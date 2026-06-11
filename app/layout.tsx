import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cabinet = Outfit({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const satoshi = DM_Sans({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GrowVera — AI Automation Engines for Mid-Market Businesses",
  description:
    "GrowVera builds and installs two custom AI engines for Australian mid-market businesses: a Speed-to-Lead Voice Agent that calls prospects in 20 seconds, and an Automated Internal Quoting Engine that prices jobs in under 5 seconds. Book a free 15-minute Pipeline Audit.",
  keywords:
    "AI automation Sydney, speed-to-lead voice agent, automated quoting engine, AI business automation Australia, CRM automation, lead response automation, quoting software Australia",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — AI Automation Engines for Mid-Market Businesses",
    description:
      "We stop your business from losing revenue to slow response times and manual admin. Two custom AI engines. Flat setup fee. Monthly retainer.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — AI Automation Engines for Mid-Market Businesses",
    description:
      "We stop your business from losing revenue to slow response times and manual admin. Two custom AI engines. Flat setup fee. Monthly retainer.",
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
    <html lang="en-AU" className={`${cabinet.variable} ${satoshi.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
