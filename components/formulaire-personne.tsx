'use client'

import { useState } from 'react'
import { useDossier } from '@/lib/store'
import { estISOValide, aujourdhuiISO } from '@/lib/dates'
import type { Personne } from '@/lib/demo-data'
import { Modale, Champ, Entree, ZoneTexte, BoutonPrincipal, BoutonSecondaire, Pied, MessageErreur } from '@/components/ui/formulaire'

// Création ou modification d'une personne accompagnée (= d'un dossier).
export function FormulairePersonne({ onClose, personne }: { onClose: () => void; personne?: Personne }) {
  const { actions } = useDossier()
  const [prenom, setPrenom] = useState(personne?.prenom ?? '')
  const [nom, setNom] = useState(personne?.nom ?? '')
  const [naissanceISO, setNaissanceISO] = useState(personne?.naissanceISO ?? '')
  const [contexte, setContexte] = useState(personne?.contexte ?? '')
  const [erreur, setErreur] = useState<string | null>(null)

  const enregistrer = () => {
    if (!prenom.trim()) return setErreur('Le prénom est nécessaire.')
    if (!estISOValide(naissanceISO)) return setErreur('Indiquez une date de naissance valide.')
    if (naissanceISO > aujourdhuiISO()) return setErreur('La date de naissance ne peut pas être dans le futur.')
    const donnees = { prenom: prenom.trim(), nom: nom.trim(), naissanceISO, contexte: contexte.trim() }
    if (personne) {
      actions.modifierPersonne(personne.id, donnees)
      onClose()
      return
    }
    const r = actions.ajouterPersonne(donnees)
    if (!r.ok) return setErreur(r.raison)
    onClose()
  }

  return (
    <Modale
      titre={personne ? `Modifier les informations de ${personne.prenom}` : 'Ajouter une personne'}
      sousTitre={personne ? undefined : 'Un dossier par personne accompagnée'}
      onClose={onClose}
    >
      <div className="flex flex-col gap-5">
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Prénom" htmlFor="p-prenom" obligatoire>
            <Entree id="p-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoFocus />
          </Champ>
          <Champ label="Nom" htmlFor="p-nom">
            <Entree id="p-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          </Champ>
        </div>
        <Champ label="Date de naissance" htmlFor="p-naissance" obligatoire aide="Elle sert à calculer les repères de la chronologie, comme les 18 ans.">
          <Entree id="p-naissance" type="date" value={naissanceISO} onChange={(e) => setNaissanceISO(e.target.value)} max={aujourdhuiISO()} />
        </Champ>
        <Champ label="Situation, en quelques mots" htmlFor="p-contexte" aide="Ce qu’un nouvel intervenant doit savoir en premier. Vous pourrez compléter plus tard.">
          <ZoneTexte id="p-contexte" rows={3} value={contexte} onChange={(e) => setContexte(e.target.value)} />
        </Champ>
        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal onClick={enregistrer}>{personne ? 'Enregistrer' : 'Créer le dossier'}</BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}
