'use client'

import Link from 'next/link'
import {
  Accessibility,
  Bed,
  Briefcase,
  Building2,
  Cake,
  Coins,
  FileSignature,
  Flag,
  Flower2,
  HandHeart,
  HeartHandshake,
  House,
  Scale,
  School,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import type { Parcours, IconeParcours } from '@/lib/parcours'
import { etapesDuParcours } from '@/lib/parcours'
import type { Echeance, ParcoursSuivi, Personne } from '@/lib/demo-data'
import { avancementParcours, prochainJalonParcours, pertinenceParcours } from '@/lib/selecteurs'
import { formatMoisAnnee } from '@/lib/dates'
import { cn } from '@/lib/utils'

// Résolution des icônes déclarées dans le catalogue (`IconeParcours`), jamais d'import côté données.
const icones: Record<IconeParcours, LucideIcon> = {
  school: School,
  'hand-heart': HandHeart,
  cake: Cake,
  building: Building2,
  briefcase: Briefcase,
  scale: Scale,
  home: House,
  coins: Coins,
  accessibility: Accessibility,
  bed: Bed,
  'house-heart': House,
  'file-signature': FileSignature,
  'heart-handshake': HeartHandshake,
  stethoscope: Stethoscope,
  flower: Flower2,
}

// Barre d'avancement d'un parcours : partagée entre la carte et l'en-tête du parcours actif.
export function BarreProgression({ faites, total, className }: { faites: number; total: number; className?: string }) {
  const pourcent = total ? Math.round((faites / total) * 100) : 0
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-sable', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={faites}
      aria-label={`${faites} étapes sur ${total}`}
    >
      <div className="h-full rounded-full bg-teal-700 transition-[width]" style={{ width: `${pourcent}%` }} />
    </div>
  )
}

export function IconeDuParcours({ icone, className }: { icone: IconeParcours; className?: string }) {
  const Icone = icones[icone]
  return <Icone className={className} strokeWidth={1.75} aria-hidden />
}

// Anatomie commune : icône, titre avec verbe, phrase de positionnement (deux lignes au plus),
// puis une ligne de repères. La carte du catalogue et la carte du parcours actif ne diffèrent
// que par cette dernière ligne : trois repères d'un côté, l'avancement de l'autre.
function Coquille({
  p,
  href,
  actif,
  children,
  note,
}: {
  p: Parcours
  href: string
  actif?: boolean
  children: React.ReactNode
  note?: string | null
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col rounded-lg border bg-card p-5 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:bg-teal-50',
        actif ? 'border-teal-100' : 'border-sable-2',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            actif ? 'bg-teal-100 text-teal-900' : 'bg-sable text-teal-700',
          )}
        >
          <IconeDuParcours icone={p.icone} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg leading-snug text-teal-900">{p.titre}</h3>
          <p className="mt-1 line-clamp-2 text-[15px] leading-snug text-encre-2">{p.positionnement}</p>
        </div>
      </div>

      {note && <p className="mt-3 rounded-md bg-sable px-3 py-2 text-[13px] text-encre">{note}</p>}

      <div className="mt-auto pt-4">{children}</div>
    </Link>
  )
}

// Carte du catalogue : nombre d'étapes · autorité · délai réaliste (l'information la plus
// importante — celle que personne ne donne aux familles). Un délai non confirmé le dit (§2.5).
export function CarteParcoursCatalogue({ p, personne }: { p: Parcours; personne: Personne }) {
  const nbEtapes = etapesDuParcours(p).length
  const delaiConfirme = p.delaiRealiste.statut === 'verifiee'
  return (
    <Coquille p={p} href={`/parcours/${p.id}`} note={pertinenceParcours(p, personne)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="etiquette">{nbEtapes} étapes</span>
        <span className="etiquette" aria-hidden>·</span>
        <span className="etiquette">{p.autorite}</span>
        {p.statut === 'provisoire' && (
          <span className="ml-auto rounded-full bg-sable px-2 py-0.5 text-[12px] text-encre-2">Provisoire</span>
        )}
      </div>
      <p className="mt-1.5 text-[15px] text-encre">
        <span className="font-medium">{p.delaiRealiste.texte}</span>
        {!delaiConfirme && <span className="etiquette"> — à confirmer</span>}
      </p>
    </Coquille>
  )
}

// Carte du parcours actif : même structure, les repères remplacés par l'avancement et le
// prochain moment conseillé. Toujours un jalon (§2.2) : drapeau, « vers <mois> », jamais de compte à rebours.
export function CarteParcoursActif({ p, personne, suivi }: { p: Parcours; personne: Personne; suivi: ParcoursSuivi }) {
  const av = avancementParcours(p, suivi)
  const prochain: Echeance | undefined = prochainJalonParcours(p, personne, suivi)
  return (
    <Coquille p={p} href={`/parcours/${p.id}`} actif>
      <div className="flex items-center justify-between gap-3">
        <span className="etiquette">
          {av.faites} étape{av.faites > 1 ? 's' : ''} sur {av.total}
        </span>
        <span className="etiquette">{av.pourcent} %</span>
      </div>
      <BarreProgression faites={av.faites} total={av.total} className="mt-1.5" />
      <p className="mt-3 flex items-start gap-1.5 text-[14px] leading-snug text-encre">
        <Flag className="mt-0.5 size-4 shrink-0 text-ocre" strokeWidth={1.75} aria-hidden />
        {prochain ? (
          <span>
            <span className="text-ocre">Moment conseillé — vers {formatMoisAnnee(prochain.dateISO)}</span> : {prochain.titre}
          </span>
        ) : (
          <span className="text-encre-2">Aucun moment conseillé à venir</span>
        )}
      </p>
    </Coquille>
  )
}
