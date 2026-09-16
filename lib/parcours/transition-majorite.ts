// Parcours « Préparer la majorité d'un enfant en situation de handicap » — canton de Vaud.
//
// Sources :
//  - « Memento handicap », Direction générale de la cohésion sociale (DGCS), canton de Vaud —
//    document de travail (non finalisé) remis en septembre 2026. Il décrit les prestations pour
//    adultes subventionnées par le canton : c'est la source de tout ce qui s'ouvre après 18 ans.
//    Ce qu'il en est tiré est consigné page par page dans `docs/sources/memento-handicap-dgcs.md`.
//    Les projets pilotes qu'il demande de ne pas encore mentionner (« Mon Plan », « Ma vie mon
//    appart ») sont volontairement absents d'ici.
//  - Droit fédéral pour la bascule juridique elle-même, que le memento ne couvre pas : Code civil
//    (CC), loi sur l'assurance-invalidité (LAI), loi sur les allocations familiales (LAFam), loi
//    sur l'assurance-maladie (LAMal). Références indiquées à titre d'orientation et marquées
//    « à vérifier » tant qu'une relecture juridique n'a pas été faite.
//
// Ton : on s'adresse à des parents qui ont des démarches compliquées et besoin de comprendre.
// Chaque étape dit en clair ce qu'elle signifie pour eux, ce qu'ils vont recevoir, et vers qui
// se tourner si rien n'avance. Rien d'inventé : ce qui n'est pas confirmé est écrit
// [À VÉRIFIER] ou [À COMPLÉTER].

import type { Parcours, Source } from './types'
import { MEMENTO, src } from './sources'

// Le memento, avec la page d'où vient le fait.
const M = (page: string): Source => ({ ...MEMENTO, libelle: `${MEMENTO.libelle}, p. ${page}` })

const PERMANENCE = {
  nom: 'Permanence d’orientation Patients / Résidents',
  role: 'Difficulté avec un médecin, un professionnel, une institution — 021 316 09 87, orientation.doleances@vd.ch',
  lien: { libelle: 'vd.ch — plaintes santé-social', url: 'https://www.vd.ch/plaintes-sante-social' },
}

const ESPACE_PROCHES = {
  nom: 'Espace Proches',
  role: 'Écoute, information et orientation gratuites pour les proches aidants — 0800 660 660',
  lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' },
}

const PRO_INFIRMIS = {
  nom: 'Pro Infirmis Vaud',
  role: 'Conseil social gratuit pour les personnes en situation de handicap et leurs proches',
  lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' },
}

const SI_CA_BLOQUE_GENERAL =
  'Si vous n’obtenez pas de réponse ou si vous ne comprenez pas ce qu’on vous demande, Pro Infirmis Vaud vous conseille gratuitement, et Espace Proches (0800 660 660) vous oriente. Pour un litige avec un professionnel ou une institution : Permanence d’orientation Patients / Résidents, 021 316 09 87.'

