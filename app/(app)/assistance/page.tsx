'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, MessageCircle, Send, ShieldCheck } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { BoutonPrincipal, BoutonSecondaire, ZoneTexte } from '@/components/ui/formulaire'

const exemples = [
  'Je ne comprends pas la décision reçue de l’AI.',
  'Quels documents dois-je préparer pour cette démarche ?',
  'Je dois répondre à un courrier : par où commencer ?',
]

export default function AssistancePage() {
  const { personne } = useDossier()
  const [question, setQuestion] = useState('')
  const [envoyee, setEnvoyee] = useState(false)

  function envoyer() {
    if (!question.trim()) return
    setEnvoyee(true)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <header className="max-w-2xl">
        <p className="etiquette text-teal-700">L’accompagnement inclus dans votre abonnement</p>
        <h1 className="mt-2 font-serif text-[32px] leading-tight text-teal-900">Mes questions</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-encre-2">
          Posez votre question depuis le dossier de {personne.prenom}. Vous gardez le contexte, les documents et les réponses au même endroit.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Fonctionnement de l’assistance">
        {[
          ['1', 'Écrivez', 'Expliquez ce qui vous bloque, avec vos mots.'],
          ['2', 'Ajoutez le contexte', 'Indiquez la démarche ou joignez un document si nécessaire.'],
          ['3', 'Retrouvez la réponse', 'Votre échange reste dans cet espace, prêt à être relu.'],
        ].map(([numero, titre, texte]) => (
          <article key={numero} className="rounded-lg border border-sable-2 bg-card p-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900">{numero}</span>
            <h2 className="mt-4 font-serif text-lg text-teal-900">{titre}</h2>
            <p className="mt-1 text-[14px] leading-6 text-encre-2">{texte}</p>
          </article>
        ))}
      </section>

      {envoyee ? (
        <section className="rounded-lg border border-teal-700/25 bg-teal-50 p-6" aria-live="polite">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
            <div>
              <h2 className="font-serif text-xl text-teal-900">Votre question est enregistrée</h2>
              <p className="mt-2 text-[15px] leading-6 text-encre-2">Dans la version complète, votre demande sera transmise à l’équipe Horizon Proche et la réponse apparaîtra ici. Pour ce prototype, l’échange est présenté comme une prévisualisation.</p>
              <button type="button" className="mt-4 text-[14px] font-medium text-teal-700 underline" onClick={() => { setEnvoyee(false); setQuestion('') }}>Poser une autre question</button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)] sm:p-8" aria-labelledby="nouvelle-question">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sable text-teal-700"><MessageCircle className="size-5" aria-hidden /></span>
            <div>
              <h2 id="nouvelle-question" className="font-serif text-xl text-teal-900">Que voulez-vous éclaircir ?</h2>
              <p className="mt-1 text-[14px] text-encre-2">Ne recopiez pas tout votre dossier : nous voyons déjà la personne et les démarches associées.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {exemples.map((exemple) => <button key={exemple} type="button" onClick={() => setQuestion(exemple)} className="rounded-full border border-sable-2 px-3 py-2 text-left text-[13px] text-encre-2 transition-colors hover:bg-teal-50">{exemple}</button>)}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <ZoneTexte value={question} onChange={(event) => setQuestion(event.target.value)} rows={6} placeholder="Décrivez votre question ou la situation qui vous bloque…" aria-label="Votre question" />
            <div className="flex flex-col gap-3 border-t border-sable-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[13px] text-encre-2"><ShieldCheck className="size-4 text-teal-700" aria-hidden /> N’envoyez que les informations nécessaires.</p>
              <BoutonPrincipal onClick={envoyer} disabled={!question.trim()}><Send className="size-4" aria-hidden /> Envoyer ma question</BoutonPrincipal>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-sable-2 bg-sable/50 p-6">
        <h2 className="font-serif text-xl text-teal-900">Pour avancer sans attendre</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/documents" className="flex items-center justify-between rounded-md bg-card px-4 py-3 text-[15px] text-encre hover:bg-teal-50"><span>Ouvrir le coffre de documents</span><ChevronRight className="size-4 text-encre-2" aria-hidden /></Link>
          <Link href="/contacts" className="flex items-center justify-between rounded-md bg-card px-4 py-3 text-[15px] text-encre hover:bg-teal-50"><span>Retrouver mes contacts</span><ChevronRight className="size-4 text-encre-2" aria-hidden /></Link>
        </div>
        <p className="mt-4 text-[13px] leading-5 text-encre-2">Horizon Proche vous aide à comprendre et organiser vos démarches. Ce service ne remplace pas un conseil juridique, médical ou social.</p>
      </section>
    </div>
  )
}

export function AssistanceHistoryPreview() {
  return <BoutonSecondaire className="h-10">Voir mes échanges</BoutonSecondaire>
}
