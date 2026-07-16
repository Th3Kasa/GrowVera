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
    "An AI receptionist that only answers when you can't, plus in-house quoting your team runs — for Australian trades and local services. You still pick up first; customers never talk to a machine unless you choose. Receptionist from $1,000/mo — no setup fee.",
  keywords:
    "AI receptionist Australia, missed call service for tradies, 24/7 call answering for trades, speed to lead agent, instant quoting tool for trades, AI phone answering Sydney, GrowVera",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — Never miss a call. Never lose a job.",
    description:
      "An AI receptionist that answers the calls you can't, and in-house quoting done in seconds — for Australian trades. You pick up first; customers only meet AI if you choose. From $1,000/mo — no setup fee.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — Never miss a call. Never lose a job.",
    description:
      "An AI receptionist that only answers when you can't, plus in-house instant quoting — for Australian trades and local services.",
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
