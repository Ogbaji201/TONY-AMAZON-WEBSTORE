// middleware.ts
import { NextRequest, NextResponse } from "next/server";



function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CherryBliss Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) return unauthorized();

  const { pathname } = req.nextUrl;

  // ✅ PUBLIC ROUTES (no auth)
  if (
    (pathname === "/api/orders" && req.method === "POST") ||
    pathname.startsWith("/api/payments/paystack")
  ) {
    return NextResponse.next();
  }

  // 🔐 Everything else requires admin auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return unauthorized();

  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  if (user !== adminUser || pass !== adminPass) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",

    // Orders
    "/api/orders",
    "/api/orders/:path*",

    // ✅ Paystack
    "/api/payments/:path*",
  ],
};
