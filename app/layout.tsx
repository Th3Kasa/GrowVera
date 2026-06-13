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
  title: "GrowVera — An entire web agency. Fully autonomous.",
  description:
    "GrowVera is an autonomous web agency that runs while you sleep. It finds local businesses with no website, builds each one a bespoke, designer-quality site, deploys it live, reviews it on desktop and mobile, and sends you the URL plus a ready-to-send pitch — with a built-in CRM and follow-up sequence. Plans from AUD $99/mo.",
  keywords:
    "autonomous website agency, AI website builder Australia, find businesses without websites, automated web agency, Claude AI website generator, lead generation websites, AI cold outreach, web design automation Australia, GrowVera",
  metadataBase: new URL("https://growvera.com.au"),
  openGraph: {
    title: "GrowVera — An entire web agency. Fully autonomous.",
    description:
      "Finds businesses with no website, builds them a bespoke site, deploys it, and pitches them — on its own. Built-in CRM and follow-ups. Plans from AUD $99/mo.",
    url: "https://growvera.com.au",
    siteName: "GrowVera",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVera — An entire web agency. Fully autonomous.",
    description:
      "Finds businesses with no website, builds them a bespoke site, deploys it, and pitches them — on its own. Plans from AUD $99/mo.",
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
