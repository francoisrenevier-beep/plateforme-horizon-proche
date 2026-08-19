// Données entièrement fictives pour la maquette. Aucun appel réseau.

export type Nature = 'delai' | 'jalon'

export type Echeance = {
  id: string
  nature: Nature
  titre: string
  // Provenance : pour un délai, le courrier lu ; pour un jalon, la règle de calendrier.
  provenance: string
  // Date lisible affichée
  date: string
  // Date ISO pour le tri
  dateISO: string
  // Délai uniquement : jours restants
  joursRestants?: number
  fait?: boolean
}

export type Personne = {
  id: string
  prenom: string
  nom: string
  age: number
  naissance: string
  initiale: string
  contexte: string
  contexteCourt: string
  demarchesActives: string[]
}

export const titulaire = {
  prenom: 'Sandrine',
  nom: 'Perret',
  age: 47,
  ville: 'Yverdon-les-Bains',
  canton: 'VD',
}

export const personnes: Personne[] = [
  {
    id: 'noah',
    prenom: 'Noah',
    nom: 'Perret',
    age: 16,
    naissance: '4 mars 2010',
    initiale: 'N',
    contexte:
      'Trouble du spectre de l’autisme. Scolarisé en école spécialisée. Bénéficiaire d’une allocation pour impotent de l’AI, degré moyen. Mineur, canton de Vaud.',
    contexteCourt: 'Dossier de Noah, 16 ans · 2 démarches en cours',
    demarchesActives: ['Transition à la majorité', 'Renouvellement API'],
  },
  {
    id: 'madeleine',
    prenom: 'Madeleine',
    nom: 'Perret',
    age: 84,
    naissance: '12 janvier 1942',
    initiale: 'M',
    contexte:
      'Mère de Sandrine. Troubles cognitifs. Hospitalisée, sortie prévue dans trois semaines.',
    contexteCourt: 'Dossier de Madeleine, 84 ans · 1 démarche en cours',
    demarchesActives: ['Entrée en EMS'],
  },
]

// Échéances par dossier, mêlant délais légaux et jalons conseillés.
export const echeances: Record<string, Echeance[]> = {
  noah: [
    {
      id: 'noah-e1',
      nature: 'delai',
      titre: 'Répondre à l’office AI',
      provenance: 'Date lue sur votre courrier de l’Office AI Vaud du 13 août 2026',
      date: 'avant le 12 septembre 2026',
      dateISO: '2026-09-12',
      joursRestants: 28,
    },
    {
      id: 'noah-e2',
      nature: 'delai',
      titre: 'Renvoyer le questionnaire API',
      provenance: 'Date lue sur votre courrier de l’Office AI Vaud du 13 août 2026',
      date: 'avant le 3 octobre 2026',
      dateISO: '2026-10-03',
      joursRestants: 49,
    },
    {
      id: 'noah-e3',
      nature: 'jalon',
      titre: 'Réévaluer les besoins d’accompagnement',
      provenance: 'Comptez un point de situation annuel',
      date: 'vers janvier 2027',
      dateISO: '2027-01-15',
    },
    {
      id: 'noah-e4',
      nature: 'jalon',
      titre: 'Déposer la demande à la justice de paix',
      provenance: 'Règle : 6 mois avant les 18 ans. Comptez environ 6 mois de traitement',
      date: 'vers septembre 2027',
      dateISO: '2027-09-01',
    },
  ],
  madeleine: [
    {
      id: 'mad-e1',
      nature: 'delai',
      titre: 'Confirmer la place à l’EMS Les Tilleuls',
      provenance: 'Date lue sur votre courrier de l’EMS Les Tilleuls',
      date: 'avant le 29 août 2026',
      dateISO: '2026-08-29',
      joursRestants: 14,
    },
    {
      id: 'mad-e2',
      nature: 'jalon',
      titre: 'Déposer la demande de prestations complémentaires',
      provenance: 'Règle : 3 mois avant l’entrée en établissement. À faire dès maintenant',
      date: 'dès maintenant',
      dateISO: '2026-08-16',
    },
  ],
}

// Chronologie signature : part d’aujourd’hui et descend dans le futur.
export type PointChronologie = {
  id: string
  date: string
  dateCourte: string
  evenement: string
  nature: Nature | 'repere'
}

