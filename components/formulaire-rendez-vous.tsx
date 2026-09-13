'use client'

import { useState } from 'react'
import { useDossier } from '@/lib/store'
import { estISOValide } from '@/lib/dates'
import type { RendezVous } from '@/lib/demo-data'
import { Modale, Champ, Entree, BoutonPrincipal, BoutonSecondaire, Pied, MessageErreur } from '@/components/ui/formulaire'

export function FormulaireRendezVous({ onClose, rdv }: { onClose: () => void; rdv?: RendezVous }) {
  const { dossier, actions } = useDossier()
  const [intervenant, setIntervenant] = useState(rdv?.intervenant ?? '')
  const [fonction, setFonction] = useState(rdv?.fonction ?? '')
  const [dateISO, setDateISO] = useState(rdv?.dateISO ?? '')
  const [heure, setHeure] = useState(rdv?.heure ?? '')
  const [lieu, setLieu] = useState(rdv?.lieu ?? '')
  const [erreur, setErreur] = useState<string | null>(null)

  const enregistrer = () => {
    if (!intervenant.trim()) return setErreur('Indiquez avec qui a lieu le rendez-vous.')
    if (!estISOValide(dateISO)) return setErreur('Indiquez une date valide.')
    const donnees = { intervenant: intervenant.trim(), fonction: fonction.trim(), dateISO, heure: heure.trim() || undefined, lieu: lieu.trim() }
    if (rdv) actions.modifierRendezVous(rdv.id, donnees)
    else actions.ajouterRendezVous(donnees)
    onClose()
  }

  return (
    <Modale titre={rdv ? 'Modifier le rendez-vous' : 'Ajouter un rendez-vous'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
        <Champ label="Avec qui" htmlFor="r-int" obligatoire>
          <Entree id="r-int" list="r-intervenants" value={intervenant} onChange={(e) => setIntervenant(e.target.value)} autoFocus />
          <datalist id="r-intervenants">
            {dossier.intervenants.map((i) => (
              <option key={i.id} value={i.contact !== 'Greffe' && i.contact !== 'Secrétariat' ? i.contact : i.organisation}>
                {i.organisation}
              </option>
            ))}
          </datalist>
        </Champ>
        <Champ label="Fonction ou objet" htmlFor="r-fn" aide="« Pédopsychiatre », « Point de situation »…">
          <Entree id="r-fn" value={fonction} onChange={(e) => setFonction(e.target.value)} />
        </Champ>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Date" htmlFor="r-date" obligatoire>
            <Entree id="r-date" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          </Champ>
          <Champ label="Heure" htmlFor="r-heure">
            <Entree id="r-heure" value={heure} onChange={(e) => setHeure(e.target.value)} placeholder="14h30" />
          </Champ>
        </div>
        <Champ label="Lieu" htmlFor="r-lieu">
          <Entree id="r-lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} />
        </Champ>
        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal onClick={enregistrer}>{rdv ? 'Enregistrer' : 'Ajouter'}</BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}
