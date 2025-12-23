import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { reference, orderId } = await req.json();

    if (!reference && !orderId) {
      return NextResponse.json(
        { error: "Provide reference or orderId" },
        { status: 400 }
      );
    }

    // Find the order
    const order = orderId
      ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
      : await prisma.order.findFirst({ where: { paymentReference: reference }, include: { items: true } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If already paid, return immediately (idempotent)
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, alreadyPaid: true, orderId: order.id });
    }

    const refToVerify = reference || order.paymentReference;
    if (!refToVerify) {
      return NextResponse.json(
        { error: "Missing payment reference on order. Re-initialize payment." },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const psRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(refToVerify)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const psJson = await psRes.json().catch(() => null);

    if (!psRes.ok || !psJson?.status) {
      return NextResponse.json(
        { error: "Paystack verify failed", paystack: psJson },
        { status: 500 }
      );
    }

    const data = psJson.data;
    const paid = data?.status === "success";

    if (!paid) {
      // Mark as failed (optional)
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json({ success: false, status: data?.status ?? "unknown" });
    }

    // ✅ Update DB to confirmed/paid
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProvider: "paystack",
        paymentReference: refToVerify,
        paymentStatus: "PAID",
        status: "CONFIRMED",
        paidAt: data?.paid_at ? new Date(data.paid_at) : new Date(),
      },
    });

    return NextResponse.json({ success: true, orderId: order.id, reference: refToVerify });
  } catch (err: any) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Internal error", details: err?.message || "Unknown" },
      { status: 500 }
    );
  }
}
