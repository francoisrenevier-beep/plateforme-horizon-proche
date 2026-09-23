// Types du modèle de données et données de démonstration (entièrement fictives).
// Aucun appel réseau. Les données servent d'amorce à la couche locale (`lib/store.tsx`),
// qui les persiste dans le navigateur et les rend modifiables.
//
// Convention : toutes les dates sont en ISO (AAAA-MM-JJ) ; les libellés sont dérivés (`lib/dates.ts`).

import { aujourdhuiISO, decalerJours, ageA, formatDateLongue } from '@/lib/dates'

export type Nature = 'delai' | 'jalon'

export type Echeance = {
  id: string
  nature: Nature
  titre: string
  // Provenance : pour un délai, le courrier lu ; pour un jalon, la règle de calendrier.
  provenance: string
  // Date ISO, canonique
  dateISO: string
  // Libellé libre facultatif (« dès maintenant ») ; sinon dérivé de dateISO selon la nature.
  date?: string
  // Délai uniquement : jours restants figés (utilisé sur la page publique pour un exemple stable).
  // Dans l'application, le compte à rebours est toujours calculé à partir de dateISO.
  joursRestants?: number
  fait?: boolean
  // Rattachements facultatifs
  demarcheId?: string
  documentId?: string
  origine?: 'manuel' | 'document' | 'parcours' | 'rendez-vous'
}

// Ce qui est saisi pour une personne accompagnée. L'âge, l'initiale et le libellé de
// naissance sont dérivés (voir `enrichirPersonne`).
export type PersonneBase = {
  id: string
  prenom: string
  nom: string
  naissanceISO: string
  contexte: string
  // Dossier archivé (§9.7) : sort du décompte, reste lisible.
  archive?: boolean
}

export type Personne = PersonneBase & {
  age: number
  naissance: string
  initiale: string
}

export function enrichirPersonne(p: PersonneBase): Personne {
  return {
    ...p,
    age: ageA(p.naissanceISO),
    naissance: formatDateLongue(p.naissanceISO),
    initiale: (p.prenom.trim().charAt(0) || '?').toUpperCase(),
  }
}

export type Titulaire = {
  prenom: string
  nom: string
  ville: string
  canton: string
}

export type PointChronologie = {
  id: string
  date: string
  dateCourte: string
  evenement: string
  nature: Nature | 'repere'
}

export type Document = {
  id: string
  titre: string
  emetteur: string
  // Date telle qu'elle figure sur le document (texte libre : « 04.2026 », « 2024 »)
  date: string
  type: string
  annee: string
  etiquettes: string[]
  demarche?: string
  classe: boolean
  ajouteLe?: string // ISO date-heure
  ajoutePar?: string
}

export type Intervenant = {
  id: string
  organisation: string
  contact: string
  fonction: string
  telephone: string
  courriel: string
  adresse?: string
  site?: string
  horaires?: string
  reference?: string
  dernierContact?: string
  notes?: string
}

export type Reference = { id: string; label: string; valeur: string }

export type QuestionRdv = { id: string; texte: string; ajouteeLe: string; faite: boolean }
export type PieceRdv = { id: string; texte: string; lie: boolean }

export type RendezVous = {
  id: string
  intervenant: string
  fonction: string
  dateISO: string
  heure?: string
  lieu: string
  questions: QuestionRdv[]
  pieces: PieceRdv[]
  // « Avant » : ce qui a changé depuis la dernière fois
  changements: string
  // « Pendant »
  notes: { dit: string; decide: string; prescrit: string; prochaine: string }
  // « Après »
  decisions: string[]
}

export type SectionPortrait = {
  id: string
  intitule: string
  texte: string | null
}

// Les sept sections fixes du portrait (CLAUDE.md §2.3), dans cet ordre.
export const INTITULES_PORTRAIT = [
  'Comment je communique',
  'Ce qui me rassure',
  'Ce qui me met en difficulté',
  'Le déroulé de ma journée',
  'Ce que j’aime',
  'Les gens qui comptent pour moi',
  'Mon histoire',
] as const

export function portraitVide(): SectionPortrait[] {
  return INTITULES_PORTRAIT.map((intitule, i) => ({ id: `pt${i + 1}`, intitule, texte: null }))
}

export type Acces = {
  id: string
  nom: string
  role: string
  peutVoir: string
  depuis: string
  jusqua: string
}

export type Demarche = {
  id: string
  // Fiche éditoriale associée (`lib/fiches.ts`), le cas échéant
  ficheId?: string
  titre: string
  canton: string
  situation: string
  prochaineAction?: string
  prochaineDate?: string
  // Pièces de la fiche cochées par la famille
  piecesCochees: string[]
}

