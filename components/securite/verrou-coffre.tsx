'use client'

// Le verrou du coffre. Rien de l'application n'est rendu tant que le coffre n'est pas ouvert ;
// une fois verrouillé (manuellement ou après inactivité), l'état déchiffré quitte la mémoire.

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { DossierProvider, normaliser, genId, useDossier } from '@/lib/store'
import type { Etat } from '@/lib/demo-data'
import {
  changerCodeSecours,
  changerPhrase as changerPhraseEnveloppe,
  creerEnveloppe,
  nouveauCodeSecours,
  ouvrirAvecPhrase,
  type Enveloppe,
} from '@/lib/securite/crypto'
import {
  CLE_ANCIENNE_EN_CLAIR,
  construireSauvegarde,
  demanderPersistance,
  ecrireEnveloppe,
  ecrireEtatChiffre,
  effacerToutLeCoffre,
  enregistrerFichier,
  lireEnveloppe,
  lireEtatChiffre,
  lireFichier,
  lireTentatives,
  listerIdsFichiers,
  remettreTentativesAZero,
  supprimerFichier,
} from '@/lib/securite/stockage'
import { Securite, telechargerBlob, type ContexteSecurite } from '@/components/securite/contexte-securite'
import { CreationCoffre } from '@/components/securite/creation-coffre'
import { Deverrouillage } from '@/components/securite/deverrouillage'

type Phase =
  | { nom: 'chargement' }
  | { nom: 'indisponible'; message: string }
  | { nom: 'creation' }
  | { nom: 'verrouille'; enveloppe: Enveloppe }
  | { nom: 'ouvert'; enveloppe: Enveloppe; cle: CryptoKey; etat: Etat; echecs: number; parSecours: boolean }

function avecEvenement(etat: Etat, texte: string): Etat {
  const entree = { id: genId('sec'), quand: new Date().toISOString(), texte }
  return {
    ...etat,
    compte: { ...etat.compte, securite: { ...etat.compte.securite, journal: [entree, ...etat.compte.securite.journal].slice(0, 100) } },
  }
}

