import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY in .env.local" },
        { status: 500 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body?.orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const amountKobo = Math.round(Number(order.totalAmount) * 100);
    if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount", totalAmount: order.totalAmount },
        { status: 400 }
      );
    }

    const reference = `CB_${order.id}_${Date.now()}`;
    const callback_url = `${appUrl.replace(/\/$/, "")}/checkout/success?orderId=${order.id}`;

    const payload = {
      email: order.customerEmail,
      amount: amountKobo,
      currency: "NGN",
      reference,
      callback_url,
      metadata: { orderId: order.id },
    };

    console.log("🟦 Paystack initialize payload:", payload);

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const psText = await psRes.text();
    let psJson: any;
    try {
      psJson = psText ? JSON.parse(psText) : null;
    } catch {
      psJson = { raw: psText };
    }

    console.log("🟨 Paystack response:", {
      status: psRes.status,
      body: psJson,
    });

    if (!psRes.ok || !psJson?.status || !psJson?.data?.authorization_url) {
      return NextResponse.json(
        {
          error: "Paystack initialize failed",
          paystackStatus: psRes.status,
          paystackBody: psJson,
        },
        { status: 500 }
      );
    }

    // Save reference for webhook matching
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProvider: "paystack",
        paymentReference: reference,
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json({
      authorization_url: psJson.data.authorization_url,
      access_code: psJson.data.access_code,
      reference,
    });
  } catch (err: any) {
    console.error("❌ Initialize route error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message || "Unknown" },
      { status: 500 }
    );
  }
}
