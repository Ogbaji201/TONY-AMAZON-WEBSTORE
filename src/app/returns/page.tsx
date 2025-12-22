
export const metadata = { title: "Returns | CherryBliss" };

export default function ReturnsPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Returns & Refunds</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          We want you to be satisfied with your purchase. If there’s an issue, contact us as soon as possible
          and we’ll work with you to resolve it.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Eligibility</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Returns are accepted for damaged, incorrect, or defective items.</li>
          <li>Items must be unused, in original packaging, and in resellable condition where applicable.</li>
          <li>Some products (e.g., opened supplements, personal care items) may not be eligible for return for hygiene/safety reasons.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Timeframe</h2>
        <p>
          Please report issues within <strong>48 hours</strong> of delivery. This helps us resolve problems quickly.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">How to Request a Return</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact us with your order ID and a short description of the issue.</li>
          <li>Include clear photos of the item (and packaging) if it arrived damaged or incorrect.</li>
          <li>We will confirm return instructions or arrange a resolution.</li>
        </ol>

        <h2 className="text-xl font-semibold text-black mt-6">Refunds / Replacements</h2>
        <p>
          Depending on the situation, we may offer a replacement, partial refund, or full refund. If a return is
          approved, we’ll explain the next steps and timelines clearly.
        </p>
      </div>
    </main>
  );
}
