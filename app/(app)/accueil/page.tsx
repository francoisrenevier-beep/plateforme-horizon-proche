'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, HelpCircle, Search } from 'lucide-react'
import { useDossier, parcoursSuivis } from '@/lib/store'
import { listeParcours, CATEGORIES, type CategorieParcours, parcours as catalogue } from '@/lib/parcours'
import { situations } from '@/lib/parcours/orientation'
import { CarteParcoursCatalogue, CarteParcoursActif } from '@/components/carte-parcours'
import { Modale, BoutonSecondaire } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

type Filtre = 'tous' | CategorieParcours

const descriptionsCategories: Record<CategorieParcours, string> = {
  enfant: 'École, formation, majorité et premières demandes.',
  adulte: 'Hébergement, emploi, finances et protection.',
  'personne-agee': 'Entrée en EMS, maintien à domicile et décisions à venir.',
  transversal: 'Les démarches qui concernent de nombreuses familles.',
}

export default function AccueilPage() {
  const { personne, dossier, titulaire } = useDossier()
  const [filtre, setFiltre] = useState<Filtre>('tous')
  const [recherche, setRecherche] = useState('')
  const [orientation, setOrientation] = useState(false)

  const suivis = parcoursSuivis(dossier)
  const rechercheNormalisee = recherche.trim().toLocaleLowerCase('fr')
  const disponibles = listeParcours
    .filter((p) => !dossier.parcours[p.id]?.active && (filtre === 'tous' || p.categorie === filtre))
    .filter((p) => !rechercheNormalisee || `${p.titre} ${p.positionnement} ${p.resume}`.toLocaleLowerCase('fr').includes(rechercheNormalisee))
    // Les parcours ouvrables d'abord, les « bientôt disponibles » ensuite.
    .sort((a, b) => Number(b.publie) - Number(a.publie))

  const etapes = [
    { titre: 'Décrire la personne accompagnée', detail: 'Pour adapter les démarches à sa situation.', href: '/portrait', fait: dossier.portrait.some((section) => section.texte) },
    { titre: 'Choisir un premier parcours', detail: 'Pour obtenir une feuille de route concrète.', href: '#titre-catalogue', fait: suivis.length > 0 },
    { titre: 'Ranger un premier document', detail: 'Pour ne plus chercher vos courriers.', href: '/documents', fait: dossier.documents.length > 0 },
  ]
  const progression = etapes.filter((etape) => etape.fait).length

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Bonjour {titulaire.prenom}</h1>
        <p className="mt-1 text-encre-2">
          Dossier de {personne.prenom}, {personne.age} ans ·{' '}
          {suivis.length === 0 ? 'aucun parcours en cours' : `${suivis.length} parcours en cours`}
        </p>
      </header>

      <section className="rounded-lg border border-teal-700/25 bg-teal-50 p-5" aria-labelledby="titre-demarrage">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="etiquette text-teal-700">Votre espace aidant</p><h2 id="titre-demarrage" className="mt-1 font-serif text-xl text-teal-900">Commencez ici, en trois étapes</h2><p className="mt-1 text-[15px] text-encre-2">Horizon Proche devient utile dès que votre dossier contient un peu de contexte.</p></div>
          <span className="rounded-full bg-card px-3 py-1.5 text-[13px] font-medium text-teal-900">{progression}/3 terminé{progression > 1 ? 's' : ''}</span>
        </div>
        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {etapes.map((etape, index) => <li key={etape.titre}><Link href={etape.href} className="flex h-full gap-3 rounded-md bg-card p-3 transition-colors hover:bg-creme"><span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full text-[13px]', etape.fait ? 'bg-teal-700 text-primary-foreground' : 'bg-sable text-encre-2')}>{etape.fait ? '✓' : index + 1}</span><span><span className="block text-[14px] font-medium text-encre">{etape.titre}</span><span className="mt-0.5 block text-[12px] leading-5 text-encre-2">{etape.detail}</span></span></Link></li>)}
        </ol>
      </section>

      {/* Parcours actifs */}
      <section aria-labelledby="titre-actifs">
        <h2 id="titre-actifs" className="font-serif text-xl text-teal-900">
          En cours pour {personne.prenom}
        </h2>
        {suivis.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Aucun parcours n’est suivi pour {personne.prenom}. Choisissez une situation ci-dessous : vous verrez toutes les
            étapes avant de décider.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {suivis.map(({ p, suivi }) => (
              <CarteParcoursActif key={p.id} p={p} personne={personne} suivi={suivi} />
            ))}
          </div>
        )}
      </section>

      {/* Catalogue */}
      <section aria-labelledby="titre-catalogue">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="titre-catalogue" className="font-serif text-xl text-teal-900">
              Choisir un parcours
            </h2>
            <p className="mt-1 max-w-2xl text-[15px] text-encre-2">
              Une situation, toutes ses étapes dans l’ordre. Les délais indiqués sont des ordres de grandeur, à confirmer
              auprès de l’autorité concernée.
            </p>
          </div>
          <BoutonSecondaire onClick={() => setOrientation(true)} className="h-10">
            <HelpCircle className="size-4" aria-hidden />
            Je ne sais pas par où commencer
          </BoutonSecondaire>
        </div>

        <label className="relative mt-5 block max-w-xl">
          <span className="sr-only">Rechercher un parcours</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-encre-2" aria-hidden />
          <input
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher : AI, hébergement, curatelle…"
            className="h-11 w-full rounded-md border border-sable-2 bg-card pl-10 pr-4 text-[15px] text-encre outline-none transition-colors placeholder:text-encre-2 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choisir une situation">
          {CATEGORIES.map((c) => {
            const nombre = listeParcours.filter((p) => p.categorie === c.id && p.publie).length
            const selectionnee = filtre === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFiltre(selectionnee ? 'tous' : c.id)}
                aria-pressed={selectionnee}
                className={cn(
                  'flex min-h-[112px] flex-col items-start rounded-lg border p-4 text-left transition-colors',
                  selectionnee ? 'border-teal-700 bg-teal-50' : 'border-sable-2 bg-card hover:border-teal-700/40 hover:bg-teal-50/60',
                )}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="font-serif text-lg text-teal-900">{c.libelle}</span>
                  <span className="rounded-full bg-sable px-2 py-0.5 text-[12px] text-encre-2">{nombre} parcours</span>
                </span>
                <span className="mt-2 max-w-sm text-[14px] leading-relaxed text-encre-2">{descriptionsCategories[c.id]}</span>
                <span className="mt-auto pt-3 text-[13px] font-medium text-teal-700">{selectionnee ? 'Afficher toutes les situations' : 'Voir les parcours →'}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[13px] text-encre-2">
            {filtre === 'tous' ? 'Tous les parcours disponibles' : `Parcours pour : ${CATEGORIES.find((c) => c.id === filtre)?.libelle}`}
          </p>
          {filtre !== 'tous' && <button type="button" onClick={() => setFiltre('tous')} className="text-[13px] font-medium text-teal-700 underline-offset-4 hover:underline">Tout afficher</button>}
        </div>

        {disponibles.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Tous les parcours de cette catégorie sont déjà suivis pour {personne.prenom}.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {disponibles.map((p) => (
              <CarteParcoursCatalogue key={p.id} p={p} personne={personne} />
            ))}
          </div>
        )}
      </section>

      {orientation && (
        <Modale
          titre="Par où commencer ?"
          sousTitre="Choisissez la phrase qui ressemble le plus à votre situation"
          onClose={() => setOrientation(false)}
        >
          <ul className="flex flex-col gap-2">
            {[...situations]
              .sort((a, b) => Number(!!catalogue[b.parcoursId]?.publie) - Number(!!catalogue[a.parcoursId]?.publie))
              .map((s) => {
              const p = catalogue[s.parcoursId]
              if (!p) return null
              if (!p.publie) {
                return (
                  <li key={s.id} aria-disabled="true" className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-sable-2 px-4 py-3 text-[15px] text-encre-2">
                    <span>
                      <span className="block">{s.texte}</span>
                      <span className="etiquette">→ {p.titre}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-sable px-2.5 py-0.5 text-[12px]">Bientôt</span>
                  </li>
                )
              }
              return (
                <li key={s.id}>
                  <Link
                    href={`/parcours/${p.id}`}
                    onClick={() => setOrientation(false)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-sable-2 px-4 py-3 text-[15px] text-encre transition-colors hover:bg-teal-50"
                  >
                    <span>
                      <span className="block">{s.texte}</span>
                      <span className="etiquette">→ {p.titre}</span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-encre-2" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-[13px] leading-relaxed text-encre-2">
            Aucune phrase ne correspond ? Parcourez le catalogue par situation, ou appelez la permanence gratuite des proches
            aidants du canton de Vaud (0800 660 660).
          </p>
        </Modale>
      )}
    </div>
  )
}
