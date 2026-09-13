'use client'

import { useState } from 'react'
import { Plus, Clock, Flag } from 'lucide-react'
import { useDossier, useEcheances } from '@/lib/store'
import { aujourdhuiISO } from '@/lib/dates'
import type { Echeance } from '@/lib/demo-data'
import { EcheanceItem } from '@/components/echeance-item'
import { FormulaireEcheance } from '@/components/formulaire-echeance'
import { BoutonPrincipal, BoutonSuppression } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

type Filtre = 'toutes' | 'delai' | 'jalon'

export default function EcheancesPage() {
  const { personne, actions } = useDossier()
  const echeances = useEcheances()
  const [filtre, setFiltre] = useState<Filtre>('toutes')
  const [ajout, setAjout] = useState(false)
  const [enEdition, setEnEdition] = useState<Echeance | null>(null)
  const [suppression, setSuppression] = useState<string | null>(null)

  const auj = aujourdhuiISO()
  const filtrees = echeances.filter((e) => filtre === 'toutes' || e.nature === filtre)
  const aVenir = filtrees.filter((e) => !e.fait && (e.nature === 'delai' || e.dateISO >= auj))
  const passees = filtrees.filter((e) => !e.fait && e.nature === 'jalon' && e.dateISO < auj)
  const faites = filtrees.filter((e) => e.fait)

  const nbDelais = echeances.filter((e) => e.nature === 'delai' && !e.fait).length
  const nbJalons = echeances.filter((e) => e.nature === 'jalon' && !e.fait).length

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-teal-900">Échéances</h1>
          <p className="mt-1 text-encre-2">
            Tout ce qui attend une réponse ou un geste pour {personne.prenom}, délais légaux et moments conseillés.
          </p>
        </div>
        <BoutonPrincipal onClick={() => setAjout(true)}>
          <Plus className="size-4" aria-hidden />
          Ajouter une échéance
        </BoutonPrincipal>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par nature">
        <Pastille actif={filtre === 'toutes'} onClick={() => setFiltre('toutes')}>
          Toutes
        </Pastille>
        <Pastille actif={filtre === 'delai'} onClick={() => setFiltre('delai')}>
          <Clock className="size-3.5 text-rouille" aria-hidden />
          Délais légaux ({nbDelais})
        </Pastille>
        <Pastille actif={filtre === 'jalon'} onClick={() => setFiltre('jalon')}>
          <Flag className="size-3.5 text-ocre" aria-hidden />
          Moments conseillés ({nbJalons})
        </Pastille>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="etiquette">À venir</h2>
        {aVenir.length === 0 && (
          <p className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Rien en attente. Quand vous recevez un courrier avec une date, ajoutez-la ici comme délai légal.
          </p>
        )}
        {aVenir.map((e) => (
          <Ligne
            key={e.id}
            e={e}
            suppression={suppression}
            setSuppression={setSuppression}
            onModifier={() => setEnEdition(e)}
            onBasculerFait={() => actions.basculerEcheanceFaite(e.id)}
            onSupprimer={() => actions.supprimerEcheance(e.id)}
          />
        ))}
      </section>

      {passees.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="etiquette">Moments conseillés passés, non marqués</h2>
          {passees.map((e) => (
            <Ligne
              key={e.id}
              e={e}
              suppression={suppression}
              setSuppression={setSuppression}
              onModifier={() => setEnEdition(e)}
              onBasculerFait={() => actions.basculerEcheanceFaite(e.id)}
              onSupprimer={() => actions.supprimerEcheance(e.id)}
            />
          ))}
        </section>
      )}

      {faites.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="etiquette">Faites</h2>
          {faites.map((e) => (
            <Ligne
              key={e.id}
              e={e}
              suppression={suppression}
              setSuppression={setSuppression}
              onModifier={() => setEnEdition(e)}
              onBasculerFait={() => actions.basculerEcheanceFaite(e.id)}
              onSupprimer={() => actions.supprimerEcheance(e.id)}
            />
          ))}
        </section>
      )}

      <p className="border-t border-sable-2 pt-4 text-[15px] leading-relaxed text-encre-2">
        Un délai légal vient toujours d’un courrier que vous avez reçu. Un moment conseillé vient d’une règle de calendrier
        ou d’un parcours suivi : il vous aide à vous organiser, il ne vous oblige à rien.
      </p>

      {ajout && <FormulaireEcheance onClose={() => setAjout(false)} />}
      {enEdition && <FormulaireEcheance echeance={enEdition} onClose={() => setEnEdition(null)} />}
    </div>
  )
}

function Ligne({
  e,
  suppression,
  setSuppression,
  onModifier,
  onBasculerFait,
  onSupprimer,
}: {
  e: Echeance
  suppression: string | null
  setSuppression: (id: string | null) => void
  onModifier: () => void
  onBasculerFait: () => void
  onSupprimer: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <EcheanceItem echeance={e} onBasculerFait={onBasculerFait} onModifier={onModifier} onSupprimer={() => setSuppression(e.id)} />
      {suppression === e.id && (
        <div className="flex justify-end px-2">
          <BoutonSuppression
            arme
            onArmer={() => {}}
            onConfirmer={() => {
              onSupprimer()
              setSuppression(null)
            }}
            onAnnuler={() => setSuppression(null)}
          />
        </div>
      )}
    </div>
  )
}

function Pastille({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] transition-colors',
        actif ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 bg-card text-encre hover:bg-teal-50',
      )}
    >
      {children}
    </button>
  )
}
