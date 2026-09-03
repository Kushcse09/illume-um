import { Analytics } from '@vercel/analytics/next'
import { Fredoka, Inter, IBM_Plex_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const fredoka = Fredoka({ variable: '--font-fredoka', subsets: ['latin'] })
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const plex = IBM_Plex_Mono({ variable: '--font-plex', subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'illume — Find the gap. Light the way.',
  description: 'An AI diagnostic tutor that helps students explain what they know, so learning can meet them exactly where they are.',
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-white text-foreground"><body className={`${fredoka.variable} ${inter.variable} ${plex.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
