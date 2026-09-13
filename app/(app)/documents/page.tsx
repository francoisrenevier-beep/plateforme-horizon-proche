'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Camera, ChevronRight } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { CaptureFlow, DocIcon } from '@/components/capture-flow'
import { cn } from '@/lib/utils'

type Cle = 'type' | 'emetteur' | 'annee' | 'demarche'
const filtres: { cle: Cle; label: string }[] = [
  { cle: 'type', label: 'Type' },
  { cle: 'emetteur', label: 'Émetteur' },
  { cle: 'annee', label: 'Année' },
  { cle: 'demarche', label: 'Démarche' },
]

export default function DocumentsPage() {
  const { personne, dossier } = useDossier()
  const [recherche, setRecherche] = useState('')
  const [captureOuverte, setCaptureOuverte] = useState(false)
  const [filtreOuvert, setFiltreOuvert] = useState<Cle | null>(null)
  const [valeurs, setValeurs] = useState<Partial<Record<Cle, string>>>({})
  const [nonClassesSeuls, setNonClassesSeuls] = useState(false)

  const documents = dossier.documents
  const options = useMemo(() => {
    const o: Record<Cle, string[]> = { type: [], emetteur: [], annee: [], demarche: [] }
    for (const d of documents) {
      for (const cle of Object.keys(o) as Cle[]) {
        const v = d[cle]
        if (v && !o[cle].includes(v)) o[cle].push(v)
      }
    }
    return o
  }, [documents])

  const q = recherche.toLowerCase()
  const liste = documents.filter(
    (d) =>
      (d.titre.toLowerCase().includes(q) || d.emetteur.toLowerCase().includes(q) || d.etiquettes.some((e) => e.toLowerCase().includes(q))) &&
      (Object.keys(valeurs) as Cle[]).every((cle) => !valeurs[cle] || d[cle] === valeurs[cle]) &&
      (!nonClassesSeuls || !d.classe),
  )
  const nonClasses = documents.filter((d) => !d.classe).length

  return (
    <div className="flex flex-col gap-8 pb-24">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Documents</h1>
        <p className="mt-1 text-encre-2">Le coffre du dossier de {personne.prenom}.</p>
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
        <p className="etiquette mt-2">Recherche sur le titre, l’émetteur et les étiquettes.</p>
      </div>

      {/* Filtres en pastilles */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {filtres.map((f) => {
            const actif = !!valeurs[f.cle]
            return (
              <button
                key={f.cle}
                type="button"
                onClick={() => setFiltreOuvert((v) => (v === f.cle ? null : f.cle))}
                aria-expanded={filtreOuvert === f.cle}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] transition-colors',
                  actif ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 bg-card text-encre hover:bg-teal-50',
                )}
              >
                {f.label}
                {actif && ` : ${valeurs[f.cle]}`}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setNonClassesSeuls((v) => !v)}
            aria-pressed={nonClassesSeuls}
            className={cn(
              'rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
              nonClassesSeuls ? 'bg-teal-900 text-primary-foreground' : 'bg-sable text-encre hover:bg-sable-2',
            )}
          >
            Non classés ({nonClasses})
          </button>
        </div>
        {filtreOuvert && (
          <div className="flex flex-wrap gap-2 rounded-lg border border-sable-2 bg-card p-3">
            <button
              type="button"
              onClick={() => {
                setValeurs((v) => ({ ...v, [filtreOuvert]: undefined }))
                setFiltreOuvert(null)
              }}
              className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] text-encre-2 hover:bg-sable"
            >
              Tous
            </button>
            {options[filtreOuvert].map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setValeurs((v) => ({ ...v, [filtreOuvert]: o }))
                  setFiltreOuvert(null)
                }}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[13px]',
                  valeurs[filtreOuvert] === o ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 hover:bg-teal-50',
                )}
              >
                {o}
              </button>
            ))}
            {options[filtreOuvert].length === 0 && <span className="etiquette">Aucune valeur.</span>}
          </div>
        )}
      </div>

      {/* Liste en lignes */}
      <ul className="flex flex-col divide-y divide-sable-2 overflow-hidden rounded-lg border border-sable-2 bg-card">
        {liste.map((d) => (
          <li key={d.id}>
            <Link href={`/documents/${d.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-teal-50">
              <DocIcon type={d.type} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-[15px] font-medium text-encre">{d.titre}</p>
                  {!d.classe && <span className="rounded-full bg-sable px-2 py-0.5 text-[11px] text-encre-2">Non classé</span>}
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
          <li className="px-4 py-8 text-center text-encre-2">
            {documents.length === 0 ? 'Le coffre est vide. Ajoutez un premier document.' : 'Aucun document ne correspond à votre recherche.'}
          </li>
        )}
      </ul>

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setCaptureOuverte(true)}
        className={cn(
          'fixed bottom-20 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-teal-900 px-6 md:bottom-6',
          'font-medium text-primary-foreground shadow-[0_6px_20px_rgba(22,78,78,0.25)] hover:bg-teal-700',
        )}
      >
        <Camera className="size-5" aria-hidden />
        Ajouter un document
      </button>

      {captureOuverte && <CaptureFlow onClose={() => setCaptureOuverte(false)} />}
    </div>
  )
}
