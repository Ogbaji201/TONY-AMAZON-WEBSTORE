export const metadata = { title: "Privacy Policy | CherryBliss" };

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          CherryBliss respects your privacy. This policy explains what information we collect, how we use it,
          and the choices you have.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contact details (name, email, phone number)</li>
          <li>Delivery address</li>
          <li>Order details (items purchased, totals, status)</li>
          <li>Basic technical data (e.g., browser/device information) for security and performance</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process and fulfil your orders</li>
          <li>To communicate with you about your order</li>
          <li>To improve our products and customer experience</li>
          <li>To prevent fraud and protect our services</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Sharing</h2>
        <p>
          We do not sell your personal data. We may share limited information with service providers
          (e.g., delivery partners) only as needed to fulfil your order.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Data Retention</h2>
        <p>
          We keep order records for business operations and compliance. If you request deletion, we will
          review and comply where legally possible.
        </p>

        <h2 className="text-xl font-semibold text-black mt-6">Your Choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You can request access, correction, or deletion of your data.</li>
          <li>You can opt out of non-essential communications.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mt-6">Contact</h2>
        <p>
          For privacy-related requests, please contact us using the details provided on our website and include
          “Privacy Request” in your message.
        </p>
      </div>
    </main>
  );
}
