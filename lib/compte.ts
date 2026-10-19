// Compte du titulaire : abonnement, consentements, réglages de sécurité.
//
// Dans le prototype, tout cela vit dans l'état chiffré, sur l'appareil. En production :
//   - l'abonnement viendra du serveur, alimenté uniquement par le webhook Stripe (CLAUDE.md §9.4) ;
//     le simulateur des réglages disparaîtra ;
//   - les consentements seront aussi horodatés côté serveur (preuve), sans leur contenu métier ;
//   - le journal de sécurité restera chiffré, lisible par la famille seule.

export type StatutAbonnement = 'trialing' | 'active' | 'past_due' | 'canceled'

export const DUREE_ESSAI_JOURS = 30
export const VERSION_POLITIQUE = '2026-10-19'

export type EvenementSecurite = { id: string; quand: string; texte: string }

export type Compte = {
  abonnement: {
    statut: StatutAbonnement
    essaiDebutISO: string // date-heure
  }
  consentement: {
    // Traitement de données sensibles (santé, handicap) concernant la personne accompagnée
    donneesSensiblesLe: string
    // Le titulaire déclare agir avec l'accord de la personne ou en qualité de représentant
    legitimiteLe: string
    versionPolitique: string
  }
  securite: {
    verrouillageMinutes: 5 | 15 | 30
    journal: EvenementSecurite[]
  }
}

export function nouveauCompte(maintenant = new Date()): Compte {
  const iso = maintenant.toISOString()
  return {
    abonnement: { statut: 'trialing', essaiDebutISO: iso },
    consentement: { donneesSensiblesLe: iso, legitimiteLe: iso, versionPolitique: VERSION_POLITIQUE },
    securite: { verrouillageMinutes: 15, journal: [] },
  }
}

export function finEssai(compte: Compte): Date {
  const d = new Date(compte.abonnement.essaiDebutISO)
  d.setDate(d.getDate() + DUREE_ESSAI_JOURS)
  return d
}

export function joursEssaiRestants(compte: Compte, maintenant = new Date()): number {
  return Math.max(0, Math.ceil((finEssai(compte).getTime() - maintenant.getTime()) / 86_400_000))
}

// Règle §9.5 : un dossier est ouvert si l'abonnement est `active` ou `trialing` (essai en cours).
export function abonnementOuvert(compte: Compte, maintenant = new Date()): boolean {
  const { statut } = compte.abonnement
  if (statut === 'active') return true
  if (statut === 'trialing') return joursEssaiRestants(compte, maintenant) > 0
  return false
}

export const libelleStatut: Record<StatutAbonnement, string> = {
  trialing: 'Essai gratuit',
  active: 'Abonnement actif',
  past_due: 'Paiement en échec',
  canceled: 'Abonnement terminé',
}
