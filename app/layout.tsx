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
  title: "GrowVera — Never miss a call. Never lose a job.",
  description:
    "AI receptionists and instant quoting for Australian trades and local services. Your phone answered 24/7, your quotes done in seconds — humans still answer when you're free. Receptionist from $650/mo, no setup fee.",
  keywords:
    "AI receptionist Australia, missed call service for tradies, 24/7 call answering for trades, speed to lead agent, instant quoting tool for trades, AI phone answering Sydney, GrowVera",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — Never miss a call. Never lose a job.",
    description:
      "AI receptionists and instant quoting for Australian trades and local services. Your phone answered 24/7, your quotes done in seconds. From $650/mo, no setup fee.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — Never miss a call. Never lose a job.",
    description:
      "AI receptionists and instant quoting for Australian trades and local services. Your phone answered 24/7, your quotes done in seconds.",
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
