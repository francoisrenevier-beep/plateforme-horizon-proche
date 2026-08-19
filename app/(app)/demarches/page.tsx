'use client'

import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { usePersonne } from '@/components/person-context'
import { demarches, demarchesSuggerees } from '@/lib/demo-data'

export default function DemarchesPage() {
  const { personne } = usePersonne()
  const liste = demarches.filter((d) => d.dossier === personne.id)

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Démarches</h1>
        <p className="mt-1 text-encre-2">Ce qui est en cours pour {personne.prenom}.</p>
      </header>

      <div className="flex flex-col gap-4">
        {liste.map((d) => (
          <Link
            key={d.id}
            href={`/demarches/${d.id}`}
            className="group rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:border-teal-100 hover:bg-teal-50/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-serif text-xl text-teal-900">{d.titre}</h2>
                <p className="mt-1 text-[15px] text-encre">{d.situation}</p>
              </div>
              <ChevronRight className="mt-1 size-5 shrink-0 text-encre-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sable-2 pt-4">
              <span className="etiquette">
                Avancement : {d.etapesFaites} étapes sur {d.etapesTotal}
              </span>
              <span className="text-[15px] text-encre">
                Prochaine action : <span className="font-medium">{d.prochaineAction}</span>
                <span className="text-encre-2"> · {d.prochaineDate}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Suggestions discrètes */}
      <section>
        <h2 className="etiquette mb-3">Autres démarches qui pourraient vous concerner</h2>
        <div className="flex flex-col gap-2">
          {demarchesSuggerees.map((s) => (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border border-sable-2 bg-sable/50 px-5 py-3 text-[15px] text-encre-2"
            >
              {s}
              <ArrowRight className="size-4" aria-hidden />
            </div>
          ))}
        </div>
        <button type="button" className="mt-3 text-[15px] text-teal-700 hover:underline">
          Voir toutes les démarches
        </button>
      </section>
    </div>
  )
}
