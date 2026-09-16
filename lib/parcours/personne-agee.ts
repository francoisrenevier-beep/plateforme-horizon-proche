// Parcours de la catégorie « Personne âgée » — canton de Vaud.
//
// PROVISOIRES : étapes plausibles, appuyées sur le droit fédéral (CC, LPC, LAMal, LAVS) et
// sur l'organisation vaudoise telle que connue (réseaux de santé et BRIO, CMS de l'AVASAD,
// justice de paix). Rien n'a été relu contre sa source ; dénominations, délais et montants
// sont marqués [À VÉRIFIER] ou [À COMPLÉTER] dans le texte.

import type { Parcours } from './types'
import { AVERTISSEMENT_PROVISOIRE, CC, LPC, VD, src } from './sources'

// ---------------------------------------------------------------------------
// Préparer une entrée en EMS
// ---------------------------------------------------------------------------

export const entreeEms: Parcours = {
  id: 'entree-ems',
  titre: 'Préparer une entrée en EMS',
  positionnement: 'Pour les proches d’une personne âgée pour qui le domicile ne suffit plus, même avec de l’aide',
  categorie: 'personne-agee',
  canton: 'Vaud',
  autorite: 'BRIO du réseau de santé',
  delaiRealiste: { texte: 'De quelques semaines à plusieurs mois', statut: 'a-verifier' },
  icone: 'bed',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'L’entrée en établissement médico-social est rarement un choix simple, et rarement une urgence qu’on n’a pas vue venir. Dans le canton de Vaud, elle passe par le Bureau régional d’information et d’orientation (BRIO) du réseau de santé, qui évalue le besoin et gère l’attente. Ce parcours aide à poser la question avec la personne, à s’orienter, à comprendre qui paie, à régler l’administratif et à préparer le jour de l’entrée.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'question',
      titre: 'Poser la question',
      sousTitre: 'Avec la personne, pas à sa place',
      etapes: [
        {
          id: 'decider-avec',
          titre: 'En parler avec la personne concernée',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Tant qu’elle est capable de discernement, c’est la personne qui décide d’entrer ou non en EMS. Si elle ne l’est plus, ce sont ses directives anticipées, son mandat pour cause d’inaptitude ou son représentant légal qui comptent. Le rôle des proches est d’informer, de proposer, d’accompagner — et de dire quand ils n’en peuvent plus. Cette étape est une conversation, pas une tâche.',
          aFaire: ['Chercher ce qui existe : directives anticipées, mandat pour cause d’inaptitude, curatelle.', 'Proposer un court séjour d’essai ou un accueil de jour avant toute décision.'],
          questionOuverte: true,
          lienInterne: { libelle: 'Parcours directives anticipées et mandat', href: '/parcours/directives-mandat' },
          genereJalon: false,
          sources: [CC('16', 'capacité de discernement'), CC('370 ss', 'directives anticipées'), CC('360 ss', 'mandat pour cause d’inaptitude')],
        },
        {
          id: 'evaluation-cms',
          titre: 'Demander une évaluation au CMS',
          moisParRapportAuRepere: 0,
          quand: 'Si ce n’est pas déjà fait',
          pourquoi:
            'Le centre médico-social évalue les besoins à domicile et peut proposer des aides qui repoussent ou évitent l’entrée en EMS. Son évaluation sert aussi au BRIO : elle documente que le maintien à domicile a été tenté.',
          aFaire: ['Contacter le CMS de la région et demander une évaluation à domicile.', 'Ranger le plan d’aide dans le coffre.'],
          contacts: [{ nom: 'Centre médico-social (CMS) de la région', role: 'Évaluation et aide à domicile', lien: { libelle: 'avasad.ch', url: 'https://www.avasad.ch/' } }],
          lienInterne: { libelle: 'Parcours maintien à domicile', href: '/parcours/maintien-domicile' },
          genereJalon: true,
          sources: [src('AVASAD — organisation des CMS vaudois [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'orientation',
      titre: 'S’orienter',
      sousTitre: 'Le BRIO, les visites, l’attente',
      etapes: [
        {
          id: 'brio',
          titre: 'S’inscrire auprès du BRIO',
          moisParRapportAuRepere: 1,
          quand: 'Dès que l’entrée est envisagée',
          pourquoi:
            'Dans le canton de Vaud, l’admission en EMS passe par le Bureau régional d’information et d’orientation du réseau de santé [À VÉRIFIER : procédure exacte, rôle de l’hôpital ou du CMS dans l’inscription]. Le BRIO évalue le besoin, informe sur les établissements et tient la liste d’attente. Sans inscription, aucune place ne peut être attribuée.',
          aFaire: ['Contacter le BRIO de la région ; demander quels documents sont nécessaires et qui doit faire l’inscription.', 'Indiquer les établissements préférés, s’il y en a.'],
          contacts: [{ nom: 'BRIO du réseau de santé de la région', role: 'Information, orientation, liste d’attente [À VÉRIFIER : coordonnées par région]', lien: { libelle: 'vd.ch — réseaux de santé', url: 'https://www.vd.ch/themes/sante-soins-et-handicap' } }],
          pieces: ['Rapport médical récent', 'Évaluation du CMS, si elle existe', 'Carte d’assuré et police d’assurance maladie'],
          genereJalon: true,
          sources: [VD('réseaux de santé et BRIO [À VÉRIFIER]')],
        },
        {
          id: 'visiter',
          titre: 'Visiter des établissements',
          moisParRapportAuRepere: 1,
          quand: 'Pendant l’attente',
          pourquoi:
            'Une visite, si possible avec la personne, permet de comparer l’ambiance, les chambres, les activités, la proximité pour les visites. Un EMS reconnu d’intérêt public a un prix de pension fixé par le canton et donne droit aux aides financières ; un établissement non reconnu, pas forcément [À VÉRIFIER].',
          aFaire: ['Visiter deux ou trois établissements ; demander le prix de pension et ce qu’il comprend.', 'Noter les impressions et la préférence de la personne dans le dossier.'],
          lienInterne: { libelle: 'Préparer les questions', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('Liste des EMS reconnus d’intérêt public — canton de Vaud [À VÉRIFIER]')],
        },
        {
          id: 'attente',
          titre: 'Pendant l’attente, prévoir un relais',
          moisParRapportAuRepere: 2,
          quand: 'Si l’attente se prolonge',
          pourquoi:
            'L’attente peut durer. Court séjour en EMS, accueil de jour, relève à domicile : ces solutions transitoires soulagent et documentent l’urgence auprès du BRIO. Signaler tout changement (chute, hospitalisation, épuisement du proche) permet de réévaluer la priorité.',
          aFaire: ['Demander au BRIO ou au CMS un court séjour ou un accueil de jour.', 'Signaler tout changement par écrit.'],
          contacts: [{ nom: 'Espace Proches', role: 'Orientation vers les relèves', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } }],
          genereJalon: true,
          sources: [VD('courts séjours et accueil temporaire [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'financement',
      titre: 'Le financement',
      sousTitre: 'Qui paie quoi, et ce qu’il ne faut pas faire',
      etapes: [
        {
          id: 'comprendre-cout',
          titre: 'Comprendre le coût et ce qui le couvre',
          moisParRapportAuRepere: 1,
          quand: 'Dès que l’entrée est envisagée',
          pourquoi:
            'Le séjour en EMS se compose d’un prix de pension (hébergement) et des soins. Les soins sont payés par l’assurance maladie, le canton et une participation du résident [À VÉRIFIER : montants]. Le prix de pension est à la charge du résident : rentes, fortune, puis prestations complémentaires jusqu’à un plafond, et aide cantonale si cela ne suffit pas [À VÉRIFIER : LAPRAMS]. Personne ne devrait renoncer à une place pour des raisons financières sans avoir fait ce calcul.',
          aFaire: ['Demander au BRIO ou à Pro Senectute une simulation du reste à charge.', 'Réunir les décisions de rentes et un état de la fortune.'],
          contacts: [{ nom: 'Pro Senectute Vaud', role: 'Conseil et aide aux demandes', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } }],
          genereJalon: true,
          sources: [src('LAMal, art. 25a — financement des soins'), LPC('10', 'dépenses reconnues — séjour en home'), src('Loi vaudoise d’aide aux personnes recourant à l’action médico-sociale (LAPRAMS) [À VÉRIFIER]')],
        },
        {
          id: 'pc-home',
          titre: 'Déposer la demande de prestations complémentaires',
          moisParRapportAuRepere: 2,
          quand: 'Avant l’entrée si possible',
          pourquoi:
            'Les PC sont versées au plus tôt dès le mois de la demande [À VÉRIFIER] : chaque mois de retard est un mois de prix de pension à payer soi-même. La demande peut être déposée dès que l’entrée est prévue.',
          aFaire: ['Déposer la demande auprès de l’agence d’assurances sociales de la commune [À VÉRIFIER], avec la date d’entrée prévue.'],
          lienInterne: { libelle: 'Parcours prestations complémentaires', href: '/parcours/pc-subsides' },
          pieces: ['Décisions de rentes', 'Relevés de fortune', 'Attestation du prix de pension', 'Police d’assurance maladie'],
          genereJalon: true,
          sources: [LPC('12', 'naissance du droit [À VÉRIFIER]')],
        },
        {
          id: 'dessaisissement',
          titre: 'Ne pas donner ni vendre à bas prix sans conseil',
          moisParRapportAuRepere: 1,
          quand: 'Avant toute opération sur le patrimoine',
          pourquoi:
            'Une fortune donnée aux enfants ou un bien vendu en dessous de sa valeur est compté comme si la personne le possédait encore dans le calcul des PC, pendant des années [À VÉRIFIER : règles de dessaisissement]. Un geste bien intentionné peut priver la personne de l’aide dont elle a besoin.',
          aFaire: ['Avant toute donation ou vente, demander conseil à Pro Senectute ou à un·e notaire.'],
          pointsAttention: ['Les donations passées peuvent aussi être prises en compte : signalez-les dans la demande plutôt que de les laisser découvrir.'],
          genereJalon: false,
          sources: [LPC('11a', 'renonciation à des revenus ou à des parts de fortune [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'administratif',
      titre: 'L’administratif',
      sousTitre: 'Le contrat, le bail, les assurances',
      etapes: [
        {
          id: 'contrat',
          titre: 'Lire le contrat d’hébergement',
          moisParRapportAuRepere: 3,
          quand: 'Quand une place est proposée',
          pourquoi:
            'Le contrat fixe le prix, les prestations comprises et non comprises, la chambre, les modalités de résiliation, la gestion de l’argent personnel. Ce qui n’est pas écrit ne peut pas être exigé.',
          aFaire: ['Lire le contrat ; noter les délais de résiliation et les suppléments.', 'Si la personne a un curateur ou un mandataire, vérifier qui signe.'],
          pieces: ['Contrat d’hébergement', 'Liste des prestations et prix'],
          ficheId: 'ems',
          genereJalon: true,
          sources: [src('Contrat de droit privé — pas de source légale spécifique')],
        },
        {
          id: 'bail-domicile',
          titre: 'Résilier le bail et régler le domicile',
          moisParRapportAuRepere: 3,
          quand: 'Dès que la date d’entrée est connue',
          pourquoi:
            'Le bail se résilie selon les délais du contrat ; la date de résiliation écrite dans le bail est un délai légal. Une résiliation anticipée est possible avec un locataire de remplacement solvable [À VÉRIFIER]. Le domicile légal peut rester dans la commune ou être transféré : cela a des conséquences sur les impôts et les aides [À COMPLÉTER].',
          aFaire: ['Relire le bail, noter le prochain terme de résiliation comme délai légal, envoyer la résiliation par courrier recommandé.', 'Demander à la commune et à l’EMS ce qu’il en est du domicile.'],
          concerne: 'Seulement si la personne quitte un logement loué',
          pieces: ['Contrat de bail', 'Lettre de résiliation'],
          genereJalon: true,
          sources: [src('Code des obligations (CO), art. 264 — restitution anticipée de la chose louée [À VÉRIFIER]'), CC('23 ss', 'domicile')],
        },
        {
          id: 'assurances-adresses',
          titre: 'Informer les assurances et changer les adresses',
          moisParRapportAuRepere: 3,
          quand: 'Autour de l’entrée',
          pourquoi:
            'L’assurance maladie reste due et doit connaître la nouvelle situation ; l’assurance ménage et la responsabilité civile peuvent être adaptées ; la caisse AVS, la caisse de pension, la banque, la poste doivent avoir la nouvelle adresse.',
          aFaire: ['Faire la liste des organismes à informer et cocher au fur et à mesure.', 'Demander à la poste un ordre de réexpédition.'],
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'entree',
      titre: 'Le jour de l’entrée et après',
      sousTitre: 'Transmettre, s’installer, suivre',
      etapes: [
        {
          id: 'portrait',
          titre: 'Transmettre ce qui aide la personne',
          moisParRapportAuRepere: 3,
          quand: 'Avant le premier jour',
          pourquoi:
            'L’équipe soignante découvrira la personne. Son portrait à la première personne — ses habitudes, ce qui la rassure, son histoire — change la manière dont elle sera accueillie dès le premier jour. Les directives anticipées et le nom du représentant thérapeutique doivent aussi être remis.',
          aFaire: ['Mettre le portrait à jour et le remettre au référent ou à l’infirmière-cheffe.', 'Remettre une copie des directives anticipées.', 'Ajouter le référent aux intervenants du dossier.'],
          lienInterne: { libelle: 'Ouvrir le portrait', href: '/portrait' },
          genereJalon: true,
          sources: [CC('372', 'obligation du médecin de respecter les directives anticipées')],
        },
        {
          id: 'suivi',
          titre: 'Faire un point après le premier mois',
          moisParRapportAuRepere: 4,
          quand: 'Un mois après l’entrée',
          pourquoi:
            'Le premier mois révèle ce qui va et ce qui ne va pas : sommeil, repas, contacts, médication. Un entretien avec l’équipe permet d’ajuster. En cas de difficulté persistante, la Permanence d’orientation Patients / Résidents du canton peut être saisie.',
          aFaire: ['Demander un entretien de bilan avec le référent.', 'En cas de difficulté non résolue : contacter la Permanence d’orientation Patients / Résidents (021 316 09 87).'],
          contacts: [{ nom: 'Permanence d’orientation Patients / Résidents', role: 'Insatisfaction, problèmes, litiges', lien: { libelle: 'vd.ch — plaintes santé-social', url: 'https://www.vd.ch/plaintes-sante-social' } }],
          genereJalon: true,
          sources: [VD('plaintes santé-social', 'https://www.vd.ch/plaintes-sante-social')],
        },
        {
          id: 'proche-aidant',
          titre: 'Et vous, le proche aidant',
          moisParRapportAuRepere: null,
          quand: 'À tout moment',
          pourquoi:
            'L’entrée d’un parent en EMS est souvent vécue comme un échec ou un abandon. Ce n’en est pas un. Le canton de Vaud propose une écoute gratuite aux proches aidants ; des groupes de parole existent pour ceux qui traversent la même chose.',
          aFaire: ['Appeler la permanence gratuite des proches aidants (0800 660 660).'],
          contacts: [{ nom: 'Espace Proches', role: 'Écoute et conseil gratuits', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } }],
          genereJalon: false,
          sources: [VD('proches aidants', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Pro Senectute Vaud', texte: 'Conseil social, aide aux démarches, information sur les EMS.', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } },
    { titre: 'Guide social romand — EMS', texte: 'Fonctionnement et financement des EMS par canton.', lien: { libelle: 'guidesocial.ch', url: 'https://www.guidesocial.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Maintien à domicile avec le CMS
// ---------------------------------------------------------------------------

export const maintienDomicile: Parcours = {
  id: 'maintien-domicile',
  titre: 'Organiser le maintien à domicile avec le CMS',
  positionnement: 'Pour les proches d’une personne âgée qui souhaite rester chez elle et a besoin d’aide',
  categorie: 'personne-agee',
  canton: 'Vaud',
  autorite: 'CMS de la région (AVASAD)',
  delaiRealiste: { texte: 'Première visite en 1 à 2 semaines [À VÉRIFIER]', statut: 'a-verifier' },
  icone: 'house-heart',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'Rester chez soi avec de l’aide est possible longtemps, à condition d’organiser cette aide avant que tout repose sur un seul proche. Dans le canton de Vaud, le centre médico-social (CMS) de la région évalue les besoins, met en place soins et aide à domicile, et oriente vers les autres services : repas, transports, accueil de jour, relève. Ce parcours suit la mise en place, le financement et les ajustements.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'premier-contact',
      titre: 'Le premier contact',
      sousTitre: 'L’évaluation à domicile',
      etapes: [
        {
          id: 'contacter-cms',
          titre: 'Contacter le CMS de la région',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Le CMS est la porte d’entrée du maintien à domicile. Toute personne peut le contacter, sans ordonnance, pour demander une évaluation. Une infirmière vient à domicile, évalue les besoins avec la personne et ses proches, et propose un plan d’aide.',
          aFaire: ['Trouver le CMS compétent pour la commune et demander une évaluation à domicile.', 'Préparer la visite : ce qui devient difficile, ce que le proche fait aujourd’hui, ce que la personne accepte.'],
          contacts: [{ nom: 'Centre médico-social (CMS) de la région', role: 'Évaluation, soins et aide à domicile', lien: { libelle: 'avasad.ch', url: 'https://www.avasad.ch/' } }],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          genereJalon: true,
          sources: [src('AVASAD — missions des CMS [À VÉRIFIER]')],
        },
        {
          id: 'plan-aide',
          titre: 'Lire et comprendre le plan d’aide',
          moisParRapportAuRepere: 0,
          quand: 'Après l’évaluation',
          pourquoi:
            'Le plan d’aide distingue les soins (infirmiers, toilette, médicaments), pris en charge par l’assurance maladie avec une participation [À VÉRIFIER : montant], et l’aide au ménage ou l’accompagnement, facturés selon un tarif qui dépend du revenu [À VÉRIFIER]. Savoir ce qui est prescrit et ce qui est facturé évite les surprises.',
          aFaire: ['Demander le détail des prestations et de leur coût ; ranger le plan d’aide dans le coffre.', 'Vérifier que le médecin traitant a prescrit les soins pour que l’assurance les couvre.'],
          pieces: ['Plan d’aide du CMS', 'Prescription médicale de soins à domicile'],
          genereJalon: true,
          sources: [src('LAMal, art. 25a et OPAS, art. 7 — soins à domicile [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'mettre-en-place',
      titre: 'Mettre en place',
      sousTitre: 'Les services autour du CMS',
      etapes: [
        {
          id: 'services',
          titre: 'Activer les services complémentaires',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Repas livrés à domicile, système d’appel d’urgence (bracelet ou pendentif), transports adaptés, accueil de jour dans un centre d’accueil temporaire (CAT) : ces services existent dans tout le canton et se demandent souvent par le CMS. Chacun allège un peu la charge du proche.',
          aFaire: ['Demander au CMS quels services sont possibles et lesquels il peut activer.', 'Noter les coûts et les coordonnées de chaque service dans les intervenants du dossier.'],
          contacts: [
            { nom: 'CAT — centre d’accueil temporaire de la région', role: 'Accueil de jour [À VÉRIFIER : coordonnées]' },
            { nom: 'Transport Handicap Vaud', role: 'Transports adaptés [À VÉRIFIER]' },
          ],
          lienInterne: { libelle: 'Intervenants du dossier', href: '/intervenants' },
          genereJalon: true,
          sources: [VD('centres d’accueil temporaire [À VÉRIFIER]')],
        },
        {
          id: 'securiser-logement',
          titre: 'Sécuriser le logement',
          moisParRapportAuRepere: 1,
          quand: 'Après l’évaluation',
          pourquoi:
            'Une chute change tout. L’ergothérapeute du CMS repère les risques (tapis, baignoire, escalier, éclairage) et propose des aides : barres d’appui, siège de douche, lit électrique. Certaines sont financées par l’AVS ou les prestations complémentaires.',
          aFaire: ['Demander une évaluation du logement par l’ergothérapeute du CMS.', 'Suivre le parcours « Adapter le logement » pour le financement.'],
          lienInterne: { libelle: 'Parcours adaptation du logement', href: '/parcours/logement-moyens-auxiliaires' },
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
      ],
    },
    {
      id: 'financer',
      titre: 'Financer',
      sousTitre: 'Ce qui peut être demandé',
      etapes: [
        {
          id: 'api-avs',
          titre: 'Demander l’allocation pour impotent AVS',
          moisParRapportAuRepere: 2,
          quand: 'Dès que l’aide quotidienne est régulière',
          pourquoi:
            'Une personne à la retraite qui a besoin d’aide régulière pour les actes ordinaires de la vie (se lever, s’habiller, manger, se laver, se déplacer) peut recevoir une allocation pour impotent de l’AVS, en trois degrés [À VÉRIFIER : conditions du degré faible à domicile]. Elle se demande à la caisse de compensation, avec un rapport médical ; le CMS peut appuyer.',
          aFaire: ['Déposer la demande auprès de la caisse cantonale de compensation AVS, avec un rapport médical.', 'Tenir un journal de l’aide apportée sur une semaine pour l’enquête.'],
          contacts: [{ nom: 'Caisse cantonale vaudoise de compensation AVS', role: 'Allocation pour impotent AVS', lien: { libelle: 'caisseavsvaud.ch', url: 'https://www.caisseavsvaud.ch/' } }],
          pieces: ['Formulaire de demande', 'Rapport médical', 'Journal de l’aide apportée'],
          genereJalon: true,
          sources: [src('LAVS, art. 43bis — allocation pour impotent [À VÉRIFIER]')],
        },
        {
          id: 'pc-domicile',
          titre: 'Vérifier le droit aux prestations complémentaires',
          moisParRapportAuRepere: 2,
          quand: 'Si les revenus sont modestes',
          pourquoi:
            'Les PC complètent une rente insuffisante et remboursent des frais liés au maintien à domicile : aide au ménage, soins, moyens auxiliaires, franchise [À VÉRIFIER : liste et plafonds]. Le canton connaît aussi une aide pour le maintien à domicile quand les PC ne suffisent pas [À VÉRIFIER : LAPRAMS].',
          aFaire: ['Suivre le parcours « Prestations complémentaires et subsides ».'],
          lienInterne: { libelle: 'Parcours prestations complémentaires', href: '/parcours/pc-subsides' },
          genereJalon: true,
          sources: [LPC('14', 'frais de maladie et d’invalidité'), src('LAPRAMS — aide au maintien à domicile [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'ajuster',
      titre: 'Ajuster dans le temps',
      sousTitre: 'Réévaluer, souffler, anticiper',
      etapes: [
        {
          id: 'reevaluation',
          titre: 'Demander une réévaluation régulière',
          moisParRapportAuRepere: 6,
          quand: 'Tous les six mois, ou après tout événement',
          pourquoi:
            'Les besoins changent, souvent après une hospitalisation ou une chute. Le plan d’aide doit suivre. Une réévaluation se demande au CMS ; l’hôpital, à la sortie, transmet aussi ses recommandations.',
          aFaire: ['Demander au CMS une réévaluation et noter les changements dans le dossier.'],
          genereJalon: true,
          sources: [src('Pas de source légale — pratique')],
        },
        {
          id: 'releve',
          titre: 'Organiser des relèves pour le proche',
          moisParRapportAuRepere: 3,
          quand: 'Avant d’être épuisé',
          pourquoi:
            'Le maintien à domicile tient tant que le proche tient. Relève à domicile (Croix-Rouge vaudoise, associations), accueil de jour, court séjour en EMS : ces relais se demandent avant l’épuisement, pas après.',
          aFaire: ['Demander à Espace Proches ou au CMS quelles relèves existent dans la région.', 'Prévoir un court séjour pour la personne au moins une fois par an [à ajuster selon la situation].'],
          contacts: [
            { nom: 'Espace Proches', role: 'Orientation vers les relèves', lien: { libelle: 'vd.ch — proches aidants', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants' } },
            { nom: 'Croix-Rouge vaudoise', role: 'Relève à domicile [À VÉRIFIER : prestation et tarif]', lien: { libelle: 'croixrougevaudoise.ch', url: 'https://www.croixrougevaudoise.ch/' } },
          ],
          lienInterne: { libelle: 'Parcours proche aidant', href: '/parcours/statut-proche-aidant' },
          genereJalon: true,
          sources: [VD('proches aidants', 'https://www.vd.ch/aides-financieres-et-soutien-social/proches-aidants')],
        },
        {
          id: 'anticiper',
          titre: 'Anticiper : directives anticipées et mandat',
          moisParRapportAuRepere: 1,
          quand: 'Tant que la personne peut décider',
          pourquoi:
            'Le maintien à domicile finit parfois par une hospitalisation ou une entrée en EMS dans l’urgence. Ce que la personne veut pour ses soins, et qui décidera pour elle si elle ne le peut plus, se règle maintenant, calmement, pas aux urgences.',
          aFaire: ['Suivre le parcours « Directives anticipées et mandat pour cause d’inaptitude ».'],
          lienInterne: { libelle: 'Parcours directives et mandat', href: '/parcours/directives-mandat' },
          genereJalon: true,
          sources: [CC('370 ss', 'directives anticipées'), CC('360 ss', 'mandat pour cause d’inaptitude')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'AVASAD — les CMS vaudois', texte: 'Coordonnées des CMS par région et prestations.', lien: { libelle: 'avasad.ch', url: 'https://www.avasad.ch/' } },
    { titre: 'Pro Senectute Vaud', texte: 'Conseil social, activités, aide administrative.', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } },
  ],
}

// ---------------------------------------------------------------------------
// Directives anticipées et mandat pour cause d'inaptitude
// ---------------------------------------------------------------------------

export const directivesMandat: Parcours = {
  id: 'directives-mandat',
  titre: 'Rédiger des directives anticipées et un mandat pour cause d’inaptitude',
  positionnement: 'Pour une personne qui veut décider maintenant de ce qui se passera si elle ne peut plus décider',
  categorie: 'personne-agee',
  canton: 'Vaud',
  autorite: 'Justice de paix (validation du mandat)',
  delaiRealiste: { texte: 'Quelques semaines, tant que la personne peut décider', statut: 'a-verifier' },
  icone: 'file-signature',
  statut: 'provisoire',
  repere: 'activation',
  resume:
    'Deux documents distincts permettent à une personne de garder la main sur son avenir. Les directives anticipées disent quels soins elle accepte ou refuse et qui la représente auprès des médecins. Le mandat pour cause d’inaptitude désigne qui s’occupera d’elle, de ses biens et de ses affaires si elle devient incapable de discernement — et évite souvent une curatelle. Tous deux exigent que la personne soit capable de discernement au moment où elle les rédige : c’est maintenant qu’il faut le faire.',
  avertissement: AVERTISSEMENT_PROVISOIRE,
  phases: [
    {
      id: 'comprendre',
      titre: 'Comprendre et choisir',
      sousTitre: 'Deux documents, deux formes',
      etapes: [
        {
          id: 'distinguer',
          titre: 'Distinguer les deux documents',
          moisParRapportAuRepere: 0,
          quand: 'Dès maintenant',
          pourquoi:
            'Les directives anticipées portent sur les soins médicaux : ce que la personne veut ou refuse, et qui parle pour elle (le représentant thérapeutique). Le mandat pour cause d’inaptitude porte sur le reste : l’assistance personnelle, la gestion du patrimoine, la représentation juridique. Il peut confier tout à une personne, ou répartir entre plusieurs. Ce sont des choix qui appartiennent à la personne ; les proches peuvent aider à les formuler, pas les faire à sa place.',
          aFaire: ['Lire un modèle de chaque document (Pro Senectute, FMH, Pro Infirmis).', 'En parler avec la personne : ce qu’elle veut, à qui elle fait confiance.'],
          questionOuverte: true,
          contacts: [{ nom: 'Pro Senectute Vaud', role: 'Modèles et conseil (Docupass)', lien: { libelle: 'vd.prosenectute.ch', url: 'https://vd.prosenectute.ch/' } }],
          genereJalon: false,
          sources: [CC('370', 'directives anticipées — principe'), CC('360', 'mandat pour cause d’inaptitude — principe')],
        },
        {
          id: 'forme',
          titre: 'Respecter la forme',
          moisParRapportAuRepere: 0,
          quand: 'Avant de rédiger',
          pourquoi:
            'Les directives anticipées doivent être écrites, datées et signées. Le mandat pour cause d’inaptitude doit être soit entièrement écrit à la main, daté et signé par la personne, soit établi par un·e notaire (acte authentique). Un mandat tapé à l’ordinateur et simplement signé n’est pas valable.',
          aFaire: ['Choisir entre le mandat manuscrit et l’acte notarié ; en cas de patrimoine important ou de situation familiale complexe, le notaire est conseillé.'],
          pointsAttention: ['Un mandat manuscrit doit être écrit en entier de la main de la personne — pas seulement signé.'],
          genereJalon: false,
          sources: [CC('361', 'forme du mandat pour cause d’inaptitude'), CC('371', 'forme des directives anticipées')],
        },
      ],
    },
    {
      id: 'rediger',
      titre: 'Rédiger',
      sousTitre: 'Avec le médecin, avec les personnes désignées',
      etapes: [
        {
          id: 'directives',
          titre: 'Rédiger les directives anticipées',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Des directives précises sont plus utiles que des formules générales : réanimation, alimentation artificielle, hospitalisation, soins palliatifs, lieu de fin de vie. Le médecin traitant aide à comprendre ce que chaque choix signifie. Le représentant thérapeutique désigné doit être d’accord et savoir ce que la personne veut.',
          aFaire: ['Prendre rendez-vous avec le médecin traitant pour discuter des directives.', 'Rédiger, dater, signer ; remettre une copie au représentant thérapeutique et au médecin.'],
          pieces: ['Directives anticipées signées', 'Copie pour le médecin traitant'],
          lienInterne: { libelle: 'Préparer le rendez-vous', href: '/rendez-vous' },
          genereJalon: true,
          sources: [CC('370', 'contenu des directives anticipées'), CC('372', 'obligation du médecin')],
        },
        {
          id: 'mandat',
          titre: 'Rédiger le mandat pour cause d’inaptitude',
          moisParRapportAuRepere: 1,
          quand: 'Dans le mois',
          pourquoi:
            'Le mandat décrit les tâches confiées et peut donner des instructions. La ou les personnes désignées doivent accepter ; elles pourront toujours refuser le moment venu, d’où l’intérêt de prévoir un remplaçant. Une rémunération peut être prévue.',
          aFaire: ['Rédiger le mandat à la main ou chez un·e notaire ; prévoir un remplaçant.', 'Informer les personnes désignées et leur remettre une copie.'],
          contacts: [{ nom: 'Notaire', role: 'Acte authentique, conseil' }],
          pieces: ['Mandat pour cause d’inaptitude (manuscrit ou acte notarié)'],
          genereJalon: true,
          sources: [CC('360', 'contenu du mandat'), CC('366', 'rémunération [À VÉRIFIER]')],
        },
      ],
    },
    {
      id: 'faire-connaitre',
      titre: 'Faire connaître',
      sousTitre: 'Un document introuvable ne sert à rien',
      etapes: [
        {
          id: 'inscrire',
          titre: 'Faire inscrire l’existence du mandat',
          moisParRapportAuRepere: 2,
          quand: 'Une fois le mandat rédigé',
          pourquoi:
            'La personne peut faire inscrire dans la banque de données de l’état civil le fait qu’un mandat existe et où il est déposé. Le jour venu, la justice de paix consultera ce registre. Un mandat que personne ne trouve reste lettre morte.',
          aFaire: ['Demander à l’office de l’état civil l’inscription de l’existence du mandat et de son lieu de dépôt [À VÉRIFIER : procédure et émolument].', 'Décider où l’original est conservé (notaire, domicile, proche) et le noter dans le dossier.'],
          contacts: [{ nom: 'Office de l’état civil', role: 'Inscription de l’existence du mandat', lien: { libelle: 'vd.ch — état civil', url: 'https://www.vd.ch/etat-civil' } }],
          genereJalon: true,
          sources: [CC('361 al. 3', 'inscription dans la banque de données de l’état civil')],
        },
        {
          id: 'carte-assure',
          titre: 'Signaler les directives anticipées',
          moisParRapportAuRepere: 2,
          quand: 'Une fois les directives rédigées',
          pourquoi:
            'L’existence et le lieu de dépôt des directives anticipées peuvent être inscrits sur la carte d’assuré. Le médecin qui doit décider dans l’urgence est tenu de vérifier si des directives existent.',
          aFaire: ['Demander à l’assurance maladie d’enregistrer la mention sur la carte d’assuré [À VÉRIFIER : procédure].', 'Ranger une copie des directives dans le coffre et en donner l’accès aux proches concernés.'],
          lienInterne: { libelle: 'Accès au dossier', href: '/acces' },
          genereJalon: true,
          sources: [CC('371 al. 2', 'mention sur la carte d’assuré'), CC('372 al. 1', 'devoir du médecin de rechercher les directives')],
        },
      ],
    },
    {
      id: 'le-jour-venu',
      titre: 'Le jour venu, et entre-temps',
      sousTitre: 'Validation, révision',
      etapes: [
        {
          id: 'validation',
          titre: 'Faire valider le mandat par la justice de paix',
          moisParRapportAuRepere: null,
          quand: 'Si la personne devient incapable de discernement',
          pourquoi:
            'Le mandat ne prend pas effet tout seul. Quand la personne devient incapable de discernement, la justice de paix vérifie que le mandat est valable, que la personne désignée est apte et accepte, puis lui remet un document attestant ses pouvoirs. Sans cette validation, le mandataire ne peut pas agir auprès des banques ou des administrations.',
          aFaire: ['Écrire à la justice de paix du domicile de la personne, avec le mandat original et un certificat médical d’incapacité de discernement.', 'Noter tout délai écrit sur les courriers comme délai légal.'],
          contacts: [{ nom: 'Justice de paix du district', role: 'Validation du mandat', lien: { libelle: 'vd.ch — justice', url: 'https://www.vd.ch/justice' } }],
          pieces: ['Original du mandat', 'Certificat médical d’incapacité de discernement'],
          genereJalon: false,
          sources: [CC('363', 'constatation de la validité et acceptation')],
        },
        {
          id: 'reviser',
          titre: 'Relire et mettre à jour',
          moisParRapportAuRepere: 24,
          quand: 'Tous les deux ans, ou après un changement de vie',
          pourquoi:
            'Des directives anciennes peuvent être considérées comme moins fiables ; un mandataire peut avoir déménagé ou changé d’avis. Relire, redater, resigner garde les documents vivants. Un nouveau document remplace l’ancien s’il le dit clairement.',
          aFaire: ['Relire les deux documents avec la personne ; redater et resigner s’ils sont toujours d’actualité.'],
          genereJalon: true,
          sources: [CC('362', 'révocation du mandat'), CC('371 al. 3', 'révocation des directives anticipées [À VÉRIFIER]')],
        },
      ],
    },
  ],
  ressources: [
    { titre: 'Pro Senectute — Docupass', texte: 'Dossier de prévoyance : directives anticipées, mandat, dispositions de fin de vie.', lien: { libelle: 'prosenectute.ch', url: 'https://www.prosenectute.ch/' } },
    { titre: 'FMH — directives anticipées', texte: 'Modèles de directives anticipées de la Fédération des médecins suisses.', lien: { libelle: 'fmh.ch', url: 'https://www.fmh.ch/' } },
  ],
}
