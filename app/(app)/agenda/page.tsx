'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, CalendarDays, Clock, MapPin, ChevronRight, Flag } from 'lucide-react'
import { useDossier, useEcheances, useChronologie, dateMajorite } from '@/lib/store'
import { aujourdhuiISO, formatDateLongue, formatMoisAnnee } from '@/lib/dates'
import type { Echeance, RendezVous } from '@/lib/demo-data'
import { EcheanceItem } from '@/components/echeance-item'
import { Chronologie } from '@/components/chronologie'
import { FormulaireEcheance } from '@/components/formulaire-echeance'
import { FormulaireRendezVous } from '@/components/formulaire-rendez-vous'
import { BoutonAgenda, MentionAgenda } from '@/components/bouton-agenda'
import { evenementDeLEcheance, evenementDuRendezVous } from '@/lib/export-agenda'
import { BoutonPrincipal, BoutonSecondaire } from '@/components/ui/formulaire'
import { Card, CardTitle } from '@/components/ui/card'

// « Agenda » : tout ce qui a une date pour la personne — délais légaux, moments conseillés
// (dont ceux produits par les parcours en cours) et rendez-vous — dans une seule liste,
// puis la chronologie signature. Le traitement délai / jalon de §2.2 vient d'`EcheanceItem`.
type Entree = { iso: string; ordre: number } & ({ genre: 'echeance'; echeance: Echeance } | { genre: 'rdv'; rdv: RendezVous })

