import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wellforward: For UCD International Students",
  description:
    "Find friends, ask seniors, and survive your first month in Dublin. A platform built by UCD international students, for UCD international students.",
  keywords: [
    "UCD international students",
    "UCD IRP appointment",
    "UCD first year guide",
    "Dublin international student",
    "UCD Smurfit international",
    "UCD make friends",
    "UCD PPS number",
    "UCD student guide",
  ],
  openGraph: {
    title: "Wellforward: For UCD International Students",
    description:
      "You're not the only one figuring it out. Find friends, ask seniors, and survive your first month in Dublin.",
    type: "website",
    locale: "en_IE",
    url: "https://wellforward.pages.dev",
    siteName: "Wellforward",
    images: [
      {
        url: "/og-preview.png",
        width: 1365,
        height: 768,
        alt: "Wellforward — For UCD International Students. Find friends, ask seniors, and survive your first month in Dublin.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellforward: For UCD International Students",
    description:
      "You're not the only one figuring it out. Find friends, ask seniors, and survive your first month in Dublin.",
    images: ["/og-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Explicit favicon - overrides any Next.js/Vercel default.
            SVG for modern browsers, .ico as universal fallback (this is the
            one that shows in the browser tab). */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
