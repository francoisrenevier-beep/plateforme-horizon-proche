'use client'

import { useState } from 'react'
import { X, Camera, ImageIcon, Check, ChevronRight } from 'lucide-react'
import { intervenantsNoah, demarches } from '@/lib/demo-data'

// Parcours de capture en trois étapes — la première suffit (mode « vidage de carton »).
export function CaptureFlow({ onClose }: { onClose: () => void }) {
  const [etape, setEtape] = useState(1)
  const [compteur, setCompteur] = useState(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter un document"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-card sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-sable-2 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg text-teal-900">Ajouter un document</h2>
            <p className="etiquette">Étape {etape} sur 3</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 items-center justify-center rounded-md text-encre-2 hover:bg-sable"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {etape === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex aspect-[3/4] max-h-72 items-center justify-center rounded-lg border border-sable-2 bg-sable">
                <span className="flex flex-col items-center gap-2 text-encre-2">
                  <Camera className="size-10" strokeWidth={1.5} aria-hidden />
                  <span className="etiquette">Aperçu de la photo</span>
                </span>
              </div>
              {compteur > 1 && (
                <p className="etiquette text-center">{compteur} photos prises dans cette session</p>
              )}
              <button
                type="button"
                onClick={() => setEtape(2)}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-6 font-medium text-primary-foreground hover:bg-teal-700"
              >
                <Check className="size-5" aria-hidden />
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setCompteur((c) => c + 1)}
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-sable-2 px-6 text-[15px] text-teal-700 hover:bg-teal-50"
              >
                <Camera className="size-4" aria-hidden />
                Photographier le document suivant
              </button>
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-6">
              <p className="etiquette">Trois questions facultatives. Vous pouvez tout passer.</p>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">
                  Ce document contient-il une date à ne pas manquer&nbsp;?
                </legend>
                <p className="etiquette">Recopiez la date telle qu’elle figure sur le document.</p>
                <div className="mt-1 flex gap-2">
                  <input
                    type="date"
                    className="h-11 flex-1 rounded-md border border-sable-2 bg-card px-3 text-[15px]"
                    aria-label="Date figurant sur le document"
                  />
                  <button type="button" className="h-11 rounded-md border border-sable-2 px-5 text-[15px] text-encre-2 hover:bg-sable">
                    Non
                  </button>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">De qui vient ce courrier&nbsp;?</legend>
                <div className="flex flex-wrap gap-2">
                  {intervenantsNoah.slice(0, 3).map((i) => (
                    <button key={i.id} type="button" className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] hover:bg-teal-50">
                      {i.organisation}
                    </button>
                  ))}
                  <button type="button" className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] text-encre-2 hover:bg-sable">
                    Passer
                  </button>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">À quelle démarche se rattache-t-il&nbsp;?</legend>
                <div className="flex flex-wrap gap-2">
                  {demarches.map((d) => (
                    <button key={d.id} type="button" className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] hover:bg-teal-50">
                      {d.titre}
                    </button>
                  ))}
                  <button type="button" className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] text-encre-2 hover:bg-sable">
                    Passer
                  </button>
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() => setEtape(3)}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-6 font-medium text-primary-foreground hover:bg-teal-700"
              >
                Terminer
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}

          {etape === 3 && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                <Check className="size-7" aria-hidden />
              </span>
              <div>
                <h3 className="font-serif text-xl text-teal-900">Enregistré</h3>
                <p className="mt-1 text-encre-2">Classé dans Assurances — AI.</p>
              </div>
              <button type="button" className="text-[15px] text-teal-700 hover:underline">
                Changer le classement
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 flex h-11 items-center justify-center rounded-md border border-sable-2 px-6 text-[15px] hover:bg-teal-50"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DocIcon({ type }: { type: string }) {
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-md border border-sable-2 bg-teal-50"
      aria-hidden
    >
      <ImageIcon className="size-5 text-teal-700" strokeWidth={1.5} />
      <span className="sr-only">{type}</span>
    </span>
  )
}
