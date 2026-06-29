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
  title: "GrowVera — Your AI growth team. Sydney.",
  description:
    "GrowVera is a done-for-you AI growth agency in Sydney. We build and run websites, content and ads for local businesses and creators — agency-quality work at a fraction of the price. Retainers from $890/mo AUD.",
  keywords:
    "AI digital agency Sydney, done-for-you web design Sydney, social media management Sydney, AI content creation Australia, managed paid ads Sydney, small business marketing Sydney, GrowVera",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — Your AI growth team. Sydney.",
    description:
      "Websites, content and ads — done for you, for a fraction of what an agency charges. Retainers from $890/mo AUD.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — Your AI growth team. Sydney.",
    description:
      "Websites, content and ads — done for you, for a fraction of what an agency charges. Retainers from $890/mo AUD.",
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
