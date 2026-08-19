'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Square,
  CheckSquare,
  ImageIcon,
  Printer,
  Share2,
  BellPlus,
  GripVertical,
} from 'lucide-react'
import { rendezVousNoah, questionsRdv, piecesAEmporter } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const onglets = ['Avant', 'Pendant', 'Après'] as const
type Onglet = (typeof onglets)[number]

export default function RdvDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const rdv = rendezVousNoah.find((r) => r.id === id)
  if (!rdv) notFound()

  const [onglet, setOnglet] = useState<Onglet>('Avant')

  return (
    <div className="flex flex-col gap-6">
      <Link href="/rendez-vous" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Tous les rendez-vous
      </Link>

      <header>
        <h1 className="font-serif text-[26px] text-teal-900">{rdv.intervenant}</h1>
        <p className="mt-1 text-encre-2">
          {rdv.fonction} · {rdv.date}
          {rdv.heure ? `, ${rdv.heure}` : ''} · {rdv.lieu}
        </p>
      </header>

      {/* Onglets */}
      <div role="tablist" aria-label="Étapes du rendez-vous" className="flex gap-1 border-b border-sable-2">
        {onglets.map((o) => (
          <button
            key={o}
            role="tab"
            aria-selected={onglet === o}
            onClick={() => setOnglet(o)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2.5 text-[15px] transition-colors',
              onglet === o ? 'border-teal-900 font-medium text-teal-900' : 'border-transparent text-encre-2 hover:text-encre',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      {onglet === 'Avant' && <Avant />}
      {onglet === 'Pendant' && <Pendant />}
      {onglet === 'Après' && <Apres />}
    </div>
  )
}

function Avant() {
  const [questions, setQuestions] = useState(questionsRdv)
  const [nouvelle, setNouvelle] = useState('')

  const ajouter = () => {
    const t = nouvelle.trim()
    if (!t) return
    setQuestions((q) => [...q, { id: `q${Date.now()}`, texte: t, ajoutee: 'ajoutée à l’instant', faite: false }])
    setNouvelle('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mes questions */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">Mes questions</h2>
        <div className="mt-4 flex gap-2">
          <input
            value={nouvelle}
            onChange={(e) => setNouvelle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) ajouter()
            }}
            placeholder="Une question vous vient ? Notez-la maintenant."
            aria-label="Nouvelle question"
            className="h-11 flex-1 rounded-md border border-sable-2 bg-card px-4 text-[15px] outline-none placeholder:text-encre-2"
          />
          <button
            type="button"
            onClick={ajouter}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground hover:bg-teal-700"
          >
            <Plus className="size-4" aria-hidden />
            Ajouter
          </button>
        </div>

        <ul className="mt-4 flex flex-col divide-y divide-sable-2">
          {questions.map((q) => (
            <li key={q.id} className="flex items-center gap-3 py-3">
              <GripVertical className="size-4 shrink-0 cursor-grab text-encre-2" aria-hidden />
              <button
                type="button"
                onClick={() => setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, faite: !x.faite } : x)))}
                aria-pressed={q.faite}
                aria-label={q.faite ? 'Marquer non traitée' : 'Marquer traitée'}
                className="shrink-0 text-teal-700"
              >
                {q.faite ? <CheckSquare className="size-5" aria-hidden /> : <Square className="size-5 text-encre-2" aria-hidden />}
              </button>
              <span className={cn('min-w-0 flex-1 text-[15px] text-encre', q.faite && 'text-encre-2 line-through')}>
                {q.texte}
              </span>
              <span className="etiquette shrink-0">{q.ajoutee}</span>
            </li>
          ))}
        </ul>
        <p className="etiquette mt-3">Les questions notées entre deux rendez-vous se retrouvent ici.</p>
      </section>

      {/* À emporter */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">À emporter</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {piecesAEmporter.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              {p.lie ? <CheckSquare className="size-5 shrink-0 text-teal-700" aria-hidden /> : <Square className="size-5 shrink-0 text-encre-2" aria-hidden />}
              <span className="flex-1 text-[15px] text-encre">{p.texte}</span>
              {p.lie && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1 text-[13px] text-teal-700">
                  <ImageIcon className="size-3.5" aria-hidden />
                  Dans le coffre
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Ce qui a changé */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">Ce qui a changé depuis la dernière fois</h2>
        <textarea
          rows={3}
          placeholder="Notez ce que le professionnel devrait savoir…"
          className="mt-3 w-full resize-none rounded-md border border-sable-2 bg-card p-3 text-[15px] outline-none placeholder:text-encre-2"
        />
      </section>

      <button
        type="button"
        className="inline-flex h-11 w-fit items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50"
      >
        <Printer className="size-4" aria-hidden />
        Imprimer la préparation
      </button>
    </div>
  )
}

function Pendant() {
  const champs = ['Ce qui a été dit', 'Ce qui a été décidé', 'Ce qui a été prescrit', 'Prochaine étape']
  return (
    <div className="flex flex-col gap-5">
      {champs.map((c) => (
        <section key={c}>
          <label className="font-serif text-lg text-teal-900" htmlFor={c}>
            {c}
          </label>
          <textarea
            id={c}
            rows={3}
            className="mt-2 w-full resize-none rounded-md border border-sable-2 bg-card p-3 text-[15px] outline-none"
          />
        </section>
      ))}
    </div>
  )
}

function Apres() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg bg-teal-50 p-6">
        <h2 className="font-serif text-xl text-teal-900">Décisions du rendez-vous</h2>
        <ul className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed text-encre">
          <li className="flex gap-3">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
            Poursuivre le suivi actuel, prochain point dans six mois.
          </li>
          <li className="flex gap-3">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
            Rédiger un certificat pour les transports scolaires.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground hover:bg-teal-700"
        >
          <Share2 className="size-4" aria-hidden />
          Partager le compte-rendu
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50"
        >
          <BellPlus className="size-4" aria-hidden />
          Créer un rappel
        </button>
      </div>
      <p className="etiquette">Un rappel ajoute un moment conseillé à votre chronologie.</p>
    </div>
  )
}
