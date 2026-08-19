'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, Share2, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { documentsNoah } from '@/lib/demo-data'

export default function DocumentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const doc = documentsNoah.find((d) => d.id === id)
  if (!doc) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Link href="/documents" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Tous les documents
      </Link>

      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Image */}
        <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-sable-2 bg-sable">
          <span className="flex flex-col items-center gap-2 text-encre-2">
            <ImageIcon className="size-12" strokeWidth={1.25} aria-hidden />
            <span className="etiquette">{doc.type}</span>
          </span>
        </div>

        {/* Informations */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-serif text-2xl text-teal-900">{doc.titre}</h1>
            <p className="mt-1 text-encre-2">{doc.emetteur}</p>
          </div>

          <dl className="flex flex-col divide-y divide-sable-2 rounded-lg border border-sable-2 bg-card">
            <Ligne terme="Type" valeur={doc.type} />
            <Ligne terme="Émetteur" valeur={doc.emetteur} />
            <Ligne terme="Date" valeur={doc.date} />
            <Ligne terme="Démarche liée" valeur={doc.demarche ?? 'Aucune'} />
            <Ligne terme="Échéance liée" valeur={doc.demarche === 'Renouvellement API' ? 'Questionnaire API — 3 octobre 2026' : 'Aucune'} />
            <Ligne terme="Ajouté par" valeur="Sandrine Perret · hier, 18h12" />
          </dl>

          <div>
            <p className="etiquette mb-2">Étiquettes</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {doc.etiquettes.map((e) => (
                <span key={e} className="rounded-md bg-teal-50 px-2.5 py-1 text-[13px] text-teal-700">
                  {e}
                </span>
              ))}
              <button type="button" className="rounded-md border border-dashed border-sable-2 px-2.5 py-1 text-[13px] text-encre-2 hover:bg-teal-50">
                + Ajouter une étiquette
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Action icon={Download} label="Télécharger" primaire />
            <Action icon={Share2} label="Partager" />
            <Action icon={Pencil} label="Renommer" />
            <Action icon={Trash2} label="Supprimer" />
          </div>
        </div>
      </div>

      {/* Encadré obligatoire */}
      <div className="rounded-lg bg-sable px-5 py-4 text-[15px] text-encre">
        Cette photo ne remplace pas l’original. Conservez le document papier.
      </div>
    </div>
  )
}

function Ligne({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="etiquette shrink-0">{terme}</dt>
      <dd className="text-right text-[15px] text-encre">{valeur}</dd>
    </div>
  )
}

function Action({
  icon: Icon,
  label,
  primaire,
}: {
  icon: typeof Download
  label: string
  primaire?: boolean
}) {
  return (
    <button
      type="button"
      className={
        primaire
          ? 'inline-flex h-11 items-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground hover:bg-teal-700'
          : 'inline-flex h-11 items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50'
      }
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  )
}
