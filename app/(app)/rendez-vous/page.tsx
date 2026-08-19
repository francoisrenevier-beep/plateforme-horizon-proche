'use client'

import Link from 'next/link'
import { MapPin, Clock, ChevronRight } from 'lucide-react'
import { rendezVousNoah, type RendezVous } from '@/lib/demo-data'

export default function RendezVousPage() {
  const aVenir = rendezVousNoah.filter((r) => r.statut === 'a-venir')
  const passes = rendezVousNoah.filter((r) => r.statut === 'passe')

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Rendez-vous</h1>
        <p className="mt-1 text-encre-2">Ce qui se prépare et ce qui a été noté.</p>
      </header>

      <section>
        <h2 className="etiquette mb-3">À venir</h2>
        <div className="flex flex-col gap-3">
          {aVenir.map((r) => (
            <CarteRdv key={r.id} rdv={r} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="etiquette mb-3">Passés</h2>
        <div className="flex flex-col gap-3">
          {passes.map((r) => (
            <CarteRdv key={r.id} rdv={r} />
          ))}
        </div>
      </section>
    </div>
  )
}

function CarteRdv({ rdv }: { rdv: RendezVous }) {
  return (
    <Link
      href={`/rendez-vous/${rdv.id}`}
      className="group flex items-center gap-4 rounded-lg border border-sable-2 bg-card p-5 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:bg-teal-50/40"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-serif text-lg text-teal-900">{rdv.intervenant}</h3>
          <span className="etiquette">{rdv.fonction}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-encre">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-encre-2" aria-hidden />
            {rdv.date}
            {rdv.heure ? `, ${rdv.heure}` : ''}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-encre-2" aria-hidden />
            {rdv.lieu}
          </span>
        </div>
        {rdv.questionsEnAttente ? (
          <span className="mt-2 inline-block rounded-full bg-teal-100 px-2.5 py-1 text-[13px] text-teal-900">
            {rdv.questionsEnAttente} questions en attente
          </span>
        ) : null}
      </div>
      <ChevronRight className="size-5 shrink-0 text-encre-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
