import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { VERSION_POLITIQUE } from '@/lib/compte'
import { formatDateLongue } from '@/lib/dates'

// Politique de confidentialité. Rédigée à partir des choix techniques réellement en place.
// Tout ce qui dépend d'une décision ou d'une relecture juridique reste marqué [À COMPLÉTER]
// ou [À VÉRIFIER] (CLAUDE.md §2.5 et §7).

export const metadata: Metadata = {
  title: 'Confidentialité — Horizon Proche',
  description: 'Comment Horizon Proche protège les informations des familles et des personnes accompagnées.',
}

const enBref = [
  'Vos dossiers sont chiffrés sur votre appareil avant d’être enregistrés.',
  'La clé vient de votre phrase secrète, que nous ne connaissons pas. Nous ne pouvons donc pas lire vos dossiers.',
  'Aucune publicité, aucun outil de mesure d’audience, aucune revente.',
  'Vous pouvez tout exporter ou tout effacer à tout moment, depuis les réglages.',
]

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-2xl text-teal-900">{titre}</h2>
      <div className="flex flex-col gap-3 text-[16px] leading-7 text-encre-2">{children}</div>
    </section>
  )
}

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-10 px-5 py-14 md:px-10 md:py-20">
      <header>
        <p className="etiquette">Mise à jour du {formatDateLongue(VERSION_POLITIQUE)}</p>
        <h1 className="mt-2 font-serif text-4xl text-teal-900">Confidentialité</h1>
        <p className="mt-4 text-[17px] leading-7 text-encre-2">
          Un dossier Horizon Proche contient des informations sur la santé, le handicap et la vie d’une personne qui ne s’exprime pas toujours elle-même. Nous avons construit l’outil pour que ces informations restent entre vos mains.
        </p>
      </header>

      <ul className="flex flex-col gap-3 rounded-xl bg-teal-50 p-6">
        {enBref.map((p) => (
          <li key={p} className="flex gap-3 text-[16px] leading-7 text-encre">
            <ShieldCheck className="mt-1 size-5 shrink-0 text-teal-700" aria-hidden />
            {p}
          </li>
        ))}
      </ul>

      <Section titre="Qui est responsable">
        <p>Responsable du traitement, adresse et personne de contact pour la protection des données. [À COMPLÉTER]</p>
      </Section>

      <Section titre="Les informations concernées">
        <p>
          Les informations que vous saisissez sur vous-même (prénom, nom, commune) et sur les personnes que vous accompagnez (identité, date de naissance, situation, portrait, démarches, rendez-vous, intervenants), ainsi que les photos et fichiers que vous rangez dans le coffre.
        </p>
        <p>
          Une partie de ces informations relève des données sensibles au sens de la loi fédérale sur la protection des données (nLPD), en particulier les données de santé. C’est pourquoi un accord explicite vous est demandé à l’ouverture du coffre. [À VÉRIFIER par un juriste : base légale et forme du consentement lorsque la personne accompagnée est mineure ou sous curatelle.]
        </p>
        <p>Nous ne vous demandons que ce qui sert à organiser l’accompagnement. Les champs facultatifs le restent.</p>
      </Section>

      <Section titre="Où sont vos données et comment elles sont protégées">
        <p>
          Dans cette version, tout reste sur votre appareil, dans le stockage de votre navigateur. Rien n’est transmis à un serveur. Le contenu est chiffré (AES-256-GCM) avec une clé tirée de votre phrase secrète. Chaque fichier a sa propre clé.
        </p>
        <p>
          Avec la synchronisation entre appareils, les dossiers seront hébergés en Suisse, chez Infomaniak. Ils y arriveront déjà chiffrés : le serveur conservera des blocs illisibles et ne recevra jamais votre phrase secrète. Ce modèle est appelé « zéro connaissance ». [À COMPLÉTER : contrat de sous-traitance et localisation précise des centres de données.]
        </p>
        <p>
          Le coffre se verrouille seul après une période d’inactivité que vous choisissez. Si vous oubliez votre phrase secrète, seul votre code de secours permet de rouvrir le coffre. Sans l’un ni l’autre, personne ne peut récupérer les données, nous non plus.
        </p>
      </Section>

      <Section titre="Ce que nous ne faisons jamais">
        <ul className="list-disc pl-5">
          <li>Lire le contenu de vos dossiers.</li>
          <li>Afficher de la publicité ou utiliser des traceurs, des cookies publicitaires ou des outils de mesure d’audience.</li>
          <li>Vendre, louer ou céder vos informations.</li>
          <li>Utiliser vos documents pour entraîner un modèle d’intelligence artificielle.</li>
          <li>Écrire à la personne accompagnée ou à vos contacts à votre place.</li>
        </ul>
      </Section>

      <Section titre="Partage avec d’autres personnes">
        <p>
          Vous seul·e décidez qui voit quoi. Un accès est nommé, limité à une partie du dossier et peut avoir une date de fin. Un lien de consultation est temporaire et révocable. Les personnes invitées ne paient rien.
        </p>
      </Section>

      <Section titre="Paiement">
        <p>
          L’abonnement est réglé sur la page sécurisée de Stripe. Aucune donnée de carte ne passe par Horizon Proche. Stripe ne reçoit que les informations du payeur, jamais celles de la personne accompagnée, et la facture porte le nom du payeur. [À VÉRIFIER : lieu de traitement chez Stripe et garanties pour la communication de données à l’étranger.]
        </p>
      </Section>

      <Section titre="Durée de conservation">
        <p>
          Vos données restent tant que vous gardez votre coffre. Un dossier archivé reste consultable et exportable pendant au moins douze mois, sans aucune relance. Quand vous supprimez vos données, elles sont effacées immédiatement de votre appareil. [À COMPLÉTER : délai d’effacement des copies de sauvegarde côté serveur, une fois la synchronisation en place.]
        </p>
      </Section>

      <Section titre="Vos droits">
        <p>
          Vous pouvez obtenir une copie de vos données, les corriger, les emporter ailleurs, les effacer et retirer votre accord. Tout se fait directement depuis les réglages, sans demande à formuler : sauvegarde chiffrée, export lisible, suppression complète.
        </p>
        <p>
          Pour toute question, écrivez à [À COMPLÉTER]. Vous pouvez aussi vous adresser au Préposé fédéral à la protection des données et à la transparence (PFPDT).
        </p>
      </Section>

      <p className="border-t border-sable-2 pt-6 text-[15px] text-encre-2">
        <Link href="/" className="text-teal-700 underline">
          Retour à l’accueil
        </Link>
      </p>
    </div>
  )
}
