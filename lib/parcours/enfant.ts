// Parcours de la catégorie « Enfant et jeune » — canton de Vaud.
//
// Tous ces parcours sont PROVISOIRES sauf mention contraire : les étapes sont plausibles et
// s'appuient sur le droit fédéral (LAI, RAI) et sur l'organisation vaudoise telle que connue,
// mais aucune n'a été relue contre sa source. Les dénominations de services cantonaux, les
// délais et les formulaires sont marqués [À VÉRIFIER] ou [À COMPLÉTER] dans le texte.

import type { Parcours } from './types'
import { AVERTISSEMENT_PROVISOIRE, LAI, VD, src } from './sources'

// ---------------------------------------------------------------------------
// Préparer l'entrée à l'école
// ---------------------------------------------------------------------------

export const entreeEcole: Parcours = {
  id: 'entree-ecole',
  titre: 'Préparer l’entrée à l’école d’un enfant en situation de handicap',
  positionnement: 'Pour les parents d’un enfant de 2 à 4 ans dont les besoins particuliers sont déjà connus',
  categorie: 'enfant',
  canton: 'Vaud',
  autorite: 'Pédagogie spécialisée (DGEO)',
  delaiRealiste: { texte: 'Commencer 12 à 18 mois avant la rentrée', statut: 'a-verifier' },
  icone: 'school',
  statut: 'provisoire',
  publie: false,
  repere: 'entree-ecole',
  resume:
    'Dans le canton de Vaud, un enfant entre à l’école l’année de ses 4 ans [À VÉRIFIER : 4 ans révolus au 31 juillet]. Quand ses besoins particuliers sont déjà connus, tout se joue dans les mois qui précèdent : demander les mesures de pédagogie spécialisée, choisir avec l’école la forme de scolarisation, organiser les transports et transmettre ce qui aide votre enfant. Ce parcours met ces étapes dans l’ordre, à partir de sa date de naissance.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'avant-4-ans',
      titre: 'Bien avant la rentrée',
      sousTitre: 'Poser les bases pendant les années préscolaires',
      etapes: [
        {
          id: 'mesures-prescolaires',
          titre: 'Faire le point sur le soutien préscolaire',
          moisParRapportAuRepere: -24,
          quand: 'Vers 2 ans, ou dès que le besoin est identifié',
          pourquoi:
            'Avant l’école, un enfant en situation de handicap peut être suivi à la maison ou en garderie par un service éducatif itinérant, une logopédiste, une psychomotricienne. Ces professionnels connaissent votre enfant et leurs bilans serviront à la demande de mesures scolaires.',
          aFaire: [
            'Demander au pédiatre ou au service qui suit votre enfant quelles prestations préscolaires existent et comment y accéder [À VÉRIFIER : service éducatif itinérant (SEI), prestations de pédagogie spécialisée avant l’école].',
            'Garder une copie de chaque bilan et rapport dans le coffre : ils seront demandés plus tard.',
          ],
          contacts: [
            { nom: 'Pédiatre de votre enfant', role: 'Premier interlocuteur, prescrit les bilans' },
            { nom: 'Pédagogie spécialisée — canton de Vaud', role: 'Prestations préscolaires [À VÉRIFIER : porte d’entrée exacte]', lien: { libelle: 'vd.ch — pédagogie spécialisée', url: 'https://www.vd.ch/formation/pedagogie-specialisee' } },
          ],
          pieces: ['Rapports et bilans existants (médicaux, logopédie, psychomotricité, développement)'],
          genereJalon: true,
          sources: [VD('pédagogie spécialisée — prestations préscolaires [À VÉRIFIER]', 'https://www.vd.ch/formation/pedagogie-specialisee')],
        },
        {
          id: 'demande-ai-mineur',
          titre: 'Vérifier que la demande AI a été faite',
          moisParRapportAuRepere: -20,
          quand: 'Dès que le diagnostic est posé',
          pourquoi:
            'L’assurance-invalidité prend en charge, pour un enfant, le traitement de certaines infirmités congénitales, des moyens auxiliaires et, selon l’aide nécessaire au quotidien, une allocation pour impotent. La demande ne se fait pas toute seule et l’instruction prend des mois : mieux vaut qu’elle soit en cours avant la rentrée.',
          aFaire: [
            'Si aucune demande n’a été déposée, suivre le parcours « Demander l’AI et l’allocation pour impotent pour un enfant ».',
            'Si une décision existe, la ranger dans le coffre : elle sera utile à l’école pour justifier certains besoins.',
          ],
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Prestations AI pour mineurs', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          lienInterne: { libelle: 'Ouvrir le parcours AI', href: '/parcours/premiere-demande-ai' },
          genereJalon: false,
          sources: [LAI('13', 'mesures médicales pour les infirmités congénitales'), LAI('42', 'allocation pour impotent')],
        },
        {
          id: 'premier-contact-ecole',
          titre: 'Prendre contact avec l’école de votre secteur',
          moisParRapportAuRepere: -12,
          quand: 'Un an avant la rentrée',
          pourquoi:
            'L’établissement scolaire de votre domicile est votre interlocuteur pour la scolarisation, quelle que soit la forme qu’elle prendra ensuite. Le rencontrer tôt permet d’expliquer la situation, de connaître les délais de l’établissement et d’éviter que la demande de mesures arrive trop tard.',
          aFaire: [
            'Écrire à la direction de l’établissement primaire de votre commune pour annoncer l’arrivée de votre enfant et ses besoins particuliers.',
            'Demander un entretien et noter les questions à poser dans le dossier.',
            'Demander quel est le calendrier d’inscription et à quelle date les demandes de mesures doivent être déposées [À COMPLÉTER].',
          ],
          contacts: [{ nom: 'Direction de l’établissement scolaire', role: 'Inscription et organisation de la scolarité' }],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          genereJalon: true,
          sources: [VD('inscription à l’école obligatoire [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'annee-precedente',
      titre: 'L’année qui précède',
      sousTitre: 'Demander les mesures et choisir la forme de scolarisation',
      etapes: [
        {
          id: 'demande-mesures-renforcees',
          titre: 'Demander des mesures de pédagogie spécialisée',
          moisParRapportAuRepere: -10,
          quand: 'Dix mois avant la rentrée au plus tard [À VÉRIFIER]',
          pourquoi:
            'La loi vaudoise sur la pédagogie spécialisée distingue des mesures ordinaires (soutien dans la classe) et des mesures renforcées (aide à l’intégration, enseignement spécialisé, scolarisation en école spécialisée). Les mesures renforcées passent par une évaluation formelle des besoins de l’enfant, décidée par le canton, et son instruction prend plusieurs mois.',
          aFaire: [
            'Demander à l’école ou à la direction de la pédagogie spécialisée comment déposer la demande et quel formulaire utiliser [À COMPLÉTER : formulaire et adresse].',
            'Joindre les rapports récents (moins d’un an si possible) : médicaux, logopédie, psychomotricité, service éducatif itinérant.',
            'Noter dans le dossier tout délai indiqué par écrit comme délai légal.',
          ],
          contacts: [
            { nom: 'Direction de la pédagogie spécialisée (DGEO)', role: 'Décide des mesures renforcées [À VÉRIFIER : dénomination et compétence exactes]', lien: { libelle: 'vd.ch — pédagogie spécialisée', url: 'https://www.vd.ch/formation/pedagogie-specialisee' } },
          ],
          pieces: [
            'Rapports médicaux et bilans récents',
            'Formulaire de demande de mesures [À COMPLÉTER : nom exact]',
            'Autorisation de transmettre les informations entre professionnels',
          ],
          pointsAttention: ['Un rapport de plus de douze mois est souvent redemandé : vérifiez les dates avant d’envoyer.'],
          genereJalon: true,
          sources: [src('Loi vaudoise sur la pédagogie spécialisée (LPS) — mesures ordinaires et renforcées [À VÉRIFIER : articles]'), src('Procédure d’évaluation standardisée (PES) de la CDIP [À VÉRIFIER : application dans le canton de Vaud]')],
        },
        {
          id: 'forme-de-scolarisation',
          titre: 'Choisir la forme de scolarisation avec l’école',
          moisParRapportAuRepere: -6,
          quand: 'Au printemps qui précède la rentrée',
          pourquoi:
            'Classe ordinaire avec soutien, classe ordinaire avec aide à l’intégration, classe ou école d’enseignement spécialisé : la décision revient au canton sur la base de l’évaluation, mais elle se construit avec vous. Visiter les lieux et rencontrer les équipes vous aide à vous faire une opinion et à la faire entendre.',
          aFaire: [
            'Demander à visiter les structures envisagées et à rencontrer les enseignant·es concernés.',
            'Écrire ce qui compte pour vous et pour votre enfant (rythme, transports, contacts avec les autres enfants) et le remettre aux personnes qui instruisent la demande.',
            'Demander à recevoir la décision par écrit, avec la voie et le délai de recours.',
          ],
          contacts: [{ nom: 'Direction de l’établissement scolaire et pédagogie spécialisée', role: 'Concertation sur l’orientation' }],
          pointsAttention: ['Une décision de mesures est révisable : ce qui est choisi pour la première année n’est pas figé pour toute la scolarité.'],
          genereJalon: true,
          sources: [src('LPS — modalités de scolarisation [À VÉRIFIER]')],
        },
        {
          id: 'transports-accueil',
          titre: 'Organiser les transports et l’accueil hors classe',
          moisParRapportAuRepere: -4,
          quand: 'Avant l’été',
          pourquoi:
            'Si votre enfant est scolarisé hors de son secteur ou ne peut pas se déplacer seul, un transport peut être organisé et pris en charge [À VÉRIFIER : conditions et prise en charge]. L’accueil parascolaire (cantine, devoirs, avant et après l’école) doit aussi être anticipé : les structures ordinaires n’ont pas toujours les moyens d’accueillir un enfant qui a besoin d’un accompagnement.',
          aFaire: [
            'Demander à l’école ou à la pédagogie spécialisée qui organise et finance le transport scolaire dans votre situation [À COMPLÉTER].',
            'Contacter la structure d’accueil parascolaire de votre commune pour savoir si un accompagnement est possible.',
          ],
          contacts: [{ nom: 'Commune de domicile — accueil parascolaire', role: 'Accueil avant et après l’école' }],
          genereJalon: true,
          sources: [VD('transports scolaires des élèves en pédagogie spécialisée [À VÉRIFIER]')],
        },
        {
          id: 'portrait-ecole',
          titre: 'Préparer ce que l’école doit savoir de votre enfant',
          moisParRapportAuRepere: -2,
          quand: 'Pendant l’été',
          pourquoi:
            'Une nouvelle enseignante, une aide à l’intégration, une équipe de cantine : chacun découvrira votre enfant. Un portrait écrit à la première personne — comment je communique, ce qui me rassure, ce qui me met en difficulté — leur donne dès le premier jour ce que vous mettez des années à apprendre.',
          aFaire: [
            'Compléter le portrait dans le dossier, puis l’imprimer ou en donner l’accès à l’enseignant·e référent·e.',
            'Ajouter aux intervenants les personnes qui suivront votre enfant à l’école.',
          ],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [src('Pratique du portrait (CLAUDE.md §2.3) — pas de source légale')],
        },
      ],
    },
    {
      id: 'rentree-et-apres',
      titre: 'La rentrée et les premiers mois',
      sousTitre: 'Installer le suivi et ajuster',
      etapes: [
        {
          id: 'reseau-de-rentree',
          titre: 'Demander une réunion de réseau',
          moisParRapportAuRepere: 1,
          quand: 'Dans les semaines qui suivent la rentrée',
          pourquoi:
            'La réunion de réseau réunit les personnes qui suivent votre enfant (enseignant·e, thérapeutes, pédagogie spécialisée, vous). C’est là que se fixent les objectifs de l’année et la manière dont vous serez informés. Sans réunion, chacun travaille de son côté.',
          aFaire: [
            'Demander la date de la première réunion de réseau et préparer vos questions dans le dossier.',
            'Demander le document qui fixe les objectifs de l’année [À VÉRIFIER : projet pédagogique individualisé ou équivalent] et le ranger dans le coffre.',
          ],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('Pratique vaudoise des réseaux [À VÉRIFIER : base réglementaire]')],
        },
        {
          id: 'point-premier-trimestre',
          titre: 'Faire un point après le premier trimestre',
          moisParRapportAuRepere: 4,
          quand: 'Vers décembre',
          pourquoi:
            'Les premiers mois révèlent ce qui fonctionne et ce qui manque. Les mesures accordées sont limitées dans le temps et doivent être renouvelées [À COMPLÉTER : durée habituelle] ; un point de situation à ce moment-là évite de découvrir en juin qu’il fallait demander le renouvellement en mars.',
          aFaire: [
            'Demander un entretien avec l’enseignant·e et noter ce qui a changé.',
            'Demander la date limite de renouvellement des mesures et la noter dès qu’elle est écrite.',
          ],
          genereJalon: true,
          sources: [src('LPS — durée et renouvellement des mesures [À COMPLÉTER]')],
        },
        {
          id: 'proche-aidant',
          titre: 'Et vous, le proche aidant',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          pourquoi:
            'Une rentrée qui se prépare sur deux ans, des réunions, des rapports à collecter : cela pèse sur les parents. Le canton de Vaud propose une écoute et une orientation gratuites aux proches aidants, et des associations de parents partagent leur expérience des mêmes démarches.',
          aFaire: ['Appeler la permanence gratuite des proches aidants (0800 660 660).', 'Suivre le parcours « Faire reconnaître votre rôle de proche aidant » si vous ne l’avez pas encore fait.'],
          contacts: [{ nom: 'Espace Proches', role: 'Écoute et conseil gratuits pour les proches aidants', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } }],
          lienInterne: { libelle: 'Parcours proche aidant', href: '/parcours/statut-proche-aidant' },
          genereJalon: false,
          sources: [VD('proches aidants', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Pédagogie spécialisée — État de Vaud', texte: 'Présentation des mesures et des prestations pour les élèves à besoins particuliers.', lien: { libelle: 'vd.ch', url: 'https://www.vd.ch/formation/pedagogie-specialisee' } },
    { titre: 'Info handicap', texte: 'Plateforme de Pro Infirmis : questions juridiques et pratiques, dont la scolarité.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Première demande AI et allocation pour impotent
// ---------------------------------------------------------------------------

export const premiereDemandeAi: Parcours = {
  id: 'premiere-demande-ai',
  titre: 'Demander l’AI et l’allocation pour impotent pour un enfant',
  positionnement: 'Pour les parents d’un enfant mineur dont le handicap ou la maladie vient d’être reconnu',
  categorie: 'enfant',
  canton: 'Vaud',
  autorite: 'Office AI pour le canton de Vaud',
  delaiRealiste: { texte: '3 à 12 mois selon la prestation', statut: 'a-verifier' },
  icone: 'hand-heart',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'L’assurance-invalidité n’intervient pas d’elle-même : il faut la solliciter. Pour un enfant, elle peut prendre en charge le traitement de certaines infirmités congénitales, des moyens auxiliaires et, si votre enfant a besoin d’une aide importante au quotidien, verser une allocation pour impotent. Ce parcours suit la demande depuis la constitution du dossier jusqu’à la décision et ses suites.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'constituer',
      titre: 'Constituer la demande',
      sousTitre: 'Comprendre ce qui peut être demandé et réunir les pièces',
      etapes: [
        {
          id: 'comprendre-prestations',
          titre: 'Comprendre ce que l’AI peut faire pour un enfant',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Pour un mineur, l’AI n’est pas une rente : ce sont des prestations distinctes, chacune avec ses conditions. Les mesures médicales pour une infirmité congénitale figurant sur la liste fédérale ; les moyens auxiliaires ; l’allocation pour impotent (API) quand l’enfant a besoin d’aide pour les actes ordinaires de la vie plus que les enfants de son âge ; un supplément pour soins intenses si les soins dépassent un certain nombre d’heures par jour [À VÉRIFIER : seuils] ; et, sous conditions, une contribution d’assistance.',
          aFaire: [
            'Lire la page « mineurs » de l’office AI et noter les prestations qui semblent correspondre à votre enfant.',
            'En cas de doute, demander un entretien à Pro Infirmis Vaud, qui conseille gratuitement les familles.',
          ],
          contacts: [
            { nom: 'Office AI pour le canton de Vaud', role: 'Instruction des demandes', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } },
            { nom: 'Pro Infirmis Vaud', role: 'Conseil social gratuit', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } },
          ],
          genereJalon: false,
          sources: [LAI('13', 'infirmités congénitales'), LAI('21', 'moyens auxiliaires'), LAI('42', 'allocation pour impotent'), LAI('42ter al. 3', 'supplément pour soins intenses'), LAI('42quater', 'contribution d’assistance')],
        },
        {
          id: 'reunir-rapports',
          titre: 'Réunir les rapports médicaux',
          moisParRapportAuRepere: 0,
          quand: 'Avant d’envoyer la demande',
          pourquoi:
            'L’office AI instruit sur pièces. Un dossier qui décrit le diagnostic, la date de début des troubles et surtout leurs conséquences concrètes au quotidien est traité plus vite et plus justement qu’un dossier que l’office doit compléter lui-même.',
          aFaire: [
            'Demander au pédiatre et aux spécialistes un rapport récent qui décrit les limitations au quotidien, pas seulement le diagnostic.',
            'Rassembler les bilans existants (hôpital, thérapeutes, école ou garderie).',
            'Ranger chaque pièce dans le coffre avec sa date.',
          ],
          pieces: ['Rapports médicaux récents', 'Bilans des thérapeutes', 'Carte d’assuré AVS/AI de l’enfant', 'Attestation de domicile ou livret de famille'],
          lienInterne: { libelle: 'Ouvrir le coffre', href: '/documents' },
          genereJalon: true,
          sources: [src('Pratique de l’office AI — instruction sur pièces [pas de référence légale précise]')],
        },
        {
          id: 'deposer-demande',
          titre: 'Remplir et envoyer la demande',
          moisParRapportAuRepere: 1,
          quand: 'Dès que les pièces sont réunies',
          pourquoi:
            'La demande se fait sur le formulaire de l’office AI [À VÉRIFIER : formulaire « Demande de prestations AI pour mineurs »], signé par le ou les représentants légaux. La date de dépôt compte : certaines prestations ne sont versées qu’à partir de la demande, jamais pour la période antérieure.',
          aFaire: [
            'Télécharger et remplir le formulaire de demande pour mineurs ; cocher toutes les prestations envisagées, il n’est pas nécessaire d’en être sûr.',
            'Signer l’autorisation qui permet à l’office AI de demander des renseignements aux médecins.',
            'Envoyer le tout à l’office AI du canton de domicile et garder une copie datée.',
          ],
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Réception des demandes', lien: { libelle: 'aivd.ch — formulaires', url: 'https://www.aivd.ch/' } }],
          pieces: ['Formulaire de demande signé', 'Rapports réunis à l’étape précédente'],
          pointsAttention: ['Envoyez la demande même si un rapport manque : l’office AI peut le réclamer lui-même, et la date de dépôt sera protégée.'],
          genereJalon: true,
          sources: [LAI('29', 'naissance du droit — versement dès la demande [À VÉRIFIER pour les prestations concernées]')],
        },
      ],
    },
    {
      id: 'instruction',
      titre: 'Pendant l’instruction',
      sousTitre: 'Répondre, préparer l’enquête, lire le projet de décision',
      etapes: [
        {
          id: 'repondre-office',
          titre: 'Répondre aux courriers de l’office AI',
          moisParRapportAuRepere: 2,
          quand: 'Au fil des courriers',
          pourquoi:
            'L’office AI demande des questionnaires, des précisions, des rapports complémentaires. Chaque courrier porte une date de réponse : c’est un délai légal, à noter tel quel dans le dossier. Un dossier sans réponse peut être classé.',
          aFaire: [
            'À chaque courrier reçu, l’ajouter au coffre et noter la date de réponse comme délai légal.',
            'Répondre par écrit et garder la preuve d’envoi.',
          ],
          lienInterne: { libelle: 'Ajouter un courrier', href: '/documents' },
          genereJalon: false,
          sources: [src('Loi fédérale sur la partie générale du droit des assurances sociales (LPGA), art. 43 — instruction de la demande')],
        },
        {
          id: 'enquete-domicile',
          titre: 'Préparer l’enquête à domicile pour l’allocation pour impotent',
          moisParRapportAuRepere: 3,
          quand: 'Quand l’office AI annonce la visite',
          pourquoi:
            'Pour l’allocation pour impotent, une personne mandatée par l’office AI vient à la maison évaluer l’aide dont votre enfant a besoin, acte par acte : se lever, s’habiller, manger, se laver, se déplacer, être surveillé. C’est cette évaluation qui fixe le degré (faible, moyen, grave) et donc le montant. Une famille qui a l’habitude d’aider ne voit plus tout ce qu’elle fait.',
          aFaire: [
            'Tenir pendant une semaine un journal simple de l’aide apportée, heure par heure, y compris la nuit.',
            'Le jour de la visite, décrire une journée ordinaire, pas une bonne journée.',
            'Comparer avec ce qu’un enfant du même âge sans handicap fait seul : c’est la référence de l’AI.',
          ],
          concerne: 'Seulement si une allocation pour impotent ou un supplément pour soins intenses est demandé',
          pieces: ['Journal de l’aide apportée sur une semaine'],
          genereJalon: true,
          sources: [src('Règlement sur l’assurance-invalidité (RAI), art. 37 et 39 — évaluation de l’impotence et des soins intenses [À VÉRIFIER]')],
        },
        {
          id: 'projet-decision',
          titre: 'Lire le projet de décision et réagir si besoin',
          moisParRapportAuRepere: 6,
          quand: 'À réception du préavis',
          pourquoi:
            'Avant de décider, l’office AI envoie un projet de décision. Vous pouvez faire part de vos objections dans le délai indiqué [À VÉRIFIER : 30 jours]. C’est le moment le plus utile pour contester : plus simple qu’un recours, et l’office peut encore changer d’avis.',
          aFaire: [
            'Noter le délai de réponse écrit sur le préavis comme délai légal.',
            'Si le projet vous semble incomplet, demander conseil (Pro Infirmis, Procap, avocat·e) avant de répondre.',
            'Répondre par écrit avec les pièces qui manquaient.',
          ],
          contacts: [{ nom: 'Procap ou Pro Infirmis', role: 'Conseil juridique en assurances sociales', lien: { libelle: 'procap.ch', url: 'https://www.procap.ch/' } }],
          genereJalon: false,
          sources: [src('RAI, art. 73ter — procédure de préavis [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'apres-decision',
      titre: 'Après la décision',
      sousTitre: 'Comprendre, contester si nécessaire, prévoir la suite',
      etapes: [
        {
          id: 'lire-decision',
          titre: 'Lire la décision et ses voies de recours',
          moisParRapportAuRepere: 8,
          quand: 'À réception de la décision',
          pourquoi:
            'La décision indique ce qui est accordé, à partir de quand et pour combien de temps. Elle indique aussi la voie et le délai de recours [À VÉRIFIER : 30 jours auprès du Tribunal cantonal, Cour des assurances sociales]. Ce délai est un délai légal : passé, la décision est définitive.',
          aFaire: [
            'Ranger la décision dans le coffre et noter le délai de recours comme délai légal.',
            'Vérifier la date de début du droit et le degré retenu.',
            'En cas de désaccord, demander conseil avant la fin du délai.',
          ],
          ficheId: 'api',
          genereJalon: false,
          sources: [src('LPGA, art. 56 et 60 — recours contre une décision, délai de 30 jours [À VÉRIFIER]')],
        },
        {
          id: 'completer',
          titre: 'Demander ce qui découle de la décision',
          moisParRapportAuRepere: 9,
          quand: 'Une fois la décision reçue',
          pourquoi:
            'Une allocation pour impotent ouvre d’autres portes : la contribution d’assistance, qui permet d’engager une personne pour aider à la maison [À VÉRIFIER : conditions pour les mineurs], et la bonification pour tâches d’assistance sur votre propre AVS si le degré est au moins moyen [À VÉRIFIER].',
          aFaire: [
            'Se renseigner sur la contribution d’assistance auprès de l’office AI si votre enfant vit à la maison.',
            'Suivre le parcours « Faire reconnaître votre rôle de proche aidant » pour la bonification AVS.',
          ],
          lienInterne: { libelle: 'Parcours proche aidant', href: '/parcours/statut-proche-aidant' },
          genereJalon: true,
          sources: [LAI('42quater', 'contribution d’assistance'), src('Loi fédérale sur l’assurance-vieillesse et survivants (LAVS), art. 29septies — bonification pour tâches d’assistance')],
        },
        {
          id: 'revision',
          titre: 'Prévoir la révision',
          moisParRapportAuRepere: null,
          quand: 'Quand la situation change, et à chaque révision annoncée',
          pourquoi:
            'L’allocation pour impotent et les mesures médicales sont accordées pour une période et révisées. Toute amélioration ou aggravation doit être annoncée à l’office AI. Une révision annoncée par courrier est une nouvelle instruction : les mêmes réflexes s’appliquent.',
          aFaire: ['Annoncer par écrit tout changement important dans la situation de votre enfant.', 'À la majorité, suivre le parcours « Préparer la majorité » : les prestations changent de nature à 18 ans.'],
          lienInterne: { libelle: 'Parcours majorité', href: '/parcours/transition-majorite' },
          genereJalon: false,
          sources: [src('LPGA, art. 17 — révision des prestations'), src('LPGA, art. 31 — obligation d’annoncer les changements')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Office AI pour le canton de Vaud', texte: 'Formulaires, explications par prestation, contacts.', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } },
    { titre: 'Pro Infirmis Vaud', texte: 'Conseil social et juridique gratuit pour les personnes en situation de handicap et leurs proches.', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } },
    { titre: 'Procap', texte: 'Association de personnes avec handicap ; service juridique en assurances sociales.', lien: { libelle: 'procap.ch', url: 'https://www.procap.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Entrée en établissement socio-éducatif (enfant, adolescent)
// ---------------------------------------------------------------------------

export const entreeEseEnfant: Parcours = {
  id: 'entree-ese-enfant',
  titre: 'Préparer l’entrée en établissement d’un enfant ou d’un adolescent',
  positionnement: 'Pour les parents qui envisagent un internat, un foyer ou un accueil relais pour un enfant en situation de handicap',
  categorie: 'enfant',
  canton: 'Vaud',
  autorite: 'Pédagogie spécialisée, DGEJ [À VÉRIFIER]',
  delaiRealiste: { texte: '6 à 18 mois selon les places', statut: 'a-verifier' },
  icone: 'building',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'Un enfant peut avoir besoin, pour un temps ou durablement, d’être accueilli hors de la maison : internat de semaine lié à une école spécialisée, foyer, accueil relais pour souffler. Dans le canton de Vaud, la porte d’entrée dépend du type d’accueil [À VÉRIFIER : pédagogie spécialisée pour les internats scolaires, Direction générale de l’enfance et de la jeunesse pour les foyers]. Ce parcours aide à clarifier le besoin, à déposer la demande et à préparer l’entrée.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'clarifier',
      titre: 'Clarifier le besoin',
      sousTitre: 'De quel accueil s’agit-il, et pour combien de temps',
      etapes: [
        {
          id: 'type-accueil',
          titre: 'Nommer le type d’accueil recherché',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Internat de semaine, foyer à l’année, accueil relais de quelques jours par mois, court séjour d’urgence : ce ne sont ni les mêmes lieux, ni les mêmes portes d’entrée, ni les mêmes financements. Poser le mot juste dès le début évite des mois d’attente sur la mauvaise liste.',
          aFaire: [
            'Décrire par écrit ce que vous cherchez : combien de nuits, quelles périodes, pour quelle raison.',
            'En parler avec le réseau qui suit votre enfant (école, pédiatre, assistant·e social·e) : ce sont eux qui connaissent les portes d’entrée.',
          ],
          contacts: [{ nom: 'Pro Infirmis Vaud', role: 'Conseil et orientation', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } }],
          genereJalon: true,
          sources: [src('Organisation vaudoise de l’accueil des mineurs en situation de handicap [À COMPLÉTER]')],
        },
        {
          id: 'visiter',
          titre: 'Visiter les lieux possibles',
          moisParRapportAuRepere: 1,
          quand: 'Avant de déposer une demande',
          pourquoi:
            'Une visite dit ce qu’aucune brochure ne dit : le bruit, le rythme, la manière dont les éducateurs parlent aux enfants. Elle permet aussi de poser les questions pratiques — week-ends, vacances, transports, contacts avec l’école.',
          aFaire: ['Demander une visite à chaque établissement envisagé et noter vos impressions dans le dossier.', 'Demander s’il existe une liste d’attente et sa longueur habituelle.'],
          lienInterne: { libelle: 'Préparer les questions', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'demander',
      titre: 'Déposer la demande',
      sousTitre: 'Par la bonne porte, avec un dossier complet',
      etapes: [
        {
          id: 'deposer',
          titre: 'Déposer la demande auprès de l’autorité compétente',
          moisParRapportAuRepere: 2,
          quand: 'Dès que le type d’accueil est clair',
          pourquoi:
            'L’admission dans une structure subventionnée passe par une décision cantonale, pas par l’établissement seul [À VÉRIFIER : procédure et service compétent selon le type d’accueil]. La demande s’appuie sur les rapports existants et sur une évaluation des besoins.',
          aFaire: [
            'Demander au réseau de votre enfant qui dépose la demande et sur quel formulaire [À COMPLÉTER].',
            'Joindre les rapports récents et, s’il existe, le portrait de votre enfant.',
            'Noter tout délai indiqué par écrit comme délai légal.',
          ],
          pieces: ['Rapports médicaux et éducatifs récents', 'Décision de mesures de pédagogie spécialisée, s’il y en a une', 'Décision AI (allocation pour impotent), s’il y en a une'],
          genereJalon: true,
          sources: [src('Procédure d’admission [À COMPLÉTER]')],
        },
        {
          id: 'attente',
          titre: 'Pendant l’attente, tenir le dossier à jour',
          moisParRapportAuRepere: 4,
          quand: 'Tous les deux ou trois mois',
          pourquoi:
            'Les places sont rares et une demande qui n’est plus d’actualité peut passer derrière. Signaler régulièrement que le besoin persiste, et tout changement (aggravation, épuisement familial), maintient la demande vivante et permet une prise en charge d’urgence si nécessaire.',
          aFaire: ['Reprendre contact avec le service qui instruit la demande et noter la réponse dans le dossier.', 'Demander un accueil relais ou un court séjour en attendant si la situation à la maison devient difficile.'],
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'preparer-entree',
      titre: 'Préparer l’entrée',
      sousTitre: 'Le financement, les papiers, la transmission',
      etapes: [
        {
          id: 'financement',
          titre: 'Comprendre qui paie quoi',
          moisParRapportAuRepere: 6,
          quand: 'Dès qu’une place se profile',
          pourquoi:
            'Dans une structure subventionnée, le canton prend en charge l’essentiel ; une participation des parents peut être demandée [À COMPLÉTER : base et montant]. L’allocation pour impotent est réduite quand l’enfant séjourne en institution aux frais de la collectivité [À VÉRIFIER : règle exacte].',
          aFaire: ['Demander par écrit à l’établissement et au service cantonal le détail des frais à votre charge.', 'Prévenir l’office AI de la date d’entrée : le montant de l’allocation pour impotent en dépend.'],
          genereJalon: true,
          sources: [src('LAI, art. 42 al. 5 et RAI — allocation pour impotent en cas de séjour en institution [À VÉRIFIER]'), src('Participation des parents [À COMPLÉTER]')],
        },
        {
          id: 'transmettre',
          titre: 'Transmettre ce qui aide votre enfant',
          moisParRapportAuRepere: 7,
          quand: 'Avant le premier jour',
          pourquoi:
            'Une équipe qui reçoit un enfant a besoin de savoir ce qui le rassure, ce qui le met en difficulté, comment il communique. Le portrait à la première personne est fait pour cela. Le contrat ou la convention d’accueil fixe le reste : week-ends, vacances, communication avec vous.',
          aFaire: ['Mettre le portrait à jour et en donner une copie à l’équipe.', 'Lire le contrat d’accueil ; noter les délais de résiliation et les modalités de communication.', 'Ajouter le référent de l’établissement aux intervenants du dossier.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'suivi',
          titre: 'Installer le suivi après l’entrée',
          moisParRapportAuRepere: 9,
          quand: 'Dans les trois mois qui suivent l’entrée',
          pourquoi:
            'Le premier bilan permet d’ajuster le projet d’accompagnement et de dire ce qui ne va pas. En cas de désaccord avec l’établissement, une permanence cantonale existe pour les résidents et leurs proches.',
          aFaire: ['Demander un bilan de réseau après les premières semaines.', 'En cas de difficulté non résolue : contacter la Permanence d’orientation Patients / Résidents (021 316 09 87).'],
          contacts: [{ nom: 'Permanence d’orientation Patients / Résidents', role: 'Insatisfaction, problèmes, litiges', lien: { libelle: 'vd.ch — plaintes santé-social', url: 'https://www.vd.ch/plaintes-sante-social' } }],
          genereJalon: true,
          sources: [VD('plaintes santé-social', 'https://www.vd.ch/plaintes-sante-social')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Pro Infirmis Vaud', texte: 'Conseil aux familles, orientation vers les structures.', lien: { libelle: 'proinfirmis.ch', url: 'https://www.proinfirmis.ch/' } },
    { titre: 'Espace Proches', texte: 'Écoute et orientation pour les proches aidants, y compris pour un accueil relais.', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } },
  ],
}

// ---------------------------------------------------------------------------
// Transition école → formation ou atelier
// ---------------------------------------------------------------------------

export const transitionFormation: Parcours = {
  id: 'transition-formation',
  titre: 'Passer de l’école à une formation ou à un atelier',
  positionnement: 'Pour les parents d’un·e jeune en situation de handicap dans ses deux dernières années de scolarité',
  categorie: 'enfant',
  canton: 'Vaud',
  autorite: 'Office AI (orientation professionnelle)',
  delaiRealiste: { texte: 'Commencer deux ans avant la fin de l’école', statut: 'a-verifier' },
  icone: 'briefcase',
  statut: 'provisoire',
  publie: false,
  repere: 'activation',
  resume:
    'La fin de la scolarité ne prévient pas : elle arrive à une date fixe, et sans préparation le jeune se retrouve sans activité. Formation professionnelle initiale soutenue par l’AI, formation pratique, atelier ou centre de jour d’un établissement socio-éducatif : chaque voie a son calendrier, et l’office AI ne peut instruire une formation qu’après une orientation. Ce parcours démarre le jour où vous l’ouvrez, idéalement deux ans avant la fin de l’école.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'deux-ans-avant',
      titre: 'Deux ans avant',
      sousTitre: 'Ouvrir les options',
      etapes: [
        {
          id: 'orientation-ai',
          titre: 'Demander l’orientation professionnelle de l’AI',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'L’AI propose une orientation professionnelle aux assurés que leur handicap gêne dans le choix d’une profession. C’est la première marche : sans elle, ni formation professionnelle initiale ni mesures de réadaptation. Elle se demande à l’office AI, avec l’école.',
          aFaire: ['Demander à l’école que la demande d’orientation professionnelle soit déposée, ou la déposer vous-même auprès de l’office AI.', 'Ranger la confirmation de dépôt dans le coffre.'],
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Orientation professionnelle', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          pieces: ['Formulaire de demande AI (si aucune demande n’est en cours)', 'Bilan scolaire récent'],
          genereJalon: true,
          sources: [LAI('15', 'orientation professionnelle')],
        },
        {
          id: 'bilan-ecole',
          titre: 'Faire un bilan avec l’école sur les voies possibles',
          moisParRapportAuRepere: 1,
          quand: 'Au premier réseau de l’année',
          pourquoi:
            'L’école spécialisée ou l’enseignant·e référent·e connaît les voies qui ont fonctionné pour d’autres élèves : formation en entreprise avec soutien, attestation fédérale (AFP), formation pratique, centre de formation spécialisé, atelier. Le bilan scolaire est aussi une pièce du dossier AI.',
          aFaire: ['Demander à l’école un bilan écrit des compétences et des besoins d’accompagnement.', 'Lister avec elle les voies envisageables et ce qui reste à vérifier pour chacune.'],
          lienInterne: { libelle: 'Préparer le réseau', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'visites-stages',
          titre: 'Visiter et organiser des stages',
          moisParRapportAuRepere: 4,
          quand: 'Dans l’année',
          pourquoi:
            'Un stage de quelques jours vaut mieux que toutes les descriptions. Les centres de formation et les ateliers accueillent des stagiaires ; l’AI peut financer un stage d’observation dans le cadre de l’orientation.',
          aFaire: ['Demander à la conseillère ou au conseiller AI un stage d’observation dans les lieux envisagés.', 'Noter après chaque stage ce qui a plu et ce qui a été difficile.'],
          genereJalon: true,
          sources: [LAI('15', 'orientation professionnelle — mesures d’observation [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'un-an-avant',
      titre: 'Un an avant',
      sousTitre: 'Déposer la demande pour la voie choisie',
      etapes: [
        {
          id: 'formation-initiale',
          titre: 'Demander la formation professionnelle initiale',
          moisParRapportAuRepere: 12,
          quand: 'Un an avant la fin de l’école',
          pourquoi:
            'Si la voie est une formation (apprentissage, AFP, formation pratique, formation en centre spécialisé), l’AI peut en prendre en charge les frais supplémentaires dus au handicap et verser une indemnité journalière pendant la formation [À VÉRIFIER : conditions et montants]. La décision se prend sur la base de l’orientation et d’une place trouvée.',
          aFaire: ['Déposer, avec le conseiller AI, la demande de formation professionnelle initiale pour la voie retenue.', 'Réunir le contrat ou la promesse de place du lieu de formation.'],
          concerne: 'Seulement si la voie retenue est une formation',
          contacts: [{ nom: 'Office AI pour le canton de Vaud', role: 'Formation professionnelle initiale', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } }],
          pieces: ['Rapport d’orientation professionnelle', 'Promesse de place ou contrat de formation'],
          genereJalon: true,
          sources: [LAI('16', 'formation professionnelle initiale'), LAI('22', 'indemnités journalières [À VÉRIFIER]')],
        },
        {
          id: 'inscription-dcish',
          titre: 'S’inscrire pour un atelier ou un centre de jour',
          moisParRapportAuRepere: 12,
          quand: 'Dès 16 ans révolus, un an avant la fin de l’école',
          pourquoi:
            'Si la voie est un atelier ou un centre de jour d’un établissement socio-éducatif, l’accès passe par le Dispositif cantonal d’indication et de suivi (DCISH), ouvert dès 16 ans révolus. Les listes d’attente sont longues : une inscription tardive laisse un vide après l’école.',
          aFaire: ['Remplir le formulaire d’accès à un établissement socio-éducatif (Pro Infirmis Vaud).', 'Ranger l’accusé de réception dans le coffre et relancer tous les trois mois.'],
          concerne: 'Seulement si la voie retenue est un atelier ou un centre de jour',
          contacts: [{ nom: 'DCISH — Pro Infirmis Vaud', role: 'Indication et suivi pour les établissements socio-éducatifs', lien: { libelle: 'proinfirmis.ch — DCISH', url: 'https://www.proinfirmis.ch/' } }],
          lienInterne: { libelle: 'Étape correspondante du parcours majorité', href: '/parcours/transition-majorite' },
          genereJalon: true,
          sources: [src('Memento handicap — DGCS, canton de Vaud (document de travail, septembre 2026) — DCISH')],
        },
      ],
    },
    {
      id: 'fin-scolarite',
      titre: 'La fin de l’école et après',
      sousTitre: 'Sécuriser la transition',
      etapes: [
        {
          id: 'date-fin-scolarite',
          titre: 'Confirmer la date de fin de scolarité',
          moisParRapportAuRepere: 18,
          quand: 'Six mois avant la fin présumée',
          pourquoi:
            'En pédagogie spécialisée, la scolarité peut se prolonger au-delà de l’âge ordinaire [À VÉRIFIER : jusqu’à 18 ans, prolongation possible jusqu’à 20 ans]. La date exacte conditionne tout le reste : demandez-la par écrit.',
          aFaire: ['Demander à l’école la date de fin de scolarité et, si une prolongation est possible, la procédure pour la demander.', 'Noter tout délai écrit comme délai légal.'],
          genereJalon: true,
          sources: [src('LPS — durée de la scolarité en pédagogie spécialisée [À VÉRIFIER]')],
        },
        {
          id: 'transports-assurances',
          titre: 'Régler les transports et les assurances',
          moisParRapportAuRepere: 22,
          quand: 'Avant le premier jour',
          pourquoi:
            'Le trajet vers un atelier ou un centre de formation n’est pas toujours possible seul ; les frais de transport peuvent être pris en charge selon la voie [À VÉRIFIER : AI pour la formation, établissement pour l’atelier]. L’assurance accident dépend du statut (en formation, en atelier).',
          aFaire: ['Demander au lieu de formation ou d’accueil comment le transport est organisé et financé.', 'Vérifier avec lui la couverture accident et, si nécessaire, l’assurance maladie.'],
          genereJalon: true,
          sources: [src('Prise en charge des frais de transport [À COMPLÉTER]')],
        },
        {
          id: 'suivi-apres',
          titre: 'Faire un point après trois mois',
          moisParRapportAuRepere: 27,
          quand: 'Trois mois après le début',
          pourquoi:
            'Les premiers mois révèlent si la voie convient. L’AI peut encore adapter (changement de formation, soutien supplémentaire, placement avec accompagnement) ; un atelier peut ajuster le taux d’activité. Sans point de situation, les difficultés s’installent.',
          aFaire: ['Demander un bilan au lieu de formation ou d’accueil et au conseiller AI.', 'Noter ce qui est décidé dans le dossier.'],
          genereJalon: true,
          sources: [LAI('18', 'placement et aide au placement [À VÉRIFIER]')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Office AI pour le canton de Vaud', texte: 'Orientation professionnelle, formation professionnelle initiale, placement.', lien: { libelle: 'aivd.ch', url: 'https://www.aivd.ch/' } },
    { titre: 'Info handicap', texte: 'Formation et travail pour les personnes en situation de handicap.', lien: { libelle: 'info-handicap.ch', url: 'https://info-handicap.ch/' } },
  ],
}
