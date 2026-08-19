'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  FolderClosed,
  CalendarClock,
  CalendarDays,
  HeartHandshake,
  Users,
  Shield,
  Link2,
  Settings,
} from 'lucide-react'
import { PersonProvider } from '@/components/person-context'
import { PersonSwitcher } from '@/components/person-switcher'
import { titulaire } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/accueil', label: 'Accueil', icon: Home },
  { href: '/demarches', label: 'Démarches', icon: FileText },
  { href: '/documents', label: 'Documents', icon: FolderClosed },
  { href: '/echeances', label: 'Échéances', icon: CalendarClock },
  { href: '/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/portrait', label: 'Portrait', icon: HeartHandshake },
  { href: '/intervenants', label: 'Intervenants', icon: Users },
]

const navBas = [
  { href: '/acces', label: 'Accès et rôles', icon: Shield },
  { href: '/partage', label: 'Partager un lien', icon: Link2 },
  { href: '/reglages', label: 'Réglages', icon: Settings },
]

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof Home
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] transition-colors',
        active ? 'bg-teal-100 text-teal-900' : 'text-encre hover:bg-teal-50',
      )}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <PersonProvider>
      <div className="flex min-h-screen bg-creme">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-sable-2 bg-creme px-4 py-5 md:flex">
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
                SP
              </span>
              <span className="text-[15px] text-encre-2">
                {titulaire.prenom} {titulaire.nom}
              </span>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Barre mobile simplifiée */}
          <header className="flex items-center gap-3 border-b border-sable-2 bg-creme px-4 py-3 md:hidden">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-100 font-serif text-teal-900">
              R
            </span>
            <span className="font-serif text-lg text-teal-900">Repères</span>
          </header>

          <main className="mx-auto w-full max-w-[900px] px-5 py-8 md:px-10 md:py-12">{children}</main>
        </div>
      </div>
    </PersonProvider>
  )
}
