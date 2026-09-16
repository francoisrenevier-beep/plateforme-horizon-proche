// Parcours de la catégorie « Adulte » — canton de Vaud.
//
// PROVISOIRES : étapes plausibles, appuyées sur le droit fédéral (CC, LAI, LPC, LPGA) et sur
// l'organisation vaudoise telle que connue (justice de paix, DCISH, agences d'assurances
// sociales, OVAM). Rien n'a été relu contre sa source ; les dénominations, délais et
// formulaires sont marqués [À VÉRIFIER] ou [À COMPLÉTER] dans le texte.

import type { Parcours } from './types'
import { AVERTISSEMENT_PROVISOIRE, CC, LAI, LPC, MEMENTO, VD, src } from './sources'

// ---------------------------------------------------------------------------
// Demander une curatelle
// ---------------------------------------------------------------------------

export const curatelle: Parcours = {
  id: 'curatelle',
  titre: 'Demander une curatelle pour un proche',
  positionnement: 'Pour les proches d’un adulte qui n’arrive plus à gérer seul ses affaires ou sa personne',
  categorie: 'adulte',
  canton: 'Vaud',
  autorite: 'Justice de paix du district',
  delaiRealiste: { texte: 'Environ 6 mois', statut: 'a-verifier' },
  icone: 'scale',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'Une curatelle est une mesure de protection décidée par la justice de paix, quand un adulte ne peut plus, en tout ou en partie, s’occuper de ses affaires et qu’aucune autre solution ne suffit. Elle n’est jamais automatique et jamais la seule option : ce parcours commence par la question de savoir si elle est nécessaire, puis suit la demande, l’instruction, la décision et ce qui vient après.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'avant',
      titre: 'Avant de demander',
      sousTitre: 'Est-ce vraiment une curatelle qu’il faut ?',
      etapes: [
        {
          id: 'alternatives',
          titre: 'Poser la question des alternatives',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Le droit de la protection de l’adulte donne la priorité aux solutions les moins contraignantes. Une procuration bancaire, un mandat pour cause d’inaptitude rédigé pendant que la personne peut encore décider, la représentation par le conjoint ou le partenaire pour les actes courants, la représentation dans le domaine médical par les proches : chacune peut suffire selon la situation. La curatelle vient quand ces solutions manquent ou ne suffisent pas.',
          aFaire: [
            'Écrire ce qui pose concrètement problème aujourd’hui : factures, décisions médicales, logement, contrats.',
            'Vérifier si un mandat pour cause d’inaptitude ou une procuration existe déjà.',
            'Demander conseil (Pro Infirmis, Pro Senectute, service social, avocat·e) avant de décider.',
          ],
          questionOuverte: true,
          contacts: [
            { nom: 'Pro Senectute Vaud', role: 'Conseil social pour les personnes âgées et leurs proches', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } },
            { nom: 'Pro Infirmis Vaud', role: 'Conseil social pour les personnes en situation de handicap', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } },
          ],
          lienInterne: { libelle: 'Parcours directives anticipées et mandat', href: '/parcours/directives-mandat' },
          genereJalon: false,
          sources: [CC('360 ss', 'mandat pour cause d’inaptitude'), CC('374 ss', 'représentation par le conjoint ou le partenaire'), CC('378', 'représentation dans le domaine médical'), CC('389', 'subsidiarité et proportionnalité des mesures')],
        },
      ],
    },
    {
      id: 'demande',
      titre: 'La demande',
      sousTitre: 'Signaler la situation à la justice de paix',
      etapes: [
        {
          id: 'signalement',
          titre: 'Écrire à la justice de paix',
          moisParRapportAuRepere: 1,
          quand: 'Quand la question est tranchée',
          pourquoi:
            'Toute personne peut signaler à l’autorité de protection de l’adulte qu’une personne semble avoir besoin d’aide. Dans le canton de Vaud, c’est la justice de paix du district de domicile de la personne concernée. Un courrier simple suffit ; ce qui compte est la description des faits, pas le vocabulaire juridique.',
          aFaire: [
            'Trouver la justice de paix compétente pour le domicile de la personne.',
            'Écrire un courrier qui décrit la situation, les difficultés observées, ce qui a déjà été tenté, et ce que vous demandez.',
            'Joindre un certificat médical récent si vous en avez un ; sinon, dire quel médecin suit la personne.',
            'Garder une copie datée et l’ajouter au coffre.',
          ],
          contacts: [{ nom: 'Justice de paix du district', role: 'Autorité de protection de l’adulte', lien: { libelle: 'vd.ch — justices de paix', url: 'https://www.vd.ch/justice' } }],
          pieces: ['Courrier de signalement', 'Certificat médical récent, si disponible', 'Copie d’une pièce d’identité de la personne concernée [À VÉRIFIER : nécessaire ?]'],
          lienInterne: { libelle: 'Ajouter le courrier', href: '/documents' },
          genereJalon: true,
          sources: [CC('443', 'droit et devoir d’aviser l’autorité'), CC('442', 'compétence de l’autorité du domicile')],
        },
        {
          id: 'proposer-curateur',
          titre: 'Dire qui pourrait être curateur ou curatrice',
          moisParRapportAuRepere: 1,
          quand: 'Dans le même courrier ou peu après',
          pourquoi:
            'La justice de paix nomme une personne apte, qui peut être un proche. Elle tient compte des souhaits de la personne concernée et de ses proches. Si aucun proche ne peut ou ne veut, un curateur professionnel est désigné [À VÉRIFIER : Office des curatelles et tutelles professionnelles, OCTP]. Un proche curateur reçoit de l’aide et une rémunération est possible [À VÉRIFIER].',
          aFaire: ['Demander à la personne concernée qui elle souhaiterait.', 'Si un proche se propose, l’écrire à la justice de paix avec ses coordonnées.', 'Se renseigner sur ce que la fonction implique : rapports, comptes, temps.'],
          pointsAttention: ['Une curatelle n’est pas une prise de pouvoir : le curateur agit dans l’intérêt de la personne et lui rend compte, autant que possible.'],
          genereJalon: false,
          sources: [CC('400', 'nomination du curateur'), CC('401', 'souhaits de la personne concernée et des proches'), src('Office des curatelles et tutelles professionnelles (OCTP), canton de Vaud [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'instruction',
      titre: 'L’instruction',
      sousTitre: 'Audition, expertise, décision',
      etapes: [
        {
          id: 'audition',
          titre: 'Préparer l’audition',
          moisParRapportAuRepere: 3,
          quand: 'À réception de la convocation',
          pourquoi:
            'La personne concernée est entendue personnellement par la justice de paix, sauf si c’est impossible. Les proches peuvent être entendus aussi. L’autorité peut ordonner une expertise médicale et une enquête sociale. C’est le moment de dire ce que la personne souhaite et ce dont elle a réellement besoin.',
          aFaire: ['Noter la date de convocation dans le dossier et préparer ce que vous voulez dire : faits, besoins, souhaits de la personne.', 'Accompagner la personne si elle le souhaite.'],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          genereJalon: true,
          sources: [CC('447', 'audition de la personne concernée'), CC('446', 'établissement des faits, expertise')],
        },
        {
          id: 'type-curatelle',
          titre: 'Comprendre le type de curatelle proposé',
          moisParRapportAuRepere: 4,
          quand: 'Pendant l’instruction',
          pourquoi:
            'Il n’y a pas une curatelle mais plusieurs, adaptées au besoin : d’accompagnement (aide sans pouvoir de représentation), de représentation (le curateur agit pour la personne dans certains domaines), de gestion (du patrimoine), de coopération (certains actes exigent le consentement du curateur), ou de portée générale (tous les domaines, exceptionnelle). La justice de paix choisit la mesure sur mesure, la moins lourde possible.',
          aFaire: ['Demander à la justice de paix quel type et quels domaines sont envisagés, et dire ce qui vous semble juste ou excessif.'],
          genereJalon: false,
          sources: [CC('393', 'curatelle d’accompagnement'), CC('394', 'curatelle de représentation'), CC('395', 'gestion du patrimoine'), CC('396', 'curatelle de coopération'), CC('398', 'curatelle de portée générale')],
        },
      ],
    },
    {
      id: 'apres-decision',
      titre: 'Après la décision',
      sousTitre: 'Lire, contester si besoin, exercer la mesure',
      etapes: [
        {
          id: 'lire-decision',
          titre: 'Lire la décision et son délai de recours',
          moisParRapportAuRepere: 6,
          quand: 'À réception de la décision',
          pourquoi:
            'La décision indique le type de curatelle, les domaines couverts et le nom du curateur. Elle peut être contestée dans un délai de recours [À VÉRIFIER : 30 jours dès la notification] par la personne concernée, ses proches, ou toute personne qui a un intérêt juridique. Ce délai est un délai légal : notez-le tel quel.',
          aFaire: ['Ranger la décision dans le coffre et noter le délai de recours comme délai légal.', 'Vérifier que les domaines couverts correspondent au besoin, ni plus ni moins.'],
          lienInterne: { libelle: 'Ajouter la décision', href: '/documents' },
          genereJalon: false,
          sources: [CC('450', 'recours contre les décisions de l’autorité'), CC('450b', 'délai de recours — 30 jours [À VÉRIFIER]')],
        },
        {
          id: 'inventaire',
          titre: 'Dresser l’inventaire d’entrée',
          moisParRapportAuRepere: 7,
          quand: 'Dès la prise de fonction du curateur',
          pourquoi:
            'Quand la curatelle porte sur la gestion du patrimoine, le curateur établit avec l’autorité un inventaire des biens au début de la mesure. C’est la base de tous les comptes futurs ; un inventaire incomplet se paie pendant des années.',
          aFaire: ['Réunir les relevés bancaires, polices d’assurance, titres de propriété, dettes et revenus.', 'Demander à la justice de paix le formulaire d’inventaire et la date à laquelle il est attendu [À COMPLÉTER].'],
          concerne: 'Seulement si la curatelle comprend la gestion du patrimoine',
          pieces: ['Relevés de comptes', 'Polices d’assurance', 'Contrats en cours (bail, abonnements)', 'Décisions de rentes et de prestations'],
          genereJalon: true,
          sources: [CC('405', 'inventaire à l’entrée en fonction')],
        },
        {
          id: 'rapports-comptes',
          titre: 'Prévoir les rapports et les comptes périodiques',
          moisParRapportAuRepere: null,
          quand: 'Selon le rythme fixé par la justice de paix',
          pourquoi:
            'Le curateur rend compte à la justice de paix : rapport sur la situation de la personne et, s’il gère le patrimoine, comptes périodiques [À VÉRIFIER : au moins tous les deux ans]. Tenir les pièces au fil de l’eau rend l’exercice simple ; le faire d’un coup est pénible.',
          aFaire: ['Noter dans le dossier la date du premier rapport dès qu’elle est communiquée.', 'Classer justificatifs et relevés au fur et à mesure dans le coffre.'],
          concerne: 'Seulement si vous êtes vous-même curateur ou curatrice',
          genereJalon: false,
          sources: [CC('410', 'comptes'), CC('411', 'rapport périodique')],
        },
        {
          id: 'reexamen',
          titre: 'Savoir que la mesure peut évoluer',
          moisParRapportAuRepere: null,
          quand: 'Quand la situation change',
          pourquoi:
            'Une curatelle n’est pas définitive : elle peut être allégée, renforcée ou levée si la situation de la personne change. La personne concernée ou un proche peut le demander en tout temps.',
          aFaire: ['Écrire à la justice de paix si la mesure ne correspond plus au besoin.'],
          genereJalon: false,
          sources: [CC('414', 'modification des circonstances'), CC('399', 'fin de la curatelle')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Guide social romand — protection de l’adulte', texte: 'Présentation des mesures de protection et des démarches.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
    { titre: 'Justice de paix — État de Vaud', texte: 'Compétences et coordonnées des justices de paix par district.', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } },
  ],
}

// ---------------------------------------------------------------------------
// Entrée en institution pour adulte (handicap)
// ---------------------------------------------------------------------------

export const hebergementAdulte: Parcours = {
  id: 'hebergement-adulte',
  titre: 'Trouver une place en institution pour un adulte en situation de handicap',
  positionnement: 'Pour les proches d’un adulte qui a besoin d’un hébergement, d’un centre de jour ou d’un atelier',
  categorie: 'adulte',
  canton: 'Vaud',
  autorite: 'DCISH (Pro Infirmis Vaud), DGCS',
  delaiRealiste: { texte: 'Souvent plus d’un an d’attente', statut: 'a-verifier' },
  icone: 'building',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'Dans le canton de Vaud, l’accès aux établissements socio-éducatifs pour adultes (hébergement, centre de jour, atelier, logement accompagné) passe par le Dispositif cantonal d’indication et de suivi pour personnes en situation de handicap (DCISH). Les places manquent et l’attente se compte en mois, parfois en années : ce parcours aide à s’inscrire tôt, à tenir pendant l’attente et à préparer l’entrée, y compris son financement.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'projet',
      titre: 'Clarifier le projet',
      sousTitre: 'Quel lieu, pour quelle vie',
      etapes: [
        {
          id: 'type-de-lieu',
          titre: 'Nommer le type de lieu recherché',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Hébergement à l’année, centre de jour, atelier, logement accompagné avec passages à domicile : ce sont des prestations différentes, parfois combinées, avec des listes d’attente distinctes. Le DCISH évalue le besoin, mais il vous aidera d’autant mieux que vous savez décrire ce que vous cherchez — et ce que la personne concernée souhaite.',
          aFaire: ['Écrire, avec la personne concernée, ce qu’elle souhaite : où vivre, quoi faire en journée, quel niveau d’accompagnement.', 'Demander conseil à Pro Infirmis Vaud sur les prestations existantes.'],
          contacts: [{ nom: 'Pro Infirmis Vaud', role: 'Conseil et orientation', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } }],
          genereJalon: true,
          sources: [MEMENTO],
        },
        {
          id: 'visiter',
          titre: 'Visiter des établissements',
          moisParRapportAuRepere: 1,
          quand: 'Avant ou pendant l’inscription',
          pourquoi:
            'Chaque établissement a son projet, son public, son rythme. Une visite avec la personne concernée permet d’exprimer une préférence au DCISH et d’éviter une orientation qui ne conviendrait pas.',
          aFaire: ['Demander une visite dans deux ou trois établissements qui correspondent au projet.', 'Noter vos impressions et celles de la personne concernée dans le dossier.'],
          lienInterne: { libelle: 'Préparer les questions', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'inscription',
      titre: 'L’inscription au DCISH',
      sousTitre: 'Le dossier, l’évaluation, la liste d’attente',
      etapes: [
        {
          id: 'formulaire-dcish',
          titre: 'Remplir le formulaire d’accès à un établissement socio-éducatif',
          moisParRapportAuRepere: 1,
          quand: 'Dès que le projet est clair',
          pourquoi:
            'Le formulaire d’accès, géré par Pro Infirmis Vaud pour le DCISH, ouvre la procédure. Conditions : domicile dans le canton de Vaud, 16 ans révolus, déficience intellectuelle, physique, sensorielle ou polyhandicap [À VÉRIFIER : autres situations, notamment psychique]. Sans inscription, aucune place ne peut être attribuée.',
          aFaire: ['Télécharger et remplir le formulaire avec la personne concernée.', 'Joindre les rapports récents et la décision AI.', 'Garder une copie datée et l’accusé de réception dans le coffre.'],
          contacts: [{ nom: 'DCISH — Pro Infirmis Vaud', role: 'Indication et suivi', lien: { libelle: 'proinfirmis.ch — DCISH', url: 'https://www.proinfirmis.ch/' } }],
          pieces: ['Formulaire d’accès à un établissement socio-éducatif', 'Rapports médicaux et éducatifs récents', 'Décision AI (rente, allocation pour impotent)', 'Attestation de domicile'],
          genereJalon: true,
          sources: [MEMENTO],
        },
        {
          id: 'evaluation',
          titre: 'Participer à l’évaluation des besoins',
          moisParRapportAuRepere: 3,
          quand: 'À la convocation du DCISH',
          pourquoi:
            'Le DCISH rencontre la personne et ses proches pour évaluer les besoins et formuler une indication : le type de prestation adapté, et son degré d’urgence. C’est cette indication qui détermine sur quelle liste et à quel rang la demande sera placée.',
          aFaire: ['Préparer l’entretien : besoins au quotidien, ce qui fonctionne à la maison, ce qui ne tient plus.', 'Apporter le portrait de la personne si vous l’avez rédigé.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [MEMENTO],
        },
        {
          id: 'attente',
          titre: 'Pendant l’attente, tenir le dossier vivant',
          moisParRapportAuRepere: 6,
          quand: 'Tous les trois mois',
          pourquoi:
            'L’attente peut être longue. Signaler que le besoin persiste et annoncer tout changement (épuisement du proche, aggravation, perte du logement) permet au DCISH de réévaluer l’urgence. Des solutions transitoires existent : accueil de jour, court séjour, relève à domicile.',
          aFaire: ['Reprendre contact avec le DCISH et noter la réponse dans le dossier.', 'Demander un court séjour ou une relève si la situation à la maison se dégrade.'],
          contacts: [{ nom: 'Espace Proches', role: 'Orientation vers les relèves et courts séjours', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } }],
          genereJalon: true,
          sources: [MEMENTO],
        },
      ],
    },
    {
      id: 'financement',
      titre: 'Le financement',
      sousTitre: 'Qui paie quoi, et ce qu’il faut demander',
      etapes: [
        {
          id: 'pc-hebergement',
          titre: 'Demander les prestations complémentaires pour l’hébergement',
          moisParRapportAuRepere: 9,
          quand: 'Dès qu’une place est annoncée, avant l’entrée',
          pourquoi:
            'Le prix de l’hébergement dépasse presque toujours la rente AI. Les prestations complémentaires (PC) couvrent la différence jusqu’à un plafond, selon la taxe journalière reconnue et un montant pour dépenses personnelles [À VÉRIFIER : montants cantonaux]. Le canton subventionne le reste pour les établissements reconnus [À VÉRIFIER : loi vaudoise sur les mesures d’aide et d’intégration pour personnes handicapées, LAIH].',
          aFaire: ['Déposer la demande de PC auprès de l’agence d’assurances sociales de la commune [À VÉRIFIER : guichet compétent], en précisant la date d’entrée prévue.', 'Demander à l’établissement une attestation du prix de pension.'],
          contacts: [{ nom: 'Agence d’assurances sociales (AAS) de la commune', role: 'Dépôt des demandes de PC [À VÉRIFIER]' }],
          pieces: ['Décision de rente AI', 'Attestation du prix de pension', 'Relevés de fortune et de revenus', 'Police d’assurance maladie'],
          lienInterne: { libelle: 'Parcours prestations complémentaires', href: '/parcours/pc-subsides' },
          genereJalon: true,
          sources: [LPC('10', 'dépenses reconnues — séjour en home'), src('Loi vaudoise sur les mesures d’aide et d’intégration pour personnes handicapées (LAIH) [À VÉRIFIER]'), MEMENTO],
        },
        {
          id: 'api-institution',
          titre: 'Annoncer l’entrée à l’office AI',
          moisParRapportAuRepere: 10,
          quand: 'Avant l’entrée',
          pourquoi:
            'L’allocation pour impotent est réduite quand la personne séjourne dans une institution aux frais de la collectivité [À VÉRIFIER : règle exacte]. Ne pas l’annoncer expose à devoir rembourser.',
          aFaire: ['Écrire à l’office AI la date d’entrée et le nom de l’établissement.'],
          concerne: 'Seulement si la personne reçoit une allocation pour impotent',
          genereJalon: true,
          sources: [LAI('42 al. 5', 'allocation pour impotent en cas de séjour en institution [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'entree',
      titre: 'L’entrée et après',
      sousTitre: 'Le contrat, la transmission, le suivi',
      etapes: [
        {
          id: 'contrat',
          titre: 'Lire et signer le contrat d’hébergement',
          moisParRapportAuRepere: 11,
          quand: 'Avant le premier jour',
          pourquoi:
            'Le contrat fixe les prestations, le prix, les modalités de résiliation, la gestion de l’argent personnel, les assurances. Si la personne a un curateur, c’est lui qui signe pour les domaines couverts.',
          aFaire: ['Lire le contrat ; noter les délais de résiliation et les frais non compris.', 'Vérifier l’assurance maladie (elle reste due), la responsabilité civile et la gestion de l’argent de poche.'],
          pieces: ['Contrat d’hébergement', 'Police d’assurance maladie', 'Attestation d’assurance responsabilité civile'],
          genereJalon: true,
          sources: [src('Pas de source légale spécifique — contrat de droit privé')],
        },
        {
          id: 'transmettre',
          titre: 'Transmettre ce qui aide la personne',
          moisParRapportAuRepere: 11,
          quand: 'Avant le premier jour',
          pourquoi:
            'Une nouvelle équipe découvrira la personne. Le portrait à la première personne — comment je communique, ce qui me rassure, ce qui me met en difficulté — lui donne d’emblée ce que vous savez. Le projet d’accompagnement individualisé se construira ensuite avec elle.',
          aFaire: ['Mettre le portrait à jour et le remettre au référent.', 'Ajouter le référent aux intervenants du dossier.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [src('Pratique du portrait (CLAUDE.md §2.3) — pas de source légale')],
        },
        {
          id: 'suivi',
          titre: 'Installer le suivi',
          moisParRapportAuRepere: 14,
          quand: 'Dans les trois mois qui suivent l’entrée',
          pourquoi:
            'Un premier bilan permet d’ajuster l’accompagnement. En cas de désaccord persistant avec l’établissement, la Permanence d’orientation Patients / Résidents du canton peut être saisie.',
          aFaire: ['Demander un bilan de réseau.', 'En cas de difficulté non résolue : contacter la Permanence d’orientation Patients / Résidents (021 316 09 87).'],
          contacts: [{ nom: 'Permanence d’orientation Patients / Résidents', role: 'Insatisfaction, problèmes, litiges', lien: { libelle: 'vd.ch — plaintes santé-social', url: 'https://www.vd.ch/plaintes-sante-social' } }],
          genereJalon: true,
          sources: [VD('plaintes santé-social', 'https://www.vd.ch/plaintes-sante-social')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Pro Infirmis Vaud — DCISH', texte: 'Formulaire d’accès et informations sur le dispositif.', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } },
    { titre: 'Info handicap', texte: 'Logement et vie en institution.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Prestations complémentaires et subsides
// ---------------------------------------------------------------------------

export const pcSubsides: Parcours = {
  id: 'pc-subsides',
  titre: 'Obtenir les prestations complémentaires et les subsides',
  positionnement: 'Pour les proches d’une personne dont la rente AI ou AVS ne couvre pas les besoins',
  categorie: 'adulte',
  canton: 'Vaud',
  autorite: 'Caisse cantonale AVS, OVAM',
  delaiRealiste: { texte: '2 à 4 mois pour une décision', statut: 'a-verifier' },
  icone: 'coins',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'Les prestations complémentaires (PC) à l’AVS et à l’AI complètent une rente insuffisante pour couvrir les besoins vitaux ; elles ouvrent aussi le remboursement de frais de maladie et d’invalidité, et le subside à l’assurance maladie. Elles ne sont jamais versées pour la période antérieure à la demande [À VÉRIFIER] : déposer tôt compte. Ce parcours couvre la vérification du droit, la demande, la décision et les obligations qui suivent.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'verifier',
      titre: 'Vérifier le droit',
      sousTitre: 'PC, PC Familles, subside : de quoi parle-t-on',
      etapes: [
        {
          id: 'conditions',
          titre: 'Vérifier les conditions',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Les PC s’adressent aux personnes qui reçoivent une rente AVS ou AI, ou une allocation pour impotent, ou des indemnités journalières AI depuis six mois [À VÉRIFIER], domiciliées en Suisse, et dont les revenus ne couvrent pas les dépenses reconnues. La fortune compte, avec un seuil d’entrée [À VÉRIFIER : montants]. Le canton de Vaud connaît en plus des PC Familles pour les familles qui travaillent avec de bas revenus [À VÉRIFIER].',
          aFaire: ['Faire une estimation avec l’outil en ligne de la caisse de compensation ou avec Pro Senectute / Pro Infirmis.', 'Noter les documents qui manquent pour l’estimation.'],
          contacts: [
            { nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'PC AVS/AI', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } },
            { nom: 'Pro Senectute Vaud', role: 'Aide à la demande pour les personnes âgées', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } },
          ],
          genereJalon: false,
          sources: [LPC('4', 'conditions générales'), LPC('9a', 'seuils de fortune [À VÉRIFIER]'), src('Loi vaudoise sur les prestations complémentaires cantonales pour familles (LPCFam) [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'demander',
      titre: 'Déposer la demande',
      sousTitre: 'Un dossier complet, déposé tôt',
      etapes: [
        {
          id: 'pieces',
          titre: 'Réunir les pièces',
          moisParRapportAuRepere: 0,
          quand: 'Avant le dépôt',
          pourquoi:
            'La demande de PC exige un portrait complet de la situation financière : revenus, fortune, loyer, primes, rentes. Un dossier incomplet est retourné et la date de dépôt peut être discutée.',
          aFaire: ['Rassembler les pièces de la liste ci-dessous et les ranger dans le coffre.'],
          pieces: ['Décisions de rentes (AVS, AI, LPP, étrangères)', 'Relevés bancaires et postaux au 31 décembre', 'Contrat de bail et dernier décompte de charges', 'Police d’assurance maladie', 'Dernière déclaration d’impôts et décision de taxation', 'Attestation de domicile', 'Pour un séjour en home : attestation du prix de pension'],
          lienInterne: { libelle: 'Ouvrir le coffre', href: '/documents' },
          genereJalon: true,
          sources: [src('Pratique des caisses de compensation — liste de pièces [À VÉRIFIER]')],
        },
        {
          id: 'deposer',
          titre: 'Déposer la demande',
          moisParRapportAuRepere: 1,
          quand: 'Dès que les pièces sont réunies',
          pourquoi:
            'Dans le canton de Vaud, la demande de PC se dépose auprès de l’agence d’assurances sociales de la commune de domicile [À VÉRIFIER : guichet compétent, centres régionaux]. Le droit naît au plus tôt le mois du dépôt : chaque mois de retard est perdu.',
          aFaire: ['Remplir le formulaire de demande avec l’agence ou un service social.', 'Garder une copie datée et l’accusé de réception.'],
          contacts: [{ nom: 'Agence d’assurances sociales (AAS) de la commune', role: 'Dépôt de la demande [À VÉRIFIER]' }],
          pointsAttention: ['Déposez même si un document manque : la date de dépôt est protégée et la caisse réclamera le reste.'],
          genereJalon: true,
          sources: [LPC('12', 'naissance du droit — dès le mois du dépôt [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'decision',
      titre: 'La décision et ses suites',
      sousTitre: 'Lire, contester, compléter',
      etapes: [
        {
          id: 'lire-decision',
          titre: 'Lire la décision et son délai d’opposition',
          moisParRapportAuRepere: 3,
          quand: 'À réception',
          pourquoi:
            'La décision détaille le calcul : dépenses reconnues, revenus déterminants, montant mensuel. Elle peut être contestée par opposition dans un délai indiqué [À VÉRIFIER : 30 jours]. C’est un délai légal, à noter tel quel. Beaucoup d’erreurs viennent d’une pièce oubliée : relisez le calcul ligne par ligne.',
          aFaire: ['Ranger la décision dans le coffre et noter le délai d’opposition comme délai légal.', 'Vérifier chaque ligne du calcul ; en cas de doute, demander conseil avant la fin du délai.'],
          lienInterne: { libelle: 'Ajouter la décision', href: '/documents' },
          genereJalon: false,
          sources: [src('LPGA, art. 52 — opposition, délai de 30 jours [À VÉRIFIER]')],
        },
        {
          id: 'subside',
          titre: 'Vérifier le subside à l’assurance maladie',
          moisParRapportAuRepere: 3,
          quand: 'Après la décision de PC',
          pourquoi:
            'Une personne au bénéfice des PC reçoit un subside couvrant sa prime d’assurance maladie jusqu’à la prime de référence [À VÉRIFIER : montant et automaticité]. Dans le canton de Vaud, le subside est géré par l’Office vaudois de l’assurance-maladie (OVAM). Il peut aussi être demandé sans PC, selon le revenu.',
          aFaire: ['Vérifier que le subside apparaît sur la facture de primes ; sinon, contacter l’OVAM.', 'Sans PC, demander le subside à l’OVAM selon votre revenu.'],
          contacts: [{ nom: 'Office vaudois de l’assurance-maladie (OVAM)', role: 'Subsides à l’assurance maladie', lien: { libelle: 'vd.ch — subsides', url: 'https://www.vd.ch/themes/sante-soins-et-handicap/assurance-maladie/subsides' } }],
          genereJalon: true,
          sources: [VD('subsides à l’assurance maladie', 'https://www.vd.ch/themes/sante-soins-et-handicap/assurance-maladie/subsides'), src('LAMal, art. 65 — réduction des primes')],
        },
        {
          id: 'frais-maladie',
          titre: 'Faire rembourser les frais de maladie et d’invalidité',
          moisParRapportAuRepere: 4,
          quand: 'Au fil des factures',
          pourquoi:
            'Les bénéficiaires de PC peuvent obtenir le remboursement de frais que l’assurance maladie ne couvre pas : franchise et quote-part, soins dentaires, aide à domicile, moyens auxiliaires, régime alimentaire, transports [À VÉRIFIER : liste cantonale et plafonds]. Les demandes se font dans un délai après la facture [À VÉRIFIER : 15 mois].',
          aFaire: ['Envoyer les factures concernées à la caisse de compensation avec le formulaire de remboursement.', 'Garder une copie de chaque envoi.'],
          genereJalon: false,
          sources: [LPC('14', 'frais de maladie et d’invalidité'), src('Règlement vaudois sur les frais de maladie et d’invalidité [À VÉRIFIER]')],
        },
        {
          id: 'obligations',
          titre: 'Annoncer tout changement',
          moisParRapportAuRepere: null,
          quand: 'À chaque changement',
          pourquoi:
            'Revenus, fortune, loyer, situation familiale, entrée en home, séjour à l’étranger : tout changement doit être annoncé sans délai. Une PC versée à tort est réclamée, parfois des années après. La caisse révise aussi périodiquement le droit.',
          aFaire: ['Écrire à la caisse à chaque changement et garder la preuve.', 'Répondre aux révisions périodiques dans le délai indiqué (délai légal).'],
          genereJalon: false,
          sources: [src('LPGA, art. 31 — obligation d’annoncer'), LPC('25 ss', 'restitution [À VÉRIFIER]')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Caisse cantonale vaudoise de compensation AVS', texte: 'PC, formulaires, calculateur.', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } },
    { titre: 'Guide social romand — prestations complémentaires', texte: 'Explications par canton.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Adapter le logement et obtenir des moyens auxiliaires
// ---------------------------------------------------------------------------

export const logementMoyensAuxiliaires: Parcours = {
  id: 'logement-moyens-auxiliaires',
  titre: 'Adapter le logement et obtenir des moyens auxiliaires',
  positionnement: 'Pour les proches d’une personne qui a besoin d’équipements ou de travaux pour rester chez elle',
  categorie: 'adulte',
  canton: 'Vaud',
  autorite: 'Office AI (ou caisse AVS après la retraite)',
  delaiRealiste: { texte: '3 à 6 mois par demande', statut: 'a-verifier' },
  icone: 'accessibility',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'Fauteuil roulant, lit électrique, appareil auditif, monte-escalier, salle de bain adaptée : l’AI finance une liste de moyens auxiliaires et certaines adaptations du logement, à condition de demander avant d’acheter. Après l’âge de la retraite, la liste AVS est plus restreinte. Ce parcours aide à évaluer le besoin avec un professionnel, à déposer la demande au bon endroit et à compléter par d’autres sources de financement.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'evaluer',
      titre: 'Évaluer le besoin',
      sousTitre: 'Avec un professionnel, avant tout achat',
      etapes: [
        {
          id: 'ergotherapie',
          titre: 'Demander une évaluation par un·e ergothérapeute',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'L’ergothérapeute évalue la personne dans son logement et recommande les aides et les travaux utiles. Son rapport est la pièce centrale de la demande AI ou AVS. Sur prescription médicale, l’évaluation est prise en charge par l’assurance maladie [À VÉRIFIER].',
          aFaire: ['Demander une prescription d’ergothérapie au médecin traitant.', 'Prendre rendez-vous pour une visite à domicile et ranger le rapport dans le coffre.'],
          contacts: [{ nom: 'Ergothérapeute (CMS ou indépendant·e)', role: 'Évaluation du logement et des besoins' }],
          pieces: ['Prescription médicale d’ergothérapie', 'Rapport d’ergothérapie'],
          genereJalon: true,
          sources: [src('LAMal / OPAS — ergothérapie sur prescription [À VÉRIFIER]')],
        },
        {
          id: 'essayer',
          titre: 'Essayer avant de choisir',
          moisParRapportAuRepere: 1,
          quand: 'Avant la demande',
          pourquoi:
            'Un centre de moyens auxiliaires permet d’essayer fauteuils, lits, aides à la mobilité, et conseille sur les modèles reconnus par l’AI. Un achat précipité peut ne pas être remboursé.',
          aFaire: ['Prendre rendez-vous dans un centre de moyens auxiliaires [À VÉRIFIER : FSCMA, centre romand].', 'Demander un devis pour le modèle retenu.'],
          contacts: [{ nom: 'Centre de moyens auxiliaires (FSCMA)', role: 'Essai, conseil, devis', lien: { libelle: 'fscma.ch', url: 'https://www.fscma.ch/' } }],
          genereJalon: true,
          sources: [src('Fondation suisse pour les centres de moyens auxiliaires (FSCMA) [À VÉRIFIER : centre compétent pour Vaud]')],
        },
      ],
    },
    {
      id: 'demander',
      titre: 'Demander avant d’acheter',
      sousTitre: 'AI, AVS ou prestations complémentaires',
      etapes: [
        {
          id: 'demande-ai',
          titre: 'Déposer la demande de moyens auxiliaires',
          moisParRapportAuRepere: 2,
          quand: 'Avant tout achat ou travaux',
          pourquoi:
            'L’AI remet les moyens auxiliaires figurant sur sa liste et peut contribuer aux adaptations du logement rendues nécessaires par l’invalidité [À VÉRIFIER : positions de l’ordonnance sur les moyens auxiliaires, OMAI]. Après l’âge de la retraite, la liste AVS est plus courte et les adaptations du logement n’en font pas partie [À VÉRIFIER]. Dans les deux cas, une demande déposée après l’achat peut être refusée.',
          aFaire: ['Déposer la demande à l’office AI (avant la retraite) ou à la caisse de compensation AVS (après), avec le rapport d’ergothérapie et le devis.', 'Noter tout délai écrit sur les courriers comme délai légal.'],
          contacts: [
            { nom: 'Office AI pour le canton de Vaud', role: 'Moyens auxiliaires AI', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } },
            { nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'Moyens auxiliaires AVS', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } },
          ],
          pieces: ['Formulaire de demande', 'Rapport d’ergothérapie', 'Devis', 'Rapport médical récent'],
          pointsAttention: ['Une personne qui recevait déjà un moyen auxiliaire de l’AI avant la retraite conserve ce droit (garantie des droits acquis) [À VÉRIFIER].'],
          genereJalon: true,
          sources: [LAI('21', 'moyens auxiliaires'), src('Ordonnance concernant la remise de moyens auxiliaires par l’AI (OMAI) [À VÉRIFIER : positions]'), src('Ordonnance concernant la remise de moyens auxiliaires par l’AVS (OMAV) [À VÉRIFIER]')],
        },
        {
          id: 'complements',
          titre: 'Chercher les compléments de financement',
          moisParRapportAuRepere: 3,
          quand: 'Si l’AI ou l’AVS ne couvre pas tout',
          pourquoi:
            'Ce que l’AI ou l’AVS ne prend pas peut être demandé aux prestations complémentaires (frais d’invalidité), à des fondations (Pro Infirmis, Cerebral, fondations privées), parfois à la commune. Chacune a ses conditions ; la demande de PC suppose d’en être bénéficiaire.',
          aFaire: ['Si la personne reçoit des PC, demander le remboursement à la caisse de compensation.', 'Demander à Pro Infirmis Vaud une aide financière ou une orientation vers des fondations.'],
          contacts: [{ nom: 'Pro Infirmis Vaud', role: 'Aide financière et orientation', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } }],
          lienInterne: { libelle: 'Parcours prestations complémentaires', href: '/parcours/pc-subsides' },
          genereJalon: true,
          sources: [LPC('14', 'frais de maladie et d’invalidité — moyens auxiliaires [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'travaux',
      titre: 'Les travaux',
      sousTitre: 'Autorisations et exécution',
      etapes: [
        {
          id: 'proprietaire',
          titre: 'Obtenir l’accord du propriétaire',
          moisParRapportAuRepere: 3,
          quand: 'Avant de commencer',
          pourquoi:
            'Un locataire ne peut pas modifier le logement sans le consentement écrit du bailleur. Le bailleur peut exiger la remise en état au départ, sauf accord contraire : à négocier par écrit avant les travaux.',
          aFaire: ['Écrire au bailleur avec le rapport d’ergothérapie et le devis ; demander son accord écrit et régler la question de la remise en état.'],
          concerne: 'Seulement si la personne est locataire',
          pieces: ['Accord écrit du bailleur'],
          genereJalon: true,
          sources: [src('Code des obligations (CO), art. 260a — rénovations et modifications par le locataire')],
        },
        {
          id: 'executer',
          titre: 'Faire exécuter et réceptionner les travaux',
          moisParRapportAuRepere: 5,
          quand: 'Après la décision de prise en charge',
          pourquoi:
            'Attendre la décision écrite avant de commander évite de payer soi-même ce qui aurait été remboursé. À la réception, vérifier avec l’ergothérapeute que l’adaptation correspond au besoin.',
          aFaire: ['Commander une fois la décision reçue ; transmettre la facture à l’organe payeur.', 'Faire vérifier le résultat par l’ergothérapeute.'],
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'entretien',
          titre: 'Entretien, réparation, remplacement',
          moisParRapportAuRepere: null,
          quand: 'Au fil du temps',
          pourquoi:
            'L’AI prend en charge, sous conditions, les frais d’entretien et de réparation des moyens auxiliaires remis, et leur remplacement quand ils sont usés ou ne conviennent plus [À VÉRIFIER]. Là encore, la demande précède la dépense.',
          aFaire: ['Demander à l’office AI avant toute réparation importante ou remplacement.'],
          genereJalon: false,
          sources: [src('OMAI — frais d’entretien et de réparation [À VÉRIFIER]')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Office AI pour le canton de Vaud — moyens auxiliaires', texte: 'Liste, procédure et formulaires.', lien: { libelle: 'aivd.ch', url: 'https://aivd.ch/moyens-auxiliaires-plus-de-25-ans/' } },
    { titre: 'Info handicap — logement', texte: 'Adaptation du logement, financement, droit du bail.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
  ],
}
