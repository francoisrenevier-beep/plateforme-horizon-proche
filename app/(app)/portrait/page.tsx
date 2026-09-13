'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Printer, Users, Pencil, X } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { formatDateLongue, aujourdhuiISO } from '@/lib/dates'
import type { SectionPortrait } from '@/lib/demo-data'
import { ZoneTexte, BoutonPrincipal, BoutonSecondaire } from '@/components/ui/formulaire'

const AIDES: Record<string, string> = {
  pt1: 'Comment on me parle, ce qui m’aide à comprendre, le temps qu’il me faut pour répondre.',
  pt2: 'Ce qui me met en confiance : une routine, une personne, un objet, une façon d’annoncer les choses.',
  pt3: 'Les bruits, les lieux, les situations que je supporte mal, et ce qu’on peut faire à ce moment-là.',
  pt4: 'Comment se passe une journée ordinaire, du lever au coucher.',
  pt5: 'Mes centres d’intérêt, ce qui me fait du bien.',
  pt6: 'Les personnes importantes pour moi, et ce qu’elles savent faire avec moi.',
  pt7: 'D’où je viens, les grandes étapes de ma vie, ce qu’il faut savoir de mon parcours.',
}

export default function PortraitPage() {
  const { personne, dossier, actions } = useDossier()
  const [apercu, setApercu] = useState(false)
  const [enEdition, setEnEdition] = useState<string | null>(null)
  const remplies = dossier.portrait.filter((s) => s.texte).length

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-[32px] leading-tight text-teal-900">Bien m’accompagner</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-encre-2">
            Ce qu’il faut savoir sur {personne.prenom} pour l’accompagner au quotidien. Écrit à la première personne, comme
            si {personne.prenom} parlait.
          </p>
          <p className="etiquette mt-2">
            {remplies} section{remplies > 1 ? 's' : ''} sur 7 remplie{remplies > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BoutonPrincipal onClick={() => setApercu(true)} disabled={remplies === 0}>
            <Printer className="size-4" aria-hidden />
            Imprimer une page à remettre
          </BoutonPrincipal>
          <Link href="/acces" className="inline-flex h-11 items-center gap-2 rounded-md border border-sable-2 px-5 text-[15px] text-encre hover:bg-teal-50">
            <Users className="size-4" aria-hidden />
            Qui peut le lire
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {dossier.portrait.map((section) => (
          <article key={section.id} className="rounded-xl border border-sable-2 bg-card p-7 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-[22px] text-teal-900">{section.intitule}</h2>
              {enEdition !== section.id && (
                <button
                  type="button"
                  onClick={() => setEnEdition(section.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  {section.texte ? 'Modifier' : 'Écrire'}
                </button>
              )}
            </div>
            {enEdition === section.id ? (
              <EditeurSection
                section={section}
                aide={AIDES[section.id]}
                onAnnuler={() => setEnEdition(null)}
                onEnregistrer={(texte) => {
                  actions.modifierSectionPortrait(section.id, texte.trim() || null)
                  setEnEdition(null)
                }}
              />
            ) : section.texte ? (
              <p className="mt-3 whitespace-pre-line text-[18px] leading-[1.7] text-encre">{section.texte}</p>
            ) : (
              <p className="mt-3 text-[17px] leading-relaxed text-encre-2">Personne n’a encore rempli cette section. Une phrase suffit pour commencer.</p>
            )}
          </article>
        ))}
      </div>

      {/* Bandeau en pied de page, obligatoire */}
      <div className="rounded-xl bg-teal-50 p-6 text-[17px] leading-relaxed text-encre">
        Ce portrait appartient à {personne.prenom}.{' '}
        {personne.age < 18
          ? 'À sa majorité, il pourra le lire, le corriger et décider qui y a accès.'
          : 'Il peut le lire, le corriger et décider qui y a accès.'}
      </div>

      {apercu && <ApercuA4 sections={dossier.portrait} prenom={personne.prenom} age={personne.age} onClose={() => setApercu(false)} />}
    </div>
  )
}

function EditeurSection({
  section,
  aide,
  onAnnuler,
  onEnregistrer,
}: {
  section: SectionPortrait
  aide?: string
  onAnnuler: () => void
  onEnregistrer: (texte: string) => void
}) {
  const [texte, setTexte] = useState(section.texte ?? '')
  return (
    <div className="mt-3 flex flex-col gap-3">
      {aide && <p className="etiquette">{aide}</p>}
      <ZoneTexte
        rows={5}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Je…"
        aria-label={section.intitule}
        className="text-[17px]"
        autoFocus
      />
      <p className="etiquette">Écrivez à la première personne (« Je me repère mieux quand… »), pas à la troisième.</p>
      <div className="flex justify-end gap-2">
        <BoutonSecondaire className="h-10" onClick={onAnnuler}>
          Annuler
        </BoutonSecondaire>
        <BoutonPrincipal className="h-10" onClick={() => onEnregistrer(texte)}>
          Enregistrer
        </BoutonPrincipal>
      </div>
    </div>
  )
}

function ApercuA4({ sections, prenom, age, onClose }: { sections: SectionPortrait[]; prenom: string; age: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-encre/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Aperçu de la page à remettre">
      <div className="w-full max-w-2xl">
        <div className="mb-3 flex items-center justify-between print:hidden">
          <p className="text-[15px] font-medium text-creme">Aperçu — page A4</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} className="flex h-9 items-center gap-2 rounded-md bg-creme px-3 text-[13px] text-encre hover:bg-sable">
              <Printer className="size-4" aria-hidden />
              Imprimer
            </button>
            <button type="button" onClick={onClose} aria-label="Fermer l’aperçu" className="flex size-9 items-center justify-center rounded-md bg-creme text-encre hover:bg-sable">
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-card p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="border-b border-sable-2 pb-4">
            <p className="etiquette">Bien m’accompagner</p>
            <h2 className="font-serif text-2xl text-teal-900">
              {prenom}, {age} ans
            </h2>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {sections
              .filter((s) => s.texte)
              .map((s) => (
                <div key={s.id}>
                  <h3 className="font-serif text-[15px] text-teal-900">{s.intitule}</h3>
                  <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-encre">{s.texte}</p>
                </div>
              ))}
          </div>
          <p className="etiquette mt-8 border-t border-sable-2 pt-4">Rédigé par sa famille · imprimé le {formatDateLongue(aujourdhuiISO())}</p>
        </div>
      </div>
    </div>
  )
}
