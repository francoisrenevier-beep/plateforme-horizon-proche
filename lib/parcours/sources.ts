// Sources partagées entre parcours et raccourcis d'écriture.
// Tout est « à vérifier » tant qu'une relecture juridique datée n'a pas été faite.

import type { Source } from './types'

export const src = (libelle: string, url?: string): Source => ({ libelle, url, statut: 'a-verifier' })

export const MEMENTO: Source = {
  libelle: 'Memento handicap — DGCS, canton de Vaud (document de travail, version de septembre 2026)',
  statut: 'a-verifier',
}

export const CC = (art: string, objet: string) => src(`Code civil suisse (CC), art. ${art} — ${objet}`)
export const LAI = (art: string, objet: string) => src(`Loi fédérale sur l’assurance-invalidité (LAI), art. ${art} — ${objet}`)
export const LPC = (art: string, objet: string) => src(`Loi fédérale sur les prestations complémentaires (LPC), art. ${art} — ${objet}`)
export const VD = (page: string, url?: string) => src(`Site de l’État de Vaud — ${page}`, url)

// Avertissement commun : le texte varie légèrement selon la catégorie, mais le fond ne change pas.
export const AVERTISSEMENT_COMMUN =
  'Ce parcours propose des moments, pas des obligations. Les seules dates opposables sont celles écrites sur les courriers que vous recevez : notez-les comme délais légaux. Les informations cantonales et légales restent à confirmer auprès de l’autorité concernée ; ce qui n’est pas confirmé est signalé dans le texte.'

export const AVERTISSEMENT_PROVISOIRE =
  'Ce parcours est provisoire : ses étapes sont plausibles mais n’ont pas encore été relues contre leurs sources. Il propose des moments, pas des obligations. Les seules dates opposables sont celles écrites sur les courriers que vous recevez : notez-les comme délais légaux. Ce qui n’est pas confirmé est signalé dans le texte.'