export type Activite = { id: string; texte: string; auteur: string; quand: string }

export type StatutEtape = 'a-faire' | 'fait' | 'pas-concerne'
export type SuiviEtape = { statut: StatutEtape; note?: string; faitLe?: string }
export type ParcoursSuivi = {
  active: boolean
  activeLe?: string
  etapes: Record<string, SuiviEtape>
}

export type DossierData = {
  echeances: Echeance[]
  documents: Document[]
  intervenants: Intervenant[]
  references: Reference[]
  rendezVous: RendezVous[]
  portrait: SectionPortrait[]
  acces: Acces[]
  demarches: Demarche[]
  parcours: Record<string, ParcoursSuivi>
  journal: Activite[]
}

export type Etat = {
  version: 1
  titulaire: Titulaire
  personneActiveId: string
  personnes: PersonneBase[]
  dossiers: Record<string, DossierData>
}

export function dossierVide(titulaire: Titulaire): DossierData {
  return {
    echeances: [],
    documents: [],
    intervenants: [],
    references: [],
    rendezVous: [],
    portrait: portraitVide(),
    acces: [
      {
        id: 'acces-titulaire',
        nom: `${titulaire.prenom} ${titulaire.nom}`,
        role: 'Titulaire',
        peutVoir: 'L’ensemble du dossier, y compris le volet financier',
        depuis: formatDateLongue(aujourdhuiISO()),
        jusqua: 'sans limite',
      },
    ],
    demarches: [],
    parcours: {},
    journal: [],
  }
}

// ---------------------------------------------------------------------------
// Données de démonstration
// ---------------------------------------------------------------------------

export const titulaire: Titulaire = {
  prenom: 'Sandrine',
  nom: 'Perret',
  ville: 'Yverdon-les-Bains',
  canton: 'VD',
}

export const personnes: PersonneBase[] = [
  {
    id: 'noah',
    prenom: 'Noah',
    nom: 'Perret',
    naissanceISO: '2010-03-04',
    contexte:
      'Trouble du spectre de l’autisme. Scolarisé en école spécialisée. Bénéficiaire d’une allocation pour impotent de l’AI, degré moyen. Mineur, canton de Vaud.',
  },
  {
    id: 'madeleine',
    prenom: 'Madeleine',
    nom: 'Perret',
    naissanceISO: '1942-01-12',
    contexte: 'Mère de Sandrine. Troubles cognitifs. Hospitalisée, sortie prévue dans trois semaines.',
  },
]

// Les dates de la démonstration sont posées par rapport à aujourd'hui, pour que les
// comptes à rebours restent parlants quelle que soit la date d'ouverture.
const auj = aujourdhuiISO()
const dansJours = (n: number) => decalerJours(auj, n)
const ilYaJours = (n: number) => decalerJours(auj, -n)
const dateHeure = (joursAvant: number, heure = '18:12') => `${ilYaJours(joursAvant)}T${heure}:00`

export const echeancesNoah: Echeance[] = [
  {
    id: 'noah-e1',
    nature: 'delai',
    titre: 'Répondre à l’office AI',
    provenance: `Date lue sur votre courrier de l’Office AI Vaud du ${formatDateLongue(ilYaJours(2))}`,
    dateISO: dansJours(28),
    demarcheId: 'api',
    documentId: 'd1',
    origine: 'document',
  },
  {
    id: 'noah-e2',
    nature: 'delai',
    titre: 'Renvoyer le questionnaire API',
    provenance: `Date lue sur votre courrier de l’Office AI Vaud du ${formatDateLongue(ilYaJours(2))}`,
    dateISO: dansJours(49),
    demarcheId: 'api',
    documentId: 'd2',
    origine: 'document',
  },
  {
    id: 'noah-e3',
    nature: 'jalon',
    titre: 'Réévaluer les besoins d’accompagnement',
    provenance: 'Comptez un point de situation annuel',
    dateISO: '2027-01-15',
    origine: 'manuel',
  },
]

export const echeancesMadeleine: Echeance[] = [
  {
    id: 'mad-e1',
    nature: 'delai',
    titre: 'Confirmer la place à l’EMS Les Tilleuls',
    provenance: 'Date lue sur votre courrier de l’EMS Les Tilleuls',
    dateISO: dansJours(14),
    demarcheId: 'ems',
    origine: 'document',
  },
  {
    id: 'mad-e2',
    nature: 'jalon',
    titre: 'Déposer la demande de prestations complémentaires',
    provenance: 'Règle : 3 mois avant l’entrée en établissement. À faire dès maintenant',
    dateISO: auj,
    date: 'dès maintenant',
    demarcheId: 'ems',
    origine: 'manuel',
  },
]

