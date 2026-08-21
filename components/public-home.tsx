'use client'

import Link from 'next/link'
import { ArrowDown, ArrowRight, Check, LockKeyhole } from 'lucide-react'

const situations = [
  {
    title: 'Mon enfant a un handicap et sa majorité approche.',
    text: 'Je veux comprendre ce qui change à 18 ans et préparer les prochaines démarches sans courir après les informations.',
  },
  {
    title: 'Mon parent perd son autonomie et les démarches s’accumulent.',
    text: 'Je dois garder le fil entre les courriers, les rendez-vous et les réponses à donner, parfois depuis un autre canton.',
  },
  {
    title: 'J’accompagne un adulte et je coordonne plusieurs professionnels.',
    text: 'Je veux que chacun ait les bons documents au bon moment, sans transmettre tout le dossier à tout le monde.',
  },
]

const functions = [
  {
    verb: 'Suivre',
    title: 'les délais qui comptent',
    text: 'Repérez ce qui est légalement obligatoire et ce qui est simplement conseillé. Un délai légal appelle une réponse ; un moment conseillé vous aide à vous organiser.',
  },
  {
    verb: 'Voir',
    title: 'la suite sur une chronologie',
    text: 'Les prochaines étapes se lisent dans l’ordre, à partir de la situation de la personne accompagnée : majorité, rendez-vous de réseau, renouvellement ou curatelle.',
  },
  {
    verb: 'Ranger',
    title: 'les documents au même endroit',
    text: 'Décisions, courriers et rapports restent avec la démarche concernée. Vous pouvez les photographier directement depuis votre téléphone.',
  },
  {
    verb: 'Partager',
    title: 'ce qu’il faut, avec qui il faut',
    text: 'Donnez accès à un professionnel ou à un membre de la famille, dossier par dossier. Vous pouvez retirer cet accès quand vous le souhaitez.',
  },
]

const faqs = [
  {
    question: 'Faut-il créer un compte pour la personne accompagnée ?',
    answer: 'Non. Vous créez votre dossier en tant que proche aidant. Vous indiquez simplement les informations utiles sur la personne que vous accompagnez.',
  },
  {
    question: 'Que se passe-t-il si je me trompe de date ?',
    answer: 'Vous pouvez modifier une date et sa source. Repères ne remplace pas la vérification du courrier original et ne transforme pas une date incertaine en urgence.',
  },
  {
    question: 'Mon curateur ou mon assistante sociale peut-il voir mon dossier ?',
    answer: 'Oui, si vous lui accordez un accès. Vous choisissez les éléments partagés et pouvez retirer l’accès à tout moment.',
  },
  {
    question: 'Est-ce que cela fonctionne hors du canton de Vaud ?',
    answer: 'Repères est conçu pour la Suisse romande. Les démarches et les autorités varient selon le canton ; les informations cantonales sont indiquées lorsqu’elles sont connues.',
  },
  {
    question: 'Qui a créé Repères ?',
    answer: 'Repères est développé pour les proches aidants en Suisse romande, avec une attention particulière portée aux démarches réelles et aux informations faciles à vérifier.',
  },
]

function DeadlineBadge({ recommended = false }: { recommended?: boolean }) {
  return (
    <span className={recommended ? 'inline-flex rounded-sm border border-ocre/40 bg-sable px-2.5 py-1 text-xs font-medium text-encre-2' : 'inline-flex rounded-sm border border-teal-700/30 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-900'}>
      {recommended ? 'Moment conseillé' : 'Délai légal'}
    </span>
  )
}

function ProductPreview() {
  return (
    <div className="border border-sable-2 bg-card p-5 shadow-card sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-sable-2 pb-5">
        <div>
          <p className="etiquette">Prochainement · dossier de démonstration</p>
          <h2 className="mt-2 font-serif text-2xl text-teal-900 sm:text-3xl">Une échéance, sans deviner ce qui presse.</h2>
        </div>
        <span className="hidden border border-sable-2 px-3 py-1 text-xs text-encre-2 sm:inline-flex">Vaud</span>
      </div>
      <div className="flex flex-col gap-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <DeadlineBadge />
          <p className="text-lg font-medium text-encre">Répondre à l’office AI</p>
          <p className="text-4xl font-semibold tracking-tight text-teal-900 sm:text-5xl">12 septembre 2026</p>
          <p className="max-w-md text-[15px] leading-6 text-encre-2">Date lue sur votre courrier de l’Office AI Vaud du 13 août 2026</p>
        </div>
        <div className="border-l-2 border-teal-700 pl-4 sm:min-w-36">
          <p className="etiquette">Temps restant</p>
          <p className="mt-1 text-2xl font-semibold text-teal-900">28 jours</p>
          <p className="mt-1 text-sm text-encre-2">à la date du 15 août</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-sable-2 pt-4 text-sm text-encre-2">
        <DeadlineBadge recommended />
        <span>Préparer les pièces pour le rendez-vous de réseau</span>
      </div>
    </div>
  )
}

