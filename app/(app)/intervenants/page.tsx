'use client'

import { useState } from 'react'
import { Phone, Mail, Copy, User, Plus, Pencil, Check, X } from 'lucide-react'
import { useDossier } from '@/lib/store'
import type { Intervenant, Reference } from '@/lib/demo-data'
import { Card } from '@/components/ui/card'
import { Modale, Champ, Entree, BoutonPrincipal, BoutonSecondaire, BoutonSuppression, Pied, MessageErreur } from '@/components/ui/formulaire'

export default function IntervenantsPage() {
  const { personne, dossier, actions } = useDossier()
  const [ajout, setAjout] = useState(false)
  const [enEdition, setEnEdition] = useState<Intervenant | null>(null)
  const [copie, setCopie] = useState<string | null>(null)
  const [refEdition, setRefEdition] = useState<string | null>(null)
  const [refAjout, setRefAjout] = useState(false)

  const copier = async (r: Reference) => {
    try {
      await navigator.clipboard.writeText(r.valeur)
      setCopie(r.id)
      setTimeout(() => setCopie(null), 1500)
    } catch {
      // presse-papiers indisponible
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="etiquette">Dossier de {personne.prenom}</p>
          <h1 className="mt-1 font-serif text-[26px] text-teal-900">Contacts utiles</h1>
          <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre-2">
            Retrouvez au même endroit les personnes, services et institutions qui accompagnent votre proche. Ajoutez leurs coordonnées,
            vos numéros de référence et la dernière information utile pour ne plus chercher dans vos papiers.
          </p>
        </div>
        <BoutonPrincipal onClick={() => setAjout(true)}>
          <Plus className="size-4" aria-hidden />
          Ajouter un intervenant
        </BoutonPrincipal>
      </header>

      {/* Références utiles, épinglées en haut */}
      <section aria-labelledby="ref-titre">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="ref-titre" className="etiquette">
            Références à portée de main
          </h2>
          <button type="button" onClick={() => setRefAjout(true)} className="inline-flex items-center gap-1 text-[13px] text-teal-700 hover:underline">
            <Plus className="size-3.5" aria-hidden />
            Ajouter une référence
          </button>
        </div>
        <Card className="p-4">
          {dossier.references.length === 0 && !refAjout && (
            <p className="text-[15px] text-encre-2">Numéro AVS, numéro de dossier AI, numéro d’assuré… Ajoutez ce que vous devez souvent recopier.</p>
          )}
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {dossier.references.map((r) =>
              refEdition === r.id ? (
                <EditeurReference
                  key={r.id}
                  reference={r}
                  onAnnuler={() => setRefEdition(null)}
                  onEnregistrer={(label, valeur) => {
                    actions.modifierReference(r.id, { label, valeur })
                    setRefEdition(null)
                  }}
                  onSupprimer={() => {
                    actions.supprimerReference(r.id)
                    setRefEdition(null)
                  }}
                />
              ) : (
                <div key={r.id} className="min-w-[9rem]">
                  <dt className="etiquette">{r.label}</dt>
                  <dd className="mt-0.5 flex items-center gap-2 font-mono text-sm text-encre">
                    {r.valeur}
                    <button type="button" onClick={() => copier(r)} aria-label={`Copier ${r.label}`} className="text-encre-2 hover:text-teal-700">
                      {copie === r.id ? <Check className="size-3.5 text-teal-700" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                    </button>
                    <button type="button" onClick={() => setRefEdition(r.id)} aria-label={`Modifier ${r.label}`} className="text-encre-2 hover:text-teal-700">
                      <Pencil className="size-3.5" aria-hidden />
                    </button>
                  </dd>
                </div>
              ),
            )}
            {refAjout && (
              <EditeurReference
                onAnnuler={() => setRefAjout(false)}
                onEnregistrer={(label, valeur) => {
                  actions.ajouterReference({ label, valeur })
                  setRefAjout(false)
                }}
              />
            )}
          </dl>
        </Card>
      </section>

      <ul className="flex flex-col gap-3">
        {dossier.intervenants.length === 0 && (
          <li className="rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Aucun intervenant. Ajoutez le gestionnaire AI, l’école, le médecin, l’autorité…
          </li>
        )}
        {dossier.intervenants.map((i) => (
          <li key={i.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg text-teal-900">{i.organisation}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-encre">
                    <User className="size-3.5 text-encre-2" aria-hidden />
                    {i.contact}
                    {i.fonction && ` · ${i.fonction}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {i.reference && <span className="rounded-full bg-teal-100 px-3 py-1 font-mono text-xs text-teal-900">{i.reference}</span>}
                  <button type="button" onClick={() => setEnEdition(i)} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
                    <Pencil className="size-3.5" aria-hidden />
                    Modifier
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {i.telephone && (
                  <a href={`tel:${i.telephone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-lg border border-sable-2 bg-creme px-3 py-2 text-sm text-encre transition-colors hover:bg-teal-50">
                    <Phone className="size-4 text-teal-700" aria-hidden />
                    {i.telephone}
                  </a>
                )}
                {i.courriel && (
                  <a href={`mailto:${i.courriel}`} className="inline-flex items-center gap-2 rounded-lg border border-sable-2 bg-creme px-3 py-2 text-sm text-encre transition-colors hover:bg-teal-50">
                    <Mail className="size-4 text-teal-700" aria-hidden />
                    {i.courriel}
                  </a>
                )}
              </div>

              {i.dernierContact && <p className="etiquette mt-3">Dernier contact noté : {i.dernierContact}</p>}
            </Card>
          </li>
        ))}
      </ul>

      {(ajout || enEdition) && (
        <FormulaireIntervenant
          intervenant={enEdition ?? undefined}
          onClose={() => {
            setAjout(false)
            setEnEdition(null)
          }}
        />
      )}
    </div>
  )
}

function EditeurReference({
  reference,
  onAnnuler,
  onEnregistrer,
  onSupprimer,
}: {
  reference?: Reference
  onAnnuler: () => void
  onEnregistrer: (label: string, valeur: string) => void
  onSupprimer?: () => void
}) {
  const [label, setLabel] = useState(reference?.label ?? '')
  const [valeur, setValeur] = useState(reference?.valeur ?? '')
  return (
    <div className="flex w-full flex-wrap items-end gap-2 rounded-md border border-sable-2 p-3">
      <Champ label="Libellé" htmlFor={`ref-l-${reference?.id ?? 'new'}`}>
        <Entree id={`ref-l-${reference?.id ?? 'new'}`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="N° AVS" className="h-10 w-40" autoFocus />
      </Champ>
      <Champ label="Valeur" htmlFor={`ref-v-${reference?.id ?? 'new'}`}>
        <Entree id={`ref-v-${reference?.id ?? 'new'}`} value={valeur} onChange={(e) => setValeur(e.target.value)} className="h-10 w-48 font-mono text-sm" />
      </Champ>
      <button type="button" onClick={() => label.trim() && valeur.trim() && onEnregistrer(label.trim(), valeur.trim())} className="inline-flex h-10 items-center gap-1 rounded-md bg-teal-900 px-3 text-[13px] text-primary-foreground hover:bg-teal-700">
        <Check className="size-3.5" aria-hidden />
        Enregistrer
      </button>
      <button type="button" onClick={onAnnuler} aria-label="Annuler" className="inline-flex h-10 items-center rounded-md border border-sable-2 px-3 text-[13px] text-encre hover:bg-sable">
        <X className="size-3.5" aria-hidden />
      </button>
      {onSupprimer && (
        <button type="button" onClick={onSupprimer} className="inline-flex h-10 items-center rounded-md px-2 text-[13px] text-rouille hover:bg-rouille/10">
          Supprimer
        </button>
      )}
    </div>
  )
}

function FormulaireIntervenant({ intervenant, onClose }: { intervenant?: Intervenant; onClose: () => void }) {
  const { actions } = useDossier()
  const [organisation, setOrganisation] = useState(intervenant?.organisation ?? '')
  const [contact, setContact] = useState(intervenant?.contact ?? '')
  const [fonction, setFonction] = useState(intervenant?.fonction ?? '')
  const [telephone, setTelephone] = useState(intervenant?.telephone ?? '')
  const [courriel, setCourriel] = useState(intervenant?.courriel ?? '')
  const [reference, setReference] = useState(intervenant?.reference ?? '')
  const [dernierContact, setDernierContact] = useState(intervenant?.dernierContact ?? '')
  const [erreur, setErreur] = useState<string | null>(null)
  const [suppression, setSuppression] = useState(false)

  const enregistrer = () => {
    if (!organisation.trim() && !contact.trim()) return setErreur('Indiquez au moins une organisation ou un nom.')
    const donnees = {
      organisation: organisation.trim() || contact.trim(),
      contact: contact.trim() || '—',
      fonction: fonction.trim(),
      telephone: telephone.trim(),
      courriel: courriel.trim(),
      reference: reference.trim() || undefined,
      dernierContact: dernierContact.trim() || undefined,
    }
    if (intervenant) actions.modifierIntervenant(intervenant.id, donnees)
    else actions.ajouterIntervenant(donnees)
    onClose()
  }

  return (
    <Modale titre={intervenant ? 'Modifier l’intervenant' : 'Ajouter un intervenant'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
        <Champ label="Organisation" htmlFor="i-org" aide="Office AI Vaud, école, cabinet médical, justice de paix…">
          <Entree id="i-org" value={organisation} onChange={(e) => setOrganisation(e.target.value)} autoFocus />
        </Champ>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Personne de contact" htmlFor="i-contact">
            <Entree id="i-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </Champ>
          <Champ label="Fonction" htmlFor="i-fn">
            <Entree id="i-fn" value={fonction} onChange={(e) => setFonction(e.target.value)} />
          </Champ>
          <Champ label="Téléphone" htmlFor="i-tel">
            <Entree id="i-tel" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          </Champ>
          <Champ label="Courriel" htmlFor="i-mail">
            <Entree id="i-mail" type="email" value={courriel} onChange={(e) => setCourriel(e.target.value)} />
          </Champ>
          <Champ label="Référence de dossier" htmlFor="i-ref" aide="Le numéro à rappeler dans vos courriers.">
            <Entree id="i-ref" value={reference} onChange={(e) => setReference(e.target.value)} className="font-mono text-sm" />
          </Champ>
          <Champ label="Dernier contact" htmlFor="i-dc">
            <Entree id="i-dc" value={dernierContact} onChange={(e) => setDernierContact(e.target.value)} placeholder="12 juin 2026" />
          </Champ>
        </div>
        <Pied>
          {intervenant && (
            <BoutonSuppression
              className="mr-auto"
              arme={suppression}
              onArmer={() => setSuppression(true)}
              onAnnuler={() => setSuppression(false)}
              onConfirmer={() => {
                actions.supprimerIntervenant(intervenant.id)
                onClose()
              }}
            />
          )}
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal onClick={enregistrer}>{intervenant ? 'Enregistrer' : 'Ajouter'}</BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}
