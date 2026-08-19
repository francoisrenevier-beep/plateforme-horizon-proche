'use client'

import { Camera, Paperclip, CalendarPlus } from 'lucide-react'
import { usePersonne } from '@/components/person-context'
import { Card, CardTitle } from '@/components/ui/card'
import { EcheanceItem } from '@/components/echeance-item'
import { Chronologie } from '@/components/chronologie'
import {
  echeances,
  chronologieNoah,
  derniereActivite,
  titulaire,
} from '@/lib/demo-data'

export default function AccueilPage() {
  const { personne } = usePersonne()
  const liste = [...(echeances[personne.id] ?? [])].sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  )

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Bonjour {titulaire.prenom}</h1>
        <p className="mt-1 text-encre-2">{personne.contexteCourt}</p>
      </header>

      {/* À faire prochainement */}
      <Card className="p-0">
        <div className="flex items-center justify-between p-6 pb-4">
          <CardTitle>À faire prochainement</CardTitle>
        </div>
        <div className="flex flex-col gap-3 px-6 pb-4">
          {liste.map((e) => (
            <EcheanceItem key={e.id} echeance={e} />
          ))}
        </div>
        <div className="border-t border-sable-2 px-6 py-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:text-teal-900 hover:underline"
          >
            <CalendarPlus className="size-4" aria-hidden />
            Ajouter au calendrier (.ics)
          </button>
        </div>
      </Card>

      {/* Chronologie — élément signature */}
      {personne.id === 'noah' && (
        <Card>
          <CardTitle>Ma chronologie</CardTitle>
          <p className="etiquette mb-6 mt-1">Repère : 4 mars 2028 — Noah a 18 ans</p>
          <Chronologie points={chronologieNoah} />
          <p className="mt-6 border-t border-sable-2 pt-4 text-[15px] leading-relaxed text-encre-2">
            Cette chronologie est établie à partir de la date de naissance de Noah et de sa
            situation. Elle vous propose des moments, pas des obligations.
          </p>
        </Card>
      )}

      {/* Ajouter un document */}
      <div className="rounded-lg border border-dashed border-sable-2 bg-card/60 p-8 text-center">
        <h2 className="font-serif text-lg text-teal-900">Ajouter un document</h2>
        <button
          type="button"
          className="mx-auto mt-4 flex h-11 items-center gap-2 rounded-md bg-teal-900 px-6 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-teal-700"
        >
          <Camera className="size-5" aria-hidden />
          Prendre une photo
        </button>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline"
        >
          <Paperclip className="size-4" aria-hidden />
          Choisir un fichier
        </button>
      </div>

      {/* Dernières activités */}
      <Card>
        <CardTitle>Dernières activités</CardTitle>
        <ul className="mt-4 flex flex-col divide-y divide-sable-2">
          {derniereActivite.map((a) => (
            <li key={a.id} className="flex flex-col py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-[15px] text-encre">{a.texte}</span>
              <span className="etiquette shrink-0 sm:ml-4">
                {a.auteur} · {a.date}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