export default function AgendaPage() {
  const { personne, dossier, actions } = useDossier()
  const echeances = useEcheances()
  const chronologie = useChronologie()
  const [ajoutEcheance, setAjoutEcheance] = useState(false)
  const [ajoutRdv, setAjoutRdv] = useState(false)

  const auj = aujourdhuiISO()
  const echeancesAVenir = echeances.filter((e) => !e.fait && (e.nature === 'delai' || e.dateISO >= auj))
  const jalonsPasses = echeances.filter((e) => !e.fait && e.nature === 'jalon' && e.dateISO < auj).length
  const rdvAVenir = dossier.rendezVous.filter((r) => r.dateISO >= auj)

  const entrees: Entree[] = [
    ...echeancesAVenir.map((e): Entree => ({ iso: e.dateISO, ordre: e.nature === 'delai' ? 0 : 2, genre: 'echeance', echeance: e })),
    ...rdvAVenir.map((r): Entree => ({ iso: r.dateISO, ordre: 1, genre: 'rdv', rdv: r })),
  ].sort((a, b) => a.iso.localeCompare(b.iso) || a.ordre - b.ordre)

  // Regroupement par mois pour la lecture.
  const parMois = entrees.reduce<{ mois: string; entrees: Entree[] }[]>((acc, e) => {
    const mois = formatMoisAnnee(e.iso)
    const dernier = acc[acc.length - 1]
    if (dernier && dernier.mois === mois) dernier.entrees.push(e)
    else acc.push({ mois, entrees: [e] })
    return acc
  }, [])

  const evenements = [
    ...echeancesAVenir.map((e) => evenementDeLEcheance(e, personne, personne.id)),
    ...rdvAVenir.map((r) => evenementDuRendezVous(r, personne, personne.id)),
  ]
  const majorite = dateMajorite(personne.naissanceISO)

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-teal-900">Agenda de {personne.prenom}</h1>
          <p className="mt-1 text-encre-2">Délais légaux, moments conseillés et rendez-vous, dans l’ordre.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BoutonPrincipal className="h-10" onClick={() => setAjoutEcheance(true)}>
            <Plus className="size-4" aria-hidden />
            Délai ou moment
          </BoutonPrincipal>
          <BoutonSecondaire className="h-10" onClick={() => setAjoutRdv(true)}>
            <CalendarDays className="size-4" aria-hidden />
            Rendez-vous
          </BoutonSecondaire>
        </div>
      </header>

      <section aria-labelledby="titre-a-venir">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="titre-a-venir" className="font-serif text-xl text-teal-900">
            À venir
          </h2>
          <BoutonAgenda
            variante="lien"
            evenements={evenements}
            nomCalendrier={`Agenda de ${personne.prenom} — Horizon Proche`}
            nomFichier={`agenda-${personne.prenom}`}
            libelle="Ajouter à mon agenda"
          />
        </div>
        {entrees.length > 0 && <MentionAgenda className="mb-4 max-w-lg" />}

        {entrees.length === 0 ? (
          <p className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Rien à venir pour le moment. Les parcours en cours ajouteront leurs moments conseillés ici.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {parMois.map((groupe) => (
              <div key={groupe.mois}>
                <h3 className="etiquette mb-2 capitalize">{groupe.mois}</h3>
                <div className="flex flex-col gap-3">
                  {groupe.entrees.map((e) =>
                    e.genre === 'echeance' ? (
                      <EcheanceItem key={e.echeance.id} echeance={e.echeance} onBasculerFait={() => actions.basculerEcheanceFaite(e.echeance.id)} />
                    ) : (
                      <LigneRdv key={e.rdv.id} rdv={e.rdv} />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sable-2 pt-4">
          <Link href="/echeances" className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            Toutes les échéances
            <ChevronRight className="size-4" aria-hidden />
          </Link>
          <Link href="/rendez-vous" className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            Tous les rendez-vous
            <ChevronRight className="size-4" aria-hidden />
          </Link>
          {jalonsPasses > 0 && (
            <Link href="/echeances" className="inline-flex items-center gap-1.5 text-[13px] text-ocre hover:underline">
              <Flag className="size-3.5" aria-hidden />
              {jalonsPasses} moment{jalonsPasses > 1 ? 's' : ''} conseillé{jalonsPasses > 1 ? 's' : ''} passé{jalonsPasses > 1 ? 's' : ''}, à revoir
            </Link>
          )}
        </div>
      </section>

      {/* Chronologie — élément signature */}
      <Card>
        <CardTitle>Ma chronologie</CardTitle>
        {majorite >= auj ? (
          <p className="etiquette mb-6 mt-1">
            Repère : {formatDateLongue(majorite)} — {personne.prenom} a 18 ans
          </p>
        ) : (
          <p className="etiquette mb-6 mt-1">Ce qui vient, dans l’ordre</p>
        )}
        <Chronologie points={chronologie} />
        <p className="mt-6 border-t border-sable-2 pt-4 text-[15px] leading-relaxed text-encre-2">
          Cette chronologie est établie à partir de la date de naissance de {personne.prenom}, des courriers que vous avez
          notés et des parcours que vous suivez. Elle vous propose des moments, pas des obligations.
        </p>
      </Card>

      {ajoutEcheance && <FormulaireEcheance onClose={() => setAjoutEcheance(false)} />}
      {ajoutRdv && <FormulaireRendezVous onClose={() => setAjoutRdv(false)} />}
    </div>
  )
}

function LigneRdv({ rdv }: { rdv: RendezVous }) {
  const enAttente = rdv.questions.filter((q) => !q.faite).length
  return (
    <Link
      href={`/rendez-vous/${rdv.id}`}
      className="group flex items-start gap-4 rounded-lg border border-sable-2 bg-card p-4 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:bg-teal-50/40 sm:p-5"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900" aria-hidden>
        <CalendarDays className="size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="etiquette mb-1 block">Rendez-vous</span>
        <span className="block font-serif text-lg text-teal-900">{rdv.intervenant}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-encre">
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
        </span>
        {enAttente > 0 && (
          <span className="mt-2 inline-block rounded-full bg-teal-100 px-2.5 py-1 text-[13px] text-teal-900">
            {enAttente} question{enAttente > 1 ? 's' : ''} en attente
          </span>
        )}
      </span>
      <ChevronRight className="mt-1 size-5 shrink-0 text-encre-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
