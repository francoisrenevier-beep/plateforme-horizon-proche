'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Share2, Pencil, ImageIcon, X, Clock } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { formatRelatif, formatDateLongue } from '@/lib/dates'
import { Modale, Champ, Entree, Selection, BoutonPrincipal, BoutonSecondaire, BoutonSuppression, Pied } from '@/components/ui/formulaire'

const TYPES = ['Courrier', 'Décision', 'Formulaire', 'Rapport', 'Attestation', 'Certificat', 'Facture', 'Pièce d’identité', 'Autre']

export default function DocumentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { dossier, actions } = useDossier()
  const doc = dossier.documents.find((d) => d.id === id)

  const [edition, setEdition] = useState(false)
  const [nouvelleEtiquette, setNouvelleEtiquette] = useState('')
  const [ajoutEtiquette, setAjoutEtiquette] = useState(false)
  const [suppression, setSuppression] = useState(false)
  const [ajoutEcheance, setAjoutEcheance] = useState(false)

  if (!doc) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/documents" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          Tous les documents
        </Link>
        <p className="rounded-lg border border-dashed border-sable-2 p-8 text-center text-encre-2">Ce document n’existe plus dans le coffre.</p>
      </div>
    )
  }

  const echeancesLiees = dossier.echeances.filter((e) => e.documentId === doc.id)
  const demarcheLiee = dossier.demarches.find((d) => d.titre === doc.demarche)

  const ajouterEtiquette = () => {
    const t = nouvelleEtiquette.trim()
    if (t && !doc.etiquettes.includes(t)) actions.modifierDocument(doc.id, { etiquettes: [...doc.etiquettes, t] })
    setNouvelleEtiquette('')
    setAjoutEtiquette(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/documents" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Tous les documents
      </Link>

      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Image */}
        <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-sable-2 bg-sable">
          <span className="flex flex-col items-center gap-2 text-encre-2">
            <ImageIcon className="size-12" strokeWidth={1.25} aria-hidden />
            <span className="etiquette">{doc.type}</span>
          </span>
        </div>

        {/* Informations */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl text-teal-900">{doc.titre}</h1>
              <p className="mt-1 text-encre-2">{doc.emetteur}</p>
            </div>
            {!doc.classe && (
              <button
                type="button"
                onClick={() => setEdition(true)}
                className="rounded-full bg-sable px-3 py-1 text-[13px] text-encre hover:bg-sable-2"
              >
                Non classé — classer maintenant
              </button>
            )}
          </div>

          <dl className="flex flex-col divide-y divide-sable-2 rounded-lg border border-sable-2 bg-card">
            <Ligne terme="Type" valeur={doc.type} />
            <Ligne terme="Émetteur" valeur={doc.emetteur} />
            <Ligne terme="Date" valeur={doc.date} />
            <Ligne terme="Démarche liée" valeur={doc.demarche ?? 'Aucune'} lien={demarcheLiee ? `/demarches/${demarcheLiee.id}` : undefined} />
            <Ligne
              terme="Échéance liée"
              valeur={
                echeancesLiees.length > 0
                  ? echeancesLiees.map((e) => `${e.titre} — ${formatDateLongue(e.dateISO)}`).join(' · ')
                  : 'Aucune'
              }
              lien={echeancesLiees.length > 0 ? '/echeances' : undefined}
            />
            <Ligne terme="Ajouté par" valeur={doc.ajouteLe ? `${doc.ajoutePar ?? '—'} · ${formatRelatif(doc.ajouteLe)}` : (doc.ajoutePar ?? '—')} />
          </dl>

          <div>
            <p className="etiquette mb-2">Étiquettes</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {doc.etiquettes.map((e) => (
                <span key={e} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-[13px] text-teal-700">
                  {e}
                  <button
                    type="button"
                    onClick={() => actions.modifierDocument(doc.id, { etiquettes: doc.etiquettes.filter((x) => x !== e) })}
                    aria-label={`Retirer l’étiquette ${e}`}
                    className="rounded-sm hover:bg-teal-100"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </span>
              ))}
              {ajoutEtiquette ? (
                <span className="inline-flex items-center gap-1">
                  <Entree
                    value={nouvelleEtiquette}
                    onChange={(e) => setNouvelleEtiquette(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) ajouterEtiquette()
                      if (e.key === 'Escape') setAjoutEtiquette(false)
                    }}
                    aria-label="Nouvelle étiquette"
                    className="h-8 w-40 text-[13px]"
                    autoFocus
                  />
                  <button type="button" onClick={ajouterEtiquette} className="h-8 rounded-md bg-teal-900 px-2.5 text-[13px] text-primary-foreground">
                    Ajouter
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAjoutEtiquette(true)}
                  className="rounded-md border border-dashed border-sable-2 px-2.5 py-1 text-[13px] text-encre-2 hover:bg-teal-50"
                >
                  + Ajouter une étiquette
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <BoutonPrincipal title="Disponible quand les fichiers seront stockés">
              <Download className="size-4" aria-hidden />
              Télécharger
            </BoutonPrincipal>
            <BoutonSecondaire onClick={() => router.push('/partage')}>
              <Share2 className="size-4" aria-hidden />
              Partager
            </BoutonSecondaire>
            <BoutonSecondaire onClick={() => setEdition(true)}>
              <Pencil className="size-4" aria-hidden />
              Modifier
            </BoutonSecondaire>
            <BoutonSecondaire onClick={() => setAjoutEcheance(true)}>
              <Clock className="size-4" aria-hidden />
              Noter une date lue
            </BoutonSecondaire>
            <BoutonSuppression
              arme={suppression}
              onArmer={() => setSuppression(true)}
              onAnnuler={() => setSuppression(false)}
              onConfirmer={() => {
                actions.supprimerDocument(doc.id)
                router.push('/documents')
              }}
            />
          </div>
        </div>
      </div>

      {/* Encadré obligatoire */}
      <div className="rounded-lg bg-sable px-5 py-4 text-[15px] text-encre">
        Cette photo ne remplace pas l’original. Conservez le document papier.
      </div>

      {edition && (
        <ModaleEdition
          doc={doc}
          demarches={dossier.demarches.map((d) => d.titre)}
          onClose={() => setEdition(false)}
          onEnregistrer={(patch) => {
            actions.modifierDocument(doc.id, patch)
            setEdition(false)
          }}
        />
      )}
      {ajoutEcheance && <FormulaireEcheanceDocument docId={doc.id} titre={doc.titre} emetteur={doc.emetteur} demarcheId={demarcheLiee?.id} onClose={() => setAjoutEcheance(false)} />}
    </div>
  )
}

