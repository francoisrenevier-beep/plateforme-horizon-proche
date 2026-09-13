'use client'

import Link from 'next/link'
import { ChevronRight, Plus, Route } from 'lucide-react'
import { useDossier, avancementDemarche, libelleDate } from '@/lib/store'
import { fiches } from '@/lib/fiches'
import { StatutFicheBadge } from '@/components/statut-fiche'

export default function DemarchesPage() {
  const { personne, dossier, actions } = useDossier()
  const liste = dossier.demarches
  const catalogue = Object.values(fiches).filter((f) => !liste.some((d) => d.ficheId === f.id))

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Démarches</h1>
        <p className="mt-1 text-encre-2">Ce qui est en cours pour {personne.prenom}.</p>
      </header>

      <div className="flex flex-col gap-4">
        {liste.length === 0 && (
          <p className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Aucune démarche ouverte. Choisissez-en une ci-dessous pour en suivre les pièces et les étapes.
          </p>
        )}
        {liste.map((d) => {
          const av = avancementDemarche(d, dossier)
          const fiche = d.ficheId ? fiches[d.ficheId] : undefined
          const prochaine = dossier.echeances
            .filter((e) => e.demarcheId === d.id && !e.fait)
            .sort((a, b) => a.dateISO.localeCompare(b.dateISO))[0]
          return (
            <Link
              key={d.id}
              href={`/demarches/${d.id}`}
              className="group rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:border-teal-100 hover:bg-teal-50/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl text-teal-900">{d.titre}</h2>
                    {fiche?.parcoursId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[13px] text-teal-700">
                        <Route className="size-3.5" aria-hidden />
                        Parcours
                      </span>
                    )}
                  </div>
                  {d.situation && <p className="mt-1 text-[15px] text-encre">{d.situation}</p>}
                </div>
                <ChevronRight className="mt-1 size-5 shrink-0 text-encre-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sable-2 pt-4">
                <span className="etiquette">Avancement : {av.libelle}</span>
                {(d.prochaineAction || prochaine) && (
                  <span className="text-[15px] text-encre">
                    Prochaine action : <span className="font-medium">{d.prochaineAction ?? prochaine?.titre}</span>
                    {prochaine && (
                      <span className="text-encre-2"> · {libelleDate(prochaine)}</span>
                    )}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Catalogue */}
      {catalogue.length > 0 && (
        <section>
          <h2 className="etiquette mb-3">Autres démarches qui pourraient vous concerner</h2>
          <div className="flex flex-col gap-2">
            {catalogue.map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sable-2 bg-sable/50 px-5 py-3"
              >
                <span className="flex flex-wrap items-center gap-2 text-[15px] text-encre">
                  {f.titre}
                  <StatutFicheBadge statut={f.statut} />
                </span>
                <span className="flex gap-3">
                  <Link href={`/demarches/${f.id}`} className="text-[15px] text-teal-700 hover:underline">
                    Lire la fiche
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      actions.ajouterDemarche({ id: f.id, ficheId: f.id, titre: f.titre, canton: f.canton === 'Vaud' ? 'VD' : f.canton, situation: '' })
                    }
                    className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline"
                  >
                    <Plus className="size-4" aria-hidden />
                    Ouvrir pour {personne.prenom}
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