export default function PublicHome() {
  return (
    <div>
      <section className="mx-auto max-w-[1100px] px-5 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="max-w-3xl animate-[fade-in_500ms_ease-out_both]">
          <p className="etiquette text-teal-700">Pour les proches aidants en Suisse romande</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-tight text-teal-900 sm:text-5xl md:text-6xl">Vous accompagnez un proche. Repères tient le fil des démarches.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-encre-2 sm:text-xl">Les délais, les documents et les étapes à venir, rassemblés dans un seul dossier, pour vous aider à avancer sans porter toute l’organisation dans votre tête.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/accueil" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-900 px-6 font-medium text-primary-foreground transition-colors hover:bg-teal-700">[CTA_PRINCIPAL] <ArrowRight aria-hidden="true" data-icon="inline-end" /></Link>
            <a href="#aperçu" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 font-medium text-teal-900 underline decoration-sable-2 underline-offset-4 hover:decoration-teal-700">Voir comment cela fonctionne <ArrowDown aria-hidden="true" data-icon="inline-end" /></a>
          </div>
        </div>
        <div id="aperçu" className="mt-14 scroll-mt-8 md:mt-20"><ProductPreview /></div>
      </section>

      <section className="border-y border-sable-2 bg-sable/50">
        <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-20">
          <p className="etiquette">Est-ce que c’est pour vous ?</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl text-teal-900 sm:text-4xl">Quand les démarches prennent plus de place qu’elles ne devraient.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">{situations.map((situation) => <article key={situation.title} className="flex flex-col gap-3 border-t-2 border-teal-700 pt-5"><h3 className="text-lg font-semibold leading-7 text-encre">{situation.title}</h3><p className="text-[17px] leading-7 text-encre-2">{situation.text}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <div className="max-w-2xl"><p className="etiquette">Ce que fait Repères</p><h2 className="mt-3 font-serif text-3xl text-teal-900 sm:text-4xl">Moins de recherche. Plus de visibilité sur la prochaine étape.</h2></div>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">{functions.map((item) => <article key={item.verb} className="flex gap-5 border-t border-sable-2 pt-5"><span className="font-mono text-sm font-semibold text-teal-700">{item.verb}</span><div className="flex flex-col gap-2"><h3 className="text-xl font-semibold text-encre">{item.title}</h3><p className="text-[17px] leading-7 text-encre-2">{item.text}</p></div></article>)}</div>
        <div className="mt-14 border-l-2 border-ocre bg-sable px-5 py-5 sm:px-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5"><div className="shrink-0"><DeadlineBadge /><span className="mx-2 text-encre-2">vs.</span><DeadlineBadge recommended /></div><p className="text-[17px] leading-7 text-encre-2">Cette distinction est volontaire. Repères vous aide à voir ce qui doit être fait, sans fabriquer de fausses urgences autour de chaque étape.</p></div></div>
      </section>

      <section className="border-y border-sable-2 bg-teal-50/60"><div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-20"><div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start"><div><p className="etiquette">Vos données</p><h2 className="mt-3 font-serif text-3xl text-teal-900 sm:text-4xl">Vous gardez la main.</h2></div><div className="flex flex-col gap-5 text-[17px] leading-7 text-encre-2"><p className="flex gap-3"><LockKeyhole className="mt-1 shrink-0 text-teal-700" aria-hidden="true" />Les informations restent accessibles uniquement aux personnes à qui vous donnez un accès.</p><p><strong className="font-semibold text-encre">[HEBERGEMENT_ET_LPD]</strong> Nous détaillerons ici où vos données sont hébergées et comment elles sont protégées selon le droit suisse.</p><p>Vous pouvez retirer un accès accordé, exporter votre dossier ou demander sa suppression.</p></div></div></div></section>

      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-20"><div className="grid gap-10 md:grid-cols-2"><div><p className="etiquette">En toute clarté</p><h2 className="mt-3 font-serif text-3xl text-teal-900">Ce que Repères ne fait pas.</h2></div><ul className="flex flex-col gap-4 text-[17px] leading-7 text-encre-2"><li className="flex gap-3"><Check className="mt-1 shrink-0 text-teal-700" aria-hidden="true" />Repères ne donne pas de conseil juridique.</li><li className="flex gap-3"><Check className="mt-1 shrink-0 text-teal-700" aria-hidden="true" />Repères ne remplit pas les formulaires à votre place.</li><li className="flex gap-3"><Check className="mt-1 shrink-0 text-teal-700" aria-hidden="true" />Repères ne remplace ni le curateur, ni l’assistant social, ni le médecin. Il vous aide à savoir quoi faire, quand, et avec quels documents en main.</li></ul></div></section>

      <section className="border-y border-sable-2 bg-sable/50"><div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto max-w-2xl text-center"><p className="etiquette">Accès et abonnement</p><h2 className="mt-3 font-serif text-3xl text-teal-900 sm:text-4xl">Un dossier simple, sans grille compliquée.</h2><p className="mt-5 text-[17px] leading-7 text-encre-2">[TARIF] Abonnement mensuel unique. [À PRÉCISER : période d’essai et ce qui arrive aux documents à la fin de l’abonnement.]</p><Link href="/accueil" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-teal-900 px-6 font-medium text-primary-foreground hover:bg-teal-700">[CTA_PRINCIPAL]</Link></div></div></section>

      <section className="mx-auto max-w-[820px] px-5 py-16 md:px-10 md:py-24"><p className="etiquette">Questions fréquentes</p><h2 className="mt-3 font-serif text-3xl text-teal-900 sm:text-4xl">Avant de commencer</h2><div className="mt-8 flex flex-col">{faqs.map((faq) => <details key={faq.question} className="group border-t border-sable-2 py-5"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-encre marker:content-none group-open:text-teal-900">{faq.question}<span className="float-right text-2xl font-normal text-teal-700" aria-hidden="true">+</span></summary><p className="mt-3 max-w-2xl text-[17px] leading-7 text-encre-2">{faq.answer}</p></details>)}</div></section>

      <section className="bg-teal-900 text-primary-foreground"><div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-5 py-16 md:px-10 md:py-20"><h2 className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">Vous accompagnez un proche. Repères tient le fil des démarches.</h2><Link href="/accueil" className="inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-creme px-6 font-medium text-teal-900 hover:bg-sable">[CTA_PRINCIPAL]</Link></div></section>
    </div>
  )
}

