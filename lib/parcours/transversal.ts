// Parcours de la catégorie « Toutes situations » — canton de Vaud.
//
// PROVISOIRES : étapes plausibles, appuyées sur le droit fédéral (CO, LAPG, LAVS, LAI, CC,
// OEC) et sur le programme vaudois de soutien aux proches aidants. Rien n'a été relu contre sa
// source ; dénominations, délais et montants sont marqués [À VÉRIFIER] ou [À COMPLÉTER].

import type { Parcours } from './types'
import { AVERTISSEMENT_PROVISOIRE, CC, LAI, VD, src } from './sources'

const ESPACE_PROCHES = {
  nom: 'Espace Proches',
  role: 'Écoute, information et orientation gratuites pour les proches aidants (0800 660 660)',
  lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' },
}

// ---------------------------------------------------------------------------
// Faire reconnaître son rôle de proche aidant
// ---------------------------------------------------------------------------

export const statutProcheAidant: Parcours = {
  id: 'statut-proche-aidant',
  titre: 'Faire reconnaître votre rôle de proche aidant',
  positionnement: 'Pour toute personne qui accompagne régulièrement un proche et n’a jamais pensé à ce que cela lui donne comme droits',
  categorie: 'transversal',
  canton: 'Vaud',
  autorite: 'Canton (programme proches aidants), employeur, caisse AVS',
  delaiRealiste: { texte: 'Pas de délai officiel ; les aides se demandent au fil de l’eau', statut: 'a-verifier' },
  icone: 'heart-handshake',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'Il n’existe pas de « statut » officiel de proche aidant en Suisse, mais il existe des droits : au travail, pour l’AVS, pour souffler. La plupart ne sont pas réclamés parce que personne ne se reconnaît sous ce mot. Ce parcours passe en revue ce qui existe dans le canton de Vaud et au niveau fédéral, et ce qu’il faut faire pour en bénéficier.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'se-reconnaitre',
      titre: 'Se reconnaître',
      sousTitre: 'Le premier pas, souvent le plus difficile',
      etapes: [
        {
          id: 'espace-proches',
          titre: 'Appeler Espace Proches',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Le canton de Vaud a un programme de soutien aux proches aidants, avec une permanence téléphonique gratuite qui informe, oriente et propose des entretiens individuels. Un appel de vingt minutes fait souvent gagner des mois.',
          aFaire: ['Appeler le 0800 660 660 et raconter votre situation.', 'Noter les pistes proposées dans le dossier.'],
          contacts: [ESPACE_PROCHES],
          genereJalon: true,
          sources: [VD('proches aidants — programme cantonal', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
        {
          id: 'carte-urgence',
          titre: 'Demander la carte d’urgence du proche aidant',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Si vous avez un accident, qui s’occupera de la personne que vous aidez ? La carte d’urgence, à garder sur soi, indique aux secours que quelqu’un dépend de vous et qui prévenir. Elle est gratuite [À VÉRIFIER : procédure de demande].',
          aFaire: ['Demander la carte via Espace Proches et noter dans le dossier le plan d’urgence : qui prévenir, où sont les clés, les médicaments, le portrait.'],
          lienInterne: { libelle: 'Partager le dossier en cas d’urgence', href: '/partage' },
          genereJalon: true,
          sources: [VD('carte d’urgence proche aidant [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'au-travail',
      titre: 'Au travail',
      sousTitre: 'Les congés prévus par la loi',
      etapes: [
        {
          id: 'conge-court',
          titre: 'Connaître le congé pour la prise en charge d’un proche',
          moisParRapportAuRepere: 1,
          quand: 'Avant d’en avoir besoin',
          pourquoi:
            'Depuis 2021, un employé a droit à un congé payé pour s’occuper d’un membre de la famille ou du partenaire atteint dans sa santé : jusqu’à trois jours par cas et dix jours par an [À VÉRIFIER]. Il se demande à l’employeur ; un certificat médical peut être exigé.',
          aFaire: ['Informer votre employeur de votre situation de proche aidant, par écrit si vous le souhaitez.', 'Le moment venu, demander le congé en citant l’article du Code des obligations.'],
          concerne: 'Seulement si vous êtes salarié·e',
          genereJalon: false,
          sources: [src('Code des obligations (CO), art. 329h — congé pour la prise en charge de proches [À VÉRIFIER : durées]')],
        },
        {
          id: 'conge-enfant',
          titre: 'Connaître le congé pour un enfant gravement atteint',
          moisParRapportAuRepere: 1,
          quand: 'Si votre enfant est gravement malade ou accidenté',
          pourquoi:
            'Les parents d’un enfant mineur gravement atteint dans sa santé ont droit à un congé de prise en charge de quatorze semaines au plus, indemnisé par les allocations pour perte de gain, à prendre dans un délai-cadre de dix-huit mois [À VÉRIFIER]. Il peut être partagé entre les parents.',
          aFaire: ['Demander à la caisse de compensation de l’employeur le formulaire d’allocation de prise en charge.', 'Faire remplir le certificat médical qui atteste la gravité.'],
          concerne: 'Seulement pour un enfant mineur gravement atteint dans sa santé',
          contacts: [{ nom: 'Caisse de compensation de votre employeur', role: 'Allocation de prise en charge (APG)' }],
          genereJalon: false,
          sources: [src('Loi sur les allocations pour perte de gain (LAPG), art. 16n ss — allocation de prise en charge [À VÉRIFIER]')],
        },
        {
          id: 'amenagements',
          titre: 'Négocier des aménagements',
          moisParRapportAuRepere: 2,
          quand: 'Quand la charge devient régulière',
          pourquoi:
            'Réduction du taux, télétravail, horaires souples : rien n’y oblige l’employeur, mais beaucoup acceptent quand la demande est claire et anticipée. Une réduction du taux a des conséquences sur la prévoyance : à vérifier avec la caisse de pension.',
          aFaire: ['Préparer une demande écrite : ce dont vous avez besoin, pour combien de temps, comment le travail sera assuré.', 'Demander à la caisse de pension l’effet d’une réduction du taux.'],
          genereJalon: false,
          sources: [src('Pas de base légale — négociation')],
        },
      ],
    },
    {
      id: 'argent',
      titre: 'L’argent',
      sousTitre: 'Ce qui compense, un peu',
      etapes: [
        {
          id: 'bonification-avs',
          titre: 'Demander la bonification pour tâches d’assistance',
          moisParRapportAuRepere: 2,
          quand: 'Chaque année',
          pourquoi:
            'Une personne qui s’occupe d’un parent proche recevant une allocation pour impotent peut faire inscrire sur son propre compte AVS une bonification qui améliorera sa future rente [À VÉRIFIER : degré d’impotence requis, condition de proximité du domicile]. Elle doit être demandée chaque année à la caisse de compensation cantonale ; elle n’est pas rétroactive au-delà d’un certain délai [À VÉRIFIER].',
          aFaire: ['Demander le formulaire à la caisse cantonale de compensation et le déposer chaque année.', 'Ajouter un moment conseillé annuel dans le dossier.'],
          contacts: [{ nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'Bonification pour tâches d’assistance', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } }],
          pieces: ['Formulaire de demande', 'Copie de la décision d’allocation pour impotent de la personne aidée'],
          genereJalon: true,
          sources: [src('LAVS, art. 29septies — bonifications pour tâches d’assistance [À VÉRIFIER]')],
        },
        {
          id: 'contribution-assistance',
          titre: 'Comprendre la contribution d’assistance',
          moisParRapportAuRepere: 2,
          quand: 'Si la personne aidée reçoit une allocation pour impotent de l’AI',
          pourquoi:
            'La contribution d’assistance permet à une personne au bénéfice d’une allocation pour impotent de l’AI, vivant à domicile, d’engager des assistants. Les membres de la famille proche ne peuvent pas être engagés à ce titre [À VÉRIFIER : cercle exclu], mais l’aide engagée soulage le proche.',
          aFaire: ['Se renseigner auprès de l’office AI sur les conditions et le nombre d’heures possibles.'],
          concerne: 'Seulement si la personne aidée reçoit une allocation pour impotent de l’AI',
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Contribution d’assistance', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          genereJalon: false,
          sources: [LAI('42quater ss', 'contribution d’assistance'), src('RAI, art. 39f — personnes exclues [À VÉRIFIER]')],
        },
        {
          id: 'aides-cantonales',
          titre: 'Vérifier les aides cantonales directes',
          moisParRapportAuRepere: 3,
          quand: 'Si la personne aidée vit à domicile',
          pourquoi:
            'Le canton de Vaud connaît des aides au maintien à domicile qui peuvent indirectement soutenir le proche aidant [À COMPLÉTER : prestations existantes, conditions]. Espace Proches et le CMS savent lesquelles s’appliquent.',
          aFaire: ['Demander à Espace Proches ou au CMS la liste des aides cantonales applicables à votre situation.'],
          contacts: [ESPACE_PROCHES],
          genereJalon: false,
          sources: [src('Aides cantonales vaudoises aux proches aidants [À COMPLÉTER]')],
        },
      ],
    },
    {
      id: 'souffler',
      titre: 'Souffler',
      sousTitre: 'Avant d’être à bout',
      etapes: [
        {
          id: 'releves',
          titre: 'Organiser des relèves',
          moisParRapportAuRepere: 3,
          quand: 'Avant d’en avoir besoin',
          pourquoi:
            'Relève à domicile de quelques heures, accueil de jour, court séjour en établissement : ces solutions existent pour que le proche puisse s’absenter, se soigner, partir. Elles se demandent avant l’épuisement.',
          aFaire: ['Demander à Espace Proches les relèves disponibles dans votre région et leur coût.', 'Planifier une première relève, même courte, et un court séjour dans l’année.'],
          contacts: [ESPACE_PROCHES, { nom: 'Croix-Rouge vaudoise', role: 'Relève à domicile [À VÉRIFIER]', lien: { libelle: 'croixrougevaudoise.ch', url: 'https://www.croixrougevaudoise.ch/' } }],
          genereJalon: true,
          sources: [VD('relèves et courts séjours [À VÉRIFIER]')],
        },
        {
          id: 'soutien',
          titre: 'Chercher un soutien pour vous',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          pourquoi:
            'Groupes de parole, consultations psychologiques pour proches aidants, associations liées à la maladie ou au handicap de la personne aidée : parler à des gens qui vivent la même chose n’est pas un luxe.',
          aFaire: ['Demander à Espace Proches les groupes et consultations près de chez vous.'],
          contacts: [ESPACE_PROCHES],
          genereJalon: false,
          sources: [VD('proches aidants — soutien psychologique [À VÉRIFIER]')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Espace Proches', texte: 'Le programme cantonal vaudois de soutien aux proches aidants.', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } },
    { titre: 'Guide social romand — proches aidants', texte: 'Droits et prestations pour les proches aidants.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Après un diagnostic, les premières démarches
// ---------------------------------------------------------------------------

export const apresDiagnostic: Parcours = {
  id: 'apres-diagnostic',
  titre: 'Après un diagnostic, faire les premières démarches',
  positionnement: 'Pour les proches d’une personne qui vient de recevoir un diagnostic qui va changer sa vie',
  categorie: 'transversal',
  canton: 'Vaud',
  autorite: 'Médecins, office AI, assurances',
  delaiRealiste: { texte: 'Les trois premiers mois pour ce qui ne peut pas attendre', statut: 'a-verifier' },
  icone: 'stethoscope',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'Les jours qui suivent un diagnostic sont faits pour encaisser, pas pour remplir des formulaires. Pourtant, certaines démarches ont un calendrier qui n’attend pas : une demande AI déposée tard fait perdre des mois de prestations, un employeur non informé ne peut pas aménager. Ce parcours trie ce qui doit être fait tout de suite, ce qui peut attendre un mois, et ce qui se prépare sur plusieurs mois.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'premiers-jours',
      titre: 'Les premiers jours',
      sousTitre: 'Comprendre et s’organiser',
      etapes: [
        {
          id: 'diagnostic-ecrit',
          titre: 'Obtenir le diagnostic par écrit',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Toutes les démarches à venir — AI, assurances, école, employeur — demanderont un rapport médical. Le demander maintenant évite de courir après plus tard. Un second avis est un droit ; l’assurance maladie le prend en charge dans la plupart des cas [À VÉRIFIER].',
          aFaire: ['Demander au médecin un rapport écrit avec le diagnostic, la date de début et les conséquences attendues au quotidien.', 'Ranger le rapport dans le coffre.'],
          pieces: ['Rapport médical de diagnostic'],
          lienInterne: { libelle: 'Ajouter au coffre', href: '/documents' },
          genereJalon: true,
          sources: [src('Loi vaudoise sur la santé publique — droit à l’information du patient [À VÉRIFIER]')],
        },
        {
          id: 'questions',
          titre: 'Noter les questions pour le prochain rendez-vous',
          moisParRapportAuRepere: 0,
          quand: 'Au fil des jours',
          pourquoi:
            'Les questions viennent la nuit et s’oublient dans le cabinet. Les noter au fur et à mesure dans le dossier, puis les emporter, transforme un rendez-vous subi en rendez-vous utile.',
          aFaire: ['Créer le prochain rendez-vous dans le dossier et y noter les questions à mesure qu’elles viennent.'],
          lienInterne: { libelle: 'Rendez-vous', href: '/rendez-vous' },
          genereJalon: false,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'referent',
          titre: 'Désigner une personne de référence',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Une seule personne qui centralise les informations, les courriers et les rendez-vous évite que tout se perde entre plusieurs proches. Ce n’est pas forcément celle qui aide le plus au quotidien.',
          aFaire: ['Décider en famille qui tient le dossier, et donner aux autres l’accès qui leur convient.'],
          lienInterne: { libelle: 'Accès au dossier', href: '/acces' },
          genereJalon: false,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'premier-mois',
      titre: 'Le premier mois',
      sousTitre: 'Ce qui a un calendrier',
      etapes: [
        {
          id: 'annonce-ai',
          titre: 'S’annoncer à l’AI sans attendre',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Pour un adulte, une rente AI ne peut pas être versée avant six mois après le dépôt de la demande, quelle que soit l’ancienneté de la maladie [À VÉRIFIER]. Pour un enfant, certaines prestations ne sont dues qu’à partir de la demande. Une détection précoce existe aussi pour les adultes en incapacité de travail. Dans tous les cas : déposer tôt, même incomplet.',
          aFaire: ['Adulte en incapacité de travail : remplir le formulaire de détection précoce ou la demande de prestations AI.', 'Enfant : suivre le parcours « Demander l’AI et l’allocation pour impotent pour un enfant ».'],
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Détection précoce et demandes', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          lienInterne: { libelle: 'Parcours AI pour un enfant', href: '/parcours/premiere-demande-ai' },
          genereJalon: true,
          sources: [LAI('29 al. 1', 'naissance du droit à la rente — six mois après la demande [À VÉRIFIER]'), LAI('3a ss', 'détection précoce')],
        },
        {
          id: 'employeur-ecole',
          titre: 'Informer l’employeur ou l’école',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Pour un adulte, l’employeur doit être informé d’une incapacité de travail (certificat médical) et l’assurance perte de gain, si elle existe, doit être annoncée dans les délais prévus par la police [À VÉRIFIER : délais d’annonce]. Pour un enfant, l’école peut adapter et déclencher les mesures de pédagogie spécialisée.',
          aFaire: ['Adulte : remettre le certificat médical à l’employeur ; demander quelle assurance perte de gain existe et son délai d’annonce (délai légal, à noter).', 'Enfant : informer l’école et demander un entretien.'],
          genereJalon: true,
          sources: [src('CO, art. 324a — maintien du salaire en cas d’empêchement de travailler'), src('Conditions générales des assurances perte de gain — délais d’annonce [À COMPLÉTER]')],
        },
        {
          id: 'assurances',
          titre: 'Faire le tour des assurances',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Assurance maladie (subside possible), assurance accident si l’origine est un accident, assurance perte de gain, caisse de pension (rente d’invalidité LPP), assurances privées : chacune a ses conditions et ses délais d’annonce. Une annonce tardive peut réduire ou supprimer la prestation.',
          aFaire: ['Lister toutes les assurances de la personne et écrire à chacune pour annoncer la situation.', 'Noter les délais indiqués dans les réponses comme délais légaux.'],
          pieces: ['Polices d’assurance', 'Certificat de caisse de pension'],
          genereJalon: true,
          sources: [src('LPP, art. 23 ss — prestations d’invalidité [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'trois-mois',
      titre: 'Les trois premiers mois',
      sousTitre: 'Organiser le quotidien',
      etapes: [
        {
          id: 'dossier',
          titre: 'Mettre le dossier en place',
          moisParRapportAuRepere: 2,
          quand: 'Dans les deux mois',
          pourquoi:
            'Courriers, décisions, rapports, contacts : ce qui est éparpillé se perd. Le coffre, la liste des intervenants et le portrait de la personne sont les trois pièces de base ; le reste vient s’y accrocher.',
          aFaire: ['Ajouter au coffre tout courrier reçu, même non classé.', 'Renseigner les intervenants avec leurs coordonnées.', 'Commencer le portrait avec la personne.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'associations',
          titre: 'Contacter l’association liée au diagnostic',
          moisParRapportAuRepere: 2,
          quand: 'Dans les deux mois',
          pourquoi:
            'Pour presque chaque maladie ou handicap, une association (ligue, fondation, groupe de parents) a accumulé ce que les familles apprennent à leurs dépens : les bons interlocuteurs, les aides, les pièges. Beaucoup offrent un conseil social gratuit.',
          aFaire: ['Chercher l’association concernée (Forum Handicap Vaud, ligues de santé, Alzheimer Vaud, autisme suisse romande…) et prendre contact.'],
          contacts: [{ nom: 'Forum Handicap Vaud', role: 'Répertoire des associations vaudoises', lien: { libelle: 'fhvd.ch/membres', url: 'https://www.fhvd.ch/membres' } }],
          genereJalon: true,
          sources: [src('Pas de source légale — répertoire associatif')],
        },
        {
          id: 'aide-quotidien',
          titre: 'Demander de l’aide pour le quotidien',
          moisParRapportAuRepere: 2,
          quand: 'Si le quotidien devient lourd',
          pourquoi:
            'Le CMS pour les soins et l’aide à domicile, Pro Infirmis ou Pro Senectute pour le conseil social, Espace Proches pour le proche aidant : ces portes existent dès maintenant, pas seulement quand la situation devient intenable.',
          aFaire: ['Contacter le CMS pour une évaluation à domicile si des soins ou de l’aide sont nécessaires.', 'Suivre le parcours « Faire reconnaître votre rôle de proche aidant ».'],
          contacts: [ESPACE_PROCHES],
          lienInterne: { libelle: 'Parcours proche aidant', href: '/parcours/statut-proche-aidant' },
          genereJalon: true,
          sources: [VD('proches aidants', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
      ],
    },
    {
      id: 'suite',
      titre: 'Et ensuite',
      sousTitre: 'Anticiper',
      etapes: [
        {
          id: 'anticiper',
          titre: 'Poser les questions d’avenir',
          moisParRapportAuRepere: 4,
          quand: 'Quand le choc est passé',
          pourquoi:
            'Directives anticipées et mandat pour cause d’inaptitude pour un adulte ; parcours de la scolarité ou de la majorité pour un enfant ; maintien à domicile ou entrée en établissement pour une personne âgée. Ce ne sont pas des urgences, mais elles se préparent mieux tôt que tard.',
          aFaire: ['Choisir dans le catalogue le ou les parcours qui correspondent à la suite, et les ouvrir quand vous serez prêts.'],
          lienInterne: { libelle: 'Voir les parcours', href: '/accueil' },
          genereJalon: true,
          sources: [src('Pas de source légale — orientation')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Info handicap', texte: 'Plateforme de Pro Infirmis : premières questions après un diagnostic.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
    { titre: 'Forum Handicap Vaud', texte: 'Associations vaudoises, généralistes ou spécialisées.', lien: { libelle: 'fhvd.ch', url: 'https://www.fhvd.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Décès d'un proche
// ---------------------------------------------------------------------------

export const deces: Parcours = {
  id: 'deces',
  titre: 'Après le décès d’un proche',
  positionnement: 'Pour la famille d’une personne qui vient de mourir, souvent après un long accompagnement',
  categorie: 'transversal',
  canton: 'Vaud',
  autorite: 'État civil, justice de paix',
  delaiRealiste: { texte: 'Quelques semaines pour l’urgent, jusqu’à un an pour la succession', statut: 'a-verifier' },
  icone: 'flower',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'Après un décès, l’administratif arrive au pire moment. Certaines choses doivent être faites dans les jours qui suivent, d’autres dans les semaines, et la succession se règle sur des mois. Ce parcours les met dans l’ordre pour que rien ne soit oublié et que rien ne soit fait trop vite — y compris la décision d’accepter ou de refuser une succession. Le dossier de la personne reste consultable après son archivage.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'premiers-jours',
      titre: 'Les premiers jours',
      sousTitre: 'Ce qui ne peut pas attendre',
      etapes: [
        {
          id: 'constat-annonce',
          titre: 'Constat de décès et annonce à l’état civil',
          moisParRapportAuRepere: 0,
          quand: 'Dans les deux jours [À VÉRIFIER]',
          pourquoi:
            'Un médecin établit le constat de décès. Le décès doit ensuite être annoncé à l’office de l’état civil du lieu du décès dans un délai court [À VÉRIFIER : deux jours]. En pratique, l’entreprise de pompes funèbres s’en charge souvent, et l’hôpital ou l’EMS s’occupe du constat. Vérifiez qui fait quoi plutôt que de supposer.',
          aFaire: ['Demander à l’hôpital, à l’EMS ou aux pompes funèbres qui annonce le décès à l’état civil.', 'Réunir le livret de famille ou un acte d’état civil et une pièce d’identité de la personne décédée.'],
          contacts: [{ nom: 'Office de l’état civil de l’arrondissement du lieu de décès', role: 'Enregistrement du décès', lien: { libelle: 'vd.ch — état civil', url: 'https://www.vd.ch/etat-civil' } }],
          pieces: ['Constat médical de décès', 'Livret de famille ou acte d’état civil', 'Pièce d’identité de la personne décédée'],
          genereJalon: false,
          sources: [src('Ordonnance sur l’état civil (OEC), art. 34 ss — annonce du décès, délai [À VÉRIFIER]')],
        },
        {
          id: 'volontes',
          titre: 'Chercher les dernières volontés',
          moisParRapportAuRepere: 0,
          quand: 'Avant d’organiser les obsèques',
          pourquoi:
            'La personne a peut-être écrit ce qu’elle souhaitait pour ses obsèques (inhumation, crémation, cérémonie) et un testament. Le testament trouvé doit être remis à l’autorité sans délai, même s’il paraît sans valeur [À VÉRIFIER : autorité compétente dans le canton de Vaud — justice de paix].',
          aFaire: ['Chercher dans les papiers, chez le notaire, dans le dossier : dispositions funéraires, testament, mandat.', 'Remettre tout testament trouvé à la justice de paix du dernier domicile.'],
          contacts: [{ nom: 'Justice de paix du district du dernier domicile', role: 'Ouverture des testaments, certificat d’héritier', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } }],
          genereJalon: false,
          sources: [CC('556', 'obligation de remettre le testament'), CC('557', 'ouverture du testament')],
        },
        {
          id: 'obseques',
          titre: 'Organiser les obsèques',
          moisParRapportAuRepere: 0,
          quand: 'Dans la semaine',
          pourquoi:
            'Les pompes funèbres organisent l’essentiel et souvent les démarches d’état civil. Les frais sont à la charge de la succession ; certaines communes vaudoises participent aux frais pour leurs habitants [À VÉRIFIER]. Demandez un devis écrit avant d’engager.',
          aFaire: ['Choisir une entreprise de pompes funèbres et demander un devis écrit.', 'Demander à la commune si elle participe aux frais d’obsèques.'],
          genereJalon: false,
          sources: [src('Règlements communaux sur les inhumations [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'premieres-semaines',
      titre: 'Les premières semaines',
      sousTitre: 'Informer, arrêter, conserver',
      etapes: [
        {
          id: 'actes-deces',
          titre: 'Obtenir des actes de décès',
          moisParRapportAuRepere: 0,
          quand: 'Dès l’enregistrement',
          pourquoi:
            'Chaque organisme demandera un acte de décès. En commander plusieurs exemplaires dès le départ évite des allers-retours.',
          aFaire: ['Commander cinq à dix actes de décès à l’office de l’état civil.', 'En ranger un dans le coffre.'],
          pieces: ['Actes de décès (plusieurs exemplaires)'],
          lienInterne: { libelle: 'Ajouter au coffre', href: '/documents' },
          genereJalon: true,
          sources: [src('OEC — délivrance d’actes [À VÉRIFIER : émoluments]')],
        },
        {
          id: 'informer',
          titre: 'Informer les organismes',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Caisse AVS (la rente cesse ; une rente de survivant peut naître), caisse de pension, office AI, assurance maladie, assurances privées, banque (les comptes sont bloqués jusqu’au certificat d’héritier), bailleur, employeur, poste, téléphone, abonnements, impôts. Si la personne avait un curateur ou était curatrice : la justice de paix. Chaque courrier reçu en retour peut contenir un délai : notez-le comme délai légal.',
          aFaire: ['Faire la liste des organismes et cocher au fur et à mesure ; joindre un acte de décès à chaque courrier.', 'Demander à la caisse AVS et à la caisse de pension les formulaires de rente de survivant.'],
          contacts: [{ nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'Fin de rente, rente de survivant', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } }],
          genereJalon: true,
          sources: [src('LAVS, art. 23 ss — rentes de survivants [À VÉRIFIER]'), src('LPP, art. 18 ss — prestations pour survivants [À VÉRIFIER]')],
        },
        {
          id: 'bail',
          titre: 'Résilier le bail',
          moisParRapportAuRepere: 1,
          quand: 'Dès que possible',
          pourquoi:
            'Le bail ne prend pas fin avec le décès : il passe aux héritiers, qui peuvent le résilier pour le prochain terme légal avec le délai de congé légal, même si le contrat prévoit plus long [À VÉRIFIER]. La date de fin figure dans le bail ou le courrier du bailleur : c’est un délai légal.',
          aFaire: ['Relire le bail, écrire au bailleur par recommandé, noter la date de fin comme délai légal.', 'Planifier la remise du logement.'],
          concerne: 'Seulement si la personne était locataire',
          pieces: ['Contrat de bail', 'Lettre de résiliation', 'Acte de décès'],
          genereJalon: true,
          sources: [src('CO, art. 266i — décès du locataire')],
        },
        {
          id: 'archiver-dossier',
          titre: 'Archiver le dossier',
          moisParRapportAuRepere: 1,
          quand: 'Quand vous vous sentez prêt',
          pourquoi:
            'Le dossier de la personne contient des documents que la succession peut réclamer. L’archiver le sort du décompte de vos dossiers et arrête toute notification, sans rien effacer : il reste consultable et exportable pendant au moins douze mois.',
          aFaire: ['Exporter le dossier si vous souhaitez en garder une copie hors de l’application.', 'Archiver le dossier depuis les réglages.'],
          lienInterne: { libelle: 'Réglages du dossier', href: '/reglages' },
          genereJalon: false,
          sources: [src('Règle produit — clôture de dossier (CLAUDE.md §9.7)')],
        },
      ],
    },
    {
      id: 'succession',
      titre: 'La succession',
      sousTitre: 'Ne rien décider trop vite',
      etapes: [
        {
          id: 'certificat-heritier',
          titre: 'Demander le certificat d’héritier',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Le certificat d’héritier identifie les héritiers et leur permet de disposer des biens (débloquer les comptes, vendre). Dans le canton de Vaud, il est délivré par la justice de paix du dernier domicile [À VÉRIFIER : autorité et émolument], une fois le délai de répudiation écoulé ou les héritiers ayant accepté.',
          aFaire: ['Demander à la justice de paix la procédure et les pièces nécessaires.'],
          contacts: [{ nom: 'Justice de paix du district du dernier domicile', role: 'Certificat d’héritier', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } }],
          pieces: ['Acte de décès', 'Livret de famille ou actes d’état civil des héritiers', 'Testament, s’il existe'],
          genereJalon: true,
          sources: [CC('559', 'certificat d’héritier')],
        },
        {
          id: 'accepter-repudier',
          titre: 'Décider d’accepter ou de répudier',
          moisParRapportAuRepere: 2,
          quand: 'Bien avant la fin du délai de répudiation',
          pourquoi:
            'Hériter, c’est aussi hériter des dettes. Les héritiers peuvent répudier la succession dans un délai légal de trois mois dès qu’ils ont connaissance du décès [À VÉRIFIER]. Ils peuvent aussi demander le bénéfice d’inventaire dans un délai plus court [À VÉRIFIER : un mois], pour connaître l’état des dettes avant de décider. Se servir dans les biens avant de décider peut valoir acceptation. Ce délai est un délai légal : confirmez-le auprès de la justice de paix et notez-le dans le dossier.',
          aFaire: ['Faire un premier état des dettes et des biens connus.', 'Confirmer le délai de répudiation auprès de la justice de paix et le noter comme délai légal.', 'En cas de doute sur les dettes, demander le bénéfice d’inventaire ou consulter un·e notaire.'],
          pointsAttention: ['Ne payez pas de dettes et ne videz pas le logement avant d’avoir décidé : ces gestes peuvent être interprétés comme une acceptation.'],
          genereJalon: true,
          sources: [CC('567', 'délai de répudiation — trois mois [À VÉRIFIER]'), CC('571', 'déchéance du droit de répudier'), CC('580 ss', 'bénéfice d’inventaire [À VÉRIFIER : délai]')],
        },
        {
          id: 'impots',
          titre: 'Régler les impôts',
          moisParRapportAuRepere: 3,
          quand: 'Dans les mois qui suivent',
          pourquoi:
            'La dernière déclaration d’impôts de la personne décédée doit être remplie par les héritiers. Le canton de Vaud perçoit un impôt sur les successions, avec des exonérations selon le lien de parenté [À COMPLÉTER : barème et exonérations]. L’administration fiscale envoie ses demandes avec des délais : ce sont des délais légaux.',
          aFaire: ['Attendre le courrier de l’administration cantonale des impôts et noter ses délais comme délais légaux.', 'Remplir la dernière déclaration avec l’aide d’un·e fiduciaire si nécessaire.'],
          genereJalon: true,
          sources: [src('Loi vaudoise concernant le droit de mutation sur les transferts immobiliers et l’impôt sur les successions et donations [À VÉRIFIER]')],
        },
        {
          id: 'partage',
          titre: 'Partager et clore',
          moisParRapportAuRepere: 6,
          quand: 'Quand tout est réuni',
          pourquoi:
            'Une fois les dettes réglées et les impôts payés, les héritiers partagent. Un partage amiable écrit évite les conflits ; un·e notaire peut le rédiger. Les comptes se ferment, les abonnements s’arrêtent, le logement est rendu.',
          aFaire: ['Établir une convention de partage écrite entre héritiers.', 'Fermer les comptes et résilier ce qui reste.'],
          genereJalon: true,
          sources: [CC('602 ss', 'partage de la succession')],
        },
      ],
    },
    {
      id: 'et-vous',
      titre: 'Et vous',
      sousTitre: 'Le deuil après l’accompagnement',
      etapes: [
        {
          id: 'soutien-deuil',
          titre: 'Chercher un soutien',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          pourquoi:
            'Quand on a accompagné quelqu’un pendant des années, le deuil se double d’un vide de rôle. Des groupes de soutien existent ; Espace Proches accompagne aussi les anciens proches aidants [À VÉRIFIER].',
          aFaire: ['Appeler Espace Proches (0800 660 660) ou une association d’accompagnement du deuil.'],
          contacts: [ESPACE_PROCHES],
          genereJalon: false,
          sources: [VD('proches aidants', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Guide social romand — décès et succession', texte: 'Démarches après un décès, par canton.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
    { titre: 'État civil — État de Vaud', texte: 'Annonce du décès, actes, arrondissements.', lien: { libelle: 'vd.ch — état civil', url: 'https://www.vd.ch/etat-civil' } },
  ],
}
