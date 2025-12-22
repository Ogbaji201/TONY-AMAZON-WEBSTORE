export const metadata = { title: "Shipping Info | CherryBliss" };

export default function ShippingPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          We aim to process and dispatch orders quickly. Delivery time depends on your location,
          item availability, and courier schedules.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Order Processing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders are typically processed within <strong>24–48 hours</strong> on business days.</li>
          <li>We may contact you to confirm your address or order details before dispatch.</li>
          <li>Orders placed on weekends or public holidays may be processed the next business day.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Estimated Delivery Times</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Local deliveries:</strong> usually 1–3 business days</li>
          <li><strong>Other locations:</strong> usually 3–7 business days</li>
          <li>Delivery times can be affected by weather, traffic, or courier delays.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Shipping Fees</h2>
        <p>
          Shipping fees (if applicable) are calculated at checkout based on your order and location.
          Occasionally, we may run free shipping promotions.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Address & Delivery Notes</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Please ensure your address and phone number are correct before placing your order.</li>
          <li>If you notice a mistake after ordering, contact us immediately—changes may not be possible after dispatch.</li>
          <li>If a delivery attempt fails due to incorrect details or the receiver being unavailable, redelivery may incur extra charges.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Questions?</h2>
        <p>
          If you have shipping questions, please reach out with your order ID and we’ll help.
        </p>
      </div>
    </main>
  );
}
