'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Plus, Route, ChevronRight } from 'lucide-react'
import { useDossier, useEcheances, useChronologie, contexteCourt, dateMajorite } from '@/lib/store'
import { aujourdhuiISO, formatDateLongue, formatRelatif } from '@/lib/dates'
import { parcours as catalogueParcours } from '@/lib/parcours'
import { Card, CardTitle } from '@/components/ui/card'
import { EcheanceItem } from '@/components/echeance-item'
import { Chronologie } from '@/components/chronologie'
import { CaptureFlow } from '@/components/capture-flow'
import { BoutonAgenda } from '@/components/bouton-agenda'
import { evenementDeLEcheance } from '@/lib/export-agenda'
import { FormulaireEcheance } from '@/components/formulaire-echeance'

export default function AccueilPage() {
  const { personne, dossier, titulaire, actions } = useDossier()
  const echeances = useEcheances()
  const chronologie = useChronologie()
  const [capture, setCapture] = useState(false)
  const [ajoutEcheance, setAjoutEcheance] = useState(false)

  const auj = aujourdhuiISO()
  const aFaire = echeances.filter((e) => !e.fait && (e.nature === 'delai' || e.dateISO >= auj)).slice(0, 6)
  const majorite = dateMajorite(personne.naissanceISO)
  const parcoursSuivis = Object.entries(dossier.parcours)
    .filter(([, s]) => s.active)
    .map(([id]) => catalogueParcours[id])
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Bonjour {titulaire.prenom}</h1>
        <p className="mt-1 text-encre-2">{contexteCourt(personne, dossier)}</p>
      </header>

      {/* À faire prochainement */}
      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-4">
          <CardTitle>À faire prochainement</CardTitle>
          <button
            type="button"
            onClick={() => setAjoutEcheance(true)}
            className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline"
          >
            <Plus className="size-4" aria-hidden />
            Ajouter
          </button>
        </div>
        <div className="flex flex-col gap-3 px-6 pb-4">
          {aFaire.length === 0 && (
            <p className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
              Rien en attente pour le moment.
            </p>
          )}
          {aFaire.map((e) => (
            <EcheanceItem key={e.id} echeance={e} onBasculerFait={() => actions.basculerEcheanceFaite(e.id)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sable-2 px-6 py-4">
          <Link href="/echeances" className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            Toutes les échéances
            <ChevronRight className="size-4" aria-hidden />
          </Link>
          <BoutonAgenda
            variante="lien"
            evenements={aFaire.map((e) => evenementDeLEcheance(e, personne, personne.id))}
            nomCalendrier={`Échéances de ${personne.prenom} — Horizon Proche`}
            nomFichier={`echeances-${personne.prenom}`}
            libelle="Ajouter à mon agenda"
          />
        </div>
      </Card>

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

      {/* Parcours suivis */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Parcours</CardTitle>
          <Link href="/parcours" className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            <Route className="size-4" aria-hidden />
            Voir les parcours
          </Link>
        </div>
        {parcoursSuivis.length === 0 ? (
          <p className="mt-3 text-[15px] leading-relaxed text-encre-2">
            Un parcours met dans l’ordre les grandes étapes d’une période de vie, comme le passage à la majorité, et
            explique chacune d’elles. Aucun parcours n’est suivi pour {personne.prenom}.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {parcoursSuivis.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/parcours/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-sable-2 px-4 py-3 text-[15px] text-encre transition-colors hover:bg-teal-50"
                >
                  {p.titre}
                  <ChevronRight className="size-4 text-encre-2" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Ajouter un document */}
      <div className="rounded-lg border border-dashed border-sable-2 bg-card/60 p-8 text-center">
        <h2 className="font-serif text-lg text-teal-900">Ajouter un document</h2>
        <p className="mt-1 text-[15px] text-encre-2">Un courrier reçu ? Notez-le tout de suite, vous le classerez plus tard.</p>
        <button
          type="button"
          onClick={() => setCapture(true)}
          className="mx-auto mt-4 flex h-11 items-center gap-2 rounded-md bg-teal-900 px-6 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-teal-700"
        >
          <Camera className="size-5" aria-hidden />
          Ajouter un document
        </button>
      </div>

      {/* Dernières activités */}
      <Card>
        <CardTitle>Dernières activités</CardTitle>
        <ul className="mt-4 flex flex-col divide-y divide-sable-2">
          {dossier.journal.length === 0 && <li className="py-3 text-[15px] text-encre-2">Aucune activité pour l’instant.</li>}
          {dossier.journal.slice(0, 8).map((a) => (
            <li key={a.id} className="flex flex-col py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-[15px] text-encre">{a.texte}</span>
              <span className="etiquette shrink-0 sm:ml-4">
                {a.auteur} · {formatRelatif(a.quand)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {capture && <CaptureFlow onClose={() => setCapture(false)} />}
      {ajoutEcheance && <FormulaireEcheance onClose={() => setAjoutEcheance(false)} />}
    </div>
  )
}
