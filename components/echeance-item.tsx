'use client'

import { useState } from 'react'
import { Clock, Flag, Check } from 'lucide-react'
import type { Echeance } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

// Applique STRICTEMENT les deux traitements visuels :
//  - DÉLAI LÉGAL : bordure gauche 3px --rouille, icône horloge, compte à rebours.
//  - JALON CONSEILLÉ : fond --sable, icône drapeau, aucun compte à rebours.
export function EcheanceItem({ echeance }: { echeance: Echeance }) {
  const [fait, setFait] = useState(!!echeance.fait)
  const estDelai = echeance.nature === 'delai'

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 sm:p-5',
        estDelai
          ? 'rounded-r-lg border-l-[3px] border-rouille bg-card'
          : 'rounded-lg bg-sable',
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
        <p className="etiquette mb-1">
          {estDelai ? 'Délai légal' : 'Moment conseillé'}
        </p>
        <h3 className={cn('font-serif text-lg text-teal-900', fait && 'line-through')}>
          {estDelai ? echeance.titre : echeance.titre}
        </h3>
        <p className="mt-1 text-[15px] text-encre">
          {estDelai ? 'Délai — ' : 'Moment conseillé — '}
          <span className={cn('font-medium', estDelai ? 'text-rouille' : 'text-ocre')}>{echeance.date}</span>
        </p>
        <p className="etiquette mt-1">{echeance.provenance}</p>

        {estDelai && typeof echeance.joursRestants === 'number' && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-rouille/10 px-2 py-1 text-[13px] font-medium text-rouille">
            <Clock className="size-3.5" aria-hidden />
            Il reste {echeance.joursRestants} jours
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setFait((v) => !v)}
        className={cn(
          'mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] transition-colors',
          fait
            ? 'border-teal-700 bg-teal-100 text-teal-900'
            : 'border-sable-2 bg-card text-encre-2 hover:bg-teal-50',
        )}
        aria-pressed={fait}
      >
        <Check className="size-3.5" aria-hidden />
        {fait ? 'Fait' : 'Marquer comme fait'}
      </button>
    </div>
  )
}
