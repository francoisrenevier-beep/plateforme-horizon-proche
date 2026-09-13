'use client'

import Link from 'next/link'
import { ChevronRight, Route, Check } from 'lucide-react'
import { useDossier, dateMajorite } from '@/lib/store'
import { listeParcours, etapesDuParcours } from '@/lib/parcours'
import { formatDateLongue } from '@/lib/dates'
import { cn } from '@/lib/utils'

export default function ParcoursPage() {
  const { personne, dossier, actions } = useDossier()

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Parcours</h1>
        <p className="mt-1 max-w-2xl text-encre-2">
          Un parcours met dans l’ordre les grandes étapes d’une période de vie et explique chacune d’elles : à quel moment
          elle se présente, pourquoi, ce qu’il y a à faire et vers qui se tourner. Quand vous suivez un parcours, ses
          moments conseillés apparaissent dans la chronologie de {personne.prenom}.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {listeParcours.map((p) => {
          const suivi = dossier.parcours[p.id]
          const actif = !!suivi?.active
          const etapes = etapesDuParcours(p)
          const concernees = etapes.filter((e) => (suivi?.etapes[e.id]?.statut ?? 'a-faire') !== 'pas-concerne')
          const faites = concernees.filter((e) => suivi?.etapes[e.id]?.statut === 'fait').length
          const repere = p.repere === 'majorite' ? dateMajorite(personne.naissanceISO) : undefined
          const majeur = personne.age >= 18

          return (
            <article
              key={p.id}
              className={cn(
                'rounded-lg border bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]',
                actif ? 'border-teal-100' : 'border-sable-2',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl text-teal-900">{p.titre}</h2>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-[13px] text-teal-900">{p.canton}</span>
                    {actif && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-[13px] text-teal-700">
                        <Check className="size-3.5" aria-hidden />
                        Suivi pour {personne.prenom}
                      </span>
                    )}
                  </div>
                  <p className="etiquette mt-1">{p.public}</p>
                </div>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-encre">{p.resume}</p>

              {p.repere === 'majorite' && majeur && (
                <p className="mt-3 rounded-md bg-sable px-3 py-2 text-[13px] text-encre">
                  Ce parcours s’adresse à une personne mineure. {personne.prenom} a {personne.age} ans : les moments
                  calculés seraient dans le passé.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-sable-2 pt-4">
                {actif ? (
                  <>
                    <span className="etiquette">
                      Avancement : {faites} étape{faites > 1 ? 's' : ''} sur {concernees.length}
                    </span>
                    {repere && <span className="etiquette">Repère : {formatDateLongue(repere)}</span>}
                  </>
                ) : (
                  <span className="etiquette">
                    {p.phases.length} phases · {etapes.length} étapes
                  </span>
                )}
                <span className="ml-auto flex flex-wrap gap-2">
                  {!actif && (
                    <button
                      type="button"
                      onClick={() => actions.activerParcours(p.id, true)}
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-900 px-4 text-[15px] font-medium text-primary-foreground hover:bg-teal-700"
                    >
                      <Route className="size-4" aria-hidden />
                      Suivre ce parcours pour {personne.prenom}
                    </button>
                  )}
                  <Link
                    href={`/parcours/${p.id}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-sable-2 px-4 text-[15px] text-encre hover:bg-teal-50"
                  >
                    {actif ? 'Ouvrir' : 'Lire le parcours'}
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <section className="rounded-lg bg-sable p-6">
        <h2 className="font-serif text-lg text-teal-900">D’autres parcours suivront</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-encre">
          Entrée en établissement d’un parent âgé, sortie d’hospitalisation, fin de scolarité spécialisée : chaque parcours
          est rédigé à partir de sources cantonales et fédérales citées, et indique ce qui reste à vérifier.
        </p>
      </section>
    </div>
  )
}
