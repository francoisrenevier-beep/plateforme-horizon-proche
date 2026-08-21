import type { Metadata } from 'next'
import { intervenantsNoah, references } from '@/lib/demo-data'
import { Card } from '@/components/ui/card'
import { Phone, Mail, Copy, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Intervenants — Horizon Proche',
}

export default function IntervenantsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <header className="mb-8">
        <p className="etiquette">Dossier de Noah</p>
        <h1 className="mt-1 font-serif text-3xl text-encre">Les intervenants</h1>
        <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre/70">
          Toutes les personnes et institutions liées au dossier, avec leurs coordonnées et vos
          numéros de référence. Rien n’est envoyé automatiquement : ces fiches sont là pour vous.
        </p>
      </header>

      {/* Références utiles, épinglées en haut */}
      <section aria-labelledby="ref-titre" className="mb-8">
        <h2 id="ref-titre" className="etiquette mb-3">
          Références à portée de main
        </h2>
        <Card className="p-4">
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {references.map((r) => (
              <div key={r.id} className="min-w-[9rem]">
                <dt className="text-xs text-encre/55">{r.label}</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-mono text-sm text-encre">
                  {r.valeur}
                  <Copy className="size-3.5 text-encre-2" aria-hidden />
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <ul className="flex flex-col gap-3">
        {intervenantsNoah.map((i) => (
          <li key={i.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg text-encre">{i.organisation}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-encre/75">
                    <User className="size-3.5 text-encre-2" aria-hidden />
                    {i.contact} · {i.fonction}
                  </p>
                </div>
                {i.reference && (
                  <span className="rounded-full bg-teal-100 px-3 py-1 font-mono text-xs text-teal-900">
                    {i.reference}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${i.telephone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-sable-2 bg-creme px-3 py-2 text-sm text-encre transition-colors hover:bg-teal-50"
                >
                  <Phone className="size-4 text-teal-700" aria-hidden />
                  {i.telephone}
                </a>
                <a
                  href={`mailto:${i.courriel}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-sable-2 bg-creme px-3 py-2 text-sm text-encre transition-colors hover:bg-teal-50"
                >
                  <Mail className="size-4 text-teal-700" aria-hidden />
                  {i.courriel}
                </a>
              </div>

              {i.dernierContact && (
                <p className="mt-3 text-xs text-encre/50">Dernier contact noté : {i.dernierContact}</p>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
