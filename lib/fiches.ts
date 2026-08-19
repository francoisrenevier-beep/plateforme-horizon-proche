// Contenu éditorial des fiches de démarche. Fictif, à visée de maquette.

export type PieceAFournir = {
  id: string
  texte: string
  // Document déjà présent dans le coffre, le cas échéant
  document?: string
}

export type OptionProtection = {
  titre: string
  description: string
}

export type Fiche = {
  id: string
  titre: string
  canton: string
  verifieLe: string
  source: string
  moment: string
  changement: string
  q000decide: { autorite: string; intervenantId: string; cantonal: string }
  pieces: PieceAFournir[]
  duree: string
  refus: string
  erreurs: string[]
  // Étape particulière : question ouverte, jamais une tâche.
  questionProtection?: {
    intro: string
    options: OptionProtection[]
  }
}

export const fiches: Record<string, Fiche> = {
  transition: {
    id: 'transition',
    titre: 'Transition à la majorité',
    canton: 'Vaud',
    verifieLe: '2 juin 2026',
    source: 'vd.ch',
    moment:
      'Aux 18 ans de votre enfant, son statut change du jour au lendemain. Il devient juridiquement adulte. Ce qui était décidé par les parents ne l’est plus automatiquement, et plusieurs prestations doivent être réexaminées à ce moment-là.',
    changement:
      'Les décisions médicales, administratives et financières lui reviennent en droit. Certaines allocations de l’enfance s’arrêtent, d’autres prennent le relais. Vous n’êtes plus, par défaut, son représentant légal.',
    q000decide: {
      autorite: 'Justice de paix du district Jura-Nord vaudois',
      intervenantId: 'i4',
      cantonal:
        'Dans le canton de Vaud, c’est la justice de paix du district de domicile qui examine les questions de protection de l’adulte.',
    },
    pieces: [
      { id: 'f1', texte: 'Copie de la décision AI en cours', document: 'Décision AI' },
      { id: 'f2', texte: 'Attestation de domicile' },
      { id: 'f3', texte: 'Rapport médical récent', document: 'Rapport pédopsychiatrique' },
      { id: 'f4', texte: 'Justificatif de la situation scolaire', document: 'Attestation de scolarité 2026-2027' },
      { id: 'f5', texte: 'Formulaire de demande signé' },
    ],
    duree:
      'Comptez environ six mois de traitement pour une demande auprès de la justice de paix. Les réexamens de prestations peuvent prendre plusieurs semaines chacun.',
    refus:
      'Un refus est motivé par écrit. Vous disposez d’un délai pour former recours, indiqué sur la décision elle-même. Un service social peut vous aider à préparer ce recours.',
    erreurs: [
      'La justice de paix met environ six mois. Déposez la demande vers 17 ans et demi, pas après l’anniversaire.',
      'Ne laissez pas expirer les prestations en cours : demandez le réexamen avant la date de bascule.',
      'Le dossier médical doit être récent. Un rapport de plus de douze mois est souvent redemandé.',
    ],
    questionProtection: {
      intro:
        'À 18 ans, Noah deviendra juridiquement autonome. Selon sa situation, plusieurs options existent : aucune mesure, une procuration, un mandat pour cause d’inaptitude, ou une curatelle limitée à certains domaines.',
      options: [
        {
          titre: 'Aucune mesure',
          description:
            'La personne gère elle-même ses affaires. Rien n’est mis en place. C’est la situation par défaut à la majorité.',
        },
        {
          titre: 'Procuration',
          description:
            'La personne autorise quelqu’un à agir en son nom pour certaines tâches précises, tant qu’elle le souhaite.',
        },
        {
          titre: 'Mandat pour cause d’inaptitude',
          description:
            'La personne désigne à l’avance qui s’occupera d’elle si un jour elle ne peut plus décider seule.',
        },
        {
          titre: 'Curatelle limitée',
          description:
            'Une autorité désigne un curateur pour des domaines précis seulement, en laissant l’autonomie ailleurs.',
        },
      ],
    },
  },
  api: {
    id: 'api',
    titre: 'Renouvellement API',
    canton: 'Vaud',
    verifieLe: '2 juin 2026',
    source: 'vd.ch',
    moment:
      'L’office AI réexamine périodiquement l’allocation pour impotent. Vous recevez un questionnaire à remplir dans un délai fixé par courrier.',
    changement:
      'Selon l’évaluation, le degré d’impotence peut être maintenu, augmenté ou réduit, ce qui modifie le montant versé.',
    q000decide: {
      autorite: 'Office AI Vaud',
      intervenantId: 'i1',
      cantonal: 'Dans le canton de Vaud, l’office AI compétent est celui du canton de domicile.',
    },
    pieces: [
      { id: 'a1', texte: 'Questionnaire API rempli', document: 'Questionnaire API (vierge)' },
      { id: 'a2', texte: 'Rapport médical à jour', document: 'Rapport pédopsychiatrique' },
      { id: 'a3', texte: 'Justificatifs des frais liés à l’impotence' },
    ],
    duree: 'Le traitement d’un renouvellement prend en général deux à quatre mois.',
    refus:
      'En cas de réduction ou de refus, la décision indique la voie et le délai de recours.',
    erreurs: [
      'Respectez le délai figurant sur le courrier : un questionnaire renvoyé tard peut suspendre le versement.',
      'Décrivez une journée type complète, sans minimiser les difficultés par habitude.',
      'Joignez un rapport médical récent, il pèse lourd dans l’évaluation.',
    ],
  },
}
