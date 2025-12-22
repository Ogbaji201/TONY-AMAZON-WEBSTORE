import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!secretKey || !appUrl) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY or NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    // Paystack expects amount in kobo
    const amountKobo = Math.round(Number(order.totalAmount) * 100);

    // A unique reference for this transaction
    const reference = `CB_${order.id}_${Date.now()}`;

    // Optional: where Paystack redirects user after payment
    const callback_url = `${appUrl}/checkout/success?orderId=${order.id}`;

    const payload = {
      email: order.customerEmail,
      amount: amountKobo,
      currency: order.currency ?? "NGN",
      reference,
      callback_url,
      metadata: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || !json?.status) {
      return NextResponse.json(
        { error: "Paystack initialize failed", details: json },
        { status: 500 }
      );
    }

    // Save reference on your order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProvider: "paystack",
        paymentReference: reference,
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json({
      authorization_url: json.data.authorization_url,
      access_code: json.data.access_code,
      reference,
    });
  } catch (err: any) {
    console.error("Paystack initialize error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? "Unknown" },
      { status: 500 }
    );
  }
}
