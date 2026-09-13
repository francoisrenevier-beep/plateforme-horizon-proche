'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Flag, Check, Pencil, Trash2, Route } from 'lucide-react'
import type { Echeance } from '@/lib/demo-data'
import { aujourdhuiISO, joursEntre, formatDateLongue, formatMoisAnnee } from '@/lib/dates'
import { cn } from '@/lib/utils'

// Applique STRICTEMENT les deux traitements visuels (CLAUDE.md §2.2) :
//  - DÉLAI LÉGAL : bordure gauche 3px --rouille, fond --card, icône horloge, compte à rebours.
//  - JALON CONSEILLÉ : fond --sable, icône drapeau, aucun compte à rebours.
// La distinction reste lisible sans les couleurs : forme de l'icône, bordure, libellé textuel.
export function EcheanceItem({
  echeance,
  onBasculerFait,
  onModifier,
  onSupprimer,
}: {
  echeance: Echeance
  // Absent : l'état « fait » est local (page publique, démonstration).
  onBasculerFait?: () => void
  onModifier?: () => void
  onSupprimer?: () => void
}) {
  const [faitLocal, setFaitLocal] = useState(!!echeance.fait)
  const fait = onBasculerFait ? !!echeance.fait : faitLocal
  const basculer = onBasculerFait ?? (() => setFaitLocal((v) => !v))
  const estDelai = echeance.nature === 'delai'
  const issuDuParcours = echeance.origine === 'parcours'

  const libelle =
    echeance.date ?? (estDelai ? `avant le ${formatDateLongue(echeance.dateISO)}` : `vers ${formatMoisAnnee(echeance.dateISO)}`)
  const joursRestants = estDelai ? (echeance.joursRestants ?? joursEntre(aujourdhuiISO(), echeance.dateISO)) : undefined

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 sm:p-5',
        estDelai ? 'rounded-r-lg border-l-[3px] border-rouille bg-card' : 'rounded-lg bg-sable',
        fait && 'opacity-60',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
          estDelai ? 'bg-rouille/10 text-rouille' : 'bg-sable-2/60 text-ocre',
        )}
        aria-hidden
      >
        {estDelai ? <Clock className="size-5" strokeWidth={1.75} /> : <Flag className="size-5" strokeWidth={1.75} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="etiquette mb-1">{estDelai ? 'Délai légal' : 'Moment conseillé'}</p>
        <h3 className={cn('font-serif text-lg text-teal-900', fait && 'line-through')}>{echeance.titre}</h3>
        <p className="mt-1 text-[15px] text-encre">
          {estDelai ? 'Délai — ' : 'Moment conseillé — '}
          <span className={cn('font-medium', estDelai ? 'text-rouille' : 'text-ocre')}>{libelle}</span>
        </p>
        <p className="etiquette mt-1">{echeance.provenance}</p>

        {estDelai && typeof joursRestants === 'number' && !fait && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-rouille/10 px-2 py-1 text-[13px] font-medium text-rouille">
            <Clock className="size-3.5" aria-hidden />
            {joursRestants > 1 && `Il reste ${joursRestants} jours`}
            {joursRestants === 1 && 'Il reste 1 jour'}
            {joursRestants === 0 && 'C’est aujourd’hui'}
            {joursRestants < 0 && `Délai dépassé depuis ${-joursRestants} jour${joursRestants < -1 ? 's' : ''}`}
          </p>
        )}

        {(onModifier || onSupprimer || issuDuParcours) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            {issuDuParcours && (
              <Link href="/parcours" className="inline-flex items-center gap-1.5 text-[13px] text-teal-700 hover:underline">
                <Route className="size-3.5" aria-hidden />
                Voir l’étape du parcours
              </Link>
            )}
            {onModifier && !issuDuParcours && (
              <button type="button" onClick={onModifier} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
                <Pencil className="size-3.5" aria-hidden />
                Modifier
              </button>
            )}
            {onSupprimer && !issuDuParcours && (
              <button type="button" onClick={onSupprimer} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-rouille">
                <Trash2 className="size-3.5" aria-hidden />
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={basculer}
        className={cn(
          'mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] transition-colors',
          fait ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 bg-card text-encre-2 hover:bg-teal-50',
        )}
        aria-pressed={fait}
      >
        <Check className="size-3.5" aria-hidden />
        {fait ? 'Fait' : 'Marquer comme fait'}
      </button>
    </div>
  )
}