// Pré-remplit la provenance à partir du document : un délai lu sur ce courrier.
function FormulaireEcheanceDocument({
  docId,
  titre,
  emetteur,
  demarcheId,
  onClose,
}: {
  docId: string
  titre: string
  emetteur: string
  demarcheId?: string
  onClose: () => void
}) {
  const { actions } = useDossier()
  const [dateISO, setDateISO] = useState('')
  const [quoi, setQuoi] = useState(`Répondre à ${emetteur}`)
  const [erreur, setErreur] = useState<string | null>(null)
  return (
    <Modale titre="Noter une date lue sur ce document" sousTitre="Elle deviendra un délai légal" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {erreur && <p role="alert" className="rounded-md bg-rouille/10 px-3 py-2 text-[15px] text-rouille">{erreur}</p>}
        <Champ label="Quoi" htmlFor="dl-quoi" obligatoire>
          <Entree id="dl-quoi" value={quoi} onChange={(e) => setQuoi(e.target.value)} />
        </Champ>
        <Champ label="Date limite" htmlFor="dl-date" obligatoire aide="Recopiez la date telle qu’elle figure sur le document.">
          <Entree id="dl-date" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} autoFocus />
        </Champ>
        <p className="etiquette">Provenance enregistrée : « Date lue sur votre document “{titre}” de {emetteur} ».</p>
        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal
            onClick={() => {
              if (!quoi.trim()) return setErreur('Indiquez ce qu’il faut faire.')
              if (!dateISO) return setErreur('Indiquez la date limite.')
              actions.ajouterEcheance({
                nature: 'delai',
                titre: quoi.trim(),
                provenance: `Date lue sur votre document « ${titre} » de ${emetteur}`,
                dateISO,
                fait: false,
                documentId: docId,
                demarcheId,
                origine: 'document',
              })
              onClose()
            }}
          >
            Ajouter le délai légal
          </BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}

function ModaleEdition({
  doc,
  demarches,
  onClose,
  onEnregistrer,
}: {
  doc: { titre: string; emetteur: string; date: string; type: string; demarche?: string; classe: boolean }
  demarches: string[]
  onClose: () => void
  onEnregistrer: (patch: { titre: string; emetteur: string; date: string; type: string; demarche?: string; classe: boolean; annee: string }) => void
}) {
  const [titre, setTitre] = useState(doc.titre)
  const [emetteur, setEmetteur] = useState(doc.emetteur)
  const [date, setDate] = useState(doc.date)
  const [type, setType] = useState(doc.type)
  const [demarche, setDemarche] = useState(doc.demarche ?? '')
  return (
    <Modale titre="Modifier le document" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Champ label="Titre" htmlFor="m-titre" obligatoire>
          <Entree id="m-titre" value={titre} onChange={(e) => setTitre(e.target.value)} />
        </Champ>
        <Champ label="Émetteur" htmlFor="m-em">
          <Entree id="m-em" value={emetteur} onChange={(e) => setEmetteur(e.target.value)} />
        </Champ>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Type" htmlFor="m-type">
            <Selection id="m-type" value={type} onChange={(e) => setType(e.target.value)}>
              {[...new Set([type, ...TYPES])].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Selection>
          </Champ>
          <Champ label="Date sur le document" htmlFor="m-date" aide="Telle qu’elle figure (« 04.2026 », « 2024 »).">
            <Entree id="m-date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Champ>
        </div>
        <Champ label="Démarche liée" htmlFor="m-dem">
          <Selection id="m-dem" value={demarche} onChange={(e) => setDemarche(e.target.value)}>
            <option value="">Aucune</option>
            {demarches.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Selection>
        </Champ>
        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal
            disabled={!titre.trim()}
            onClick={() => {
              const anneeTrouvee = date.match(/\d{4}/)?.[0] ?? '—'
              onEnregistrer({
                titre: titre.trim(),
                emetteur: emetteur.trim() || 'Émetteur à préciser',
                date: date.trim() || '—',
                type,
                demarche: demarche || undefined,
                classe: true,
                annee: anneeTrouvee,
              })
            }}
          >
            Enregistrer
          </BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}

function Ligne({ terme, valeur, lien }: { terme: string; valeur: string; lien?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="etiquette shrink-0">{terme}</dt>
      <dd className="text-right text-[15px] text-encre">
        {lien ? (
          <Link href={lien} className="text-teal-700 hover:underline">
            {valeur}
          </Link>
        ) : (
          valeur
        )}
      </dd>
    </div>
  )
}

