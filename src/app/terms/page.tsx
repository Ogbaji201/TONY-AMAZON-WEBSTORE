

export const metadata = { title: "Terms of Service | CherryBliss" };

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          By using the CherryBliss website, you agree to these terms. If you do not agree, please do not use
          the website.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Orders</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders placed on the website are requests to purchase items.</li>
          <li>We may contact you to confirm details before fulfilment.</li>
          <li>We reserve the right to cancel orders in cases of suspected fraud, pricing errors, or stock unavailability.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Product Information</h2>
        <p>
          We aim to keep product details accurate, but information may change. Images are for illustration and may
          differ slightly from the actual product.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Health Disclaimer</h2>
        <p>
          Content provided on this website is for informational purposes only and is not medical advice. Always consult
          a qualified healthcare professional before using supplements or health products, especially if pregnant,
          nursing, on medication, or managing a medical condition.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, CherryBliss will not be liable for indirect or consequential damages
          arising from the use of this website or products purchased through it.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the website means you accept the updated terms.
        </p>
      </div>
    </main>
  );
}
