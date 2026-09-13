'use client'

import { useState } from 'react'
import { X, Camera, ImageIcon, Check, ChevronRight, Clock } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { estISOValide, formatDateLongue, aujourdhuiISO } from '@/lib/dates'
import { Champ, Entree, Selection, MessageErreur } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

const TYPES = ['Courrier', 'Décision', 'Formulaire', 'Rapport', 'Attestation', 'Certificat', 'Facture', 'Pièce d’identité', 'Autre']

// Parcours d'ajout en trois étapes — la première suffit (mode « vidage de carton »).
// La photo elle-même n'est pas encore stockée (pas de backend) : le document est créé avec
// ses informations, et une date lue sur le courrier devient un délai légal (jamais un jalon).
export function CaptureFlow({
  onClose,
  titreInitial,
  demarcheIdInitiale,
}: {
  onClose: () => void
  titreInitial?: string
  demarcheIdInitiale?: string
}) {
  const { dossier, actions } = useDossier()
  const [etape, setEtape] = useState(1)
  const [titre, setTitre] = useState(titreInitial ?? '')
  const [type, setType] = useState('Courrier')
  const [dateDoc, setDateDoc] = useState('')
  const [emetteur, setEmetteur] = useState('')
  const [demarcheId, setDemarcheId] = useState(demarcheIdInitiale ?? '')
  const [dateLimite, setDateLimite] = useState('')
  const [sansDate, setSansDate] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [resultat, setResultat] = useState<{ classe: boolean; titre: string; echeance?: string } | null>(null)

  const passerEtape2 = () => {
    if (!titre.trim()) return setErreur('Donnez un nom à ce document, même approximatif (« Courrier AI »).')
    setErreur(null)
    setEtape(2)
  }

  const terminer = (rapide: boolean) => {
    const t = titre.trim() || 'Document sans titre'
    if (!rapide && !sansDate && dateLimite && !estISOValide(dateLimite)) return setErreur('La date limite n’est pas valide.')
    const demarche = dossier.demarches.find((d) => d.id === demarcheId)
    const classe = !rapide && (!!emetteur.trim() || !!demarche)
    const annee = dateDoc ? dateDoc.slice(0, 4) : aujourdhuiISO().slice(0, 4)
    const docId = actions.ajouterDocument({
      titre: t,
      emetteur: emetteur.trim() || 'Émetteur à préciser',
      date: dateDoc ? formatDateLongue(dateDoc) : formatDateLongue(aujourdhuiISO()),
      type,
      annee,
      etiquettes: demarche ? [demarche.titre] : [],
      demarche: demarche?.titre,
      classe,
    })

    let echeanceTitre: string | undefined
    if (!rapide && !sansDate && dateLimite) {
      echeanceTitre = `Répondre à ${emetteur.trim() || 'l’émetteur'} — ${t}`
      actions.ajouterEcheance({
        nature: 'delai',
        titre: echeanceTitre,
        provenance: `Date lue sur votre courrier ${emetteur.trim() ? `de ${emetteur.trim()} ` : ''}« ${t} »${dateDoc ? ` du ${formatDateLongue(dateDoc)}` : ''}`,
        dateISO: dateLimite,
        fait: false,
        demarcheId: demarche?.id,
        documentId: docId,
        origine: 'document',
      })
    }
    setResultat({ classe, titre: t, echeance: echeanceTitre })
    setEtape(3)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter un document"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-card sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-sable-2 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg text-teal-900">Ajouter un document</h2>
            <p className="etiquette">Étape {etape} sur 3</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="flex size-9 items-center justify-center rounded-md text-encre-2 hover:bg-sable">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {erreur && <div className="mb-4"><MessageErreur>{erreur}</MessageErreur></div>}

          {etape === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex aspect-[3/2] max-h-48 items-center justify-center rounded-lg border border-sable-2 bg-sable">
                <span className="flex flex-col items-center gap-2 text-encre-2">
                  <Camera className="size-10" strokeWidth={1.5} aria-hidden />
                  <span className="etiquette">La photo du document sera conservée ici</span>
                </span>
              </div>
              <Champ label="Quel est ce document ?" htmlFor="c-titre" obligatoire aide="Un nom approximatif suffit.">
                <Entree id="c-titre" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Courrier de l’office AI" autoFocus />
              </Champ>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ label="Type" htmlFor="c-type">
                  <Selection id="c-type" value={type} onChange={(e) => setType(e.target.value)}>
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Selection>
                </Champ>
                <Champ label="Date du document" htmlFor="c-date">
                  <Entree id="c-date" type="date" value={dateDoc} onChange={(e) => setDateDoc(e.target.value)} />
                </Champ>
              </div>
              <button
                type="button"
                onClick={passerEtape2}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-6 font-medium text-primary-foreground hover:bg-teal-700"
              >
                Continuer
                <ChevronRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!titre.trim()) return setErreur('Donnez un nom à ce document, même approximatif.')
                  terminer(true)
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-sable-2 px-6 text-[15px] text-teal-700 hover:bg-teal-50"
              >
                <Check className="size-4" aria-hidden />
                Enregistrer sans classer, je ferai le reste plus tard
              </button>
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-6">
              <p className="etiquette">Trois questions facultatives. Vous pouvez tout passer.</p>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">Ce document contient-il une date à ne pas manquer&nbsp;?</legend>
                <p className="etiquette">Recopiez la date telle qu’elle figure sur le document. Elle deviendra un délai légal.</p>
                <div className="mt-1 flex gap-2">
                  <Entree
                    type="date"
                    value={dateLimite}
                    disabled={sansDate}
                    onChange={(e) => setDateLimite(e.target.value)}
                    aria-label="Date figurant sur le document"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setSansDate((v) => !v)}
                    aria-pressed={sansDate}
                    className={cn('h-11 rounded-md border px-5 text-[15px]', sansDate ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 text-encre-2 hover:bg-sable')}
                  >
                    Non
                  </button>
                </div>
                {dateLimite && !sansDate && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-rouille">
                    <Clock className="size-3.5" aria-hidden />
                    Un délai légal sera créé : avant le {estISOValide(dateLimite) ? formatDateLongue(dateLimite) : '…'}
                  </p>
                )}
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">De qui vient ce document&nbsp;?</legend>
                <div className="flex flex-wrap gap-2">
                  {dossier.intervenants.slice(0, 4).map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setEmetteur(i.organisation)}
                      aria-pressed={emetteur === i.organisation}
                      className={cn('rounded-full border px-3 py-1.5 text-[13px]', emetteur === i.organisation ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 hover:bg-teal-50')}
                    >
                      {i.organisation}
                    </button>
                  ))}
                </div>
                <Entree value={emetteur} onChange={(e) => setEmetteur(e.target.value)} placeholder="Ou saisissez un autre émetteur" aria-label="Émetteur" className="mt-1" />
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-medium text-encre">À quelle démarche se rattache-t-il&nbsp;?</legend>
                <div className="flex flex-wrap gap-2">
                  {dossier.demarches.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDemarcheId((v) => (v === d.id ? '' : d.id))}
                      aria-pressed={demarcheId === d.id}
                      className={cn('rounded-full border px-3 py-1.5 text-[13px]', demarcheId === d.id ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 hover:bg-teal-50')}
                    >
                      {d.titre}
                    </button>
                  ))}
                  {dossier.demarches.length === 0 && <span className="etiquette">Aucune démarche ouverte pour l’instant.</span>}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() => terminer(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-6 font-medium text-primary-foreground hover:bg-teal-700"
              >
                Terminer
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}

          {etape === 3 && resultat && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                <Check className="size-7" aria-hidden />
              </span>
              <div>
                <h3 className="font-serif text-xl text-teal-900">Enregistré</h3>
                <p className="mt-1 text-encre-2">
                  « {resultat.titre} » {resultat.classe ? 'est classé dans le coffre.' : 'est dans le coffre, à classer plus tard.'}
                </p>
                {resultat.echeance && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-rouille/10 px-2 py-1 text-[13px] text-rouille">
                    <Clock className="size-3.5" aria-hidden />
                    Délai légal ajouté à vos échéances
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 flex h-11 items-center justify-center rounded-md border border-sable-2 px-6 text-[15px] hover:bg-teal-50"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DocIcon({ type }: { type: string }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-sable-2 bg-teal-50" aria-hidden>
      <ImageIcon className="size-5 text-teal-700" strokeWidth={1.5} />
      <span className="sr-only">{type}</span>
    </span>
  )
}
