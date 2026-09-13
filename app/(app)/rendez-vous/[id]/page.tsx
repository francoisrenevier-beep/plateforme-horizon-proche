'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Square, CheckSquare, ImageIcon, Printer, Share2, BellPlus, Trash2, Pencil } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { aujourdhuiISO, formatDateLongue, formatRelatif } from '@/lib/dates'
import type { RendezVous } from '@/lib/demo-data'
import { Entree, ZoneTexte, BoutonPrincipal, BoutonSecondaire, BoutonSuppression } from '@/components/ui/formulaire'
import { FormulaireRendezVous } from '@/components/formulaire-rendez-vous'
import { FormulaireEcheance } from '@/components/formulaire-echeance'
import { cn } from '@/lib/utils'

const onglets = ['Avant', 'Pendant', 'Après'] as const
type Onglet = (typeof onglets)[number]

export default function RdvDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { dossier, actions } = useDossier()
  const rdv = dossier.rendezVous.find((r) => r.id === id)

  const [onglet, setOnglet] = useState<Onglet>('Avant')
  const [edition, setEdition] = useState(false)
  const [suppression, setSuppression] = useState(false)

  useEffect(() => {
    if (rdv && rdv.dateISO < aujourdhuiISO()) setOnglet('Après')
  }, [rdv?.id, rdv?.dateISO]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!rdv) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/rendez-vous" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          Tous les rendez-vous
        </Link>
        <p className="rounded-lg border border-dashed border-sable-2 p-8 text-center text-encre-2">Ce rendez-vous n’existe plus.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/rendez-vous" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Tous les rendez-vous
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[26px] text-teal-900">{rdv.intervenant}</h1>
          <p className="mt-1 text-encre-2">
            {rdv.fonction && `${rdv.fonction} · `}
            {formatDateLongue(rdv.dateISO)}
            {rdv.heure ? `, ${rdv.heure}` : ''}
            {rdv.lieu && ` · ${rdv.lieu}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setEdition(true)} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
            <Pencil className="size-3.5" aria-hidden />
            Modifier
          </button>
          <BoutonSuppression
            className="h-9"
            arme={suppression}
            onArmer={() => setSuppression(true)}
            onAnnuler={() => setSuppression(false)}
            onConfirmer={() => {
              actions.supprimerRendezVous(rdv.id)
              router.push('/rendez-vous')
            }}
          />
        </div>
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

      {onglet === 'Avant' && <Avant rdv={rdv} />}
      {onglet === 'Pendant' && <Pendant rdv={rdv} />}
      {onglet === 'Après' && <Apres rdv={rdv} />}

      {edition && <FormulaireRendezVous rdv={rdv} onClose={() => setEdition(false)} />}
    </div>
  )
}

function Avant({ rdv }: { rdv: RendezVous }) {
  const { dossier, actions } = useDossier()
  const [nouvelle, setNouvelle] = useState('')
  const [nouvellePiece, setNouvellePiece] = useState('')
  const [changements, setChangements] = useState(rdv.changements)

  const ajouter = () => {
    const t = nouvelle.trim()
    if (!t) return
    actions.ajouterQuestionRdv(rdv.id, t)
    setNouvelle('')
  }
  const ajouterPiece = () => {
    const t = nouvellePiece.trim()
    if (!t) return
    const lie = dossier.documents.some((d) => t.toLowerCase().includes(d.titre.toLowerCase()))
    actions.ajouterPieceRdv(rdv.id, t, lie)
    setNouvellePiece('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mes questions */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">Mes questions</h2>
        <div className="mt-4 flex gap-2">
          <Entree
            value={nouvelle}
            onChange={(e) => setNouvelle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) ajouter()
            }}
            placeholder="Une question vous vient ? Notez-la maintenant."
            aria-label="Nouvelle question"
            className="flex-1"
          />
          <BoutonPrincipal onClick={ajouter}>
            <Plus className="size-4" aria-hidden />
            Ajouter
          </BoutonPrincipal>
        </div>

        <ul className="mt-4 flex flex-col divide-y divide-sable-2">
          {rdv.questions.length === 0 && <li className="py-3 text-[15px] text-encre-2">Aucune question notée.</li>}
          {rdv.questions.map((q) => (
            <li key={q.id} className="flex items-center gap-3 py-3">
              <button
                type="button"
                onClick={() => actions.basculerQuestionRdv(rdv.id, q.id)}
                aria-pressed={q.faite}
                aria-label={q.faite ? 'Marquer non traitée' : 'Marquer traitée'}
                className="shrink-0 text-teal-700"
              >
                {q.faite ? <CheckSquare className="size-5" aria-hidden /> : <Square className="size-5 text-encre-2" aria-hidden />}
              </button>
              <span className={cn('min-w-0 flex-1 text-[15px] text-encre', q.faite && 'text-encre-2 line-through')}>{q.texte}</span>
              <span className="etiquette shrink-0">ajoutée {formatRelatif(q.ajouteeLe)}</span>
              <button type="button" onClick={() => actions.supprimerQuestionRdv(rdv.id, q.id)} aria-label="Supprimer la question" className="shrink-0 text-encre-2 hover:text-rouille">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        <p className="etiquette mt-3">Les questions notées entre deux rendez-vous se retrouvent ici.</p>
      </section>

      {/* À emporter */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">À emporter</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {rdv.pieces.length === 0 && <li className="text-[15px] text-encre-2">Rien à emporter pour l’instant.</li>}
          {rdv.pieces.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <button type="button" onClick={() => actions.basculerPieceRdv(rdv.id, p.id)} aria-pressed={p.lie} aria-label={p.lie ? 'Marquer non prête' : 'Marquer prête'} className="shrink-0">
                {p.lie ? <CheckSquare className="size-5 text-teal-700" aria-hidden /> : <Square className="size-5 text-encre-2" aria-hidden />}
              </button>
              <span className="flex-1 text-[15px] text-encre">{p.texte}</span>
              {p.lie && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1 text-[13px] text-teal-700">
                  <ImageIcon className="size-3.5" aria-hidden />
                  Prête
                </span>
              )}
              <button type="button" onClick={() => actions.supprimerPieceRdv(rdv.id, p.id)} aria-label="Retirer" className="shrink-0 text-encre-2 hover:text-rouille">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <Entree
            value={nouvellePiece}
            onChange={(e) => setNouvellePiece(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) ajouterPiece()
            }}
            list="pieces-coffre"
            placeholder="Ajouter une pièce à emporter"
            aria-label="Nouvelle pièce"
            className="flex-1"
          />
          <datalist id="pieces-coffre">
            {dossier.documents.map((d) => (
              <option key={d.id} value={d.titre} />
            ))}
          </datalist>
          <BoutonSecondaire onClick={ajouterPiece}>
            <Plus className="size-4" aria-hidden />
            Ajouter
          </BoutonSecondaire>
        </div>
      </section>

      {/* Ce qui a changé */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">Ce qui a changé depuis la dernière fois</h2>
        <ZoneTexte
          rows={3}
          value={changements}
          onChange={(e) => setChangements(e.target.value)}
          onBlur={() => changements !== rdv.changements && actions.modifierRendezVous(rdv.id, { changements })}
          placeholder="Notez ce que le professionnel devrait savoir…"
          className="mt-3"
        />
        <p className="etiquette mt-2">Enregistré automatiquement.</p>
      </section>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 w-fit items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50"
      >
        <Printer className="size-4" aria-hidden />
        Imprimer la préparation
      </button>
    </div>
  )
}

function Pendant({ rdv }: { rdv: RendezVous }) {
  const { actions } = useDossier()
  const champs: { cle: keyof RendezVous['notes']; label: string }[] = [
    { cle: 'dit', label: 'Ce qui a été dit' },
    { cle: 'decide', label: 'Ce qui a été décidé' },
    { cle: 'prescrit', label: 'Ce qui a été prescrit' },
    { cle: 'prochaine', label: 'Prochaine étape' },
  ]
  const [notes, setNotes] = useState(rdv.notes)
  return (
    <div className="flex flex-col gap-5">
      {champs.map((c) => (
        <section key={c.cle}>
          <label className="font-serif text-lg text-teal-900" htmlFor={`note-${c.cle}`}>
            {c.label}
          </label>
          <ZoneTexte
            id={`note-${c.cle}`}
            rows={3}
            value={notes[c.cle]}
            onChange={(e) => setNotes((n) => ({ ...n, [c.cle]: e.target.value }))}
            onBlur={() => notes[c.cle] !== rdv.notes[c.cle] && actions.modifierRendezVous(rdv.id, { notes })}
            className="mt-2"
          />
        </section>
      ))}
      <p className="etiquette">Enregistré automatiquement à chaque sortie de champ.</p>
    </div>
  )
}

function Apres({ rdv }: { rdv: RendezVous }) {
  const { actions } = useDossier()
  const [nouvelle, setNouvelle] = useState('')
  const [rappel, setRappel] = useState(false)

  const ajouter = () => {
    const t = nouvelle.trim()
    if (!t) return
    actions.ajouterDecisionRdv(rdv.id, t)
    setNouvelle('')
  }

  const decisionsDeduites = [rdv.notes.decide, rdv.notes.prochaine].filter((t) => t.trim() && !rdv.decisions.includes(t.trim()))

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg bg-teal-50 p-6">
        <h2 className="font-serif text-xl text-teal-900">Décisions du rendez-vous</h2>
        <ul className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed text-encre">
          {rdv.decisions.length === 0 && decisionsDeduites.length === 0 && <li className="text-encre-2">Rien n’a encore été noté.</li>}
          {rdv.decisions.map((d, i) => (
            <li key={`${d}-${i}`} className="flex items-start gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
              <span className="flex-1">{d}</span>
              <button type="button" onClick={() => actions.supprimerDecisionRdv(rdv.id, i)} aria-label="Retirer" className="text-encre-2 hover:text-rouille">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
          {decisionsDeduites.map((d) => (
            <li key={d} className="flex items-start gap-3 text-encre-2">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sable-2" aria-hidden />
              <span className="flex-1">
                {d} <span className="etiquette">(noté pendant le rendez-vous)</span>
              </span>
              <button type="button" onClick={() => actions.ajouterDecisionRdv(rdv.id, d.trim())} className="text-[13px] text-teal-700 hover:underline">
                Retenir
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <Entree
            value={nouvelle}
            onChange={(e) => setNouvelle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) ajouter()
            }}
            placeholder="Ajouter une décision"
            aria-label="Nouvelle décision"
            className="flex-1"
          />
          <BoutonSecondaire onClick={ajouter}>
            <Plus className="size-4" aria-hidden />
            Ajouter
          </BoutonSecondaire>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <BoutonPrincipal onClick={() => window.print()}>
          <Share2 className="size-4" aria-hidden />
          Partager le compte-rendu
        </BoutonPrincipal>
        <BoutonSecondaire onClick={() => setRappel(true)}>
          <BellPlus className="size-4" aria-hidden />
          Créer un rappel
        </BoutonSecondaire>
      </div>
      <p className="etiquette">Un rappel ajoute un moment conseillé à votre chronologie.</p>

      {rappel && <FormulaireEcheance natureInitiale="jalon" onClose={() => setRappel(false)} />}
    </div>
  )
}