export const documentsNoah: Document[] = [
  { id: 'd1', titre: 'Décision AI', emetteur: 'Office AI Vaud', date: formatDateLongue(ilYaJours(2)), type: 'Décision', annee: '2026', etiquettes: ['AI', 'Décision'], demarche: 'Renouvellement API', classe: true, ajouteLe: dateHeure(1), ajoutePar: 'Sandrine Perret' },
  { id: 'd2', titre: 'Questionnaire API (vierge)', emetteur: 'Office AI Vaud', date: formatDateLongue(ilYaJours(2)), type: 'Formulaire', annee: '2026', etiquettes: ['AI', 'À remplir'], demarche: 'Renouvellement API', classe: true, ajouteLe: dateHeure(1), ajoutePar: 'Sandrine Perret' },
  { id: 'd3', titre: 'Rapport pédopsychiatrique', emetteur: 'Dr Ancel, CHUV', date: '04.2026', type: 'Rapport', annee: '2026', etiquettes: ['Médical'], classe: true, ajouteLe: dateHeure(120), ajoutePar: 'Sandrine Perret' },
  { id: 'd4', titre: 'Attestation de scolarité 2026-2027', emetteur: 'École La Combe', date: '2026', type: 'Attestation', annee: '2026', etiquettes: ['École'], classe: true, ajouteLe: dateHeure(20), ajoutePar: 'Sandrine Perret' },
  { id: 'd5', titre: 'Décision API 2024', emetteur: 'Office AI Vaud', date: '2024', type: 'Décision', annee: '2024', etiquettes: ['AI', 'Décision'], classe: true, ajouteLe: dateHeure(700), ajoutePar: 'Sandrine Perret' },
  { id: 'd6', titre: 'Courrier SESAF', emetteur: 'SESAF', date: '02.2026', type: 'Courrier', annee: '2026', etiquettes: ['École'], classe: true, ajouteLe: dateHeure(200), ajoutePar: 'Sandrine Perret' },
  { id: 'd7', titre: 'Facture logopédie', emetteur: 'Cabinet de logopédie', date: '07.2026', type: 'Facture', annee: '2026', etiquettes: ['Médical', 'Facture'], classe: true, ajouteLe: dateHeure(50), ajoutePar: 'Julien Perret' },
  { id: 'd8', titre: 'Décharge de transport', emetteur: 'Transports scolaires', date: '2026', type: 'Formulaire', annee: '2026', etiquettes: ['École'], classe: true, ajouteLe: dateHeure(30), ajoutePar: 'Sandrine Perret' },
  { id: 'd9', titre: 'Certificat médical', emetteur: 'Dr Ancel, CHUV', date: '01.2026', type: 'Certificat', annee: '2026', etiquettes: ['Médical'], classe: true, ajouteLe: dateHeure(230), ajoutePar: 'Sandrine Perret' },
  { id: 'd10', titre: 'Photo carte AVS', emetteur: 'Caisse AVS', date: '—', type: 'Pièce d’identité', annee: '—', etiquettes: ['Références'], classe: true, ajouteLe: dateHeure(400), ajoutePar: 'Sandrine Perret' },
  { id: 'd11', titre: 'Bilan éducatif', emetteur: 'École La Combe', date: '06.2026', type: 'Rapport', annee: '2026', etiquettes: ['École'], classe: true, ajouteLe: dateHeure(80), ajoutePar: 'Sandrine Perret' },
  { id: 'd12', titre: 'Convocation office AI', emetteur: 'Office AI Vaud', date: '08.2026', type: 'Courrier', annee: '2026', etiquettes: [], classe: false, ajouteLe: dateHeure(3), ajoutePar: 'Sandrine Perret' },
]

