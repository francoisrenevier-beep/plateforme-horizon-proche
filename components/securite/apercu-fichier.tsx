'use client'

// Aperçu d'un fichier du coffre : déchiffré à la demande, en mémoire, jamais écrit en clair.
// L'URL temporaire est révoquée dès que l'aperçu disparaît (navigation ou verrouillage).

import { useEffect, useRef, useState } from 'react'
import { Camera, Download, ExternalLink, FileText, ImageIcon, Paperclip } from 'lucide-react'
import { useDossier } from '@/lib/store'
import type { Document } from '@/lib/demo-data'
import { useSecurite, telechargerBlob } from '@/components/securite/contexte-securite'
import { TAILLE_MAX_FICHIER } from '@/lib/securite/stockage'
import { BoutonPrincipal, BoutonSecondaire, MessageErreur } from '@/components/ui/formulaire'

export const TYPES_ACCEPTES = 'image/jpeg,image/png,image/heic,image/heif,image/webp,application/pdf'

export function tailleLisible(octets: number): string {
  if (octets < 1024) return `${octets} o`
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`
  return `${(octets / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}

export function verifierFichier(f: File): string | null {
  if (f.size > TAILLE_MAX_FICHIER) return 'Ce fichier dépasse 15 Mo. Une photo prise avec le téléphone suffit en général.'
  if (f.type && !TYPES_ACCEPTES.split(',').includes(f.type)) return 'Formats acceptés : photo (JPEG, PNG, HEIC) ou PDF.'
  return null
}

// Boutons de choix : appareil photo (sur téléphone) ou fichier existant.
export function ChoixFichier({ onChoisi, disabled }: { onChoisi: (f: File) => void; disabled?: boolean }) {
  const photo = useRef<HTMLInputElement>(null)
  const fichier = useRef<HTMLInputElement>(null)
  const choisir = (f?: File) => f && onChoisi(f)
  return (
    <div className="flex flex-wrap gap-2">
      <BoutonSecondaire onClick={() => photo.current?.click()} disabled={disabled}>
        <Camera className="size-4" aria-hidden />
        Prendre une photo
      </BoutonSecondaire>
      <BoutonSecondaire onClick={() => fichier.current?.click()} disabled={disabled}>
        <Paperclip className="size-4" aria-hidden />
        Choisir un fichier
      </BoutonSecondaire>
      <input ref={photo} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => choisir(e.target.files?.[0])} />
      <input ref={fichier} type="file" accept={TYPES_ACCEPTES} className="hidden" onChange={(e) => choisir(e.target.files?.[0])} />
    </div>
  )
}

export function ApercuFichier({ doc }: { doc: Document }) {
  const { ouvrirFichier, enregistrerFichier } = useSecurite()
  const { actions, actionsCompte, lectureSeule } = useDossier()
  const [url, setUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  useEffect(() => {
    if (!doc.fichier) return
    let urlCree: string | null = null
    let annule = false
    setChargement(true)
    ouvrirFichier(doc.id)
      .then((r) => {
        if (annule || !r) return
        urlCree = URL.createObjectURL(r.blob)
        setBlob(r.blob)
        setUrl(urlCree)
      })
      .catch(() => !annule && setErreur('Ce fichier ne peut pas être déchiffré.'))
      .finally(() => !annule && setChargement(false))
    return () => {
      annule = true
      if (urlCree) URL.revokeObjectURL(urlCree)
    }
  }, [doc.id, doc.fichier, ouvrirFichier])

  async function joindre(f: File) {
    const err = verifierFichier(f)
    if (err) return setErreur(err)
    if (lectureSeule) return actions.modifierDocument(doc.id, {}) // déclenche le message de mode dégradé
    setErreur(null)
    try {
      // Le fichier est rangé sous l'identifiant du document : un seul fichier par document.
      const meta = await enregistrerFichier(doc.id, f)
      actions.modifierDocument(doc.id, { fichier: meta })
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Enregistrement impossible.')
    }
  }

  if (!doc.fichier) {
    return (
      <div className="flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-sable-2 bg-sable p-5 text-center">
        <ImageIcon className="size-10 text-encre-2" strokeWidth={1.25} aria-hidden />
        <p className="text-[14px] text-encre-2">Aucune photo ni fichier pour ce document.</p>
        <ChoixFichier onChoisi={joindre} />
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
      </div>
    )
  }

  const estImage = doc.fichier.type.startsWith('image/')
  const nom = doc.fichier.nom || `${doc.titre}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border border-sable-2 bg-sable">
        {chargement && <span className="etiquette">Déchiffrement…</span>}
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
        {url && estImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Photo du document « ${doc.titre} »`} className="size-full object-contain" />
        )}
        {url && !estImage && (
          <span className="flex flex-col items-center gap-2 p-4 text-center text-encre-2">
            <FileText className="size-12" strokeWidth={1.25} aria-hidden />
            <span className="text-[14px] text-encre">{nom}</span>
            <span className="etiquette">{tailleLisible(doc.fichier.taille)}</span>
          </span>
        )}
      </div>
      {url && blob && (
        <div className="flex flex-wrap gap-2">
          <BoutonPrincipal
            onClick={() => {
              telechargerBlob(blob, nom)
              actionsCompte.noterSecurite(`Fichier téléchargé : ${doc.titre}`)
            }}
          >
            <Download className="size-4" aria-hidden />
            Télécharger
          </BoutonPrincipal>
          {estImage && (
            <BoutonSecondaire onClick={() => window.open(url, '_blank', 'noopener')}>
              <ExternalLink className="size-4" aria-hidden />
              Agrandir
            </BoutonSecondaire>
          )}
        </div>
      )}
      <p className="etiquette">Fichier chiffré · {tailleLisible(doc.fichier.taille)}</p>
    </div>
  )
}

