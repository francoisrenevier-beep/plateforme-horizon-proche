// Modèle des parcours — contenu de catalogue (statique) et suivi par la famille.
//
// Un parcours ordonne toutes les étapes d'une période de vie ou d'une situation ; il s'oppose
// à la fiche de démarche (`lib/fiches.ts`), qui explique *une* procédure. Le suivi d'un parcours
// par une famille (`ParcoursSuivi`, dans `lib/demo-data.ts`) est rattaché au dossier d'une
// personne accompagnée : c'est l'instance du parcours pour cette personne.
//
// Règles (CLAUDE.md §2.2, §2.5, §2.6) :
//  - Une étape ne génère JAMAIS qu'un moment conseillé (`genereJalon`), jamais un délai légal.
//    Les délais légaux ne viennent que des courriers reçus par la famille.
//  - Aucun fait métier inventé : chaque étape cite ses sources et leur statut de vérification ;
//    le délai réaliste porte lui aussi un statut. Ce qui n'est pas confirmé est écrit
//    [À COMPLÉTER] ou [À VÉRIFIER] dans le texte lui-même.
//  - Les questions de protection restent des questions (`questionOuverte: true`).
//
// `sources` n'est PAS affiché à l'écran (décision du 15 septembre 2026) : il sert à la
// relecture juridique et au suivi éditorial.

export type StatutVerification = 'verifiee' | 'a-verifier'

export type Source = {
  libelle: string
  url?: string
  statut: StatutVerification
  verifieLe?: string
}

export type Lien = { libelle: string; url: string }

export type ContactEtape = {
  nom: string
  role: string
  lien?: Lien
}

export type EtapeParcours = {
  id: string
  titre: string
  // Décalage en mois par rapport au repère du parcours. Négatif = avant le repère.
  // null = pas de moment précis à proposer.
  moisParRapportAuRepere: number | null
  quand: string
  pourquoi: string
  aFaire: string[]
  // Trois rubriques courtes pour les familles (ajoutées le 16 septembre 2026) — informer et
  // orienter sans complexifier : ce que l'étape veut dire pour elles, ce qu'elles vont recevoir,
  // et vers qui se tourner si rien n'avance.
  enClair?: string
  vousRecevrez?: string
  siCaBloque?: string
  // Acteurs à contacter.
  contacts?: ContactEtape[]
  // Documents à réunir ou à produire.
  pieces?: string[]
  pointsAttention?: string[]
  // Condition d'application, affichée telle quelle (« Seulement si… »).
  concerne?: string
  // Renvoie vers une fiche de démarche existante (`lib/fiches.ts`).
  ficheId?: string
  // Renvoie vers un écran de l'application.
  lienInterne?: { libelle: string; href: string }
  // §2.6 — présentée comme une question à instruire, jamais une tâche à cocher.
  questionOuverte?: boolean
  // Crée un moment conseillé dans la chronologie du dossier quand le parcours est suivi.
  genereJalon: boolean
  sources: Source[]
}

export type PhaseParcours = {
  id: string
  titre: string
  sousTitre: string
  etapes: EtapeParcours[]
}

export type CategorieParcours = 'enfant' | 'adulte' | 'personne-agee' | 'transversal'

// Le point du calendrier à partir duquel les moments conseillés sont calculés.
//  - majorite : les 18 ans de la personne (depuis `naissanceISO`).
//  - entree-ecole : la rentrée de l'année des 4 ans (depuis `naissanceISO`, règle HarmoS, voir `dateEntreeEcole`).
//  - activation : le jour où la famille commence à suivre le parcours (`ParcoursSuivi.activeLe`).
export type RepereParcours = 'majorite' | 'entree-ecole' | 'activation'

// Statut éditorial d'un parcours entier.
//  - redige : contenu complet, sourcé étape par étape (la relecture juridique peut rester à faire).
//  - provisoire : entrée de catalogue avec un jeu d'étapes plausible, à compléter avant publication.
export type StatutParcours = 'redige' | 'provisoire'

// Icônes disponibles pour les cartes (clés résolues dans les composants, jamais d'import ici).
export type IconeParcours =
  | 'school'
  | 'hand-heart'
  | 'cake'
  | 'building'
  | 'briefcase'
  | 'scale'
  | 'home'
  | 'coins'
  | 'accessibility'
  | 'bed'
  | 'house-heart'
  | 'file-signature'
  | 'heart-handshake'
  | 'stethoscope'
  | 'flower'

export type Parcours = {
  id: string
  // Formulé avec un verbe d'action (« Préparer… », « Demander… »).
  titre: string
  // À qui ce parcours s'adresse, en une phrase.
  positionnement: string
  categorie: CategorieParcours
  canton: string
  // Autorité ou institution qui décide, en quelques mots (pour la carte).
  autorite: string
  // Le délai réaliste, tel qu'une famille peut s'y attendre — l'information que personne ne donne.
  // Il porte son propre statut : non confirmé, il s'affiche comme tel (§2.5).
  delaiRealiste: { texte: string; statut: StatutVerification }
  icone: IconeParcours
  statut: StatutParcours
  // Visible et ouvrable par les familles. Un parcours non publié reste dans le catalogue comme
  // « bientôt disponible » (carte non cliquable) : son contenu est conservé mais pas exposé.
  publie: boolean
  repere: RepereParcours
  resume: string
  // « En une page » : ce qu'il faut avoir compris avant de lire les étapes. Quelques phrases.
  enUnePage?: { titre: string; points: string[] }
  avertissement: string
  phases: PhaseParcours[]
  ressources: { titre: string; texte: string; lien?: Lien }[]
}

export const CATEGORIES: { id: CategorieParcours; libelle: string }[] = [
  { id: 'enfant', libelle: 'Enfant et jeune' },
  { id: 'adulte', libelle: 'Adulte' },
  { id: 'personne-agee', libelle: 'Personne âgée' },
  { id: 'transversal', libelle: 'Toutes situations' },
]
