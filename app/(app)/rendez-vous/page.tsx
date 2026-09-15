'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, ChevronRight, Plus } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { aujourdhuiISO, formatDateLongue } from '@/lib/dates'
import type { RendezVous } from '@/lib/demo-data'
import { BoutonPrincipal } from '@/components/ui/formulaire'
import { BoutonAgenda, MentionAgenda } from '@/components/bouton-agenda'
import { evenementDuRendezVous } from '@/lib/export-agenda'
import { FormulaireRendezVous } from '@/components/formulaire-rendez-vous'

export default function RendezVousPage() {
  const { personne, dossier } = useDossier()
  const [ajout, setAjout] = useState(false)
  const auj = aujourdhuiISO()
  const tries = [...dossier.rendezVous].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  const aVenir = tries.filter((r) => r.dateISO >= auj)
  const passes = tries.filter((r) => r.dateISO < auj).reverse()

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-teal-900">Rendez-vous</h1>
          <p className="mt-1 text-encre-2">Ce qui se prépare et ce qui a été noté pour {personne.prenom}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BoutonPrincipal onClick={() => setAjout(true)}>
            <Plus className="size-4" aria-hidden />
            Ajouter un rendez-vous
          </BoutonPrincipal>
          <BoutonAgenda
            evenements={aVenir.map((r) => evenementDuRendezVous(r, personne, personne.id))}
            nomCalendrier={`Rendez-vous de ${personne.prenom} — Horizon Proche`}
            nomFichier={`rendez-vous-${personne.prenom}`}
            libelle="Ajouter à mon agenda"
          />
        </div>
      </header>

      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="etiquette">À venir</h2>
          {aVenir.length > 0 && <MentionAgenda className="max-w-lg" />}
        </div>
        <div className="flex flex-col gap-3">
          {aVenir.length === 0 && (
            <p className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">Aucun rendez-vous à venir.</p>
          )}
          {aVenir.map((r) => (
            <CarteRdv key={r.id} rdv={r} />
          ))}
        </div>
      </section>

      {passes.length > 0 && (
        <section>
          <h2 className="etiquette mb-3">Passés</h2>
          <div className="flex flex-col gap-3">
            {passes.map((r) => (
              <CarteRdv key={r.id} rdv={r} />
            ))}
          </div>
        </section>
      )}

      {ajout && <FormulaireRendezVous onClose={() => setAjout(false)} />}
    </div>
  )
}

function CarteRdv({ rdv }: { rdv: RendezVous }) {
  const enAttente = rdv.questions.filter((q) => !q.faite).length
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
            {formatDateLongue(rdv.dateISO)}
            {rdv.heure ? `, ${rdv.heure}` : ''}
          </span>
          {rdv.lieu && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-encre-2" aria-hidden />
              {rdv.lieu}
            </span>
          )}
        </div>
        {enAttente > 0 && (
          <span className="mt-2 inline-block rounded-full bg-teal-100 px-2.5 py-1 text-[13px] text-teal-900">
            {enAttente} question{enAttente > 1 ? 's' : ''} en attente
          </span>
        )}
      </div>
      <ChevronRight className="size-5 shrink-0 text-encre-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
