'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Square, CheckSquare, ImageIcon, Plus, ExternalLink } from 'lucide-react'
import { fiches, type PieceAFournir } from '@/lib/fiches'

export default function FichePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const fiche = fiches[id]
  if (!fiche) notFound()

  return (
    <div className="flex flex-col gap-8">
      <Link href="/demarches" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Toutes les démarches
      </Link>

      {/* En-tête toujours visible */}
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-sable-2 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-[26px] text-teal-900">{fiche.titre}</h1>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-[13px] text-teal-900">{fiche.canton}</span>
          </div>
        </div>
        <p className="etiquette pt-2">
          Vérifié le {fiche.verifieLe} · Source : {fiche.source}
        </p>
      </header>

      <Bloc numero={1} titre="À quel moment cela arrive">
        <p>{fiche.moment}</p>
      </Bloc>

      <Bloc numero={2} titre="Ce que cela change concrètement">
        <p>{fiche.changement}</p>
      </Bloc>

      {/* Étape particulière : question ouverte, jamais une tâche */}
      {fiche.questionProtection && (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
          <h2 className="font-serif text-xl text-teal-900">Et la question de la protection ?</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-encre">{fiche.questionProtection.intro}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fiche.questionProtection.options.map((o) => (
              <div key={o.titre} className="rounded-lg border border-sable-2 bg-creme/60 p-4">
                <h3 className="font-serif text-[17px] text-teal-900">{o.titre}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-encre-2">{o.description}</p>
              </div>
            ))}
          </div>
          <p className="etiquette mt-4">
            Ces options sont présentées à titre d’information. Aucune n’est recommandée ni cochée par avance.
          </p>
        </section>
      )}

      <Bloc numero={3} titre="Qui décide, et où">
        <p>{fiche.q000decide.autorite}.</p>
        <Link
          href="/intervenants"
          className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline"
        >
          Voir la fiche de l’intervenant
          <ExternalLink className="size-3.5" aria-hidden />
        </Link>
        <EncadreCantonal texte={fiche.q000decide.cantonal} />
      </Bloc>

      <Bloc numero={4} titre="Ce qu’il faut fournir">
        <ListeCochable pieces={fiche.pieces} />
      </Bloc>

      <Bloc numero={5} titre="Combien de temps cela prend">
        <p>{fiche.duree}</p>
      </Bloc>

      <Bloc numero={6} titre="Et si la demande est refusée">
        <p>{fiche.refus}</p>
      </Bloc>

      {/* Erreurs fréquentes — en évidence sur fond teal-50 */}
      <section className="rounded-lg bg-teal-50 p-6">
        <h2 className="font-serif text-xl text-teal-900">Erreurs fréquentes</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {fiche.erreurs.map((e) => (
            <li key={e} className="flex gap-3 text-[15px] leading-relaxed text-encre">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* Ce que nous ne faisons pas */}
      <section className="rounded-lg bg-sable p-6">
        <h2 className="font-serif text-lg text-teal-900">Ce que nous ne faisons pas</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-encre">
          Nous n’établissons pas de conseil juridique. Pour un accompagnement personnalisé, adressez-vous à{' '}
          <a href="#" className="text-teal-700 underline">
            Pro Infirmis Vaud
          </a>{' '}
          ou au{' '}
          <a href="#" className="text-teal-700 underline">
            service social de votre commune
          </a>
          .
        </p>
      </section>
    </div>
  )
}

function Bloc({ numero, titre, children }: { numero: number; titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2 font-serif text-xl text-teal-900">
        <span className="etiquette text-encre-2">{numero}.</span>
        {titre}
      </h2>
      <div className="mt-3 text-[17px] leading-relaxed text-encre">{children}</div>
    </section>
  )
}

function EncadreCantonal({ texte }: { texte: string }) {
  return (
    <div className="mt-4 rounded-lg bg-teal-50 p-4">
      <p className="etiquette mb-1 flex items-center gap-1.5 text-teal-700">
        <ShieldCheck className="size-3.5" aria-hidden />
        Dans le canton de Vaud
      </p>
      <p className="text-[15px] leading-relaxed text-encre">{texte}</p>
    </div>
  )
}

function ListeCochable({ pieces }: { pieces: PieceAFournir[] }) {
  const [coche, setCoche] = useState<Record<string, boolean>>(
    Object.fromEntries(pieces.filter((p) => p.document).map((p) => [p.id, true])),
  )

  return (
    <ul className="flex flex-col divide-y divide-sable-2 rounded-lg border border-sable-2 bg-card">
      {pieces.map((p) => (
        <li key={p.id} className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setCoche((c) => ({ ...c, [p.id]: !c[p.id] }))}
            aria-pressed={!!coche[p.id]}
            aria-label={coche[p.id] ? `Décocher ${p.texte}` : `Cocher ${p.texte}`}
            className="shrink-0 text-teal-700"
          >
            {coche[p.id] ? <CheckSquare className="size-5" aria-hidden /> : <Square className="size-5 text-encre-2" aria-hidden />}
          </button>
          <span className="min-w-0 flex-1 text-[15px] text-encre">{p.texte}</span>
          {p.document ? (
            <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1.5 text-[13px] text-teal-700">
              <ImageIcon className="size-4" aria-hidden />
              {p.document}
            </span>
          ) : (
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-sable-2 px-2.5 py-1.5 text-[13px] text-encre-2 hover:bg-teal-50"
            >
              <Plus className="size-3.5" aria-hidden />
              Ajouter
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
