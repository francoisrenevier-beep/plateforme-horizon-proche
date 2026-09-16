'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, HelpCircle } from 'lucide-react'
import { useDossier, parcoursSuivis } from '@/lib/store'
import { listeParcours, CATEGORIES, type CategorieParcours, parcours as catalogue } from '@/lib/parcours'
import { situations } from '@/lib/parcours/orientation'
import { CarteParcoursCatalogue, CarteParcoursActif } from '@/components/carte-parcours'
import { Modale, BoutonSecondaire } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

type Filtre = 'tous' | CategorieParcours

export default function AccueilPage() {
  const { personne, dossier, titulaire } = useDossier()
  const [filtre, setFiltre] = useState<Filtre>('tous')
  const [orientation, setOrientation] = useState(false)

  const suivis = parcoursSuivis(dossier)
  const disponibles = listeParcours.filter((p) => !dossier.parcours[p.id]?.active && (filtre === 'tous' || p.categorie === filtre))

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Bonjour {titulaire.prenom}</h1>
        <p className="mt-1 text-encre-2">
          Dossier de {personne.prenom}, {personne.age} ans ·{' '}
          {suivis.length === 0 ? 'aucun parcours en cours' : `${suivis.length} parcours en cours`}
        </p>
      </header>

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

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrer par situation">
          {[{ id: 'tous' as const, libelle: 'Tous' }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFiltre(c.id)}
              aria-pressed={filtre === c.id}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[14px] transition-colors',
                filtre === c.id ? 'bg-teal-100 text-teal-900' : 'border border-sable-2 text-encre hover:bg-teal-50',
              )}
            >
              {c.libelle}
            </button>
          ))}
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
            {situations.map((s) => {
              const p = catalogue[s.parcoursId]
              if (!p) return null
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
