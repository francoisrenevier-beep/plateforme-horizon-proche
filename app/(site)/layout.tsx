import type { ReactNode } from 'react'
import Link from 'next/link'

const liensLegaux = ['Mentions légales', 'Confidentialité', 'Conditions d’utilisation']

export default function SiteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-creme">
      <header className="border-b border-sable-2 bg-creme">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="font-serif text-xl text-teal-900">
            Horizon Proche
          </Link>
          <Link
            href="/accueil"
            className="inline-flex h-11 items-center rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-teal-700"
          >
            Accéder à mon dossier
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-sable-2 bg-creme">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-5 py-8 text-[15px] text-encre-2 md:flex-row md:items-center md:justify-between md:px-10">
          <span>© {new Date().getFullYear()} Horizon Proche</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {liensLegaux.map((lien) => (
              <li key={lien}>{lien}</li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