export const chronologieNoah: PointChronologie[] = [
  { id: 'c0', date: 'Aujourd’hui', dateCourte: '15 août 2026', evenement: 'Vous êtes ici', nature: 'repere' },
  { id: 'c1', date: '29 août 2026', dateCourte: '29.08.2026', evenement: 'Délai — confirmer une place (dossier Madeleine)', nature: 'delai' },
  { id: 'c2', date: '12 sept. 2026', dateCourte: '12.09.2026', evenement: 'Délai — répondre à l’office AI', nature: 'delai' },
  { id: 'c3', date: '3 oct. 2026', dateCourte: '03.10.2026', evenement: 'Délai — renvoyer le questionnaire API', nature: 'delai' },
  { id: 'c4', date: 'janvier 2027', dateCourte: '01.2027', evenement: 'Moment conseillé — réévaluer les besoins', nature: 'jalon' },
  { id: 'c5', date: 'septembre 2027', dateCourte: '09.2027', evenement: 'Moment conseillé — demande à la justice de paix', nature: 'jalon' },
  { id: 'c6', date: 'mars 2028', dateCourte: '04.03.2028', evenement: 'Noah a 18 ans', nature: 'repere' },
  { id: 'c7', date: 'courant 2028', dateCourte: '2028', evenement: 'Moment conseillé — réexaminer les prestations à la majorité', nature: 'jalon' },
]

export type Document = {
  id: string
  titre: string
  emetteur: string
  date: string
  type: string
  annee: string
  etiquettes: string[]
  demarche?: string
  classe: boolean
}

export const documentsNoah: Document[] = [
  { id: 'd1', titre: 'Décision AI', emetteur: 'Office AI Vaud', date: '13.08.2026', type: 'Décision', annee: '2026', etiquettes: ['AI', 'Décision'], demarche: 'Renouvellement API', classe: true },
  { id: 'd2', titre: 'Questionnaire API (vierge)', emetteur: 'Office AI Vaud', date: '13.08.2026', type: 'Formulaire', annee: '2026', etiquettes: ['AI', 'À remplir'], demarche: 'Renouvellement API', classe: true },
  { id: 'd3', titre: 'Rapport pédopsychiatrique', emetteur: 'Dr Ancel, CHUV', date: '04.2026', type: 'Rapport', annee: '2026', etiquettes: ['Médical'], classe: true },
  { id: 'd4', titre: 'Attestation de scolarité 2026-2027', emetteur: 'École La Combe', date: '2026', type: 'Attestation', annee: '2026', etiquettes: ['École'], classe: true },
  { id: 'd5', titre: 'Décision API 2024', emetteur: 'Office AI Vaud', date: '2024', type: 'Décision', annee: '2024', etiquettes: ['AI', 'Décision'], classe: true },
  { id: 'd6', titre: 'Courrier SESAF', emetteur: 'SESAF', date: '02.2026', type: 'Courrier', annee: '2026', etiquettes: ['École'], classe: true },
  { id: 'd7', titre: 'Facture logopédie', emetteur: 'Cabinet de logopédie', date: '07.2026', type: 'Facture', annee: '2026', etiquettes: ['Médical', 'Facture'], classe: true },
  { id: 'd8', titre: 'Décharge de transport', emetteur: 'Transports scolaires', date: '2026', type: 'Formulaire', annee: '2026', etiquettes: ['École'], classe: true },
  { id: 'd9', titre: 'Certificat médical', emetteur: 'Dr Ancel, CHUV', date: '01.2026', type: 'Certificat', annee: '2026', etiquettes: ['Médical'], classe: true },
  { id: 'd10', titre: 'Photo carte AVS', emetteur: 'Caisse AVS', date: '—', type: 'Pièce d’identité', annee: '—', etiquettes: ['Références'], classe: true },
  { id: 'd11', titre: 'Bilan éducatif', emetteur: 'École La Combe', date: '06.2026', type: 'Rapport', annee: '2026', etiquettes: ['École'], classe: true },
  { id: 'd12', titre: 'Convocation office AI', emetteur: 'Office AI Vaud', date: '08.2026', type: 'Courrier', annee: '2026', etiquettes: [], classe: false },
]

export type Intervenant = {
  id: string
  organisation: string
  contact: string
  fonction: string
  telephone: string
  courriel: string
  reference?: string
  dernierContact?: string
}