export function VerrouCoffre({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>({ nom: 'chargement' })

  useEffect(() => {
    let annule = false
    ;(async () => {
      try {
        if (!window.isSecureContext || !crypto?.subtle) {
          throw new Error('Le chiffrement exige une connexion sécurisée (https).')
        }
        const enveloppe = await lireEnveloppe()
        if (annule) return
        setPhase(enveloppe ? { nom: 'verrouille', enveloppe } : { nom: 'creation' })
      } catch (e) {
        if (!annule) setPhase({ nom: 'indisponible', message: e instanceof Error ? e.message : 'Stockage indisponible.' })
      }
    })()
    return () => {
      annule = true
    }
  }, [])

  // Ouverture : déchiffre l'état, consigne l'événement dans le journal de sécurité.
  const ouvrir = useCallback(async (enveloppe: Enveloppe, cle: CryptoKey, parSecours: boolean) => {
    const { echecs } = await lireTentatives()
    await remettreTentativesAZero()
    const brut = await lireEtatChiffre<unknown>(cle)
    const etat = normaliser(brut)
    if (!etat) throw new Error('Le contenu du coffre est illisible.')
    let suivi = avecEvenement(etat, parSecours ? 'Coffre ouvert avec le code de secours' : 'Coffre ouvert')
    if (echecs > 0) suivi = avecEvenement(suivi, `${echecs} essai${echecs > 1 ? 's' : ''} de phrase secrète manqué${echecs > 1 ? 's' : ''} avant cette ouverture`)
    setPhase({ nom: 'ouvert', enveloppe, cle, etat: suivi, echecs, parSecours })
  }, [])

  const creer = useCallback(async (etat: Etat, phrase: string, code: string) => {
    const { enveloppe, cle } = await creerEnveloppe(phrase, code)
    const initial = avecEvenement(etat, 'Coffre créé sur cet appareil')
    await ecrireEtatChiffre(cle, initial)
    await ecrireEnveloppe(enveloppe)
    // L'ancienne maquette stockait tout en clair : on l'efface dès que la copie chiffrée existe.
    try {
      window.localStorage.removeItem(CLE_ANCIENNE_EN_CLAIR)
    } catch {
      // ignoré
    }
    void demanderPersistance()
    setPhase({ nom: 'ouvert', enveloppe, cle, etat: initial, echecs: 0, parSecours: false })
  }, [])

  const verrouiller = useCallback(() => {
    setPhase((p) => (p.nom === 'ouvert' ? { nom: 'verrouille', enveloppe: p.enveloppe } : p))
  }, [])

  if (phase.nom === 'chargement') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-creme">
        <p className="etiquette" aria-live="polite">
          Ouverture du coffre…
        </p>
      </div>
    )
  }

  if (phase.nom === 'indisponible') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-creme px-5">
        <div className="max-w-md rounded-lg border border-sable-2 bg-card p-6">
          <h1 className="font-serif text-xl text-teal-900">Le coffre ne peut pas s’ouvrir ici</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-encre-2">{phase.message}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
            Essayez un navigateur à jour (Safari, Chrome, Firefox, Edge), hors navigation privée.
          </p>
        </div>
      </div>
    )
  }

  if (phase.nom === 'creation') {
    return <CreationCoffre onCreer={creer} onRestaure={async () => setPhase({ nom: 'verrouille', enveloppe: (await lireEnveloppe())! })} />
  }

  if (phase.nom === 'verrouille') {
    return (
      <Deverrouillage
        enveloppe={phase.enveloppe}
        onOuvert={(cle, parSecours, enveloppeMiseAJour) => ouvrir(enveloppeMiseAJour ?? phase.enveloppe, cle, parSecours)}
        onEfface={() => setPhase({ nom: 'creation' })}
      />
    )
  }

  return (
    <CoffreOuvert
      key={phase.etat.compte.securite.journal[0]?.id}
      enveloppe={phase.enveloppe}
      cle={phase.cle}
      etat={phase.etat}
      echecs={phase.echecs}
      parSecours={phase.parSecours}
      verrouiller={verrouiller}
      onEnveloppe={(enveloppe) => setPhase((p) => (p.nom === 'ouvert' ? { ...p, enveloppe } : p))}
      onEfface={() => setPhase({ nom: 'creation' })}
    >
      {children}
    </CoffreOuvert>
  )
}

