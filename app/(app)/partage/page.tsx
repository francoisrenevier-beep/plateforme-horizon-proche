'use client'

import { useState } from 'react'
import { useDossier } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Link2, Clock, FileText, Check, HeartHandshake } from 'lucide-react'
import { cn } from '@/lib/utils'

const durees = ['24 heures', '7 jours', '30 jours']

export default function PartagePage() {
  const { personne, dossier, actions } = useDossier()
  const [selection, setSelection] = useState<string[]>([])
  const [portraitInclus, setPortraitInclus] = useState(false)
  const [duree, setDuree] = useState('7 jours')
  const [genere, setGenere] = useState<string | null>(null)
  const [copie, setCopie] = useState(false)

  const partageables = dossier.documents.filter((d) => d.classe)
  const portraitRempli = dossier.portrait.some((s) => s.texte)
  const total = selection.length + (portraitInclus ? 1 : 0)

  function toggle(id: string) {
    setGenere(null)
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function generer() {
    const jeton = Math.random().toString(36).slice(2, 10)
    setGenere(`horizon-proche.ch/c/${jeton}`)
    actions.journaliser(`Lien de consultation créé (${total} élément${total > 1 ? 's' : ''}, ${duree})`)
  }

  async function copier() {
    if (!genere) return
    try {
      await navigator.clipboard.writeText(genere)
      setCopie(true)
      setTimeout(() => setCopie(false), 1500)
    } catch {
      // presse-papiers indisponible
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="etiquette">Dossier de {personne.prenom}</p>
        <h1 className="mt-1 font-serif text-[26px] text-teal-900">Partager une sélection</h1>
        <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre-2">
          Vous choisissez exactement quelles pièces montrer, et pour combien de temps. Le lien n’est jamais envoyé à votre
          place : vous le transmettez vous-même, comme vous le souhaitez.
        </p>
      </header>

      {/* Étape 1 — choisir les pièces */}
      <section aria-labelledby="s1">
        <h2 id="s1" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">1</span>
          Ce que vous partagez
        </h2>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => {
                setGenere(null)
                setPortraitInclus((v) => !v)
              }}
              disabled={!portraitRempli}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:opacity-50',
                portraitInclus ? 'border-teal-700 bg-teal-100/60' : 'border-sable-2 bg-card hover:border-teal-700/40',
              )}
            >
              <span className={cn('grid size-5 shrink-0 place-items-center rounded-md border', portraitInclus ? 'border-teal-700 bg-teal-700 text-creme' : 'border-sable-2')} aria-hidden>
                {portraitInclus && <Check className="size-3.5" />}
              </span>
              <HeartHandshake className="size-4 shrink-0 text-encre-2" aria-hidden />
              <span className="flex-1">
                <span className="block text-sm text-encre">Portrait « Bien m’accompagner »</span>
                <span className="etiquette block">{portraitRempli ? 'Les sections remplies, en page A4' : 'Aucune section remplie pour l’instant'}</span>
              </span>
            </button>
          </li>
          {partageables.map((d) => {
            const actif = selection.includes(d.id)
            return (
              <li key={d.id}>
                <button
                  onClick={() => toggle(d.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                    actif ? 'border-teal-700 bg-teal-100/60' : 'border-sable-2 bg-card hover:border-teal-700/40',
                  )}
                >
                  <span className={cn('grid size-5 shrink-0 place-items-center rounded-md border', actif ? 'border-teal-700 bg-teal-700 text-creme' : 'border-sable-2')} aria-hidden>
                    {actif && <Check className="size-3.5" />}
                  </span>
                  <FileText className="size-4 shrink-0 text-encre-2" aria-hidden />
                  <span className="flex-1">
                    <span className="block text-sm text-encre">{d.titre}</span>
                    <span className="etiquette block">
                      {d.emetteur} · {d.date}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
          {partageables.length === 0 && <li className="etiquette px-1">Aucun document classé dans le coffre. Les documents non classés ne sont pas proposés au partage.</li>}
        </ul>
      </section>

      {/* Étape 2 — durée */}
      <section aria-labelledby="s2">
        <h2 id="s2" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">2</span>
          Pendant combien de temps
        </h2>
        <div className="flex flex-wrap gap-2">
          {durees.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuree(d)
                setGenere(null)
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                duree === d ? 'border-teal-700 bg-teal-900 text-creme' : 'border-sable-2 bg-card text-encre hover:border-teal-700/40',
              )}
            >
              <Clock className="size-4" aria-hidden />
              {d}
            </button>
          ))}
        </div>
        <p className="etiquette mt-3">Passé ce délai, le lien cesse de fonctionner tout seul. Vous n’avez rien à faire.</p>
      </section>

      {/* Étape 3 — générer */}
      <section aria-labelledby="s3">
        <h2 id="s3" className="mb-3 flex items-center gap-2 font-serif text-lg text-encre">
          <span className="grid size-6 place-items-center rounded-full bg-teal-900 font-mono text-xs text-creme">3</span>
          Créer le lien
        </h2>
        <Card className="p-5">
          <p className="text-sm text-encre-2">
            {total} élément{total > 1 ? 's' : ''} · consultable pendant {duree}
          </p>
          <button
            onClick={generer}
            disabled={total === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-900 px-5 py-3 text-sm font-medium text-creme transition-colors hover:bg-teal-700 disabled:opacity-40"
          >
            <Link2 className="size-4" aria-hidden />
            Générer un lien de consultation
          </button>

          {genere && (
            <div className="mt-4 rounded-xl border border-teal-700/25 bg-teal-50 p-4">
              <p className="etiquette mb-2 text-teal-900">Lien prêt — à vous de le transmettre</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-creme px-3 py-2 font-mono text-xs text-encre ring-1 ring-sable-2">{genere}</code>
                <button onClick={copier} className="rounded-lg bg-teal-900 px-3 py-2 text-xs text-creme hover:bg-teal-700">
                  {copie ? 'Copié' : 'Copier'}
                </button>
              </div>
              <p className="etiquette mt-2">
                Lien de démonstration : la page de consultation publique n’existe pas encore. Il ne mène nulle part.
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
