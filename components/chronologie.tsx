import type { PointChronologie } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

// L'élément signature du produit : une frise verticale qui descend dans le futur.
export function Chronologie({ points }: { points: PointChronologie[] }) {
  return (
    <ol className="relative ml-1 border-l border-sable-2 pl-0">
      {points.map((point) => {
        const repere = point.nature === 'repere'
        const majeur = repere && point.evenement.includes('18 ans')
        return (
          <li
            key={point.id}
            className={cn('relative flex gap-5 pb-8 pl-6 last:pb-0', majeur && 'pt-6')}
          >
            {/* Repère horizontal marqué à la majorité, en --teal-900 */}
            {majeur && (
              <span
                className="absolute -left-[13px] top-0 block h-px w-[calc(100%+13px)] bg-teal-900/60"
                aria-hidden
              />
            )}

            {/* Point sur la ligne */}
            <span
              className={cn(
                'absolute -left-[7px] size-3.5 rounded-full border-2 border-creme',
                majeur ? 'top-[calc(1.5rem+0.375rem)]' : 'top-1.5',
                point.nature === 'delai' && 'bg-rouille',
                point.nature === 'jalon' && 'bg-ocre',
                point.nature === 'repere' && (majeur ? 'bg-teal-900' : 'bg-teal-700'),
              )}
              aria-hidden
            />

            <div className="min-w-[92px] shrink-0">
              <span className="etiquette block leading-tight">{point.date}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[15px] leading-snug',
                  majeur ? 'font-serif text-lg text-teal-900' : 'text-encre',
                )}
              >
                {point.evenement}
              </p>
              {point.nature === 'delai' && <span className="etiquette text-rouille">Délai légal</span>}
              {point.nature === 'jalon' && <span className="etiquette text-ocre">Moment conseillé</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
