// Parcours : les grandes étapes d'une période de vie, présentées dans l'ordre,
// avec pour chacune le moment conseillé, le pourquoi, ce qu'il y a à faire et vers qui se tourner.
//
// Règles (CLAUDE.md §2.2, §2.5, §2.6) :
//  - Un moment conseillé n'est JAMAIS un délai légal. Les étapes génèrent des jalons, pas des délais.
//    Les délais légaux ne viennent que des courriers reçus par la famille.
//  - Aucun fait métier inventé : chaque étape cite sa source et son statut de vérification.
//    Ce qui n'est pas confirmé est écrit [À COMPLÉTER] ou [À VÉRIFIER].
//  - Les questions de protection restent des questions (`questionOuverte: true`).
//
// Sources utilisées pour le parcours « Transition à la majorité » :
//  - « Memento handicap », Direction générale de la cohésion sociale (DGCS), canton de Vaud —
//    document de travail (non finalisé) remis en septembre 2026. Il décrit les prestations pour
//    adultes subventionnées par le canton. Les projets pilotes qu'il demande de ne pas encore
//    mentionner (« Mon Plan », « Ma vie mon appart ») sont volontairement absents d'ici.
//  - Droit fédéral : Code civil (CC), loi sur l'assurance-invalidité (LAI), loi sur les
//    allocations familiales (LAFam), loi sur l'assurance-maladie (LAMal). Les références d'articles
//    sont indiquées à titre d'orientation et marquées « à vérifier » tant qu'une relecture
//    juridique n'a pas été faite.

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
  // Décalage en mois par rapport au repère du parcours (les 18 ans). Négatif = avant.
  // null = pas de moment précis à proposer.
  moisParRapportAuRepere: number | null
  quand: string
  pourquoi: string
  aFaire: string[]
  contacts?: ContactEtape[]
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

export type Parcours = {
  id: string
  titre: string
  canton: string
  public: string
  resume: string
  // Le repère à partir duquel les moments sont calculés.
  repere: 'majorite'
  avertissement: string
  phases: PhaseParcours[]
  ressources: { titre: string; texte: string; lien?: Lien }[]
}

const MEMENTO: Source = {
  libelle:
    'Memento handicap — DGCS, canton de Vaud (document de travail, version de septembre 2026)',
  statut: 'a-verifier',
}

const src = (libelle: string, url?: string): Source => ({ libelle, url, statut: 'a-verifier' })

