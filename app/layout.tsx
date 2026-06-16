import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wellforward — For UCD International Students",
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
    title: "Wellforward — For UCD International Students",
    description:
      "You're not the only one figuring it out. Find friends, ask seniors, and survive your first month in Dublin.",
    type: "website",
    locale: "en_IE",
  },
  robots: {
    index: true,
    follow: true,
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
