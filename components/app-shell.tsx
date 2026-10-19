'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderClosed, CalendarDays, Settings, MessageCircle, Lock } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { VerrouCoffre } from '@/components/securite/verrou-coffre'
import { useSecurite } from '@/components/securite/contexte-securite'
import { BandeauCompte } from '@/components/securite/bandeau-compte'
import { PersonSwitcher } from '@/components/person-switcher'
import { cn } from '@/lib/utils'

// Trois entrées (refonte de septembre 2026) : l'accueil porte les parcours, « Mon dossier » et
// « Agenda » agrègent ce que les parcours produisent. Les Réglages sont dans un menu secondaire.
const nav = [
  { href: '/accueil', label: 'Accueil', icon: Home },
  { href: '/dossier', label: 'Mon dossier', icon: FolderClosed },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
]

const navBas = [
  { href: '/assistance', label: 'Mes questions', icon: MessageCircle },
  { href: '/reglages', label: 'Réglages', icon: Settings },
]

// Les écrans de détail restent rattachés à leur entrée principale pour l'état actif.
const sections: Record<string, string[]> = {
  '/accueil': ['/accueil', '/parcours'],
  '/dossier': ['/dossier', '/documents', '/portrait', '/intervenants', '/contacts', '/acces', '/partage', '/demarches'],
  '/agenda': ['/agenda', '/echeances', '/rendez-vous'],
  '/reglages': ['/reglages'],
  '/assistance': ['/assistance'],
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
}: {
  href: string
  label: string
  icon: typeof Home
  active: boolean
  compact?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md transition-colors',
        compact ? 'flex-col gap-0.5 px-2 py-1.5 text-[11px]' : 'px-3 py-2.5 text-[15px]',
        active ? 'bg-teal-100 text-teal-900' : 'text-encre hover:bg-teal-50',
      )}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  )
}

function Coquille({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { titulaire, pret } = useDossier()
  const { verrouiller } = useSecurite()
  const isActive = (href: string) => (sections[href] ?? [href]).some((prefixe) => pathname === prefixe || pathname.startsWith(`${prefixe}/`))
  const initiales = `${titulaire.prenom.charAt(0)}${titulaire.nom.charAt(0)}`.toUpperCase()

  return (
    <div className="flex min-h-screen bg-creme">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto border-r border-sable-2 bg-creme px-4 py-5 md:flex">
        <PersonSwitcher />

        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Navigation principale">
          {nav.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-1 border-t border-sable-2 pt-4">
          {navBas.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <div className="mt-2 flex items-center gap-3 px-3 py-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sable font-serif text-sm text-encre">
              {initiales}
            </span>
            <span className="min-w-0 flex-1 truncate text-[15px] text-encre-2">
              {titulaire.prenom} {titulaire.nom}
            </span>
          </div>
          <button
            type="button"
            onClick={verrouiller}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] text-encre transition-colors hover:bg-teal-50"
          >
            <Lock className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
            Verrouiller
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre mobile */}
        <header className="flex flex-col gap-3 border-b border-sable-2 bg-creme px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-100 font-serif text-teal-900">H</span>
            <span className="flex-1 font-serif text-lg text-teal-900">Horizon Proche</span>
            <button
              type="button"
              onClick={verrouiller}
              aria-label="Verrouiller le coffre"
              className="flex size-10 items-center justify-center rounded-md text-encre-2 hover:bg-teal-50 hover:text-teal-700"
            >
              <Lock className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <PersonSwitcher />
        </header>

        {/* Le contenu dépend de la date du jour et du stockage local : il n'est rendu qu'une fois
            l'état chargé dans le navigateur, pour éviter tout écart avec le rendu serveur. */}
        <BandeauCompte />
        <main className="mx-auto w-full max-w-[900px] px-5 py-8 pb-24 md:px-10 md:py-12" aria-busy={!pret}>
          {pret ? children : <p className="etiquette">Chargement du dossier…</p>}
        </main>

        {/* Navigation mobile en bas : les trois entrées et les réglages */}
        <nav
          aria-label="Navigation principale (mobile)"
          className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-sable-2 bg-creme px-1 py-1 md:hidden"
        >
          {[...nav, ...navBas].map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} compact />
          ))}
        </nav>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <VerrouCoffre>
      <Coquille>{children}</Coquille>
    </VerrouCoffre>
  )
}
