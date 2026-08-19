'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Camera, ChevronRight } from 'lucide-react'
import { documentsNoah } from '@/lib/demo-data'
import { CaptureFlow, DocIcon } from '@/components/capture-flow'
import { cn } from '@/lib/utils'

const filtres = ['Type', 'Émetteur', 'Année', 'Démarche']

export default function DocumentsPage() {
  const [recherche, setRecherche] = useState('')
  const [captureOuverte, setCaptureOuverte] = useState(false)

  const liste = documentsNoah.filter(
    (d) =>
      d.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      d.emetteur.toLowerCase().includes(recherche.toLowerCase()),
  )
  const nonClasses = documentsNoah.filter((d) => !d.classe).length

  return (
    <div className="flex flex-col gap-8 pb-24">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Documents</h1>
        <p className="mt-1 text-encre-2">Le coffre du dossier de Noah.</p>
      </header>

      {/* Recherche large — fonction majeure */}
      <div>
        <div className="flex items-center gap-3 rounded-lg border border-sable-2 bg-card px-4 py-3 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
          <Search className="size-5 text-encre-2" aria-hidden />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher dans tous les documents"
            aria-label="Rechercher dans tous les documents"
            className="w-full bg-transparent text-[17px] outline-none placeholder:text-encre-2"
          />
        </div>
        <p className="etiquette mt-2">Le texte des documents est recherchable.</p>
      </div>

      {/* Filtres en pastilles */}
      <div className="flex flex-wrap gap-2">
        {filtres.map((f) => (
          <button
            key={f}
            type="button"
            className="rounded-full border border-sable-2 bg-card px-4 py-2 text-[13px] text-encre transition-colors hover:bg-teal-50"
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          className="rounded-full bg-sable px-4 py-2 text-[13px] font-medium text-encre transition-colors hover:bg-sable-2"
        >
          Non classés ({nonClasses})
        </button>
      </div>

      {/* Liste en lignes */}
      <ul className="flex flex-col divide-y divide-sable-2 overflow-hidden rounded-lg border border-sable-2 bg-card">
        {liste.map((d) => (
          <li key={d.id}>
            <Link
              href={`/documents/${d.id}`}
              className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-teal-50"
            >
              <DocIcon type={d.type} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-[15px] font-medium text-encre">{d.titre}</p>
                  {!d.classe && (
                    <span className="rounded-full bg-sable px-2 py-0.5 text-[11px] text-encre-2">Non classé</span>
                  )}
                </div>
                <p className="etiquette truncate">
                  {d.emetteur} · {d.date}
                </p>
                {d.etiquettes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {d.etiquettes.map((e) => (
                      <span key={e} className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] text-teal-700">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ChevronRight className="size-4 shrink-0 text-encre-2" aria-hidden />
            </Link>
          </li>
        ))}
        {liste.length === 0 && (
          <li className="px-4 py-8 text-center text-encre-2">Aucun document ne correspond à votre recherche.</li>
        )}
      </ul>

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setCaptureOuverte(true)}
        className={cn(
          'fixed bottom-6 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-teal-900 px-6',
          'font-medium text-primary-foreground shadow-[0_6px_20px_rgba(22,78,78,0.25)] hover:bg-teal-700',
        )}
      >
        <Camera className="size-5" aria-hidden />
        Prendre une photo
      </button>

      {captureOuverte && <CaptureFlow onClose={() => setCaptureOuverte(false)} />}
    </div>
  )
}
