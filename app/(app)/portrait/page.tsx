'use client'

import { useState } from 'react'
import { Printer, Users, Pencil, X } from 'lucide-react'
import { portraitNoah } from '@/lib/demo-data'

export default function PortraitPage() {
  const [apercu, setApercu] = useState(false)

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-[32px] leading-tight text-teal-900">Bien m’accompagner</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-encre-2">
            Ce qu’il faut savoir sur Noah pour l’accompagner au quotidien.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setApercu(true)}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground hover:bg-teal-700"
          >
            <Printer className="size-4" aria-hidden />
            Imprimer une page à remettre
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50"
          >
            <Users className="size-4" aria-hidden />
            Qui peut le lire
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {portraitNoah.map((section) => (
          <article key={section.id} className="rounded-xl border border-sable-2 bg-card p-7 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-[22px] text-teal-900">{section.intitule}</h2>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700"
              >
                <Pencil className="size-3.5" aria-hidden />
                Modifier
              </button>
            </div>
            {section.texte ? (
              <p className="mt-3 text-[18px] leading-[1.7] text-encre">{section.texte}</p>
            ) : (
              <p className="mt-3 text-[17px] leading-relaxed text-encre-2">
                Personne n’a encore rempli cette section. Une phrase suffit pour commencer.
              </p>
            )}
          </article>
        ))}
      </div>

      {/* Bandeau en pied de page, obligatoire */}
      <div className="rounded-xl bg-teal-50 p-6 text-[17px] leading-relaxed text-encre">
        Ce portrait appartient à Noah. À sa majorité, il pourra le lire, le corriger et décider qui y a accès.
      </div>

      {apercu && <ApercuA4 onClose={() => setApercu(false)} />}
    </div>
  )
}

function ApercuA4({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-encre/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Aperçu de la page à remettre">
      <div className="w-full max-w-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-medium text-creme">Aperçu — page A4</p>
          <button type="button" onClick={onClose} aria-label="Fermer l’aperçu" className="flex size-9 items-center justify-center rounded-md bg-creme text-encre hover:bg-sable">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="rounded-lg bg-card p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="border-b border-sable-2 pb-4">
            <p className="etiquette">Bien m’accompagner</p>
            <h2 className="font-serif text-2xl text-teal-900">Noah, 16 ans</h2>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {portraitNoah
              .filter((s) => s.texte)
              .map((s) => (
                <div key={s.id}>
                  <h3 className="font-serif text-[15px] text-teal-900">{s.intitule}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-encre">{s.texte}</p>
                </div>
              ))}
          </div>
          <p className="etiquette mt-8 border-t border-sable-2 pt-4">
            Rédigé par sa famille · mis à jour le 2 août 2026
          </p>
        </div>
      </div>
    </div>
  )
}
