import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("✅ HIT paystack initialize route");

  try {
    const body = await req.json();

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    const { email, amount, metadata, amountInKobo } = body ?? {};

    // Allow either:
    // - amount (naira) OR
    // - amountInKobo (already in kobo)
    if (!email || (!amount && !amountInKobo)) {
      return NextResponse.json(
        { error: "email and amount (or amountInKobo) are required" },
        { status: 400 }
      );
    }

    const computedAmountInKobo = amountInKobo
      ? Math.round(Number(amountInKobo))
      : Math.round(Number(amount) * 100);

    if (!Number.isFinite(computedAmountInKobo) || computedAmountInKobo <= 0) {
      return NextResponse.json(
        { error: "amount must be a valid number greater than 0" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: computedAmountInKobo,
        metadata: metadata ?? {},
      }),
    });

    const text = await res.text();

    // Paystack should return JSON; guard anyway
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Non-JSON response from Paystack", raw: text },
        { status: 502 }
      );
    }

    // Pass through Paystack payload and status
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
