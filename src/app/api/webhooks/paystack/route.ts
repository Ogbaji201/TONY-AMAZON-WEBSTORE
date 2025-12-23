import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const runtime = "nodejs";

// IMPORTANT: For Paystack signature verification we need the raw body.
// In Next.js App Router, req.text() gives us the raw body string.
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Missing PAYSTACK_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature");
  const bodyText = await req.text();

  // Verify signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(bodyText)
    .digest("hex");

  if (!signature || signature !== hash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // We care about successful charges
  if (event?.event !== "charge.success") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const data = event.data;
  const reference: string | undefined = data?.reference;
  const status: string | undefined = data?.status; // "success"
  const paidAt: string | undefined = data?.paid_at;
  const metadataOrderId: string | undefined = data?.metadata?.orderId;

  if (!reference || status !== "success") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // Find order either by reference (best) or by metadata.orderId (fallback)
  const order =
    (await prisma.order.findFirst({ where: { paymentReference: reference }, include: { items: true } })) ||
    (metadataOrderId
      ? await prisma.order.findUnique({ where: { id: metadataOrderId }, include: { items: true } })
      : null);

  if (!order) {
    // We still return 200 so Paystack doesn't keep retrying forever
    return NextResponse.json({ received: true, note: "Order not found" }, { status: 200 });
  }

  // Idempotency: don’t double-update or double-email
  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ received: true, note: "Already paid" }, { status: 200 });
  }

  // Update DB
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentProvider: "paystack",
      paymentReference: reference, // ensure saved
      paymentStatus: "PAID",
      status: "CONFIRMED",
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    },
  });

  // ✅ Send confirmation email AFTER payment
  // (Optional but recommended)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);

      const itemsHtml = order.items
        .map(
          (i) => `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #eee">
              <div><strong>${i.name}</strong> (x${i.quantity})</div>
              <div>₦${(i.price * i.quantity).toLocaleString()}</div>
            </div>
          `
        )
        .join("");

      await resend.emails.send({
        from: "CherryBliss <health@cherryblisshealth.com>",
        to: [order.customerEmail],
        subject: `Payment Confirmed - Order #${order.id.slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2>Payment Confirmed ✅</h2>
            <p>Hi <strong>${order.customerName}</strong>,</p>
            <p>We’ve received your payment. Your order is now confirmed.</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <h3>Items</h3>
            ${itemsHtml}
            <p style="margin-top:16px"><strong>Total:</strong> ₦${order.totalAmount.toLocaleString()}</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Resend email error:", e);
      // don’t fail webhook because email failed
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
