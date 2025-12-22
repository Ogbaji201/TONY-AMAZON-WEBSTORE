import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const runtime = "nodejs"; // ensure node crypto works

function verifyPaystackSignature(rawBody: string, signature: string, secret: string) {
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
    }

    const signature = req.headers.get("x-paystack-signature") || "";
    const rawBody = await req.text(); // IMPORTANT: raw body for signature verification

    const isValid = verifyPaystackSignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // We only care about successful charge events
    if (event?.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = event?.data?.reference;
    const amount = event?.data?.amount; // kobo
    const currency = event?.data?.currency;

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // Find the order by reference
    const order = await prisma.order.findFirst({
      where: { paymentReference: reference },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found for reference" }, { status: 404 });
    }

    // Idempotency: if already paid, return OK
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ received: true, alreadyPaid: true });
    }

    // Optional: sanity check amount
    const expectedKobo = Math.round(Number(order.totalAmount) * 100);
    if (amount !== expectedKobo || currency !== (order.currency ?? "NGN")) {
      // Mark failed or flag it
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json(
        { error: "Amount/currency mismatch", expectedKobo, got: amount, currency },
        { status: 400 }
      );
    }

    // ✅ Update your DB
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
        status: "CONFIRMED",
      },
    });

    // ✅ Send email AFTER payment success (optional but recommended)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);

      const itemsList = order.items
        .map((i) => `${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`)
        .join("<br/>");

      await resend.emails.send({
        from: "CherryBliss <health@cheryblisshealth.com>",
        to: [order.customerEmail],
        subject: `Payment Confirmed #${order.id.slice(-8).toUpperCase()} - CherryBliss`,
        html: `
          <div style="font-family:Arial,sans-serif;">
            <h2>Payment Confirmed ✅</h2>
            <p>Hi ${order.customerName}, your payment has been confirmed and your order is now being processed.</p>
            <p><strong>Order:</strong> #${order.id.slice(-8).toUpperCase()}</p>
            <p><strong>Items:</strong><br/>${itemsList}</p>
            <p><strong>Total:</strong> ₦${Number(order.totalAmount).toLocaleString()}</p>
            <p>Thanks for shopping with CherryBliss.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook error", details: err?.message }, { status: 500 });
  }
}
