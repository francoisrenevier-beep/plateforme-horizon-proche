'use client'

import { useState } from 'react'
import { Pencil, Download, Archive, ArchiveRestore, RotateCcw, Plus } from 'lucide-react'
import { useDossier, LIMITE_DOSSIERS } from '@/lib/store'
import { formatDateLongue } from '@/lib/dates'
import { Card, CardTitle } from '@/components/ui/card'
import { FormulairePersonne } from '@/components/formulaire-personne'
import { Champ, Entree, BoutonPrincipal, BoutonSecondaire, BoutonSuppression } from '@/components/ui/formulaire'

export default function ReglagesPage() {
  const { personne, personnes, personnesArchivees, titulaire, limiteAtteinte, actions } = useDossier()
  const [editionPersonne, setEditionPersonne] = useState(false)
  const [ajoutPersonne, setAjoutPersonne] = useState(false)
  const [editionTitulaire, setEditionTitulaire] = useState(false)
  const [prenom, setPrenom] = useState(titulaire.prenom)
  const [nom, setNom] = useState(titulaire.nom)
  const [ville, setVille] = useState(titulaire.ville)
  const [reinit, setReinit] = useState(false)
  const [archivage, setArchivage] = useState(false)

  const exporter = () => {
    const json = actions.exporterJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `horizon-proche-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Réglages</h1>
        <p className="mt-1 text-encre-2">Votre compte, les personnes que vous accompagnez, vos données.</p>
      </header>

      {/* Personne active */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle>Dossier de {personne.prenom}</CardTitle>
          <button type="button" onClick={() => setEditionPersonne(true)} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
            <Pencil className="size-3.5" aria-hidden />
            Modifier
          </button>
        </div>
        <dl className="mt-4 grid gap-3 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="etiquette">Nom</dt>
            <dd className="text-encre">
              {personne.prenom} {personne.nom}
            </dd>
          </div>
          <div>
            <dt className="etiquette">Date de naissance</dt>
            <dd className="text-encre">
              {formatDateLongue(personne.naissanceISO)} · {personne.age} ans
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="etiquette">Situation</dt>
            <dd className="text-encre">{personne.contexte || <span className="text-encre-2">Non renseignée.</span>}</dd>
          </div>
        </dl>
        <div className="mt-5 border-t border-sable-2 pt-4">
          {personne.archive ? (
            <BoutonSecondaire onClick={() => actions.archiverPersonne(personne.id, false)} disabled={limiteAtteinte}>
              <ArchiveRestore className="size-4" aria-hidden />
              Rouvrir ce dossier
            </BoutonSecondaire>
          ) : (
            <div className="flex flex-col gap-2">
              <BoutonSuppression
                libelle="Archiver ce dossier"
                arme={archivage}
                onArmer={() => setArchivage(true)}
                onAnnuler={() => setArchivage(false)}
                onConfirmer={() => {
                  actions.archiverPersonne(personne.id, true)
                  setArchivage(false)
                }}
              />
              <p className="etiquette max-w-xl">
                Un dossier archivé sort du décompte des {LIMITE_DOSSIERS} dossiers, reste lisible et exportable, et ne
                génère plus aucune notification ni relance.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Toutes les personnes */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle>Personnes accompagnées</CardTitle>
          <span className="etiquette">
            {personnes.length} sur {LIMITE_DOSSIERS}
          </span>
        </div>
        <ul className="mt-4 flex flex-col divide-y divide-sable-2">
          {personnes.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3">
              <span className="text-[15px] text-encre">
                {p.prenom} {p.nom} · {p.age} ans
              </span>
              {p.id !== personne.id && (
                <button type="button" onClick={() => actions.setPersonneId(p.id)} className="text-[13px] text-teal-700 hover:underline">
                  Ouvrir
                </button>
              )}
            </li>
          ))}
          {personnesArchivees.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-encre-2">
              <span className="inline-flex items-center gap-2 text-[15px]">
                <Archive className="size-4" aria-hidden />
                {p.prenom} {p.nom} · archivé
              </span>
              <button type="button" onClick={() => actions.setPersonneId(p.id)} className="text-[13px] text-teal-700 hover:underline">
                Consulter
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-sable-2 pt-4">
          <BoutonSecondaire onClick={() => setAjoutPersonne(true)} disabled={limiteAtteinte}>
            <Plus className="size-4" aria-hidden />
            Ajouter une personne
          </BoutonSecondaire>
          {limiteAtteinte && <p className="etiquette mt-2">Limite atteinte. Archivez un dossier pour en ouvrir un nouveau.</p>}
        </div>
      </Card>

      {/* Titulaire */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle>Vous</CardTitle>
          {!editionTitulaire && (
            <button type="button" onClick={() => setEditionTitulaire(true)} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
              <Pencil className="size-3.5" aria-hidden />
              Modifier
            </button>
          )}
        </div>
        {editionTitulaire ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ label="Prénom" htmlFor="t-prenom">
                <Entree id="t-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </Champ>
              <Champ label="Nom" htmlFor="t-nom">
                <Entree id="t-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
              </Champ>
            </div>
            <Champ label="Ville" htmlFor="t-ville">
              <Entree id="t-ville" value={ville} onChange={(e) => setVille(e.target.value)} />
            </Champ>
            <div className="flex justify-end gap-2">
              <BoutonSecondaire className="h-10" onClick={() => setEditionTitulaire(false)}>
                Annuler
              </BoutonSecondaire>
              <BoutonPrincipal
                className="h-10"
                onClick={() => {
                  actions.modifierTitulaire({ prenom: prenom.trim() || titulaire.prenom, nom: nom.trim(), ville: ville.trim() })
                  setEditionTitulaire(false)
                }}
              >
                Enregistrer
              </BoutonPrincipal>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[15px] text-encre">
            {titulaire.prenom} {titulaire.nom} · {titulaire.ville} ({titulaire.canton})
          </p>
        )}
        <p className="etiquette mt-4 border-t border-sable-2 pt-4">
          Compte, connexion et abonnement : à venir. Pour l’instant, vos données sont enregistrées dans ce navigateur
          uniquement.
        </p>
      </Card>

      {/* Données */}
      <Card>
        <CardTitle>Vos données</CardTitle>
        <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
          Tout ce que vous saisissez est conservé dans ce navigateur. Exportez régulièrement une copie.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <BoutonPrincipal onClick={exporter}>
            <Download className="size-4" aria-hidden />
            Exporter tous les dossiers (JSON)
          </BoutonPrincipal>
          {reinit ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <span className="text-[15px] text-encre">Effacer vos saisies et revenir aux données de démonstration ?</span>
              <button type="button" onClick={() => { actions.reinitialiser(); setReinit(false) }} className="inline-flex h-11 items-center rounded-md bg-rouille px-4 text-[15px] font-medium text-primary-foreground">
                Oui, réinitialiser
              </button>
              <BoutonSecondaire onClick={() => setReinit(false)}>Non</BoutonSecondaire>
            </span>
          ) : (
            <BoutonSecondaire onClick={() => setReinit(true)}>
              <RotateCcw className="size-4" aria-hidden />
              Réinitialiser les données de démonstration
            </BoutonSecondaire>
          )}
        </div>
      </Card>

      {editionPersonne && <FormulairePersonne personne={personne} onClose={() => setEditionPersonne(false)} />}
      {ajoutPersonne && <FormulairePersonne onClose={() => setAjoutPersonne(false)} />}
    </div>
  )
}