export const intervenantsNoah: Intervenant[] = [
  {
    id: 'i1',
    organisation: 'Office AI Vaud',
    contact: 'Mme Corina Blanc',
    fonction: 'Gestionnaire de dossier',
    telephone: '021 964 12 45',
    courriel: 'corina.blanc@aivd.ch',
    reference: 'Dossier n° 402.55.881',
    dernierContact: formatDateLongue(ilYaJours(2)),
  },
  {
    id: 'i2',
    organisation: 'École spécialisée La Combe',
    contact: 'Mme Reber',
    fonction: 'Enseignante référente',
    telephone: '024 420 55 10',
    courriel: 'm.reber@lacombe.ch',
    dernierContact: '12 juin 2026',
  },
  {
    id: 'i3',
    organisation: 'CHUV',
    contact: 'Dr Ancel',
    fonction: 'Pédopsychiatre',
    telephone: '021 314 11 11',
    courriel: 'secretariat.ancel@chuv.ch',
    dernierContact: 'avril 2026',
  },
  {
    id: 'i4',
    organisation: 'Justice de paix du district Jura-Nord vaudois',
    contact: 'Greffe',
    fonction: 'Autorité de protection',
    telephone: '024 557 74 20',
    courriel: 'jp.jnv@vd.ch',
  },
  {
    id: 'i5',
    organisation: 'Pro Infirmis Vaud',
    contact: 'Permanence sociale',
    fonction: 'Conseil et accompagnement',
    telephone: '024 425 79 40',
    courriel: 'vaud@proinfirmis.ch',
  },
]

export const referencesNoah: Reference[] = [
  { id: 'r1', label: 'N° AVS', valeur: '756.xxxx.xxxx.xx' },
  { id: 'r2', label: 'Dossier AI', valeur: '402.55.881' },
  { id: 'r3', label: 'N° assuré Assura', valeur: '88.442.109' },
]

export const rendezVousNoah: RendezVous[] = [
  {
    id: 'rv1',
    intervenant: 'Dr Ancel',
    fonction: 'Pédopsychiatre',
    dateISO: dansJours(9),
    heure: '14h30',
    lieu: 'CHUV, Lausanne',
    questions: [
      { id: 'q1', texte: 'Faut-il adapter le traitement avant la rentrée ?', ajouteeLe: ilYaJours(12), faite: false },
      { id: 'q2', texte: 'Un bilan est-il utile pour le dossier AI ?', ajouteeLe: ilYaJours(10), faite: false },
      { id: 'q3', texte: 'Comment gérer les périodes de transition ?', ajouteeLe: ilYaJours(6), faite: false },
      { id: 'q4', texte: 'Peut-on avoir un certificat pour les transports ?', ajouteeLe: ilYaJours(4), faite: false },
    ],
    pieces: [
      { id: 'p1', texte: `Décision AI du ${formatDateLongue(ilYaJours(2))}`, lie: true },
      { id: 'p2', texte: 'Rapport pédopsychiatrique 04.2026', lie: true },
      { id: 'p3', texte: 'Carte d’assurance', lie: false },
    ],
    changements: '',
    notes: { dit: '', decide: '', prescrit: '', prochaine: '' },
    decisions: [],
  },
  {
    id: 'rv2',
    intervenant: 'Réseau école',
    fonction: 'Point de situation',
    dateISO: '2026-06-12',
    lieu: 'École La Combe',
    questions: [],
    pieces: [],
    changements: '',
    notes: {
      dit: 'Noah progresse dans les échanges avec ses camarades ; les transitions restent difficiles.',
      decide: 'Poursuivre le suivi actuel, prochain point dans six mois.',
      prescrit: '',
      prochaine: 'Rédiger un certificat pour les transports scolaires.',
    },
    decisions: [
      'Poursuivre le suivi actuel, prochain point dans six mois.',
      'Rédiger un certificat pour les transports scolaires.',
    ],
  },
]

export const portraitNoah: SectionPortrait[] = [
  {
    id: 'pt1',
    intitule: 'Comment je communique',
    texte:
      'Je me repère mieux quand on me montre que quand on m’explique. Les phrases courtes m’aident. Laissez-moi le temps de répondre, je réfléchis avant de parler.',
  },
  {
    id: 'pt2',
    intitule: 'Ce qui me rassure',
    texte:
      'J’ai besoin qu’on m’annonce les changements la veille. Le matin même, c’est trop tard. Un déroulé affiché me rassure beaucoup.',
  },
  {
    id: 'pt3',
    intitule: 'Ce qui me met en difficulté',
    texte:
      'Le bruit des séchoirs à mains me fait sortir d’une pièce. Les lumières fortes et les endroits bondés me fatiguent vite.',
  },
  {
    id: 'pt4',
    intitule: 'Le déroulé de ma journée',
    texte:
      'Je me lève tôt et je prends toujours le même petit-déjeuner. L’après-midi, j’ai besoin d’un moment calme seul dans ma chambre.',
  },
  {
    id: 'pt5',
    intitule: 'Ce que j’aime',
    texte:
      'J’aime les trains, les cartes et dessiner des plans de villes. Écouter toujours la même musique me fait du bien.',
  },
  {
    id: 'pt6',
    intitule: 'Les gens qui comptent pour moi',
    texte:
      'Ma mère Sandrine, mon père Julien, et Mme Reber à l’école. Ils savent comment me parler quand je suis contrarié.',
  },
  { id: 'pt7', intitule: 'Mon histoire', texte: null },
]

