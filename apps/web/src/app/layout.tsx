import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tradewindow.xyz"),
  title: {
    default: "Trade Window",
    template: "%s | Trade Window",
  },
  description: "Trade Window is an MVP/research prototype for structured OTC deal coordination, public deal intents and future Gno.land commitment flows. It does not provide custody, financial advice, guaranteed execution or real settlement.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: "summary_large_image",
    title: "Trade Window",
    description: "Structured OTC deal coordination, public deal intents and future Gno.land commitment flows.",
    images: ["/og-image.png"],
  },
  openGraph: {
    title: "Trade Window",
    description: "Structured OTC deal coordination, public deal intents and future Gno.land commitment flows.",
    url: "https://tradewindow.xyz",
    siteName: "Trade Window",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trade Window - OTC Trade Room",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
