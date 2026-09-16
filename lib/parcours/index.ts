// Catalogue des parcours — point d'entrée unique (`@/lib/parcours`).
//
// Le contenu vit dans des fichiers séparés par catégorie ; ce fichier ne fait que l'assembler.
// Pour ajouter un parcours : l'écrire dans le fichier de sa catégorie, puis l'ajouter à `liste`.

import type { Parcours, EtapeParcours, PhaseParcours, CategorieParcours } from './types'
import { transitionMajorite } from './transition-majorite'
import { entreeEcole, premiereDemandeAi, entreeEseEnfant, transitionFormation } from './enfant'
import { curatelle, hebergementAdulte, pcSubsides, logementMoyensAuxiliaires } from './adulte'
import { entreeEms, maintienDomicile, directivesMandat } from './personne-agee'
import { statutProcheAidant, apresDiagnostic, deces } from './transversal'

export * from './types'

// Ordre d'affichage du catalogue : par catégorie, puis dans l'ordre de la vie.
const liste: Parcours[] = [
  // Enfant et jeune
  entreeEcole,
  premiereDemandeAi,
  transitionMajorite,
  entreeEseEnfant,
  transitionFormation,
  // Adulte
  curatelle,
  hebergementAdulte,
  pcSubsides,
  logementMoyensAuxiliaires,
  // Personne âgée
  entreeEms,
  maintienDomicile,
  directivesMandat,
  // Toutes situations
  statutProcheAidant,
  apresDiagnostic,
  deces,
]

export const listeParcours: readonly Parcours[] = liste

export const parcours: Record<string, Parcours> = Object.fromEntries(liste.map((p) => [p.id, p]))

export function parcoursParCategorie(categorie: CategorieParcours): Parcours[] {
  return liste.filter((p) => p.categorie === categorie)
}

export function etapesDuParcours(p: Parcours): EtapeParcours[] {
  return p.phases.flatMap((ph) => ph.etapes)
}

export function trouverEtape(p: Parcours, etapeId: string): { phase: PhaseParcours; etape: EtapeParcours } | undefined {
  for (const phase of p.phases) {
    const etape = phase.etapes.find((e) => e.id === etapeId)
    if (etape) return { phase, etape }
  }
  return undefined
}