export const transitionMajorite: Parcours = {
  id: 'transition-majorite',
  titre: 'Préparer la majorité d’un enfant en situation de handicap',
  positionnement: 'Pour les parents d’un·e jeune en situation de handicap qui approche de ses 18 ans',
  categorie: 'enfant',
  canton: 'Vaud',
  autorite: 'Justice de paix, office AI',
  // Ordre de grandeur : les démarches s'étalent de 16 à 18 ans ; la justice de paix seule
  // compte environ six mois (fiche « transition », non vérifiée).
  delaiRealiste: { texte: 'Environ 2 ans, à commencer vers 16 ans', statut: 'a-verifier' },
  icone: 'cake',
  statut: 'redige',
  publie: true,
  repere: 'majorite',
  resume:
    'À 18 ans, votre enfant devient juridiquement adulte. Rien ne se fait automatiquement : les prestations de l’enfance s’arrêtent ou se transforment, d’autres s’ouvrent, et la question de qui l’aide à décider doit être posée. Ce parcours met les étapes dans l’ordre, à partir de sa date de naissance, et explique chacune d’elles avec les mots de tous les jours.',
  enUnePage: {
    titre: 'Ce qui change à 18 ans, en une page',
    points: [
      'Le jour de ses 18 ans, votre enfant devient majeur. L’autorité parentale s’arrête ce jour-là : en droit, c’est lui qui décide pour sa santé, son argent, ses papiers — même si, dans les faits, il a besoin de vous.',
      'Rien ne se met en place tout seul. Ni mesure de protection, ni rente AI, ni prestations complémentaires : chacune se demande, et chacune prend des mois. C’est pour cela que ce parcours commence vers 16 ans.',
      'Certaines prestations de l’enfance s’arrêtent ou changent de règles à 18 ans : l’allocation pour impotent « mineur » devient une allocation « adulte » ; les allocations familiales ne continuent que sur justificatif ; le supplément pour soins intenses cesse [À VÉRIFIER].',
      'D’autres s’ouvrent : la rente AI (au plus tôt à 18 ans), les prestations complémentaires (dès 18 ans pour qui reçoit une allocation pour impotent de l’AI), la contribution d’assistance si votre enfant vit ou veut vivre dans son propre logement, et les prestations des établissements pour adultes — pour lesquelles on peut s’inscrire dès 16 ans révolus.',
      'Les courriers arrivent au nom de votre enfant, et les professionnels sont tenus au secret envers vous, sauf s’il vous y autorise ou si une mesure de protection le prévoit. C’est le point qui surprend le plus les familles.',
      'Vous n’êtes pas seuls : Espace Proches (0800 660 660, gratuit) et Pro Infirmis Vaud répondent aux familles ; pour tout litige avec une institution, la Permanence d’orientation Patients / Résidents (021 316 09 87).',
    ],
  },
  avertissement:
    'Ce parcours propose des moments, pas des obligations. Les seules dates opposables sont celles écrites sur les courriers que vous recevez : notez-les comme délais légaux. Les informations cantonales et légales restent à confirmer auprès de l’autorité concernée ; ce qui n’est pas confirmé est signalé dans le texte.',
  phases: [
    // -----------------------------------------------------------------------
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
          enClair:
            'L’allocation que vous touchez chaque mois pour votre enfant peut s’arrêter à 16 ans si vous ne faites rien. Un courrier à la caisse, avec un certificat médical, suffit souvent à la prolonger.',
          pourquoi:
            'L’allocation pour enfant est versée jusqu’à 16 ans. Pour un enfant qui ne peut pas exercer d’activité lucrative en raison d’une maladie ou d’un handicap, elle peut être prolongée jusqu’à 20 ans ; s’il est en formation, une allocation de formation prend le relais. Le versement ne se prolonge pas tout seul : la caisse a besoin d’un justificatif.',
          aFaire: [
            'Demander à la caisse d’allocations familiales (via l’employeur du parent qui les perçoit) quel justificatif elle attend pour prolonger le versement.',
            'Demander au médecin de votre enfant le certificat correspondant.',
            'Ranger la réponse écrite de la caisse dans le coffre et noter tout délai indiqué comme délai légal.',
          ],
          pieces: ['Certificat médical attestant l’incapacité d’exercer une activité lucrative [À VÉRIFIER : forme exacte attendue par la caisse]'],
          vousRecevrez: 'Une confirmation écrite de la caisse, avec la durée de la prolongation. Si elle refuse, la décision indique la voie de recours et son délai.',
          siCaBloque: 'Demandez à l’employeur le nom et le numéro de la caisse d’allocations familiales : c’est elle qui décide, pas l’employeur. Pro Infirmis Vaud peut relire la réponse avec vous.',
          genereJalon: true,
          sources: [src('Loi fédérale sur les allocations familiales (LAFam), art. 3 — prolongation jusqu’à 20 ans pour l’enfant incapable d’exercer une activité lucrative')],
        },
        {
          id: 'dcish-inscription',
          titre: 'S’inscrire au dispositif cantonal (DCISH) dès 16 ans révolus',
          moisParRapportAuRepere: -24,
          quand: 'Dès 16 ans révolus',
          enClair:
            'Dans le canton de Vaud, une seule porte donne accès aux établissements pour adultes — hébergement, centre de jour, atelier : le DCISH. On peut s’y inscrire dès 16 ans, et il vaut mieux le faire tôt, parce que les places sont rares. S’inscrire n’engage à rien.',
          pourquoi:
            'Le Dispositif cantonal d’indication et de suivi pour personnes en situation de handicap (DCISH) informe sur les offres existantes, évalue le besoin et oriente. Sans inscription, aucune place ne peut être attribuée. Conditions : être domicilié dans le canton de Vaud, avoir 16 ans révolus au moment de l’inscription, et présenter une déficience intellectuelle, physique ou sensorielle, ou un polyhandicap.',
          aFaire: [
            'Se renseigner sur les offres existantes auprès du DCISH.',
            'Remplir le formulaire d’accès à un établissement socio-éducatif, disponible chez Pro Infirmis Vaud.',
            'Garder une copie datée dans le coffre et noter l’accusé de réception.',
          ],
          contacts: [
            { nom: 'DCISH — canton de Vaud', role: 'Information, indication et suivi', lien: { libelle: 'vd.ch — contact DCISH', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/dcish-contact' } },
            { nom: 'Pro Infirmis Vaud', role: 'Formulaire d’accès à un établissement socio-éducatif', lien: { libelle: 'proinfirmis.ch — accès à un ESE', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/acces-a-un-etablissement-socio-educatif.html' } },
          ],
          pieces: ['Formulaire d’accès à un établissement socio-éducatif', 'Rapports médicaux et scolaires récents [À VÉRIFIER : pièces demandées par le formulaire]'],
          vousRecevrez: 'Un accusé de réception, puis un contact du DCISH pour évaluer le besoin de votre enfant et formuler une indication : quel type de prestation, et à quel degré d’urgence.',
          siCaBloque: 'Reprenez contact avec le DCISH tous les trois mois pour dire que le besoin persiste, et signalez tout changement. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: true,
          sources: [M('3'), M('4')],
        },
        {
          id: 'suite-scolarite',
          titre: 'Penser à la suite de l’école : formation, atelier, vie autonome',
          moisParRapportAuRepere: -24,
          quand: 'Dès 16 ans, avec le réseau école',
          enClair:
            'L’école spécialisée s’arrête un jour, et ce jour est connu à l’avance. Ce qui vient après — une formation soutenue par l’AI, un atelier, un centre de jour, une formation pour apprendre à vivre de façon autonome — se prépare deux ans avant, pas le mois d’avant.',
          pourquoi:
            'L’assurance-invalidité peut examiner des mesures d’ordre professionnel (orientation, formation professionnelle initiale). Le canton de Vaud subventionne par ailleurs des formations à la vie autonome, qui apprennent à gérer le quotidien, les démarches administratives et la participation à la société : le Service de formation à la vie autonome (SFVA) de Pro Infirmis Vaud, et certains établissements socio-éducatifs.',
          aFaire: [
            'Aborder la question de l’après-école lors du prochain point de situation avec l’enseignant·e référent·e, et demander par écrit la date de fin de scolarité.',
            'Demander à l’office AI si des mesures d’ordre professionnel peuvent être examinées, et à quel moment déposer la demande.',
            'Se renseigner sur le SFVA et, via le DCISH, sur les formations à l’autonomie proposées par les établissements.',
          ],
          contacts: [
            { nom: 'SFVA — Pro Infirmis Vaud', role: 'Service de formation à la vie autonome', lien: { libelle: 'proinfirmis.ch — SFVA', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/service-de-formation-a-la-vie-autonome-sfva.html' } },
            { nom: 'Office AI Vaud', role: 'Orientation professionnelle, formation professionnelle initiale', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } },
          ],
          pointsAttention: ['Âge limite de la pédagogie spécialisée dans le canton de Vaud : [À COMPLÉTER].'],
          vousRecevrez: 'De l’école : la date de fin de scolarité, par écrit. De l’office AI : un courrier qui ouvre l’instruction des mesures professionnelles, avec les pièces à fournir et une date de réponse (délai légal).',
          siCaBloque: 'Si l’école ne se prononce pas sur l’après, demandez une réunion de réseau consacrée à cette seule question. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: true,
          sources: [M('3'), src('Loi fédérale sur l’assurance-invalidité (LAI), art. 15 à 18 — mesures d’ordre professionnel')],
        },
        {
          id: 'portrait-a-jour',
          titre: 'Mettre le portrait à jour, avec votre enfant',
          moisParRapportAuRepere: null,
          quand: 'À tout moment, et avant chaque nouvel intervenant',
          enClair:
            'Dans deux ans, de nouvelles personnes vont s’occuper de votre enfant : gestionnaire AI, curateur ou curatrice peut-être, équipe d’un établissement. Le portrait leur dit en une page ce que vous savez depuis toujours. À 18 ans, il lui appartiendra.',
          pourquoi:
            'Le portrait « Bien m’accompagner » est écrit à la première personne. À sa majorité, votre enfant pourra le lire, le corriger et décider qui y a accès. Plus il y participe tôt, plus le document lui ressemble — et plus il sera utile aux nouveaux intervenants de la vie adulte.',
          aFaire: ['Relire les sept sections avec votre enfant, dans la mesure de ses possibilités.', 'Compléter les sections vides, même d’une phrase.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: false,
          sources: [{ libelle: 'Principe du produit (CLAUDE.md §2.3)', statut: 'verifiee' }],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'un-an-avant',
      titre: 'Environ un an avant',
      sousTitre: 'Évaluer les besoins et décider ensemble',
      etapes: [
        {
          id: 'bilan-medical',
          titre: 'Demander un rapport médical récent',
          moisParRapportAuRepere: -12,
          quand: 'Environ 12 mois avant les 18 ans',
          enClair:
            'Presque toutes les démarches de la majorité demandent le même document : un rapport médical récent qui décrit ce que votre enfant peut faire seul et l’aide dont il a besoin, heure par heure. Un seul bon rapport sert à tout ; un rapport de plus d’un an est souvent refusé.',
          pourquoi:
            'La rente AI, l’allocation pour impotent adulte et une éventuelle mesure de protection s’appuient sur un rapport médical qui décrit les limitations fonctionnelles et l’aide nécessaire au quotidien — pas seulement le diagnostic.',
          aFaire: [
            'Prendre rendez-vous avec le médecin qui suit votre enfant et lui expliquer à quoi servira le rapport.',
            'Demander que le rapport décrive concrètement une journée type et l’aide apportée.',
            'Ranger le rapport dans le coffre dès réception et en garder l’original.',
          ],
          pieces: ['Rapport médical récent (moins de 12 mois)'],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          vousRecevrez: 'Le rapport lui-même, en général sous quelques semaines. Il vous sera redemandé par l’office AI et la justice de paix : gardez-en plusieurs copies.',
          siCaBloque: 'Si le médecin ne connaît pas le format attendu, l’office AI dispose de formulaires de rapport médical [À VÉRIFIER] ; demandez-les et remettez-les au médecin.',
          genereJalon: true,
          sources: [src('Pratique observée dans les fiches de démarche existantes — à confirmer auprès de l’office AI Vaud')],
        },
        {
          id: 'question-protection',
          titre: 'Ouvrir la question : qui aidera votre enfant à décider ?',
          moisParRapportAuRepere: -12,
          quand: 'Environ 12 mois avant les 18 ans',
          enClair:
            'Aujourd’hui, vous décidez pour votre enfant. À 18 ans, plus personne ne décide à sa place, sauf si quelque chose est mis en place. Il n’y a pas une bonne réponse : cela dépend de ce que votre enfant peut comprendre et faire seul. Cette étape est une conversation à avoir, pas une case à cocher.',
          pourquoi:
            'À 18 ans, l’autorité parentale prend fin. Aucune mesure ne se met en place automatiquement : par défaut, la personne gère seule ses affaires. Selon sa situation, plusieurs options existent — aucune mesure ; des procurations pratiques ; un mandat pour cause d’inaptitude si votre enfant est capable de discernement pour le rédiger ; ou une curatelle limitée à certains domaines, décidée par la justice de paix. Le choix appartient à la famille, à la personne elle-même et à l’autorité de protection.',
          aFaire: [
            'En parler avec votre enfant, dans la mesure de ses possibilités, et avec les personnes qui l’accompagnent.',
            'Prendre conseil auprès de Pro Infirmis Vaud ou de la justice de paix de votre district : ils expliquent les options sans vous pousser vers l’une d’elles.',
            'Noter dans le dossier ce qui a été discuté, sans conclure à ce stade.',
          ],
          contacts: [
            { nom: 'Justice de paix du district de domicile', role: 'Autorité de protection de l’adulte (canton de Vaud)', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } },
            PRO_INFIRMIS,
            { nom: 'Bureau d’aide aux curateurs privés', role: '[À COMPLÉTER : coordonnées — annoncé dans le memento, section non rédigée]' },
          ],
          ficheId: 'transition',
          questionOuverte: true,
          vousRecevrez: 'Rien à ce stade : c’est une réflexion. Si vous choisissez de demander une mesure, la justice de paix vous écrira à l’étape « Déposer la demande ».',
          siCaBloque: 'Si la famille n’est pas d’accord entre elle, ou si votre enfant refuse d’en parler, c’est normal et fréquent. Un entretien avec Pro Infirmis Vaud, ou avec Espace Proches pour vous, permet de reprendre la question calmement.',
          genereJalon: true,
          sources: [
            src('Code civil suisse, art. 14 (majorité) et art. 296 (fin de l’autorité parentale)'),
            src('Code civil suisse, art. 360 ss (mandat pour cause d’inaptitude) et art. 390 ss (curatelles)'),
            M('8'),
          ],
        },
        {
          id: 'rente-ai',
          titre: 'Déposer la demande de rente AI',
          moisParRapportAuRepere: -12,
          quand: 'Environ 12 mois avant les 18 ans',
          enClair:
            'Jusqu’ici, l’AI payait des traitements, des moyens auxiliaires, peut-être une allocation pour impotent. La rente, elle, ne peut commencer qu’à 18 ans — et l’AI regarde d’abord si une formation est possible. Déposer la demande un an avant évite des mois sans revenu après l’anniversaire.',
          pourquoi:
            'Le droit à une rente de l’assurance-invalidité ne peut pas naître avant 18 ans révolus. L’office AI examine d’abord si des mesures de réadaptation (formation, insertion) sont possibles ; la rente vient ensuite ou en complément. L’instruction prend des mois.',
          aFaire: [
            'Demander à la gestionnaire AI quand et comment déposer la demande de rente pour votre enfant — le moment exact recommandé par l’office AI Vaud : [À COMPLÉTER].',
            'Rassembler les rapports médicaux, scolaires et éducatifs récents.',
            'Répondre à chaque courrier de l’office AI dans le délai indiqué, et noter ce délai comme délai légal.',
          ],
          contacts: [{ nom: 'Office AI Vaud', role: 'Gestionnaire de dossier', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          pieces: ['Rapport médical récent', 'Bilan scolaire ou éducatif', 'Formulaire de demande AI'],
          vousRecevrez: 'D’abord des questionnaires et des demandes de pièces. Puis un projet de décision (préavis) auquel vous pouvez répondre dans un délai indiqué [À VÉRIFIER : 30 jours]. Enfin la décision, avec le degré d’invalidité, le montant, la date de début et le délai de recours — un délai légal.',
          siCaBloque: 'Si le projet de décision ne vous semble pas juste, faites-vous conseiller avant de répondre (Pro Infirmis, Procap) : c’est à ce moment-là que l’office peut encore changer d’avis, plus simplement qu’en recours.',
          genereJalon: true,
          sources: [src('Loi fédérale sur l’assurance-invalidité (LAI), art. 28 et 29 — droit à la rente au plus tôt à 18 ans révolus')],
        },
      ],
    },
    // -----------------------------------------------------------------------
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
          concerne: 'Seulement si la famille et la personne ont choisi de demander une mesure de protection (voir l’étape précédente).',
          enClair:
            'Si vous avez décidé de demander une curatelle, c’est le moment. Un courrier simple à la justice de paix suffit pour commencer ; ce qui compte, c’est de décrire la situation concrètement. Comptez environ six mois — d’où ce moment, pour que la mesure soit en place le jour des 18 ans.',
          pourquoi:
            'Le traitement d’une demande prend environ six mois. Déposée trop tard, la mesure n’est pas en place le jour de la majorité, et il peut y avoir une période sans représentant légal. La justice de paix entend votre enfant, peut demander une expertise, puis choisit la mesure la moins lourde qui réponde au besoin.',
          aFaire: [
            'Contacter le greffe de la justice de paix de votre district pour connaître la forme attendue de la demande.',
            'Écrire un courrier qui décrit ce que votre enfant fait seul, ce qu’il ne peut pas faire, et qui pourrait être curateur ou curatrice (un parent est possible).',
            'Joindre le rapport médical récent et les pièces demandées ; conserver l’accusé de réception et noter comme délai légal toute date qu’il indique.',
          ],
          contacts: [
            { nom: 'Justice de paix du district de domicile', role: 'Autorité de protection de l’adulte', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } },
            { nom: 'Bureau d’aide aux curateurs privés', role: '[À COMPLÉTER : coordonnées — annoncé dans le memento]' },
          ],
          pieces: ['Courrier de demande', 'Rapport médical récent', 'Copie d’une pièce d’identité de votre enfant [À VÉRIFIER]'],
          ficheId: 'transition',
          vousRecevrez: 'Un accusé de réception, une convocation à une audition (votre enfant est entendu personnellement, vous pouvez l’accompagner), puis la décision : type de curatelle, domaines couverts, nom du curateur, et délai de recours — un délai légal.',
          siCaBloque: 'Si le greffe ne répond pas, écrivez par courrier recommandé en rappelant la date des 18 ans. Si vous êtes désigné·e curateur ou curatrice et que vous vous sentez perdu·e, le bureau d’aide aux curateurs privés existe pour cela [À COMPLÉTER : coordonnées]. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: true,
          sources: [src('Fiche de démarche « Transition à la majorité » — durée indicative de six mois à confirmer auprès de la justice de paix'), src('Code civil suisse, art. 443 (aviser l’autorité), 447 (audition), 400 (nomination du curateur)')],
        },
        {
          id: 'api-adulte',
          titre: 'Préparer le passage de l’allocation pour impotent « mineur » à « adulte »',
          moisParRapportAuRepere: -6,
          quand: 'Environ 6 mois avant les 18 ans',
          concerne: 'Seulement si votre enfant perçoit une allocation pour impotent (API).',
          enClair:
            'L’allocation pour impotent ne s’arrête pas à 18 ans, mais elle change de règles et son montant peut changer. Il dépend du degré d’aide (faible, moyen, grave) et du lieu de vie — à la maison ou en établissement. À la maison, c’est un forfait mensuel que votre enfant peut utiliser librement, y compris pour vous rémunérer.',
          pourquoi:
            'L’allocation pour impotent des mineurs et celle des adultes obéissent à des règles différentes ; le supplément pour soins intenses versé aux mineurs cesse à la majorité [À VÉRIFIER]. Pour un adulte, le memento précise que le forfait mensuel peut servir, par exemple, à rémunérer des proches aidants, du personnel paramédical, des moyens auxiliaires non pris en charge par l’AI, ou des services comme les repas à domicile et les déplacements en taxi.',
          aFaire: [
            'Demander à la gestionnaire AI comment se déroule le réexamen de l’allocation à 18 ans et s’il faut déposer une nouvelle demande.',
            'Tenir pendant une semaine un journal simple de l’aide apportée, jour et nuit : c’est ce qui sera évalué.',
            'Signaler tout projet de logement (propre logement, établissement) : le montant en dépend.',
          ],
          contacts: [{ nom: 'Office AI Vaud — allocation pour impotent', role: 'Réexamen à 18 ans', lien: { libelle: 'api.aivd.ch', url: 'https://api.aivd.ch/' } }],
          pieces: ['Rapport médical récent', 'Journal de l’aide apportée sur une semaine'],
          ficheId: 'api',
          vousRecevrez: 'Un courrier de l’office AI annonçant le réexamen, éventuellement une visite d’évaluation à domicile, puis une décision avec le degré retenu, le montant et le délai de recours (délai légal).',
          siCaBloque: 'Si le degré retenu vous paraît sous-estimé, demandez la copie du rapport d’enquête et faites-vous conseiller avant la fin du délai de recours. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: true,
          sources: [M('5'), src('Loi fédérale sur l’assurance-invalidité (LAI), art. 42 — allocation pour impotent')],
        },
        {
          id: 'assurance-maladie',
          titre: 'Vérifier l’assurance-maladie et demander le subside',
          moisParRapportAuRepere: -3,
          quand: 'Environ 3 mois avant les 18 ans',
          enClair:
            'La prime d’assurance-maladie de votre enfant va augmenter avec l’âge. Selon ses revenus et sa fortune — les siens, plus les vôtres tant qu’il vit chez vous [À VÉRIFIER] — le canton peut en payer une partie ou la totalité : c’est le subside. Il se demande, il ne vient pas tout seul.',
          pourquoi:
            'Les primes changent de catégorie à la majorité [À VÉRIFIER : catégorie applicable l’année des 18 ans]. Le canton de Vaud finance, selon le revenu et la fortune, une partie ou la totalité de la prime obligatoire : le subside, géré par l’Office vaudois de l’assurance-maladie.',
          aFaire: [
            'Demander à l’assureur ce qui change à la date anniversaire, et vérifier la franchise choisie (avec des frais médicaux réguliers, la franchise la plus basse est souvent la plus avantageuse [À VÉRIFIER : à calculer]).',
            'Déposer ou actualiser la demande de subside auprès de l’OVAM.',
          ],
          contacts: [{ nom: 'Office vaudois de l’assurance-maladie (OVAM)', role: 'Subside à l’assurance-maladie', lien: { libelle: 'vd.ch — subside', url: 'https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie' } }],
          vousRecevrez: 'De l’assureur : la nouvelle police. De l’OVAM : une décision de subside, avec le montant mensuel, qui apparaît ensuite en déduction sur la facture de primes.',
          siCaBloque: 'Si le subside n’apparaît pas sur la facture deux mois après la décision, écrivez à l’OVAM avec la copie de la décision. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: true,
          sources: [M('7'), src('Loi fédérale sur l’assurance-maladie (LAMal) — catégories de primes enfants / jeunes adultes')],
        },
      ],
    },
    // -----------------------------------------------------------------------
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
          enClair:
            'Le jour de l’anniversaire, vous n’êtes plus le représentant légal de votre enfant. Concrètement : les courriers arrivent à son nom, le médecin ne peut plus vous parler sans son accord, la banque ne vous laisse plus agir sur son compte. Si une curatelle a été décidée, c’est le curateur qui a ces droits ; sinon, votre enfant peut vous donner des procurations.',
          pourquoi:
            'L’autorité parentale prend fin. Les décisions médicales, administratives et financières reviennent en droit à votre enfant. Les professionnels sont tenus au secret envers vous sauf accord de sa part ou mesure de protection. Le portrait « Bien m’accompagner » lui appartient.',
          aFaire: [
            'S’assurer que votre enfant sait qui l’aide, et comment vous joindre.',
            'Si aucune mesure de protection n’est prévue : mettre en place avec lui des procurations pratiques — banque, poste, assurance-maladie, office AI — [À COMPLÉTER : formulaires et conditions selon les établissements].',
            'Demander à chaque professionnel (médecin, école, AI) sous quelle forme votre enfant peut les autoriser à vous parler.',
            'Mettre à jour les accès du dossier : à sa majorité, votre enfant peut décider qui voit son portrait.',
          ],
          lienInterne: { libelle: 'Voir les accès du dossier', href: '/acces' },
          vousRecevrez: 'Rien de particulier ce jour-là — c’est ce qui trompe. Les changements se voient dans les semaines qui suivent, quand les premiers courriers arrivent au nom de votre enfant.',
          siCaBloque: 'Si une administration refuse de vous parler alors que votre enfant vous a donné procuration, demandez par écrit sur quelle base elle refuse et ce qu’elle attend comme document. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: false,
          sources: [src('Code civil suisse, art. 14 (majorité), art. 296 (autorité parentale)')],
        },
        {
          id: 'prestations-complementaires',
          titre: 'Demander les prestations complémentaires',
          moisParRapportAuRepere: 0,
          quand: 'Dès 18 ans',
          concerne: 'Si votre enfant perçoit une rente AI ou une allocation pour impotent de l’AI.',
          enClair:
            'La rente AI est rarement suffisante pour vivre. Les prestations complémentaires comblent la différence entre ce que votre enfant a et ce dont il a besoin. Il y a droit dès 18 ans s’il touche une allocation pour impotent de l’AI, même sans rente. Elles ne sont jamais versées pour le passé : chaque mois de retard est perdu.',
          pourquoi:
            'Les PC couvrent les besoins vitaux des personnes dont la rente ne suffit pas. Selon le memento, peuvent y avoir droit les bénéficiaires d’une rente AVS ou AI, d’une allocation pour impotent de l’AI à partir de 18 ans, ou d’indemnités journalières de l’AI depuis six mois au moins ; dont la fortune nette ne dépasse pas CHF 100 000 (personne seule), CHF 200 000 (couple) ou CHF 50 000 (enfants et orphelins) ; domiciliés et résidant habituellement en Suisse ; de nationalité suisse ou d’un État de l’UE/AELE, ou ayant habité en Suisse dix ans sans interruption (cinq ans pour les réfugiés et apatrides) ; et dont les dépenses reconnues dépassent les revenus déterminants.',
          aFaire: [
            'Demander à l’agence d’assurances sociales de la commune ou à la Caisse cantonale vaudoise de compensation AVS comment déposer la demande, dès la décision AI reçue — ou dès l’anniversaire si l’allocation pour impotent est déjà versée.',
            'Rassembler les justificatifs de revenus, de fortune et de charges (loyer, primes).',
            'Déposer même si un document manque : la date de dépôt compte.',
          ],
          contacts: [
            { nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'Prestations complémentaires', lien: { libelle: 'caisseavsvaud.ch — PC', url: 'https://www.caisseavsvaud.ch/fr/Assurances/PC/Prestations-complementaires/Prestations-complementaires.html' } },
            { nom: 'Agence d’assurances sociales (AAS) de la commune', role: 'Dépôt de la demande [À VÉRIFIER : guichet compétent]' },
          ],
          pieces: ['Décision AI (rente, allocation pour impotent)', 'Relevés de comptes', 'Bail ou attestation de logement', 'Police d’assurance-maladie'],
          pointsAttention: ['Les seuils de fortune ci-dessus viennent du memento (document de travail) : à confirmer avec la caisse au moment de la demande.'],
          vousRecevrez: 'Une décision détaillant le calcul (dépenses reconnues, revenus déterminants, montant mensuel), avec un délai d’opposition — un délai légal. Beaucoup d’erreurs viennent d’une pièce oubliée : relisez le calcul ligne par ligne.',
          siCaBloque: 'Si la décision vous semble fausse, faites opposition dans le délai, avec l’aide de Pro Infirmis Vaud. Les PC ouvrent aussi le remboursement de certains frais de maladie et d’invalidité : demandez la liste à la caisse.',
          genereJalon: true,
          sources: [M('6'), M('7')],
        },
        {
          id: 'impots',
          titre: 'Impôts : la première déclaration',
          moisParRapportAuRepere: null,
          quand: 'L’année qui suit les 18 ans',
          enClair:
            'Votre enfant va recevoir sa propre déclaration d’impôts, même s’il n’a presque pas de revenus. Elle doit être remplie et renvoyée dans le délai, sinon il est taxé d’office. Certains frais liés au handicap sont déductibles.',
          pourquoi:
            'Dès la majorité, votre enfant devient contribuable à part entière [À VÉRIFIER : première période fiscale concernée dans le canton de Vaud].',
          aFaire: [
            'Repérer le courrier de l’Administration cantonale des impôts et noter le délai de dépôt comme délai légal.',
            'Vérifier les déductions liées au handicap : [À COMPLÉTER].',
          ],
          vousRecevrez: 'La déclaration, puis la décision de taxation, chacune avec son délai (dépôt, réclamation) — des délais légaux.',
          siCaBloque: 'Une prolongation du délai de dépôt se demande en ligne ou par courrier avant l’échéance [À VÉRIFIER]. Pro Infirmis Vaud aide à repérer les déductions.',
          genereJalon: false,
          sources: [src('Pratique générale — à confirmer auprès de l’Administration cantonale des impôts (VD)')],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'apres-18-ans',
      titre: 'Après 18 ans',
      sousTitre: 'Installer la vie adulte',
      etapes: [
        {
          id: 'logement',
          titre: 'Logement : de la maison au chez-soi, toutes les formes possibles',
          moisParRapportAuRepere: 6,
          quand: 'Selon le projet de la personne',
          enClair:
            'Il n’y a pas que « à la maison » ou « en foyer ». Entre les deux, le canton finance des aides pour vivre dans son propre appartement, des appartements rattachés à un établissement, des logements adaptés avec soins, et des hébergements à temps partiel ou pour de courts séjours. On peut commencer petit et changer plus tard.',
          pourquoi:
            'Du plus autonome au plus accompagné : l’accompagnement à domicile (Pro Infirmis, RAHMO, prestations socio-éducatives à domicile de certains établissements) aide dans les actes quotidiens, le maintien des compétences, la gestion administrative, les loisirs et les liens sociaux ; les logements protégés sont des appartements indépendants sous la responsabilité d’un établissement ; les logements adaptés avec accompagnement (LADA) sont des appartements où des prestations médico-sociales sont dispensées ; les établissements socio-éducatifs proposent un hébergement à temps plein, à temps partiel (au maximum trois jours par semaine) ou en court séjour.',
          aFaire: [
            'Discuter avec le DCISH des options adaptées à la situation, et visiter.',
            'Pour un hébergement ou un centre de jour en établissement : demander à l’établissement le détail du financement — une contribution personnelle, et une aide individuelle de la DGCS qui peut s’y substituer selon la situation financière et familiale.',
          ],
          contacts: [
            { nom: 'DCISH — canton de Vaud', role: 'Indication et suivi', lien: { libelle: 'vd.ch — contact DCISH', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/dcish-contact' } },
            { nom: 'Pro Infirmis Vaud — accompagnement à domicile', role: 'Aide dans les actes quotidiens, gestion administrative, liens sociaux', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/accompagnement-a-domicile.html' } },
            { nom: 'RAHMO', role: 'Réseau Accompagnement Handicap en Milieu Ordinaire', lien: { libelle: 'rahmo.ch', url: 'https://rahmo.ch/' } },
            { nom: 'LADA — canton de Vaud', role: 'Logements adaptés avec accompagnement', lien: { libelle: 'vd.ch — LADA', url: 'https://www.vd.ch/sante-soins-et-handicap/vivre-a-domicile/lada-logements-adaptes-avec-accompagnement' } },
            { nom: 'DGCS — aides individuelles', role: 'Financement de l’hébergement et des centres de jour', lien: { libelle: 'vd.ch — aides individuelles', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/aides-individuelles' } },
          ],
          pointsAttention: ['Règles particulières de l’hébergement à temps partiel : [À COMPLÉTER] (encadré annoncé dans le memento, non rédigé).'],
          vousRecevrez: 'Du DCISH : une indication (type de prestation) et une place sur une liste d’attente. De l’établissement : un contrat et un décompte de financement. De la DGCS : une décision d’aide individuelle si elle est demandée.',
          siCaBloque: 'L’attente peut être longue : signalez tout changement au DCISH et demandez un court séjour ou un accueil de jour en attendant. En cas de problème avec un établissement : Permanence d’orientation Patients / Résidents, 021 316 09 87 ; l’État contrôle les établissements par des visites impromptues (CIVESS).',
          genereJalon: false,
          sources: [M('2'), M('3'), M('4'), M('6')],
        },
        {
          id: 'contribution-assistance',
          titre: 'Contribution d’assistance : engager de l’aide pour vivre chez soi',
          moisParRapportAuRepere: 3,
          quand: 'Quand un logement propre est envisagé',
          concerne: 'Seulement si votre enfant perçoit une allocation pour impotent et vit — ou souhaite vivre — dans son propre logement. Elle n’est pas octroyée s’il vit au domicile de ses parents.',
          enClair:
            'Si votre enfant vit dans son propre logement, l’AI peut payer des assistants de vie qu’il engage lui-même. Attention : pas tant qu’il habite chez vous, et vous ne pouvez pas être ses assistants. C’est ce qui rend un appartement possible pour beaucoup de jeunes.',
          pourquoi:
            'La contribution d’assistance de l’AI permet d’engager des assistant·e·s de vie par contrat de travail, sur la base d’une évaluation des besoins. La demande se fait par écrit, au moyen d’un formulaire. Le choix des assistant·e·s est libre, mais il n’est pas possible d’engager un parent, un conjoint ou un concubin.',
          aFaire: [
            'Demander le formulaire de demande écrite à l’office AI.',
            'Préparer l’évaluation des besoins avec l’aide d’un service social si nécessaire.',
            'Se renseigner sur l’accompagnement à domicile, qui complète la contribution d’assistance (Pro Infirmis, RAHMO).',
          ],
          contacts: [{ nom: 'Office AI Vaud', role: 'Contribution d’assistance', lien: { libelle: 'ahv-iv.ch — contribution d’assistance', url: 'https://www.ahv-iv.ch/fr/assurances-sociales/assurance-invalidit%C3%A9-ai/contribution-dassistance' } }],
          pieces: ['Formulaire de demande', 'Décision d’allocation pour impotent', 'Bail ou projet de logement'],
          vousRecevrez: 'Une évaluation des besoins (nombre d’heures d’assistance reconnues), puis une décision avec le montant mensuel et le délai de recours (délai légal). Ensuite, des décomptes mensuels à renvoyer.',
          siCaBloque: 'Devenir employeur fait peur à beaucoup de familles : Pro Infirmis Vaud et certaines associations aident à gérer les contrats et les décomptes. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: false,
          sources: [M('5'), M('6')],
        },
        {
          id: 'travail',
          titre: 'Travail et activité de jour',
          moisParRapportAuRepere: 6,
          quand: 'Selon le projet de la personne',
          enClair:
            'Avec une rente AI, votre enfant peut quand même travailler, et le canton finance plusieurs cadres : un vrai poste en entreprise avec quelqu’un qui le suit, un atelier proche d’une entreprise, un atelier protégé, ou un centre de jour si le travail n’est pas le bon objectif. Ce n’est pas une échelle : c’est ce qui lui convient.',
          pourquoi:
            'Pour une personne au bénéfice d’une rente AI : un poste intégré en entreprise avec suivi individualisé (InsertH de Pro Infirmis ; certains ateliers proposent aussi des places intégrées en entreprise) ; les ateliers à vocation productive, dont l’environnement est proche du marché ordinaire (AEIP) ; les ateliers protégés des établissements socio-éducatifs ; les centres de jour, centrés sur le développement de la personne.',
          aFaire: ['En parler avec la gestionnaire AI et le DCISH.', 'Visiter les structures envisagées avec votre enfant et demander un stage.'],
          contacts: [
            { nom: 'InsertH — Pro Infirmis Vaud', role: 'Postes intégrés en entreprise', lien: { libelle: 'proinfirmis.ch — InsertH', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/inserth.html' } },
            { nom: 'AEIP', role: 'Ateliers à vocation productive', lien: { libelle: 'aeip.ch', url: 'https://www.aeip.ch/' } },
            { nom: 'DCISH — canton de Vaud', role: 'Ateliers protégés et centres de jour', lien: { libelle: 'vd.ch — contact DCISH', url: 'https://www.vd.ch/sante-soins-et-handicap/handicap/dcish-contact' } },
          ],
          vousRecevrez: 'Selon la voie : une convention de stage, puis un contrat ou une convention d’accueil qui précise les horaires, l’encadrement et la rémunération éventuelle.',
          siCaBloque: 'Si aucune place ne se libère, demandez au DCISH une solution transitoire (centre de jour à temps partiel) plutôt qu’une attente à la maison. ' + SI_CA_BLOQUE_GENERAL,
          genereJalon: false,
          sources: [M('2'), M('3')],
        },
        {
          id: 'loisirs-culture-transports',
          titre: 'Loisirs, sport, culture et transports',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          enClair:
            'La vie adulte, ce n’est pas que des démarches. Des associations subventionnées organisent des loisirs, des camps, du sport adapté ; des séances de spectacle sont prévues pour les personnes qui bougent ou font du bruit ; et un transport adapté existe au prix d’un billet de bus.',
          pourquoi:
            'De nombreuses associations généralistes ou spécialisées proposent des loisirs adaptés, des loisirs accompagnés en milieu ordinaire, des week-ends et camps, du sport adapté. Le programme cantonal de transport à mobilité réduite (TMR) permet de se déplacer avec un transport adapté au prix d’un transport public. Pour la culture : Relax Culture, la Bibliothèque sonore romande, Écoute Voir, La Chaise rouge, et le répertoire « L’indispensable ».',
          aFaire: ['Consulter la liste des associations et contacter celles qui correspondent aux goûts de votre enfant.', 'Pour le TMR : contacter le centre médico-social du lieu de domicile.'],
          contacts: [
            { nom: 'Forum Handicap Vaud', role: 'Liste des associations', lien: { libelle: 'fhvd.ch', url: 'https://www.fhvd.ch/' } },
            { nom: 'insieme Vaud', role: 'Loisirs et vacances', lien: { libelle: 'insiemevaud.ch', url: 'https://insiemevaud.ch/' } },
            { nom: 'TMR — via le CMS', role: 'Transport à mobilité réduite', lien: { libelle: 'cms-vaud.ch — TMR', url: 'https://www.cms-vaud.ch/search/tmr/' } },
            { nom: 'Relax Culture', role: 'Séances culturelles adaptées', lien: { libelle: 'relax-culture.ch', url: 'https://relax-culture.ch/' } },
            { nom: 'La Chaise rouge', role: 'Accompagnement aux sorties culturelles (Pro Infirmis et Croix-Rouge vaudoise)', lien: { libelle: 'proinfirmis.ch — La Chaise rouge', url: 'https://www.proinfirmis.ch/fr/prestations/vaud/la-chaise-rouge.html' } },
            { nom: 'Bibliothèque sonore romande', role: 'Livres audio gratuits', lien: { libelle: 'bibliothequesonore.ch', url: 'https://www.bibliothequesonore.ch/' } },
            { nom: 'Écoute Voir', role: 'Arts vivants et handicap sensoriel', lien: { libelle: 'ecoute-voir.org', url: 'https://ecoute-voir.org/' } },
            { nom: 'Pôle audition surdité (Les Chemain’s)', role: '[À COMPLÉTER — annoncé dans le memento]' },
          ],
          genereJalon: false,
          sources: [M('4'), M('5'), M('8')],
        },
        {
          id: 'moyens-auxiliaires',
          titre: 'Moyens auxiliaires',
          moisParRapportAuRepere: null,
          quand: 'Quand un besoin apparaît',
          enClair:
            'Fauteuil, appareil auditif, tablette de communication : l’AI en finance une partie, à condition de demander avant d’acheter. Ce qu’elle ne prend pas peut parfois être payé avec l’allocation pour impotent ou les prestations complémentaires.',
          pourquoi:
            'Un moyen auxiliaire compense la diminution ou la perte d’une fonction physique ou sensorielle, pour conserver ou développer l’autonomie dans la vie professionnelle et privée.',
          aFaire: ['Demander à l’office AI la procédure applicable à l’âge de votre enfant — les règles pour les 18–25 ans : [À COMPLÉTER].', 'Ne rien acheter avant la décision.'],
          contacts: [{ nom: 'Office AI Vaud', role: 'Moyens auxiliaires', lien: { libelle: 'aivd.ch — moyens auxiliaires', url: 'https://aivd.ch/moyens-auxiliaires-plus-de-25-ans/' } }],
          vousRecevrez: 'Une décision de remise (prêt ou achat) avec, le cas échéant, une participation à votre charge et le délai de recours.',
          siCaBloque: SI_CA_BLOQUE_GENERAL,
          genereJalon: false,
          sources: [M('6')],
        },
        {
          id: 'proche-aidant',
          titre: 'Et vous, le proche aidant',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          enClair:
            'Deux ans de démarches, c’est long. Le canton a un numéro gratuit pour les proches aidants, une carte d’urgence si quelque chose vous arrive, des relèves à la maison, des consultations psychologiques et des courts séjours pour souffler. Ce n’est pas un aveu de faiblesse, c’est prévu pour ça.',
          pourquoi:
            'Le canton de Vaud soutient les proches aidants : information sur les aides, orientation vers les organismes, entretiens individuels ; carte d’urgence, aide et relèves à la maison, consultations psychologiques, accueil de jour ou court séjour en établissement, groupes d’entraide.',
          aFaire: ['Appeler la permanence gratuite des proches aidants (0800 660 660).', 'Demander la carte d’urgence du proche aidant.', 'En cas de difficulté avec un professionnel ou une institution : contacter la Permanence d’orientation Patients / Résidents (021 316 09 87).'],
          contacts: [ESPACE_PROCHES, PERMANENCE],
          lienInterne: { libelle: 'Partager le dossier en cas d’urgence', href: '/partage' },
          genereJalon: false,
          sources: [M('8'), M('4')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Info handicap', texte: 'Plateforme de Pro Infirmis : questions juridiques, financières, vie sociale, accessibilité, logement, travail.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
    { titre: 'Guide social romand', texte: 'Informations socio-juridiques et répertoire d’institutions sociales en Suisse romande.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
    { titre: 'Associations vaudoises', texte: 'Liste des associations membres de Forum Handicap Vaud, généralistes ou spécialisées : groupes de parole, loisirs, conseils juridiques, formations adaptées.', lien: { libelle: 'fhvd.ch/membres', url: 'https://www.fhvd.ch/membres' } },
    { titre: 'Faire une réclamation, en langage facile à lire', texte: 'La page du canton pour signaler un problème avec un professionnel ou une institution, rédigée en facile à lire et à comprendre.', lien: { libelle: 'vd.ch/plaintes-falc', url: 'https://www.vd.ch/plaintes-falc' } },
    { titre: 'CIVESS', texte: 'L’organe de l’État qui contrôle les établissements socio-éducatifs (dignité, intimité, sécurité, communication avec le résident) par des visites impromptues.', lien: { libelle: 'vd.ch/civess', url: 'https://www.vd.ch/civess' } },
    { titre: 'L’indispensable', texte: 'Répertoire des prestataires en inclusion culturelle de Suisse romande (Pro Infirmis et canton de Vaud).', lien: { libelle: 'vd.ch — L’indispensable (PDF)', url: 'https://www.vd.ch/fileadmin/user_upload/themes/culture/Acc%C3%A8s_%C3%A0_la_culture/L_indispensable.pdf' } },
    { titre: 'Checklist passage à la majorité', texte: '[À COMPLÉTER — annoncée dans le memento, non encore rédigée.]' },
  ],
}
