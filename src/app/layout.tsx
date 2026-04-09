import './globals.css';
import Providers from './providers';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        {/* Vercel Analytics - tracks page views and visitors */}
        <Analytics />

        {/* Load Zapier Web Component Script */}
        <Script
          src="https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js"
          type="module"
          strategy="afterInteractive"
        />

        {/* Inject Chatbot Web Component Safely */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <zapier-interfaces-chatbot-embed
                is-popup="true"
                chatbot-id="cmlt6ppyp009g11exjbbqanrx">
              </zapier-interfaces-chatbot-embed>
            `,
          }}
        />
      </body>
    </html>
  );
}