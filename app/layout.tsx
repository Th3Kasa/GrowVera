import type { Metadata } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const outfit = Outfit({
  variable: '--font-cabinet',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'GrowVera — Local SEO & Google Maps for Sydney Businesses',
  description:
    'We help Sydney businesses show up on Google Maps and local search. Free audit — no obligation, results in 30–60 days.',
  metadataBase: new URL('https://www.growvera.com.au'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body
        className={`${outfit.variable} ${dmSans.variable}`}
        style={{ background: '#FAFAF8', margin: 0 }}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