export const parcours: Record<string, Parcours> = {
  'transition-majorite': {
    id: 'transition-majorite',
    titre: 'Transition à la majorité',
    canton: 'Vaud',
    public: 'Pour un·e jeune en situation de handicap qui approche de ses 18 ans',
    resume:
      'À 18 ans, votre enfant devient juridiquement adulte. Rien ne se fait automatiquement : les prestations de l’enfance s’arrêtent ou se transforment, d’autres s’ouvrent, et la question de qui l’aide à décider doit être posée. Ce parcours met les étapes dans l’ordre, à partir de sa date de naissance.',
    repere: 'majorite',
    avertissement:
      'Ce parcours propose des moments, pas des obligations. Les seules dates opposables sont celles écrites sur les courriers que vous recevez : notez-les comme délais légaux. Le contenu s’appuie sur un document de travail de la DGCS (canton de Vaud) et sur le droit fédéral ; chaque étape indique sa source et si elle a été vérifiée.',
    phases: [
      {
        id: 'des-16-ans',
        titre: 'Dès 16 ans',
        sousTitre: 'Préparer le terrain, sans rien précipiter',
        etapes: [
          {
            id: 'allocations-familiales',
            titre: 'Faire le point sur les allocations familiales',
            moisParRapportAuRepere: -24,
            quand: 'Autour des 16 ans',
            pourquoi:
              'L’allocation pour enfant est versée jusqu’à 16 ans. Pour un enfant qui ne peut pas exercer d’activité lucrative en raison d’une maladie ou d’un handicap, elle peut être prolongée jusqu’à 20 ans ; s’il est en formation, une allocation de formation prend le relais. Le versement ne se prolonge pas tout seul : la caisse a besoin d’un justificatif.',
            aFaire: [
              'Demander à la caisse d’allocations familiales (via l’employeur du parent qui les perçoit) quel justificatif elle attend pour prolonger le versement.',
              'Ranger la réponse écrite de la caisse dans le coffre et noter tout délai indiqué comme délai légal.',
            ],
            pieces: ['Certificat médical attestant l’incapacité d’exercer une activité lucrative [À VÉRIFIER : forme exacte attendue par la caisse]'],
            genereJalon: true,
            sources: [src('Loi fédérale sur les allocations familiales (LAFam), art. 3 — prolongation jusqu’à 20 ans pour l’enfant incapable d’exercer une activité lucrative')],
          },
          {
            id: 'dcish-inscription',
            titre: 'S’informer sur les prestations pour adultes (DCISH)',
            moisParRapportAuRepere: -24,
            quand: 'Dès 16 ans révolus',
            pourquoi:
              'Dans le canton de Vaud, l’accès à un établissement socio-éducatif pour adultes (hébergement, centre de jour, atelier) passe par le Dispositif cantonal d’indication et de suivi pour personnes en situation de handicap (DCISH). L’inscription est possible dès 16 ans révolus, ce qui laisse le temps de visiter, comparer et réfléchir avant la majorité.',
            aFaire: [
              'Vérifier les conditions : domicile dans le canton de Vaud, 16 ans révolus, déficience intellectuelle, physique, sensorielle ou polyhandicap.',
              'Se renseigner sur les offres existantes auprès du DCISH.',
              'Remplir le formulaire d’accès à un établissement socio-éducatif (Pro Infirmis Vaud).',
            ],
            contacts: [
              {
                nom: 'DCISH — canton de Vaud',
                role: 'Indication et suivi',
                lien: { libelle: 'vd.ch — contact DCISH', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/dcish-contact' },
              },
              {
                nom: 'Pro Infirmis Vaud',
                role: 'Formulaire d’accès à un établissement socio-éducatif',
                lien: {
                  libelle: 'proinfirmis.ch — accès à un ESE',
                  url: 'https://www.proinfirmis.ch/fr/prestations/vaud/acces-a-un-etablissement-socio-educatif.html',
                },
              },
            ],
            genereJalon: true,
            sources: [MEMENTO],
          },
          {
            id: 'suite-scolarite',
            titre: 'Penser à la suite de la scolarité et à la formation',
            moisParRapportAuRepere: -24,
            quand: 'Dès 16 ans, avec le réseau école',
            pourquoi:
              'La fin de la scolarité spécialisée se prépare plusieurs années à l’avance. L’assurance-invalidité peut soutenir une formation professionnelle initiale ou d’autres mesures d’ordre professionnel ; des formations à la vie autonome existent aussi pour apprendre à gérer le quotidien et les démarches.',
            aFaire: [
              'Aborder la question de l’après-école lors du prochain point de situation avec l’enseignant·e référent·e.',
              'Demander à la gestionnaire AI si des mesures d’ordre professionnel (formation professionnelle initiale) peuvent être examinées, et à quel moment déposer la demande.',
              'Se renseigner sur le Service de formation à la vie autonome (SFVA) de Pro Infirmis Vaud.',
            ],
            contacts: [
              {
                nom: 'SFVA — Pro Infirmis Vaud',
                role: 'Formation à la vie autonome',
                lien: {
                  libelle: 'proinfirmis.ch — SFVA',
                  url: 'https://www.proinfirmis.ch/fr/prestations/vaud/service-de-formation-a-la-vie-autonome-sfva.html',
                },
              },
            ],
            pointsAttention: [
              'Âge limite de la pédagogie spécialisée dans le canton de Vaud : [À COMPLÉTER].',
            ],
            genereJalon: true,
            sources: [MEMENTO, src('Loi fédérale sur l’assurance-invalidité (LAI), art. 15 à 18 — mesures d’ordre professionnel')],
          },
          {
            id: 'portrait-a-jour',
            titre: 'Mettre le portrait à jour, avec la personne',
            moisParRapportAuRepere: null,
            quand: 'À tout moment, et avant chaque nouvel intervenant',
            pourquoi:
              'Le portrait « Bien m’accompagner » appartient à votre enfant. À sa majorité, il pourra le lire, le corriger et décider qui y a accès. Plus il y participe tôt, plus le document lui ressemble — et plus il sera utile aux nouveaux intervenants de la vie adulte.',
            aFaire: [
              'Relire les sept sections avec votre enfant, dans la mesure de ses possibilités.',
              'Compléter les sections vides, même d’une phrase.',
            ],
            lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
            genereJalon: false,
            sources: [{ libelle: 'Principe du produit (CLAUDE.md §2.3)', statut: 'verifiee' }],
          },
        ],
      },
      {
        id: 'un-an-avant',
        titre: 'Environ un an avant',
        sousTitre: 'Évaluer les besoins et décider ensemble',
        etapes: [
          {
            id: 'bilan-medical',
            titre: 'Demander un bilan médical récent',
            moisParRapportAuRepere: -12,
            quand: 'Environ 12 mois avant les 18 ans',
            pourquoi:
              'Plusieurs démarches de la majorité (rente AI, allocation pour impotent, mesure de protection) s’appuient sur un rapport médical qui décrit les limitations fonctionnelles et l’aide nécessaire au quotidien. Un rapport de plus de douze mois est souvent redemandé.',
            aFaire: [
              'Prendre rendez-vous avec le médecin qui suit votre enfant et lui expliquer à quoi servira le rapport.',
              'Demander que le rapport décrive concrètement une journée type et l’aide apportée, pas seulement le diagnostic.',
              'Ranger le rapport dans le coffre dès réception.',
            ],
            pieces: ['Rapport médical récent (moins de 12 mois)'],
            genereJalon: true,
            sources: [src('Pratique observée dans les fiches de démarche existantes — à confirmer auprès de l’office AI Vaud')],
          },
          {
            id: 'question-protection',
            titre: 'Ouvrir la question de la protection de l’adulte',
            moisParRapportAuRepere: -12,
            quand: 'Environ 12 mois avant les 18 ans',
            pourquoi:
              'À 18 ans, l’autorité parentale prend fin. Aucune mesure ne se met en place automatiquement : par défaut, la personne gère seule ses affaires. Selon sa situation, plusieurs options existent — aucune mesure, une procuration, un mandat pour cause d’inaptitude, ou une curatelle limitée à certains domaines. Le choix appartient à la famille, à la personne elle-même et à l’autorité de protection.',
            aFaire: [
              'En parler avec votre enfant, dans la mesure de ses possibilités, et avec les personnes qui l’accompagnent.',
              'Prendre conseil auprès d’un service social (Pro Infirmis Vaud) ou de la justice de paix de votre district.',
              'Noter dans le dossier ce qui a été discuté, sans conclure à ce stade.',
            ],
            contacts: [
              { nom: 'Justice de paix du district de domicile', role: 'Autorité de protection de l’adulte (canton de Vaud)' },
              { nom: 'Pro Infirmis Vaud', role: 'Conseil social' },
              { nom: 'Bureau d’aide aux curateurs privés', role: '[À COMPLÉTER : coordonnées]' },
            ],
            ficheId: 'transition',
            questionOuverte: true,
            genereJalon: true,
            sources: [
              src('Code civil suisse, art. 14 (majorité) et art. 296 (fin de l’autorité parentale)'),
              src('Code civil suisse, art. 360 ss (mandat pour cause d’inaptitude) et art. 390 ss (curatelles)'),
              MEMENTO,
            ],
          },
          {
            id: 'rente-ai',
            titre: 'Anticiper la rente AI',
            moisParRapportAuRepere: -12,
            quand: 'Environ 12 mois avant les 18 ans',
            pourquoi:
              'Le droit à une rente de l’assurance-invalidité ne peut pas naître avant 18 ans révolus. L’office AI examine d’abord si des mesures de réadaptation (formation, insertion) sont possibles ; la rente vient ensuite. Déposer la demande avant la majorité évite un trou entre les prestations de l’enfance et celles de l’âge adulte.',
            aFaire: [
              'Demander à la gestionnaire AI quand et comment déposer la demande de rente pour votre enfant — le moment exact recommandé par l’office AI Vaud : [À COMPLÉTER].',
              'Rassembler les rapports médicaux, scolaires et éducatifs récents.',
              'Noter comme délai légal toute date figurant sur un courrier de l’office AI.',
            ],
            contacts: [{ nom: 'Office AI Vaud', role: 'Gestionnaire de dossier' }],
            pieces: ['Rapport médical récent', 'Bilan scolaire ou éducatif', 'Formulaire de demande AI'],
            genereJalon: true,
            sources: [src('Loi fédérale sur l’assurance-invalidité (LAI), art. 28 et 29 — droit à la rente au plus tôt à 18 ans révolus')],
          },
        ],
      },
      {
        id: 'six-mois-avant',
        titre: 'Environ six mois avant',
        sousTitre: 'Déposer ce qui doit l’être',
        etapes: [
          {
            id: 'justice-de-paix',
            titre: 'Déposer la demande auprès de la justice de paix',
            moisParRapportAuRepere: -6,
            quand: 'Environ 6 mois avant les 18 ans',
            concerne:
              'Seulement si la famille et la personne ont choisi de demander une mesure de protection (voir l’étape précédente).',
            pourquoi:
              'Le traitement d’une demande prend environ six mois. Déposée trop tard, la mesure n’est pas en place le jour de la majorité, et il peut y avoir une période sans représentant légal.',
            aFaire: [
              'Contacter le greffe de la justice de paix de votre district pour connaître la forme attendue de la demande.',
              'Joindre le rapport médical récent et les pièces demandées.',
              'Conserver l’accusé de réception et noter comme délai légal toute date qu’il indique.',
            ],
            contacts: [{ nom: 'Justice de paix du district de domicile', role: 'Autorité de protection de l’adulte' }],
            ficheId: 'transition',
            genereJalon: true,
            sources: [src('Fiche de démarche « Transition à la majorité » — durée indicative de six mois à confirmer auprès de la justice de paix')],
          },
          {
            id: 'api-adulte',
            titre: 'Préparer le passage de l’API mineur à l’API adulte',
            moisParRapportAuRepere: -6,
            quand: 'Environ 6 mois avant les 18 ans',
            concerne: 'Seulement si votre enfant perçoit une allocation pour impotent (API).',
            pourquoi:
              'L’allocation pour impotent des mineurs et celle des adultes obéissent à des règles différentes. Le montant dépend du degré (faible, moyen, grave) et du lieu de vie (domicile ou établissement). Le supplément pour soins intenses versé aux mineurs cesse à la majorité [À VÉRIFIER].',
            aFaire: [
              'Demander à la gestionnaire AI comment se déroule le réexamen de l’API à 18 ans et s’il faut déposer une nouvelle demande.',
              'Préparer une description précise de l’aide apportée au quotidien (voir aussi la fiche « Renouvellement API »).',
            ],
            contacts: [
              { nom: 'Office AI Vaud', role: 'Gestionnaire de dossier', lien: { libelle: 'api.aivd.ch', url: 'https://api.aivd.ch/' } },
            ],
            ficheId: 'api',
            genereJalon: true,
            sources: [MEMENTO, src('Loi fédérale sur l’assurance-invalidité (LAI), art. 42 — allocation pour impotent')],
          },
          {
            id: 'assurance-maladie',
            titre: 'Vérifier l’assurance-maladie et le subside',
            moisParRapportAuRepere: -3,
            quand: 'Environ 3 mois avant les 18 ans',
            pourquoi:
              'Les primes d’assurance-maladie changent de catégorie à la majorité (prime « jeune adulte » dès 19 ans [À VÉRIFIER : catégorie applicable l’année des 18 ans]). Selon le revenu et la fortune, le canton de Vaud peut prendre en charge une partie ou la totalité de la prime obligatoire : c’est le subside.',
            aFaire: [
              'Demander à l’assureur ce qui change à la date anniversaire et vérifier la franchise choisie.',
              'Vérifier si un subside peut être demandé ou doit être actualisé.',
            ],
            contacts: [
              {
                nom: 'Office vaudois de l’assurance-maladie',
                role: 'Subside à l’assurance-maladie',
                lien: { libelle: 'vd.ch — subside', url: 'https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie' },
              },
            ],
            genereJalon: true,
            sources: [MEMENTO, src('Loi fédérale sur l’assurance-maladie (LAMal) — catégories de primes enfants / jeunes adultes')],
          },
        ],
      },
      {
        id: 'a-18-ans',
        titre: 'À 18 ans',
        sousTitre: 'Le jour de la bascule',
        etapes: [
          {
            id: 'jour-j',
            titre: 'Comprendre ce qui change le jour même',
            moisParRapportAuRepere: 0,
            quand: 'Le jour des 18 ans',
            pourquoi:
              'L’autorité parentale prend fin. Les décisions médicales, administratives et financières reviennent en droit à votre enfant. Les courriers lui sont adressés personnellement, et les professionnels sont tenus au secret envers vous sauf accord de sa part ou mesure de protection. Le portrait « Bien m’accompagner » lui appartient.',
            aFaire: [
              'S’assurer que votre enfant sait qui l’aide, et comment vous joindre.',
              'Si aucune mesure de protection n’est prévue : envisager avec lui des procurations pratiques (banque, poste, assurance) — [À COMPLÉTER : conditions selon les établissements].',
              'Mettre à jour les accès du dossier : à sa majorité, votre enfant peut décider qui voit son portrait.',
            ],
            lienInterne: { libelle: 'Voir les accès du dossier', href: '/acces' },
            genereJalon: false,
            sources: [src('Code civil suisse, art. 14 (majorité), art. 296 (autorité parentale)')],
          },
          {
            id: 'prestations-complementaires',
            titre: 'Demander les prestations complémentaires',
            moisParRapportAuRepere: 0,
            quand: 'Dès 18 ans',
            concerne: 'Si votre enfant perçoit une rente AI ou une allocation pour impotent de l’AI.',
            pourquoi:
              'Les prestations complémentaires (PC) couvrent les besoins vitaux des personnes dont la rente ne suffit pas. Peuvent y avoir droit, entre autres, les bénéficiaires d’une allocation pour impotent de l’AI dès 18 ans, à condition d’être domicilié·e en Suisse, de ne pas dépasser un certain seuil de fortune et d’avoir des dépenses reconnues supérieures aux revenus déterminants.',
            aFaire: [
              'Demander à l’agence d’assurances sociales de la commune ou à la Caisse cantonale vaudoise de compensation AVS comment déposer la demande.',
              'Rassembler les justificatifs de revenus, de fortune et de charges (loyer, primes).',
            ],
            contacts: [
              {
                nom: 'Caisse cantonale vaudoise de compensation AVS',
                role: 'Prestations complémentaires',
                lien: {
                  libelle: 'caisseavsvaud.ch — PC',
                  url: 'https://www.caisseavsvaud.ch/fr/Assurances/PC/Prestations-complementaires/Prestations-complementaires.html',
                },
              },
            ],
            pointsAttention: [
              'Seuils de fortune indiqués dans le memento : CHF 100 000 (personne seule), CHF 200 000 (couple), CHF 50 000 (enfants et orphelins) — à confirmer avec la caisse au moment de la demande.',
            ],
            genereJalon: true,
            sources: [MEMENTO],
          },
          {
            id: 'impots',
            titre: 'Impôts : la première déclaration',
            moisParRapportAuRepere: null,
            quand: 'L’année qui suit les 18 ans',
            pourquoi:
              'Dès la majorité, votre enfant devient contribuable à part entière et reçoit sa propre déclaration d’impôt, même si ses revenus sont faibles [À VÉRIFIER : première période fiscale concernée dans le canton de Vaud].',
            aFaire: [
              'Repérer le courrier de l’administration cantonale des impôts et noter le délai de dépôt comme délai légal.',
              'Vérifier les déductions liées au handicap : [À COMPLÉTER].',
            ],
            genereJalon: false,
            sources: [src('Pratique générale — à confirmer auprès de l’Administration cantonale des impôts (VD)')],
          },
        ],
      },
      {
        id: 'apres-18-ans',
        titre: 'Après 18 ans',
        sousTitre: 'Installer la vie adulte',
        etapes: [
          {
            id: 'contribution-assistance',
            titre: 'Contribution d’assistance',
            moisParRapportAuRepere: 3,
            quand: 'Quand un logement propre est envisagé',
            concerne:
              'Seulement si votre enfant perçoit une allocation pour impotent et vit — ou souhaite vivre — dans son propre logement. Elle n’est pas octroyée s’il vit au domicile de ses parents.',
            pourquoi:
              'La contribution d’assistance de l’AI permet d’engager des assistant·e·s de vie par contrat de travail, sur la base d’une évaluation des besoins. Le choix des assistant·e·s est libre, mais il n’est pas possible d’engager un parent, un conjoint ou un concubin.',
            aFaire: [
              'Demander le formulaire de demande écrite à l’office AI.',
              'Préparer l’évaluation des besoins avec l’aide d’un service social si nécessaire.',
            ],
            contacts: [
              {
                nom: 'Office AI Vaud',
                role: 'Contribution d’assistance',
                lien: {
                  libelle: 'ahv-iv.ch — contribution d’assistance',
                  url: 'https://www.ahv-iv.ch/fr/assurances-sociales/assurance-invalidit%C3%A9-ai/contribution-dassistance',
                },
              },
            ],
            genereJalon: false,
            sources: [MEMENTO],
          },
          {
            id: 'logement',
            titre: 'Logement : explorer les options',
            moisParRapportAuRepere: 6,
            quand: 'Selon le projet de la personne',
            pourquoi:
              'Plusieurs formes d’habitat existent dans le canton de Vaud, du plus autonome au plus accompagné : accompagnement à domicile (Pro Infirmis, RAHMO, prestations socio-éducatives à domicile), logements protégés rattachés à un établissement, logements adaptés avec accompagnement (LADA), et hébergement en établissement socio-éducatif — à temps plein, à temps partiel (au maximum trois jours par semaine) ou en court séjour.',
            aFaire: [
              'Discuter avec le DCISH des options adaptées à la situation.',
              'Pour un hébergement en établissement : demander comment se compose le financement (contribution personnelle et aide individuelle de la DGCS selon la situation financière).',
            ],
            contacts: [
              {
                nom: 'Pro Infirmis Vaud — accompagnement à domicile',
                role: 'Aide dans les actes quotidiens, gestion administrative, liens sociaux',
                lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/accompagnement-a-domicile.html' },
              },
              { nom: 'RAHMO', role: 'Réseau Accompagnement Handicap en Milieu Ordinaire', lien: { libelle: 'rahmo.ch', url: 'https://rahmo.ch/' } },
              {
                nom: 'LADA — canton de Vaud',
                role: 'Logements adaptés avec accompagnement',
                lien: { libelle: 'vd.ch — LADA', url: 'https://www.vd.ch/sante-soins-et-handicap/vivre-a-domicile/lada-logements-adaptes-avec-accompagnement' },
              },
              {
                nom: 'DGCS — aides individuelles',
                role: 'Financement de l’hébergement et des centres de jour',
                lien: { libelle: 'vd.ch — aides individuelles', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/aides-individuelles' },
              },
            ],
            pointsAttention: ['Règles particulières de l’hébergement à temps partiel : [À COMPLÉTER] (section non rédigée dans le memento).'],
            genereJalon: false,
            sources: [MEMENTO],
          },
          {
            id: 'travail',
            titre: 'Travail et activité de jour',
            moisParRapportAuRepere: 6,
            quand: 'Selon le projet de la personne',
            pourquoi:
              'Pour une personne au bénéfice d’une rente AI, plusieurs cadres existent : un poste intégré en entreprise avec suivi individualisé, un atelier à vocation productive (exigences proches du marché ordinaire), un atelier protégé, ou un centre de jour centré sur le développement de la personne.',
            aFaire: [
              'En parler avec la gestionnaire AI et le DCISH.',
              'Visiter les structures envisagées avec votre enfant.',
            ],
            contacts: [
              { nom: 'InsertH — Pro Infirmis Vaud', role: 'Postes intégrés en entreprise', lien: { libelle: 'proinfirmis.ch — InsertH', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/inserth.html' } },
              { nom: 'AEIP', role: 'Ateliers à vocation productive', lien: { libelle: 'aeip.ch', url: 'https://www.aeip.ch/' } },
            ],
            genereJalon: false,
            sources: [MEMENTO],
          },
          {
            id: 'loisirs-culture-transports',
            titre: 'Loisirs, sport, culture et transports',
            moisParRapportAuRepere: null,
            quand: 'À tout moment',
            pourquoi:
              'De nombreuses associations subventionnées par le canton proposent des loisirs adaptés ou accompagnés, des camps, du sport adapté et un accès facilité à la culture. Le programme cantonal de transport à mobilité réduite (TMR) permet de se déplacer avec un transport adapté au prix d’un transport public.',
            aFaire: ['Consulter la liste des associations et contacter celles qui correspondent aux goûts de votre enfant.', 'Pour le TMR : contacter le centre médico-social du lieu de domicile.'],
            contacts: [
              { nom: 'Forum Handicap Vaud', role: 'Liste des associations', lien: { libelle: 'fhvd.ch', url: 'https://www.fhvd.ch/' } },
              { nom: 'insieme Vaud', role: 'Loisirs et vacances', lien: { libelle: 'insiemevaud.ch', url: 'https://insiemevaud.ch/' } },
              { nom: 'TMR — via le CMS', role: 'Transport à mobilité réduite', lien: { libelle: 'cms-vaud.ch — TMR', url: 'https://www.cms-vaud.ch/search/tmr/' } },
              { nom: 'Relax Culture', role: 'Séances culturelles adaptées', lien: { libelle: 'relax-culture.ch', url: 'https://relax-culture.ch/' } },
              { nom: 'La Chaise rouge', role: 'Accompagnement aux sorties culturelles', lien: { libelle: 'proinfirmis.ch — La Chaise rouge', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/la-chaise-rouge.html' } },
              { nom: 'Bibliothèque sonore romande', role: 'Livres audio gratuits', lien: { libelle: 'bibliothequesonore.ch', url: 'https://www.bibliothequesonore.ch/' } },
              { nom: 'Écoute Voir', role: 'Arts vivants et handicap sensoriel', lien: { libelle: 'ecoute-voir.org', url: 'https://ecoute-voir.org/' } },
            ],
            genereJalon: false,
            sources: [MEMENTO],
          },
          {
            id: 'moyens-auxiliaires',
            titre: 'Moyens auxiliaires',
            moisParRapportAuRepere: null,
            quand: 'Quand un besoin apparaît',
            pourquoi:
              'Un moyen auxiliaire (fauteuil roulant, appareil auditif, moyen de communication) compense la diminution ou la perte d’une fonction physique ou sensorielle. L’AI peut en financer une partie.',
            aFaire: ['Demander à l’office AI la procédure applicable à l’âge de votre enfant — les règles pour les 18–25 ans : [À COMPLÉTER].'],
            contacts: [{ nom: 'Office AI Vaud', role: 'Moyens auxiliaires', lien: { libelle: 'aivd.ch — moyens auxiliaires', url: 'https://aivd.ch/moyens-auxiliaires-plus-de-25-ans/' } }],
            genereJalon: false,
            sources: [MEMENTO],
          },
          {
            id: 'proche-aidant',
            titre: 'Et vous, le proche aidant',
            moisParRapportAuRepere: null,
            quand: 'À tout moment',
            pourquoi:
              'Accompagner un enfant vers la vie adulte demande du temps et de l’énergie. Le canton de Vaud soutient les proches aidants : information, orientation, entretiens individuels, carte d’urgence, aide et relèves à la maison, consultations psychologiques, accueil de jour ou court séjour en établissement, groupes d’entraide.',
            aFaire: ['Appeler la permanence gratuite des proches aidants (0800 660 660).', 'En cas de difficulté avec un professionnel ou une institution : contacter la Permanence d’orientation Patients / Résidents (021 316 09 87).'],
            contacts: [
              { nom: 'Espace Proches', role: 'Écoute et conseil gratuits pour les proches aidants', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } },
              { nom: 'Permanence d’orientation Patients / Résidents', role: 'Insatisfaction, problèmes, litiges', lien: { libelle: 'vd.ch — plaintes santé-social', url: 'https://www.vd.ch/plaintes-sante-social' } },
            ],
            genereJalon: false,
            sources: [MEMENTO],
          },
        ],
      },
    ],
    ressources: [
      { titre: 'Guide social romand', texte: 'Informations socio-juridiques et répertoire d’institutions sociales en Suisse romande.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
      { titre: 'Info handicap', texte: 'Plateforme de Pro Infirmis : questions juridiques, financières, vie sociale, accessibilité, logement, travail.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
      { titre: 'Associations vaudoises', texte: 'Liste des associations membres de Forum Handicap Vaud, généralistes ou spécialisées.', lien: { libelle: 'fhvd.ch/membres', url: 'https://www.fhvd.ch/membres' } },
    ],
  },
}

export const listeParcours = Object.values(parcours)

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