export const accesNoah: Acces[] = [
  {
    id: 'a1',
    nom: 'Sandrine Perret',
    role: 'Titulaire',
    peutVoir: 'L’ensemble du dossier, y compris le volet financier',
    depuis: 'mars 2024',
    jusqua: 'sans limite',
  },
  {
    id: 'a2',
    nom: 'Julien Perret',
    role: 'Parent',
    peutVoir: 'Tout le dossier, sauf le volet financier',
    depuis: 'mars 2024',
    jusqua: 'sans limite',
  },
  {
    id: 'a3',
    nom: 'Mme Reber',
    role: 'Professionnel',
    peutVoir: 'Le portrait seulement',
    depuis: 'septembre 2025',
    jusqua: '30 juin 2027',
  },
]

export const demarchesNoah: Demarche[] = [
  {
    id: 'transition',
    ficheId: 'transition',
    titre: 'Transition à la majorité',
    canton: 'VD',
    situation: 'Noah aura 18 ans le 4 mars 2028. Plusieurs sujets se préparent en amont.',
    piecesCochees: ['f1', 'f3', 'f4'],
  },
  {
    id: 'api',
    ficheId: 'api',
    titre: 'Renouvellement API',
    canton: 'VD',
    situation: 'L’allocation pour impotent doit être réexaminée par l’office AI.',
    prochaineAction: 'Renvoyer le questionnaire API',
    piecesCochees: ['a1'],
  },
]

export const demarchesSuggerees = [
  'Prestations complémentaires pour familles',
  'Aide au placement en atelier protégé',
]

export function creerEtatInitial(): Etat {
  const noah: DossierData = {
    echeances: echeancesNoah,
    documents: documentsNoah,
    intervenants: intervenantsNoah,
    references: referencesNoah,
    rendezVous: rendezVousNoah,
    portrait: portraitNoah,
    acces: accesNoah,
    demarches: demarchesNoah,
    parcours: {
      'transition-majorite': {
        active: true,
        activeLe: ilYaJours(90),
        etapes: {
          'allocations-familiales': { statut: 'fait', faitLe: ilYaJours(80) },
          'dcish-inscription': { statut: 'fait', faitLe: ilYaJours(45) },
          'portrait-a-jour': { statut: 'fait', faitLe: ilYaJours(40) },
        },
      },
    },
    journal: [
      { id: 'act1', texte: 'Décision AI ajoutée au coffre', auteur: 'Sandrine Perret', quand: dateHeure(1) },
      { id: 'act2', texte: `Question notée pour le rendez-vous du ${formatDateLongue(dansJours(9))}`, auteur: 'Sandrine Perret', quand: dateHeure(3, '09:40') },
      { id: 'act3', texte: 'Accès du portrait accordé à Mme Reber', auteur: 'Sandrine Perret', quand: dateHeure(7, '20:05') },
    ],
  }

  const madeleine: DossierData = {
    ...dossierVide(titulaire),
    echeances: echeancesMadeleine,
    intervenants: [
      {
        id: 'mi1',
        organisation: 'EMS Les Tilleuls',
        contact: 'Secrétariat',
        fonction: 'Admissions',
        telephone: '024 000 00 00',
        courriel: 'admissions@tilleuls.example',
      },
      {
        id: 'mi2',
        organisation: 'Centre médico-social (CMS)',
        contact: 'Infirmière référente',
        fonction: 'Coordination des soins à domicile',
        telephone: '024 000 00 01',
        courriel: 'cms@example.ch',
      },
    ],
    acces: [
      {
        id: 'ma1',
        nom: 'Sandrine Perret',
        role: 'Titulaire',
        peutVoir: 'L’ensemble du dossier, y compris le volet financier',
        depuis: 'juillet 2026',
        jusqua: 'sans limite',
      },
    ],
    demarches: [
      {
        id: 'ems',
        ficheId: 'ems',
        titre: 'Entrée en EMS',
        canton: 'VD',
        situation: 'Une place est proposée aux Tilleuls. Le financement et les prestations complémentaires sont à préparer.',
        prochaineAction: 'Confirmer la place',
        piecesCochees: [],
      },
    ],
    journal: [
      { id: 'mact1', texte: 'Dossier de Madeleine créé', auteur: 'Sandrine Perret', quand: dateHeure(40, '11:20') },
    ],
  }

  return {
    version: 1,
    titulaire,
    personneActiveId: 'noah',
    personnes,
    dossiers: { noah, madeleine },
  }
}
