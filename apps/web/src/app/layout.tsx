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
      { url: '/favicon-v3.ico' },
      { url: '/favicon-v3.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon-v3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  alternates: {
    canonical: "https://tradewindow.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Window",
    description: "Structured OTC deal coordination, public deal intents and future Gno.land commitment flows.",
    images: ["https://tradewindow.xyz/og-image-v3.png"],
  },
  openGraph: {
    title: "Trade Window",
    description: "Structured OTC deal coordination, public deal intents and future Gno.land commitment flows.",
    url: "https://tradewindow.xyz",
    siteName: "Trade Window",
    images: [
      {
        url: "https://tradewindow.xyz/og-image-v3.png",
        width: 1200,
        height: 630,
        alt: "Trade Window — OTC Trade Room for AtomOne & Gno.land",
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
