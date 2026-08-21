import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Horizon Proche — tenir le fil des démarches d’un proche',
  description:
    'Horizon Proche aide les proches aidants en Suisse romande à suivre les délais, les documents et les prochaines étapes liés à l’accompagnement d’une personne dépendante.',
  openGraph: {
    title: 'Horizon Proche — tenir le fil des démarches d’un proche',
    description:
      'Les délais, les documents et les étapes à venir rassemblés dans un seul dossier, pour les proches aidants en Suisse romande.',
    locale: 'fr_CH',
    type: 'website',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#faf8f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${lora.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
