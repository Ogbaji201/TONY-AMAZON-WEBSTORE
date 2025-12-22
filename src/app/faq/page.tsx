export const metadata = { title: "FAQ | CherryBliss" };

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQ)</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold">What do you sell?</h2>
          <p className="text-gray-700 mt-2">
            CherryBliss offers health and wellness products including supplements, personal care,
            and select health devices. Availability may vary based on stock.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Do you require payment on the website?</h2>
          <p className="text-gray-700 mt-2">
            Not at the moment. Orders are placed on the website and processed by our team. If we
            need any confirmation, we’ll contact you using the details provided at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How long does delivery take?</h2>
          <p className="text-gray-700 mt-2">
            Delivery time depends on your location and product availability. Typical delivery is
            1–3 business days for local dispatch areas and up to 3–7 business days for wider regions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Can I change or cancel my order?</h2>
          <p className="text-gray-700 mt-2">
            Yes—if your order hasn’t been dispatched. Please contact us as soon as possible with your
            order details and we’ll do our best to help.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">What if an item is out of stock?</h2>
          <p className="text-gray-700 mt-2">
            If an item becomes unavailable after you order, we’ll notify you and offer an alternative,
            partial fulfilment, or cancellation depending on your preference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Are your products genuine?</h2>
          <p className="text-gray-700 mt-2">
            We source products from reputable suppliers. If you ever have concerns about any product,
            contact us and we’ll assist.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Do you offer medical advice?</h2>
          <p className="text-gray-700 mt-2">
            No. Information on this website is for general guidance only and is not medical advice.
            Always consult a qualified healthcare professional for personal medical guidance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How do I contact you?</h2>
          <p className="text-gray-700 mt-2">
            Use the contact details provided on our website. Please include your order ID (if applicable)
            so we can help faster.
          </p>
        </section>
      </div>
    </main>
  );
}
