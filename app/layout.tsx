import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Polices embarquées dans le projet (licence SIL OFL, voir app/fonts/) : aucune requête vers
// un service tiers, ni à la compilation ni à l'affichage.
const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

const lora = localFont({
  src: [
    { path: './fonts/lora-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/lora-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
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
  // Aucun outil de mesure d'audience ni traceur : décision de protection des données (CLAUDE.md §7).
  referrer: 'no-referrer',
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
      </body>
    </html>
  )
}
