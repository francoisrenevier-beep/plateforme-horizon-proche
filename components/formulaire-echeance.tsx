'use client'

import { useState } from 'react'
import { Clock, Flag } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { estISOValide } from '@/lib/dates'
import type { Echeance, Nature } from '@/lib/demo-data'
import { Modale, Champ, Entree, Selection, BoutonPrincipal, BoutonSecondaire, Pied, MessageErreur } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

// Ajout ou modification d'une échéance. La nature (délai légal / moment conseillé) est
// choisie explicitement, avec sa signification, et la provenance est obligatoire :
// pour un délai, le courrier lu ; pour un jalon, la règle de calendrier (CLAUDE.md §2.2).
export function FormulaireEcheance({
  onClose,
  echeance,
  natureInitiale,
  demarcheIdInitiale,
}: {
  onClose: () => void
  echeance?: Echeance
  natureInitiale?: Nature
  demarcheIdInitiale?: string
}) {
  const { dossier, actions } = useDossier()
  const [nature, setNature] = useState<Nature>(echeance?.nature ?? natureInitiale ?? 'delai')
  const [titre, setTitre] = useState(echeance?.titre ?? '')
  const [dateISO, setDateISO] = useState(echeance?.dateISO ?? '')
  const [mois, setMois] = useState(echeance?.dateISO ? echeance.dateISO.slice(0, 7) : '')
  const [provenance, setProvenance] = useState(echeance?.provenance ?? '')
  const [demarcheId, setDemarcheId] = useState(echeance?.demarcheId ?? demarcheIdInitiale ?? '')
  const [erreur, setErreur] = useState<string | null>(null)

  const estDelai = nature === 'delai'

  const enregistrer = () => {
    if (!titre.trim()) return setErreur('Donnez un titre à cette échéance.')
    let iso = dateISO
    if (!estDelai) {
      if (!/^\d{4}-\d{2}$/.test(mois)) return setErreur('Indiquez le mois du moment conseillé.')
      iso = `${mois}-15`
    }
    if (!estISOValide(iso)) return setErreur('Indiquez une date valide.')
    if (!provenance.trim()) {
      return setErreur(
        estDelai
          ? 'Indiquez sur quel courrier vous avez lu cette date. Un délai légal a toujours une source.'
          : 'Indiquez la règle ou la raison qui vous fait proposer ce moment.',
      )
    }
    const donnees = {
      nature,
      titre: titre.trim(),
      dateISO: iso,
      date: undefined,
      provenance: provenance.trim(),
      demarcheId: demarcheId || undefined,
      origine: 'manuel' as const,
    }
    if (echeance) actions.modifierEcheance(echeance.id, donnees)
    else actions.ajouterEcheance({ ...donnees, fait: false })
    onClose()
  }

  return (
    <Modale titre={echeance ? 'Modifier l’échéance' : 'Ajouter une échéance'} onClose={onClose}>
      <div className="flex flex-col gap-5">
        {erreur && <MessageErreur>{erreur}</MessageErreur>}

        <fieldset>
          <legend className="text-[15px] font-medium text-encre">De quoi s’agit-il ?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ChoixNature
              actif={estDelai}
              onClick={() => setNature('delai')}
              icone={<Clock className="size-5" strokeWidth={1.75} aria-hidden />}
              titre="Un délai légal"
              texte="Une date écrite sur un courrier officiel. Elle est opposable."
              ton="delai"
            />
            <ChoixNature
              actif={!estDelai}
              onClick={() => setNature('jalon')}
              icone={<Flag className="size-5" strokeWidth={1.75} aria-hidden />}
              titre="Un moment conseillé"
              texte="Une recommandation de calendrier, pas une obligation."
              ton="jalon"
            />
          </div>
        </fieldset>

        <Champ label="Quoi" htmlFor="e-titre" obligatoire>
          <Entree id="e-titre" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={estDelai ? 'Renvoyer le questionnaire' : 'Faire le point avec l’école'} />
        </Champ>

        {estDelai ? (
          <Champ label="Date limite" htmlFor="e-date" obligatoire aide="Recopiez la date telle qu’elle figure sur le courrier.">
            <Entree id="e-date" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          </Champ>
        ) : (
          <Champ label="Vers quel mois" htmlFor="e-mois" obligatoire aide="Un moment conseillé n’a pas de jour précis.">
            <Entree id="e-mois" type="month" value={mois} onChange={(e) => setMois(e.target.value)} />
          </Champ>
        )}

        <Champ
          label={estDelai ? 'Sur quel courrier avez-vous lu cette date ?' : 'Quelle règle ou raison propose ce moment ?'}
          htmlFor="e-prov"
          obligatoire
        >
          <Entree
            id="e-prov"
            value={provenance}
            onChange={(e) => setProvenance(e.target.value)}
            placeholder={estDelai ? 'Courrier de l’Office AI Vaud du 1er septembre 2026' : 'Comptez un point de situation annuel'}
          />
        </Champ>

        {dossier.demarches.length > 0 && (
          <Champ label="Rattacher à une démarche" htmlFor="e-dem">
            <Selection id="e-dem" value={demarcheId} onChange={(e) => setDemarcheId(e.target.value)}>
              <option value="">Aucune</option>
              {dossier.demarches.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.titre}
                </option>
              ))}
            </Selection>
          </Champ>
        )}

        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal onClick={enregistrer}>{echeance ? 'Enregistrer' : 'Ajouter'}</BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}

function ChoixNature({
  actif,
  onClick,
  icone,
  titre,
  texte,
  ton,
}: {
  actif: boolean
  onClick: () => void
  icone: React.ReactNode
  titre: string
  texte: string
  ton: Nature
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        ton === 'delai' ? 'border-l-[3px] border-l-rouille' : 'bg-sable',
        actif ? 'border-teal-700 ring-2 ring-teal-700/30' : 'border-sable-2 hover:bg-teal-50',
      )}
    >
      <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full', ton === 'delai' ? 'bg-rouille/10 text-rouille' : 'bg-sable-2/60 text-ocre')}>
        {icone}
      </span>
      <span>
        <span className="block text-[15px] font-medium text-encre">{titre}</span>
        <span className="etiquette block">{texte}</span>
      </span>
    </button>
  )
}
