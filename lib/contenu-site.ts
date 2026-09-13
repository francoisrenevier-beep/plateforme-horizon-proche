// Contenu éditorial de la page de présentation publique (app/(site)/page.tsx).
// Tout le texte de la page vit ici — le composant ne contient aucune chaîne en dur.
// [NOM] : le nom du produit n'est pas tranché, voir CLAUDE.md §1.
// [À COMPLÉTER] : fait dépendant d'une décision non encore prise (hébergement, conformité), voir CLAUDE.md §2.5 et §7.

import type { Echeance } from '@/lib/demo-data'

export const nomProduit = '[NOM]'

// 1 — Ouverture
export const ouverture = {
  titre: 'Suivre seul·e les démarches d’un proche, sans rien oublier',
  contexte:
    'Un parent, un enfant, une personne que vous accompagnez au quotidien : les courriers, les délais et les rendez-vous s’accumulent, et c’est souvent une seule personne qui garde tout cela en tête.',
  ctaPrincipal: 'Créer un dossier gratuitement',
  ctaSecondaire: 'Voir comment ça fonctionne',
  ctaSecondaireAncre: '#comment-ca-fonctionne',
}

// 2 — Le problème, en trois constats
export const problemes: { titre: string; texte: string }[] = [
  {
    titre: 'Les documents sont éparpillés',
    texte:
      'Une décision reçue par courrier, un rapport médical envoyé par e-mail, une attestation scannée sur un téléphone. Rien n’est au même endroit quand il faut le retrouver.',
  },
  {
    titre: 'Les délais se découvrent trop tard',
    texte:
      'Un questionnaire à renvoyer dans un mois, une place à confirmer dans deux semaines. Sans rappel centralisé, la date arrive avant qu’on l’ait revue.',
  },
  {
    titre: 'Tout repose sur une seule mémoire',
    texte:
      'Les habitudes de la personne accompagnée, l’historique des démarches, les bons contacts à joindre : si cette information n’est écrite nulle part, elle disparaît avec la personne qui la porte.',
  },
]

// 3 — Ce que fait l'outil (reprend les modules du §6 de CLAUDE.md)
// `misEnAvant: true` sur les deux éléments qui portent la valeur du produit.
export const fonctionnalites: {
  titre: string
  texte: string
  icone: string // nom d'icône lucide-react
  misEnAvant?: boolean
}[] = [
  {
    titre: 'Une chronologie personnelle',
    texte:
      'Une frise qui part d’aujourd’hui et descend dans le futur, mêlant délais légaux, moments conseillés et repères de vie de la personne accompagnée.',
    icone: 'CalendarClock',
    misEnAvant: true,
  },
  {
    titre: 'Un portrait imprimable',
    texte:
      'Un document en sept sections, écrit à la première personne, transmissible tel quel à un nouvel intervenant — enseignant, médecin, curateur.',
    icone: 'HeartHandshake',
    misEnAvant: true,
  },
  {
    titre: 'Des démarches expliquées',
    texte: 'Ce qui se déclenche, qui décide, les pièces à fournir, les erreurs fréquentes à éviter.',
    icone: 'FileText',
  },
  {
    titre: 'Un coffre de documents',
    texte: 'Tous les courriers et justificatifs au même endroit, classés par démarche.',
    icone: 'FolderClosed',
  },
  {
    titre: 'Des rendez-vous préparés',
    texte: 'Les questions à poser et les pièces à emporter, prêtes avant d’arriver.',
    icone: 'CalendarDays',
  },
  {
    titre: 'Des accès maîtrisés',
    texte: 'Vous décidez qui voit quoi, pour combien de temps — accès nommés ou lien temporaire.',
    icone: 'Shield',
  },
]

// 4 — La distinction délai légal / jalon conseillé (voir CLAUDE.md §2.2)
// Exemples volontairement génériques et fictifs, distincts des données de démonstration
// de l'application (`lib/demo-data.ts`), pour ne pas laisser croire à un cas réel.
export const distinctionDelaiJalon = {
  titre: 'Un délai légal n’est jamais confondu avec un conseil',
  intro:
    'Un délai légal est une date opposable, lue sur un courrier officiel. Un jalon conseillé est une recommandation de calendrier, jamais une obligation — l’outil ne transforme jamais un conseil en obligation.',
  exempleDelai: {
    id: 'exemple-delai',
    nature: 'delai',
    titre: 'Répondre à l’autorité compétente',
    provenance: 'Date lue sur un courrier officiel',
    date: 'avant le 12 septembre',
    dateISO: '2026-09-12',
    joursRestants: 28,
  } satisfies Echeance,
  exempleJalon: {
    id: 'exemple-jalon',
    nature: 'jalon',
    titre: 'Réévaluer les besoins d’accompagnement',
    provenance: 'Règle de calendrier : un point de situation annuel est conseillé',
    date: 'vers janvier',
    dateISO: '2027-01-15',
  } satisfies Echeance,
}

// 5 — Données et confidentialité
export const confidentialite: { question: string; reponse: string }[] = [
  {
    question: 'Où sont hébergées les données ?',
    reponse: '[À COMPLÉTER]',
  },
  {
    question: 'Qui peut y accéder, et comment un accès se révoque-t-il ?',
    reponse:
      'Un accès est toujours nommé et limité — à une partie du dossier, pour une durée choisie — et peut être retiré à tout moment par le titulaire du dossier. Les détails techniques de contrôle d’accès (infrastructure, journalisation) : [À COMPLÉTER].',
  },
  {
    question: 'Qu’est-ce que l’outil ne fait jamais avec vos données ?',
    reponse: '[À COMPLÉTER]',
  },
  {
    question: 'Comment exporter ou supprimer un dossier ?',
    reponse: '[À COMPLÉTER]',
  },
]

// 6 — Ce que l'outil ne fait pas
export const ceQueOutilNeFaitPas = {
  titre: 'Ce que [NOM] ne fait pas',
  points: [
    'Pas de conseil juridique — pour les questions de droit, un service social ou un avocat reste nécessaire.',
    'Pas de suivi médical — l’outil organise l’information, il ne remplace aucun professionnel de santé.',
    'Pas de démarche effectuée à votre place — vous restez la personne qui dépose, signe et décide.',
  ],
}

// 7 — Appel final
export const appelFinal = {
  titre: 'Commencer un dossier',
  texte: 'La création d’un dossier est gratuite, sans engagement.',
  cta: 'Créer un dossier gratuitement',
}
