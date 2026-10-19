'use client'

// Ce que le coffre ouvert met à disposition des écrans : fichiers chiffrés, verrouillage,
// gestion des secrets, sauvegarde et effacement. La clé elle-même n'est jamais exposée.

import { createContext, useContext } from 'react'
import type { MetaFichier } from '@/lib/securite/stockage'

export type ContexteSecurite = {
  verrouiller: () => void
  enregistrerFichier: (id: string, fichier: File) => Promise<MetaFichier>
  ouvrirFichier: (id: string) => Promise<{ blob: Blob; meta: MetaFichier } | null>
  changerPhrase: (ancienne: string, nouvelle: string) => Promise<boolean>
  regenererCodeSecours: (phrase: string) => Promise<string | null>
  telechargerSauvegarde: () => Promise<void>
  effacerTout: () => Promise<void>
  // Dernier enregistrement chiffré réussi (affiché discrètement)
  derniereEcriture: Date | null
  erreurEcriture: string | null
  // Essais manqués depuis la dernière ouverture réussie
  echecsAvantOuverture: number
  ouvertParSecours: boolean
}

export const Securite = createContext<ContexteSecurite | null>(null)

export function useSecurite(): ContexteSecurite {
  const ctx = useContext(Securite)
  if (!ctx) throw new Error('useSecurite doit être utilisé dans le coffre ouvert')
  return ctx
}

export function telechargerBlob(blob: Blob, nom: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nom
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
