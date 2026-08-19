'use client'

import { useState } from 'react'
import { documentsNoah } from '@/lib/demo-data'
import { Card } from '@/components/ui/card'
import { Link2, Clock, FileText, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const durees = ['24 heures', '7 jours', '30 jours']

export default function PartagePage() {
  const [selection, setSelection] = useState<string[]>(['d1'])
  const [duree, setDuree] = useState('7 jours')
  const [genere, setGenere] = useState(false)

  const dossierPartageable = documentsNoah.filter((d) => d.classe).slice(0, 6)

  function toggle(id: string) {
    setGenere(false)
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <header className="mb-6">
        <p className="etiquette">Dossier de Noah</p>
        <h1 className="mt-1 font-serif text-3xl text-encre">Partager une sélection</h1>
        <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre/70">
          Vous choisissez exactement quelles pièces montrer, et pour combien de temps. Le lien
          n’est jamais envoyé à votre place : vous le transmettez vous-même, comme vous le
          souhaitez.
        </p>
      </header>

      {/* Étape 1 — choisir les pièces */}
      <section aria-labelledby="s1" className="mb-8">
        <h2 id="s1" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">
            1
          </span>
          Ce que vous partagez
        </h2>
        <ul className="flex flex-col gap-2">
          {dossierPartageable.map((d) => {
            const actif = selection.includes(d.id)
            return (
              <li key={d.id}>
                <button
                  onClick={() => toggle(d.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                    actif
                      ? 'border-teal-700 bg-teal-100/60'
                      : 'border-sable-2 bg-card hover:border-teal-700/40',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-md border',
                      actif ? 'border-teal-700 bg-teal-700 text-creme' : 'border-sable-2',
                    )}
                    aria-hidden
                  >
                    {actif && <Check className="size-3.5" />}
                  </span>
                  <FileText className="size-4 shrink-0 text-encre-2" aria-hidden />
                  <span className="flex-1">
                    <span className="block text-sm text-encre">{d.titre}</span>
                    <span className="block text-xs text-encre/55">
                      {d.emetteur} · {d.date}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Étape 2 — durée */}
      <section aria-labelledby="s2" className="mb-8">
        <h2 id="s2" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">
            2
          </span>
          Pendant combien de temps
        </h2>
        <div className="flex flex-wrap gap-2">
          {durees.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuree(d)
                setGenere(false)
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                duree === d
                  ? 'border-teal-700 bg-teal-900 text-creme'
                  : 'border-sable-2 bg-card text-encre hover:border-teal-700/40',
              )}
            >
              <Clock className="size-4" aria-hidden />
              {d}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-encre/55">
          Passé ce délai, le lien cesse de fonctionner tout seul. Vous n’avez rien à faire.
        </p>
      </section>

      {/* Étape 3 — générer */}
      <section aria-labelledby="s3">
        <h2 id="s3" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">
            3
          </span>
          Créer le lien
        </h2>
        <Card className="p-5">
          <p className="text-sm text-encre/70">
            {selection.length} pièce{selection.length > 1 ? 's' : ''} · consultable pendant {duree}
          </p>
          <button
            onClick={() => setGenere(true)}
            disabled={selection.length === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-900 px-5 py-3 text-sm font-medium text-creme transition-colors hover:bg-teal-700 disabled:opacity-40"
          >
            <Link2 className="size-4" aria-hidden />
            Générer un lien de consultation
          </button>

          {genere && (
            <div className="mt-4 rounded-xl border border-teal-700/25 bg-teal-50 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-teal-900/70">
                Lien prêt — à vous de le transmettre
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-creme px-3 py-2 font-mono text-xs text-encre ring-1 ring-sable-2">
                  reperes.ch/c/{Math.random().toString(36).slice(2, 10)}
                </code>
                <button className="rounded-lg bg-teal-900 px-3 py-2 text-xs text-creme hover:bg-teal-700">
                  Copier
                </button>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
