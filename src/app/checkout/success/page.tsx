// // app/checkout/success/page.tsx
// 'use client';

// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// export default function CheckoutSuccess() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('orderId');

//   return (
//     <div className="container mx-auto px-4 py-16 text-center">
//       <div className="max-w-md mx-auto">
//         <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
        
//         <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
//         <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
//         {orderId && (
//           <p className="text-gray-600 mb-6">Your order ID is: <strong>{orderId}</strong></p>
//         )}
//         <p className="text-gray-600 mb-8">We'll send you a confirmation email shortly.</p>
        
//         <div className="space-y-4">
//           <Link 
//             href="/products"
//             className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Continue Shopping
//           </Link>
//           <br />
//           <Link 
//             href="/"
//             className="inline-block text-blue-600 hover:text-blue-700 transition-colors"
//           >
//             Return to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const reference = params.get("reference") || ""; // Paystack sometimes sends ?reference=

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"PAID" | "FAILED" | "UNKNOWN">("UNKNOWN");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch("/api/payments/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, reference }),
        });

        const json = await res.json();

        if (res.ok && json?.success) {
          setStatus("PAID");
          setMessage("Payment confirmed. Your order is now confirmed ✅");
        } else {
          setStatus("FAILED");
          setMessage(json?.error || "Payment not confirmed yet. If you were charged, please contact support.");
        }
      } catch (e) {
        setStatus("FAILED");
        setMessage("Could not verify payment. Please refresh this page.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [orderId, reference]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {loading ? "Confirming payment..." : status === "PAID" ? "Payment Successful" : "Payment Pending/Failed"}
          </h1>

          <p className="text-gray-600 mb-6">{message}</p>

          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              <strong>Order ID:</strong> {orderId}
              {reference ? (
                <>
                  <br />
                  <strong>Reference:</strong> {reference}
                </>
              ) : null}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Home
            </Link>
          </div>

          {!loading && status !== "PAID" && (
            <button
              onClick={() => window.location.reload()}
              className="mt-6 text-blue-600 hover:underline"
            >
              Refresh verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