function CoffreOuvert({
  enveloppe,
  cle,
  etat,
  echecs,
  parSecours,
  verrouiller,
  onEnveloppe,
  onEfface,
  children,
}: {
  enveloppe: Enveloppe
  cle: CryptoKey
  etat: Etat
  echecs: number
  parSecours: boolean
  verrouiller: () => void
  onEnveloppe: (e: Enveloppe) => void
  onEfface: () => void
  children: ReactNode
}) {
  const [derniereEcriture, setDerniereEcriture] = useState<Date | null>(null)
  const [erreurEcriture, setErreurEcriture] = useState<string | null>(null)
  const enAttente = useRef<Etat | null>(null)
  // Fichiers tout juste chiffrés, pas encore référencés par un document enregistré :
  // le nettoyage ne doit pas les supprimer entre-temps.
  const proteges = useRef(new Set<string>())
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enveloppeRef = useRef(enveloppe)
  enveloppeRef.current = enveloppe

  // Écrit l'état chiffré, puis supprime les fichiers qui ne sont plus rattachés à aucun document.
  const ecrire = useCallback(async () => {
    const e = enAttente.current
    if (!e) return
    enAttente.current = null
    try {
      await ecrireEtatChiffre(cle, e)
      const utilises = new Set(Object.values(e.dossiers).flatMap((d) => d.documents.filter((x) => x.fichier).map((x) => x.id)))
      for (const id of proteges.current) if (utilises.has(id)) proteges.current.delete(id)
      for (const id of await listerIdsFichiers()) if (!utilises.has(id) && !proteges.current.has(id)) await supprimerFichier(id)
      setDerniereEcriture(new Date())
      setErreurEcriture(null)
    } catch (err) {
      setErreurEcriture(err instanceof Error ? err.message : 'Enregistrement impossible')
    }
  }, [cle])

  const persister = useCallback(
    (e: Etat) => {
      enAttente.current = e
      if (minuteur.current) clearTimeout(minuteur.current)
      minuteur.current = setTimeout(() => void ecrire(), 300)
    },
    [ecrire],
  )

  // Avant de verrouiller ou de quitter la page, on vide l'écriture en attente.
  const verrouillerProprement = useCallback(async () => {
    if (minuteur.current) clearTimeout(minuteur.current)
    await ecrire()
    verrouiller()
  }, [ecrire, verrouiller])

  useEffect(() => {
    const avantDepart = () => {
      if (enAttente.current) void ecrire()
    }
    window.addEventListener('pagehide', avantDepart)
    return () => window.removeEventListener('pagehide', avantDepart)
  }, [ecrire])

  const securite: ContexteSecurite = {
    verrouiller: () => void verrouillerProprement(),
    enregistrerFichier: (id, fichier) => {
      proteges.current.add(id)
      return enregistrerFichier(cle, id, fichier, fichier.name)
    },
    ouvrirFichier: (id) => lireFichier(cle, id),
    changerPhrase: async (ancienne, nouvelle) => {
      const verif = await ouvrirAvecPhrase(enveloppeRef.current, ancienne)
      if (!verif) return false
      const suivante = await changerPhraseEnveloppe(enveloppeRef.current, cle, nouvelle)
      await ecrireEnveloppe(suivante)
      onEnveloppe(suivante)
      return true
    },
    regenererCodeSecours: async (phrase) => {
      const verif = await ouvrirAvecPhrase(enveloppeRef.current, phrase)
      if (!verif) return null
      const code = nouveauCodeSecours()
      const suivante = await changerCodeSecours(enveloppeRef.current, cle, code)
      await ecrireEnveloppe(suivante)
      onEnveloppe(suivante)
      return code
    },
    telechargerSauvegarde: async () => {
      if (minuteur.current) clearTimeout(minuteur.current)
      await ecrire()
      const s = await construireSauvegarde()
      telechargerBlob(new Blob([JSON.stringify(s)], { type: 'application/json' }), `horizon-proche-sauvegarde-${new Date().toISOString().slice(0, 10)}.hpcoffre`)
    },
    effacerTout: async () => {
      if (minuteur.current) clearTimeout(minuteur.current)
      enAttente.current = null
      await effacerToutLeCoffre()
      onEfface()
    },
    derniereEcriture,
    erreurEcriture,
    echecsAvantOuverture: echecs,
    ouvertParSecours: parSecours,
  }

  return (
    <Securite.Provider value={securite}>
      <DossierProvider etatInitial={etat} persister={persister}>
        <MinuterieVerrouillage verrouiller={() => void verrouillerProprement()} />
        {children}
      </DossierProvider>
    </Securite.Provider>
  )
}

// Verrouille après la durée d'inactivité choisie dans les réglages (5, 15 ou 30 minutes).
function MinuterieVerrouillage({ verrouiller }: { verrouiller: () => void }) {
  const { compte } = useDossier()
  const minutes = compte.securite.verrouillageMinutes
  const derniere = useRef(Date.now())

  useEffect(() => {
    const activite = () => (derniere.current = Date.now())
    const evenements = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    evenements.forEach((e) => window.addEventListener(e, activite, { passive: true }))
    const verifier = () => {
      if (Date.now() - derniere.current > minutes * 60_000) verrouiller()
    }
    const intervalle = setInterval(verifier, 15_000)
    const visibilite = () => {
      if (document.visibilityState === 'visible') verifier()
    }
    document.addEventListener('visibilitychange', visibilite)
    return () => {
      evenements.forEach((e) => window.removeEventListener(e, activite))
      clearInterval(intervalle)
      document.removeEventListener('visibilitychange', visibilite)
    }
  }, [minutes, verrouiller])

  return null
}
