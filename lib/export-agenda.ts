// Traduction des éléments d'un dossier en événements d'agenda (voir `lib/ics.ts`).
//
// Un export est une forme d'affichage : la distinction délai légal / moment conseillé
// (CLAUDE.md §2.2) doit survivre hors de l'application. Elle est donc portée par le titre de
// l'événement et rappelée dans sa description, et seul un délai légal reçoit un rappel —
// un moment conseillé ne sonne jamais, il ne crée pas d'obligation.

import type { Echeance, Personne, RendezVous } from '@/lib/demo-data'
import { formatDateLongue } from '@/lib/dates'
import type { EvenementIcs } from '@/lib/ics'

// Un rendez-vous dure une heure par défaut, faute de mieux : la famille ne saisit pas de durée.
const DUREE_RENDEZ_VOUS_MINUTES = 60
const RAPPEL_RENDEZ_VOUS_MINUTES = 24 * 60 // la veille
const RAPPEL_DELAI_MINUTES = 7 * 24 * 60 // une semaine avant, pour avoir le temps d'agir

export function evenementDuRendezVous(rdv: RendezVous, personne: Personne, dossierId: string): EvenementIcs {
  const enAttente = rdv.questions.filter((q) => !q.faite)
  const lignes: string[] = []
  if (rdv.fonction) lignes.push(rdv.fonction)
  lignes.push(`Rendez-vous pour ${personne.prenom} ${personne.nom}`.trim())

  if (enAttente.length > 0) {
    lignes.push('', 'Mes questions :')
    for (const q of enAttente) lignes.push(`- ${q.texte}`)
  }
  if (rdv.pieces.length > 0) {
    lignes.push('', 'À emporter :')
    for (const p of rdv.pieces) lignes.push(`- ${p.texte}${p.lie ? '' : ' (pas encore prêt)'}`)
  }
  if (rdv.changements.trim()) {
    lignes.push('', 'Ce qui a changé depuis la dernière fois :', rdv.changements.trim())
  }
  lignes.push('', 'Préparé avec Horizon Proche.')

  return {
    uid: `${dossierId}-${rdv.id}`,
    titre: `${rdv.intervenant}${rdv.fonction ? ` — ${rdv.fonction}` : ''} (${personne.prenom})`,
    dateISO: rdv.dateISO,
    heure: rdv.heure,
    dureeMinutes: DUREE_RENDEZ_VOUS_MINUTES,
    lieu: rdv.lieu || undefined,
    description: lignes.join('\n'),
    rappelMinutesAvant: RAPPEL_RENDEZ_VOUS_MINUTES,
  }
}

export function evenementDeLEcheance(echeance: Echeance, personne: Personne, dossierId: string): EvenementIcs {
  const estDelai = echeance.nature === 'delai'
  const etiquette = estDelai ? 'Délai légal' : 'Moment conseillé'
  const lignes = [
    estDelai
      ? 'Délai légal : date opposable, lue sur un courrier officiel.'
      : 'Moment conseillé : recommandation de calendrier, pas une obligation.',
    '',
    estDelai ? `À faire avant le ${formatDateLongue(echeance.dateISO)}.` : 'Aucune date n’est imposée.',
    '',
    `Provenance : ${echeance.provenance}`,
    '',
    `Dossier de ${personne.prenom} ${personne.nom}`.trim(),
    'Suivi avec Horizon Proche.',
  ]

  return {
    uid: `${dossierId}-${echeance.id.replaceAll(':', '-')}`,
    titre: `${etiquette} — ${echeance.titre} (${personne.prenom})`,
    dateISO: echeance.dateISO,
    // Journée entière : une échéance n'a pas d'heure.
    description: lignes.join('\n'),
    // Seul un délai légal déclenche un rappel.
    rappelMinutesAvant: estDelai ? RAPPEL_DELAI_MINUTES : undefined,
  }
}
