import type { Metadata } from 'next'
import { accesNoah } from '@/lib/demo-data'
import { Card } from '@/components/ui/card'
import { Shield, Clock, Eye, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accès et rôles — Repères',
}

const roleTons: Record<string, string> = {
  Titulaire: 'bg-teal-900 text-creme',
  Parent: 'bg-teal-100 text-teal-900',
  Professionnel: 'bg-sable text-encre',
}

export default function AccesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <header className="mb-6">
        <p className="etiquette">Dossier de Noah</p>
        <h1 className="mt-1 font-serif text-3xl text-encre">Accès et rôles</h1>
        <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre/70">
          Vous décidez qui voit quoi, et pour combien de temps. Chaque accès est limité et peut être
          retiré à tout moment. Personne n’est ajouté sans votre geste.
        </p>
      </header>

      {/* Principe de confiance, sobre */}
      <Card className="mb-8 flex items-start gap-3 border-teal-700/25 bg-teal-50 p-4">
        <Shield className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
        <p className="text-sm leading-relaxed text-teal-900">
          Un accès ne donne jamais le droit d’agir à votre place. Il permet seulement de consulter la
          partie du dossier que vous avez choisi de partager.
        </p>
      </Card>

      <ul className="flex flex-col gap-3">
        {accesNoah.map((a) => (
          <li key={a.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-creme font-serif text-lg text-encre ring-1 ring-sable-2">
                    {a.nom.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-medium text-encre">{a.nom}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleTons[a.role] ?? 'bg-sable text-encre'}`}
                    >
                      {a.role}
                    </span>
                  </div>
                </div>
                {a.role !== 'Titulaire' && (
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-rouille/30 px-3 py-1.5 text-sm text-rouille transition-colors hover:bg-rouille/10">
                    <X className="size-3.5" aria-hidden />
                    Retirer l’accès
                  </button>
                )}
              </div>

              <dl className="mt-4 grid gap-3 border-t border-sable-2 pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Eye className="mt-0.5 size-4 shrink-0 text-encre-2" aria-hidden />
                  <div>
                    <dt className="text-xs text-encre/55">Peut voir</dt>
                    <dd className="text-sm text-encre">{a.peutVoir}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0 text-encre-2" aria-hidden />
                  <div>
                    <dt className="text-xs text-encre/55">Durée</dt>
                    <dd className="text-sm text-encre">
                      depuis {a.depuis} · jusqu’à {a.jusqua}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </li>
        ))}
      </ul>

      <button className="mt-6 w-full rounded-xl border border-dashed border-sable-2 py-4 text-sm text-encre-2 transition-colors hover:border-teal-700 hover:text-teal-900">
        + Inviter une personne à consulter une partie du dossier
      </button>
    </div>
  )
}
