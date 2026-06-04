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
  title: "GrowVera — More Local Clients for Sydney Businesses",
  description:
    "GrowVera helps Sydney's local service businesses dominate Google Maps through expert Google Business Profile optimisation, review generation, and local SEO. Free audit. Custom plan. Clear contract.",
  keywords:
    "local SEO Sydney, Google Business Profile optimisation, review generation, local marketing Sydney, dental SEO, small business marketing",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — More Local Clients for Sydney Businesses",
    description:
      "We put Sydney's best local businesses at the top of Google Maps — and keep them there.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — More Local Clients for Sydney Businesses",
    description:
      "We put Sydney's best local businesses at the top of Google Maps — and keep them there.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
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