export const intervenantsNoah: Intervenant[] = [
  {
    id: 'i1',
    organisation: 'Office AI Vaud',
    contact: 'Mme Corina Blanc',
    fonction: 'Gestionnaire de dossier',
    telephone: '021 964 12 45',
    courriel: 'corina.blanc@aivd.ch',
    reference: 'Dossier n° 402.55.881',
    dernierContact: '13.08.2026',
  },
  {
    id: 'i2',
    organisation: 'École spécialisée La Combe',
    contact: 'Mme Reber',
    fonction: 'Enseignante référente',
    telephone: '024 420 55 10',
    courriel: 'm.reber@lacombe.ch',
    dernierContact: '12.06.2026',
  },
  {
    id: 'i3',
    organisation: 'CHUV',
    contact: 'Dr Ancel',
    fonction: 'Pédopsychiatre',
    telephone: '021 314 11 11',
    courriel: 'secretariat.ancel@chuv.ch',
    dernierContact: '04.2026',
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

export const references = [
  { id: 'r1', label: 'N° AVS', valeur: '756.xxxx.xxxx.xx' },
  { id: 'r2', label: 'Dossier AI', valeur: '402.55.881' },
  { id: 'r3', label: 'N° assuré Assura', valeur: '88.442.109' },
]

export type RendezVous = {
  id: string
  intervenant: string
  fonction: string
  date: string
  heure?: string
  lieu: string
  statut: 'a-venir' | 'passe'
  questionsEnAttente?: number
  piecesAEmporter?: number
}

export const rendezVousNoah: RendezVous[] = [
  {
    id: 'rv1',
    intervenant: 'Dr Ancel',
    fonction: 'Pédopsychiatre',
    date: '22 septembre 2026',
    heure: '14h30',
    lieu: 'CHUV, Lausanne',
    statut: 'a-venir',
    questionsEnAttente: 4,
    piecesAEmporter: 2,
  },
  {
    id: 'rv2',
    intervenant: 'Réseau école',
    fonction: 'Point de situation',
    date: '12 juin 2026',
    lieu: 'École La Combe',
    statut: 'passe',
  },
]

export const questionsRdv = [
  { id: 'q1', texte: 'Faut-il adapter le traitement avant la rentrée ?', ajoutee: 'ajoutée le 3 août', faite: false },
  { id: 'q2', texte: 'Un bilan est-il utile pour le dossier AI ?', ajoutee: 'ajoutée le 5 août', faite: false },
  { id: 'q3', texte: 'Comment gérer les périodes de transition ?', ajoutee: 'ajoutée le 9 août', faite: false },
  { id: 'q4', texte: 'Peut-on avoir un certificat pour les transports ?', ajoutee: 'ajoutée le 11 août', faite: false },
]

export const piecesAEmporter = [
  { id: 'p1', texte: 'Décision AI du 13.08.2026', lie: true },
  { id: 'p2', texte: 'Rapport pédopsychiatrique 04.2026', lie: true },
  { id: 'p3', texte: 'Carte d’assurance', lie: false },
]

// Portrait : sept sections à la première personne.
export type SectionPortrait = {
  id: string
  intitule: string
  texte: string | null
}

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
  {
    id: 'pt7',
    intitule: 'Mon histoire',
    texte: null,
  },
]

export type Acces = {
  id: string
  nom: string
  role: string
  peutVoir: string
  depuis: string
  jusqua: string
  dossier: string
}

export const accesNoah: Acces[] = [
  {
    id: 'a1',
    nom: 'Sandrine Perret',
    role: 'Titulaire',
    peutVoir: 'L’ensemble du dossier, y compris le volet financier',
    depuis: 'mars 2024',
    jusqua: 'sans limite',
    dossier: 'noah',
  },
  {
    id: 'a2',
    nom: 'Julien Perret',
    role: 'Parent',
    peutVoir: 'Tout le dossier, sauf le volet financier',
    depuis: 'mars 2024',
    jusqua: 'sans limite',
    dossier: 'noah',
  },
  {
    id: 'a3',
    nom: 'Mme Reber',
    role: 'Professionnel',
    peutVoir: 'Le portrait seulement',
    depuis: 'septembre 2025',
    jusqua: '30 juin 2027',
    dossier: 'noah',
  },
]

export const derniereActivite = [
  { id: 'act1', texte: 'Décision AI ajoutée au coffre', auteur: 'Sandrine Perret', date: 'hier, 18h12' },
  { id: 'act2', texte: 'Question notée pour le rendez-vous du 22 septembre', auteur: 'Sandrine Perret', date: 'il y a 3 jours' },
  { id: 'act3', texte: 'Accès du portrait accordé à Mme Reber', auteur: 'Sandrine Perret', date: 'il y a 1 semaine' },
]

// Démarches
export type Demarche = {
  id: string
  titre: string
  canton: string
  situation: string
  etapesFaites: number
  etapesTotal: number
  prochaineAction: string
  prochaineDate: string
  dossier: string
}

export const demarches: Demarche[] = [
  {
    id: 'transition',
    titre: 'Transition à la majorité',
    canton: 'VD',
    situation: 'Noah aura 18 ans le 4 mars 2028. Plusieurs sujets se préparent en amont.',
    etapesFaites: 3,
    etapesTotal: 7,
    prochaineAction: 'Déposer la demande à la justice de paix',
    prochaineDate: 'vers septembre 2027',
    dossier: 'noah',
  },
  {
    id: 'api',
    titre: 'Renouvellement API',
    canton: 'VD',
    situation: 'L’allocation pour impotent doit être réexaminée par l’office AI.',
    etapesFaites: 1,
    etapesTotal: 4,
    prochaineAction: 'Renvoyer le questionnaire API',
    prochaineDate: 'avant le 3 octobre 2026',
    dossier: 'noah',
  },
]

export const demarchesSuggerees = [
  'Prestations complémentaires pour familles',
  'Aide au placement en atelier protégé',
]
