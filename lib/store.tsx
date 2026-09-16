'use client'

// Couche de données locale.
//
// Il n'y a pas encore de backend (CLAUDE.md §8 : l'authentification et les politiques RLS
// doivent être en place avant tout branchement sur des données réelles). En attendant, l'état
// complet vit ici : amorcé par les données de démonstration, modifiable par la famille,
// persisté dans le navigateur (localStorage). Les écrans ne parlent qu'à cette interface ;
// quand Supabase arrivera, c'est ce fichier qui change, pas les écrans.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  creerEtatInitial,
  dossierVide,
  enrichirPersonne,
  portraitVide,
  type Acces,
  type Activite,
  type Demarche,
  type Document,
  type DossierData,
  type Echeance,
  type Etat,
  type Intervenant,
  type Personne,
  type PersonneBase,
  type PieceRdv,
  type QuestionRdv,
  type Reference,
  type RendezVous,
  type StatutEtape,
  type Titulaire,
  type PointChronologie,
} from '@/lib/demo-data'
import { parcours as catalogueParcours } from '@/lib/parcours'
import { aujourdhuiISO, formatDateLongue, formatDateMoyenne, formatDateCourte, formatMoisAnnee, maintenantISO } from '@/lib/dates'
import { dateMajorite, jalonsDesParcours } from '@/lib/selecteurs'

export {
  dateMajorite,
  dateEntreeEcole,
  dateRepere,
  libelleRepere,
  jalonsDesParcours,
  jalonsDuParcours,
  prochainJalonParcours,
  avancementParcours,
  parcoursSuivis,
  pertinenceParcours,
  documentPourPiece,
  piecesDuParcours,
  contactsDuParcours,
  avancementDemarche,
  contexteCourt,
  libelleDate,
  nomTitulaire,
} from '@/lib/selecteurs'

const CLE_STOCKAGE = 'horizon-proche:etat:v1'
// Plafond de dossiers par abonnement (CLAUDE.md §9.1). Les dossiers archivés n'y comptent pas (§9.7).
export const LIMITE_DOSSIERS = 3

export function genId(prefixe: string): string {
  return `${prefixe}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// Rend un état chargé conforme à la forme attendue (champs ajoutés depuis la sauvegarde).
function normaliser(brut: unknown): Etat | null {
  if (!brut || typeof brut !== 'object') return null
  const e = brut as Partial<Etat>
  if (e.version !== 1 || !Array.isArray(e.personnes) || !e.dossiers || !e.titulaire) return null
  const dossiers: Record<string, DossierData> = {}
  for (const p of e.personnes) {
    const d = (e.dossiers as Record<string, Partial<DossierData>>)[p.id] ?? {}
    const vide = dossierVide(e.titulaire)
    dossiers[p.id] = {
      echeances: d.echeances ?? vide.echeances,
      documents: d.documents ?? vide.documents,
      intervenants: d.intervenants ?? vide.intervenants,
      references: d.references ?? vide.references,
      rendezVous: d.rendezVous ?? vide.rendezVous,
      portrait: d.portrait && d.portrait.length === 7 ? d.portrait : vide.portrait,
      acces: d.acces ?? vide.acces,
      demarches: d.demarches ?? vide.demarches,
      parcours: d.parcours ?? vide.parcours,
      journal: d.journal ?? vide.journal,
    }
  }
  const actif = e.personnes.some((p) => p.id === e.personneActiveId) ? e.personneActiveId! : e.personnes[0]?.id
  if (!actif) return null
  return { version: 1, titulaire: e.titulaire, personneActiveId: actif, personnes: e.personnes, dossiers }
}

type Modif<T> = Partial<Omit<T, 'id'>>

export type ActionsDossier = {
  // Personnes / dossiers
  setPersonneId: (id: string) => void
  ajouterPersonne: (p: Omit<PersonneBase, 'id'>) => { ok: true; id: string } | { ok: false; raison: string }
  modifierPersonne: (id: string, patch: Modif<PersonneBase>) => void
  archiverPersonne: (id: string, archive: boolean) => void
  modifierTitulaire: (patch: Partial<Titulaire>) => void
  // Échéances
  ajouterEcheance: (e: Omit<Echeance, 'id'>) => string
  modifierEcheance: (id: string, patch: Modif<Echeance>) => void
  supprimerEcheance: (id: string) => void
  basculerEcheanceFaite: (id: string) => void
  // Documents
  ajouterDocument: (d: Omit<Document, 'id' | 'ajouteLe' | 'ajoutePar'>) => string
  modifierDocument: (id: string, patch: Modif<Document>) => void
  supprimerDocument: (id: string) => void
  // Intervenants et références
  ajouterIntervenant: (i: Omit<Intervenant, 'id'>) => string
  modifierIntervenant: (id: string, patch: Modif<Intervenant>) => void
  supprimerIntervenant: (id: string) => void
  ajouterReference: (r: Omit<Reference, 'id'>) => void
  modifierReference: (id: string, patch: Modif<Reference>) => void
  supprimerReference: (id: string) => void
  // Rendez-vous
  ajouterRendezVous: (r: Pick<RendezVous, 'intervenant' | 'fonction' | 'dateISO' | 'heure' | 'lieu'>) => string
  modifierRendezVous: (id: string, patch: Modif<RendezVous>) => void
  supprimerRendezVous: (id: string) => void
  ajouterQuestionRdv: (rdvId: string, texte: string) => void
  basculerQuestionRdv: (rdvId: string, questionId: string) => void
  supprimerQuestionRdv: (rdvId: string, questionId: string) => void
  ajouterPieceRdv: (rdvId: string, texte: string, lie: boolean) => void
  basculerPieceRdv: (rdvId: string, pieceId: string) => void
  supprimerPieceRdv: (rdvId: string, pieceId: string) => void
  ajouterDecisionRdv: (rdvId: string, texte: string) => void
  supprimerDecisionRdv: (rdvId: string, index: number) => void
  // Portrait
  modifierSectionPortrait: (sectionId: string, texte: string | null) => void
  // Accès
  ajouterAcces: (a: Omit<Acces, 'id'>) => void
  modifierAcces: (id: string, patch: Modif<Acces>) => void
  retirerAcces: (id: string) => void
  // Démarches
  ajouterDemarche: (d: Omit<Demarche, 'id' | 'piecesCochees'> & { id?: string }) => string
  modifierDemarche: (id: string, patch: Modif<Demarche>) => void
  supprimerDemarche: (id: string) => void
  basculerPieceDemarche: (demarcheId: string, pieceId: string) => void
  // Parcours
  activerParcours: (parcoursId: string, actif: boolean) => void
  setStatutEtape: (parcoursId: string, etapeId: string, statut: StatutEtape) => void
  setNoteEtape: (parcoursId: string, etapeId: string, note: string) => void
  // Divers
  journaliser: (texte: string) => void
  reinitialiser: () => void
  exporterJSON: () => string
}

type ContexteValeur = {
  etat: Etat
  pret: boolean
  personne: Personne
  personnes: Personne[]
  personnesArchivees: Personne[]
  dossier: DossierData
  titulaire: Titulaire
  limiteAtteinte: boolean
  actions: ActionsDossier
}

const Contexte = createContext<ContexteValeur | null>(null)

export function DossierProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<Etat>(() => creerEtatInitial())
  const [pret, setPret] = useState(false)
  const chargeRef = useRef(false)

  // Chargement depuis le navigateur, une fois monté (évite tout écart serveur/client).
  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE_STOCKAGE)
      if (brut) {
        const charge = normaliser(JSON.parse(brut))
        if (charge) setEtat(charge)
      }
    } catch {
      // stockage indisponible : on reste sur les données d'amorce
    }
    chargeRef.current = true
    setPret(true)
  }, [])

  useEffect(() => {
    if (!chargeRef.current) return
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat))
    } catch {
      // quota ou stockage indisponible : l'état reste en mémoire
    }
  }, [etat])

  const actions = useMemo<ActionsDossier>(() => {
    // Modifie le dossier actif (ou celui indiqué) et journalise éventuellement.
    const majDossier = (
      fn: (d: DossierData, etat: Etat) => DossierData,
      journal?: string | ((etat: Etat) => string),
      dossierId?: string,
    ) =>
      setEtat((prev) => {
        const id = dossierId ?? prev.personneActiveId
        const courant = prev.dossiers[id]
        if (!courant) return prev
        let suivant = fn(courant, prev)
        if (journal) {
          const texte = typeof journal === 'function' ? journal(prev) : journal
          const entree: Activite = {
            id: genId('act'),
            texte,
            auteur: `${prev.titulaire.prenom} ${prev.titulaire.nom}`,
            quand: maintenantISO(),
          }
          suivant = { ...suivant, journal: [entree, ...suivant.journal].slice(0, 50) }
        }
        return { ...prev, dossiers: { ...prev.dossiers, [id]: suivant } }
      })

    const majRdv = (rdvId: string, fn: (r: RendezVous) => RendezVous, journal?: string) =>
      majDossier((d) => ({ ...d, rendezVous: d.rendezVous.map((r) => (r.id === rdvId ? fn(r) : r)) }), journal)

    return {
      setPersonneId: (id) => setEtat((prev) => (prev.dossiers[id] ? { ...prev, personneActiveId: id } : prev)),

      ajouterPersonne: (p) => {
        let resultat: ReturnType<ActionsDossier['ajouterPersonne']> = { ok: false, raison: 'Erreur inconnue' }
        setEtat((prev) => {
          const actifs = prev.personnes.filter((x) => !x.archive).length
          if (actifs >= LIMITE_DOSSIERS) {
            resultat = {
              ok: false,
              raison: `Un abonnement permet de suivre ${LIMITE_DOSSIERS} dossiers au plus. Archivez un dossier pour en ouvrir un nouveau.`,
            }
            return prev
          }
          const id = genId('p')
          const dossier = dossierVide(prev.titulaire)
          dossier.journal = [
            {
              id: genId('act'),
              texte: `Dossier de ${p.prenom} créé`,
              auteur: `${prev.titulaire.prenom} ${prev.titulaire.nom}`,
              quand: maintenantISO(),
            },
          ]
          resultat = { ok: true, id }
          return {
            ...prev,
            personneActiveId: id,
            personnes: [...prev.personnes, { ...p, id }],
            dossiers: { ...prev.dossiers, [id]: dossier },
          }
        })
        return resultat
      },

      modifierPersonne: (id, patch) =>
        setEtat((prev) => ({
          ...prev,
          personnes: prev.personnes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      archiverPersonne: (id, archive) =>
        setEtat((prev) => {
          const personnes = prev.personnes.map((p) => (p.id === id ? { ...p, archive } : p))
          let actif = prev.personneActiveId
          if (archive && actif === id) {
            actif = personnes.find((p) => !p.archive)?.id ?? id
          }
          return { ...prev, personnes, personneActiveId: actif }
        }),

      modifierTitulaire: (patch) => setEtat((prev) => ({ ...prev, titulaire: { ...prev.titulaire, ...patch } })),

      ajouterEcheance: (e) => {
        const id = genId('ech')
        majDossier(
          (d) => ({ ...d, echeances: [...d.echeances, { ...e, id }] }),
          `${e.nature === 'delai' ? 'Délai légal' : 'Moment conseillé'} ajouté : ${e.titre}`,
        )
        return id
      },
      modifierEcheance: (id, patch) =>
        majDossier((d) => ({ ...d, echeances: d.echeances.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      supprimerEcheance: (id) =>
        majDossier((d) => ({ ...d, echeances: d.echeances.filter((e) => e.id !== id) })),
      basculerEcheanceFaite: (id) => {
        // Les jalons issus d'un parcours sont calculés : on bascule le statut de l'étape.
        if (id.startsWith('parcours:')) {
          const [, parcoursId, etapeId] = id.split(':')
          majDossier((d) => {
            const suivi = d.parcours[parcoursId]
            if (!suivi) return d
            const courant = suivi.etapes[etapeId]?.statut ?? 'a-faire'
            const statut: StatutEtape = courant === 'fait' ? 'a-faire' : 'fait'
            return {
              ...d,
              parcours: {
                ...d.parcours,
                [parcoursId]: {
                  ...suivi,
                  etapes: { ...suivi.etapes, [etapeId]: { ...suivi.etapes[etapeId], statut, faitLe: statut === 'fait' ? aujourdhuiISO() : undefined } },
                },
              },
            }
          })
          return
        }
        majDossier((d) => ({ ...d, echeances: d.echeances.map((e) => (e.id === id ? { ...e, fait: !e.fait } : e)) }))
      },

      ajouterDocument: (doc) => {
        const id = genId('doc')
        majDossier(
          (d, e) => ({
            ...d,
            documents: [
              { ...doc, id, ajouteLe: maintenantISO(), ajoutePar: `${e.titulaire.prenom} ${e.titulaire.nom}` },
              ...d.documents,
            ],
          }),
          `${doc.titre} ajouté au coffre`,
        )
        return id
      },
      modifierDocument: (id, patch) =>
        majDossier((d) => ({ ...d, documents: d.documents.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      supprimerDocument: (id) =>
        majDossier(
          (d) => ({
            ...d,
            documents: d.documents.filter((x) => x.id !== id),
            echeances: d.echeances.map((e) => (e.documentId === id ? { ...e, documentId: undefined } : e)),
          }),
          (e) => {
            const doc = e.dossiers[e.personneActiveId]?.documents.find((x) => x.id === id)
            return `${doc?.titre ?? 'Document'} retiré du coffre`
          },
        ),

      ajouterIntervenant: (i) => {
        const id = genId('int')
        majDossier((d) => ({ ...d, intervenants: [...d.intervenants, { ...i, id }] }), `${i.organisation} ajouté aux intervenants`)
        return id
      },
      modifierIntervenant: (id, patch) =>
        majDossier((d) => ({ ...d, intervenants: d.intervenants.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      supprimerIntervenant: (id) =>
        majDossier((d) => ({ ...d, intervenants: d.intervenants.filter((x) => x.id !== id) })),
      ajouterReference: (r) => majDossier((d) => ({ ...d, references: [...d.references, { ...r, id: genId('ref') }] })),
      modifierReference: (id, patch) =>
        majDossier((d) => ({ ...d, references: d.references.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      supprimerReference: (id) => majDossier((d) => ({ ...d, references: d.references.filter((x) => x.id !== id) })),

      ajouterRendezVous: (r) => {
        const id = genId('rdv')
        majDossier(
          (d) => ({
            ...d,
            rendezVous: [
              ...d.rendezVous,
              { ...r, id, questions: [], pieces: [], changements: '', notes: { dit: '', decide: '', prescrit: '', prochaine: '' }, decisions: [] },
            ],
          }),
          `Rendez-vous ajouté : ${r.intervenant}, ${formatDateLongue(r.dateISO)}`,
        )
        return id
      },
      modifierRendezVous: (id, patch) => majRdv(id, (r) => ({ ...r, ...patch })),
      supprimerRendezVous: (id) => majDossier((d) => ({ ...d, rendezVous: d.rendezVous.filter((r) => r.id !== id) })),
      ajouterQuestionRdv: (rdvId, texte) =>
        majRdv(
          rdvId,
          (r) => ({ ...r, questions: [...r.questions, { id: genId('q'), texte, ajouteeLe: aujourdhuiISO(), faite: false }] }),
          'Question notée pour un rendez-vous',
        ),
      basculerQuestionRdv: (rdvId, qId) =>
        majRdv(rdvId, (r) => ({ ...r, questions: r.questions.map((q) => (q.id === qId ? { ...q, faite: !q.faite } : q)) })),
      supprimerQuestionRdv: (rdvId, qId) =>
        majRdv(rdvId, (r) => ({ ...r, questions: r.questions.filter((q) => q.id !== qId) })),
      ajouterPieceRdv: (rdvId, texte, lie) =>
        majRdv(rdvId, (r) => ({ ...r, pieces: [...r.pieces, { id: genId('pc'), texte, lie }] })),
      basculerPieceRdv: (rdvId, pId) =>
        majRdv(rdvId, (r) => ({ ...r, pieces: r.pieces.map((p: PieceRdv) => (p.id === pId ? { ...p, lie: !p.lie } : p)) })),
      supprimerPieceRdv: (rdvId, pId) => majRdv(rdvId, (r) => ({ ...r, pieces: r.pieces.filter((p) => p.id !== pId) })),
      ajouterDecisionRdv: (rdvId, texte) => majRdv(rdvId, (r) => ({ ...r, decisions: [...r.decisions, texte] })),
      supprimerDecisionRdv: (rdvId, index) =>
        majRdv(rdvId, (r) => ({ ...r, decisions: r.decisions.filter((_, i) => i !== index) })),

      modifierSectionPortrait: (sectionId, texte) =>
        majDossier(
          (d) => ({ ...d, portrait: d.portrait.map((s) => (s.id === sectionId ? { ...s, texte } : s)) }),
          (e) => {
            const s = e.dossiers[e.personneActiveId]?.portrait.find((x) => x.id === sectionId)
            return `Portrait : section « ${s?.intitule ?? ''} » mise à jour`
          },
        ),

      ajouterAcces: (a) =>
        majDossier((d) => ({ ...d, acces: [...d.acces, { ...a, id: genId('acc') }] }), `Accès accordé à ${a.nom} (${a.peutVoir})`),
      modifierAcces: (id, patch) =>
        majDossier((d) => ({ ...d, acces: d.acces.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      retirerAcces: (id) =>
        majDossier(
          (d) => ({ ...d, acces: d.acces.filter((x) => x.id !== id) }),
          (e) => `Accès retiré à ${e.dossiers[e.personneActiveId]?.acces.find((x) => x.id === id)?.nom ?? ''}`,
        ),

      ajouterDemarche: (dem) => {
        const id = dem.id ?? genId('dem')
        majDossier(
          (d) => (d.demarches.some((x) => x.id === id) ? d : { ...d, demarches: [...d.demarches, { ...dem, id, piecesCochees: [] }] }),
          `Démarche ouverte : ${dem.titre}`,
        )
        return id
      },
      modifierDemarche: (id, patch) =>
        majDossier((d) => ({ ...d, demarches: d.demarches.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      supprimerDemarche: (id) =>
        majDossier(
          (d) => ({ ...d, demarches: d.demarches.filter((x) => x.id !== id) }),
          (e) => `Démarche close : ${e.dossiers[e.personneActiveId]?.demarches.find((x) => x.id === id)?.titre ?? ''}`,
        ),
      basculerPieceDemarche: (demarcheId, pieceId) =>
        majDossier((d) => ({
          ...d,
          demarches: d.demarches.map((x) =>
            x.id === demarcheId
              ? {
                  ...x,
                  piecesCochees: x.piecesCochees.includes(pieceId)
                    ? x.piecesCochees.filter((p) => p !== pieceId)
                    : [...x.piecesCochees, pieceId],
                }
              : x,
          ),
        })),

      activerParcours: (parcoursId, actif) =>
        majDossier(
          (d) => ({
            ...d,
            parcours: {
              ...d.parcours,
              [parcoursId]: {
                active: actif,
                activeLe: actif ? (d.parcours[parcoursId]?.activeLe ?? aujourdhuiISO()) : d.parcours[parcoursId]?.activeLe,
                etapes: d.parcours[parcoursId]?.etapes ?? {},
              },
            },
          }),
          actif
            ? `Parcours suivi : ${catalogueParcours[parcoursId]?.titre ?? parcoursId}`
            : `Parcours mis en pause : ${catalogueParcours[parcoursId]?.titre ?? parcoursId}`,
        ),
      setStatutEtape: (parcoursId, etapeId, statut) =>
        majDossier((d) => {
          const suivi = d.parcours[parcoursId] ?? { active: true, activeLe: aujourdhuiISO(), etapes: {} }
          return {
            ...d,
            parcours: {
              ...d.parcours,
              [parcoursId]: {
                ...suivi,
                etapes: {
                  ...suivi.etapes,
                  [etapeId]: { ...suivi.etapes[etapeId], statut, faitLe: statut === 'fait' ? aujourdhuiISO() : undefined },
                },
              },
            },
          }
        }),
      setNoteEtape: (parcoursId, etapeId, note) =>
        majDossier((d) => {
          const suivi = d.parcours[parcoursId] ?? { active: true, activeLe: aujourdhuiISO(), etapes: {} }
          return {
            ...d,
            parcours: {
              ...d.parcours,
              [parcoursId]: {
                ...suivi,
                etapes: { ...suivi.etapes, [etapeId]: { ...suivi.etapes[etapeId], statut: suivi.etapes[etapeId]?.statut ?? 'a-faire', note } },
              },
            },
          }
        }),

      journaliser: (texte) => majDossier((d) => d, texte),
      reinitialiser: () => {
        try {
          window.localStorage.removeItem(CLE_STOCKAGE)
        } catch {
          // ignoré
        }
        setEtat(creerEtatInitial())
      },
      exporterJSON: () => {
        let sortie = ''
        setEtat((prev) => {
          sortie = JSON.stringify(prev, null, 2)
          return prev
        })
        return sortie
      },
    }
  }, [])

  const valeur = useMemo<ContexteValeur>(() => {
    const toutes = etat.personnes.map(enrichirPersonne)
    const personnes = toutes.filter((p) => !p.archive)
    const personnesArchivees = toutes.filter((p) => p.archive)
    const personne = toutes.find((p) => p.id === etat.personneActiveId) ?? toutes[0]
    return {
      etat,
      pret,
      personne,
      personnes,
      personnesArchivees,
      dossier: etat.dossiers[personne.id],
      titulaire: etat.titulaire,
      limiteAtteinte: personnes.length >= LIMITE_DOSSIERS,
      actions,
    }
  }, [etat, pret, actions])

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
}

export function useDossier(): ContexteValeur {
  const ctx = useContext(Contexte)
  if (!ctx) throw new Error('useDossier doit être utilisé dans un DossierProvider')
  return ctx
}

// Compatibilité avec l'API historique (`usePersonne`).
export function usePersonne() {
  const { personne, personnes, actions } = useDossier()
  return { personne, personnes, setPersonneId: actions.setPersonneId }
}

// ---------------------------------------------------------------------------
// Sélecteurs
// ---------------------------------------------------------------------------

// Toutes les échéances du dossier actif : saisies + calculées, triées par date.
export function useEcheances(): Echeance[] {
  const { dossier, personne } = useDossier()
  return useMemo(
    () => [...dossier.echeances, ...jalonsDesParcours(dossier, personne)].sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
    [dossier, personne],
  )
}

// Chronologie signature : aujourd'hui → futur, mêlant délais, jalons et repères de vie.
export function useChronologie(): PointChronologie[] {
  const { personne } = useDossier()
  const echeances = useEcheances()
  return useMemo(() => {
    const auj = aujourdhuiISO()
    const points: (PointChronologie & { iso: string; ordre: number })[] = []
    points.push({ id: 'auj', iso: auj, ordre: 0, date: 'Aujourd’hui', dateCourte: formatDateCourte(auj), evenement: 'Vous êtes ici', nature: 'repere' })

    for (const e of echeances) {
      if (e.fait) continue
      if (e.nature === 'jalon' && e.dateISO < auj) continue
      points.push({
        id: e.id,
        iso: e.dateISO,
        ordre: 1,
        date: e.nature === 'delai' ? formatDateMoyenne(e.dateISO) : formatMoisAnnee(e.dateISO),
        dateCourte: formatDateCourte(e.dateISO),
        evenement: `${e.nature === 'delai' ? 'Délai' : 'Moment conseillé'} — ${e.titre.charAt(0).toLowerCase()}${e.titre.slice(1)}`,
        nature: e.nature,
      })
    }

    const majorite = dateMajorite(personne.naissanceISO)
    if (majorite >= auj) {
      points.push({
        id: 'majorite',
        iso: majorite,
        ordre: 2,
        date: formatDateMoyenne(majorite),
        dateCourte: formatDateCourte(majorite),
        evenement: `${personne.prenom} a 18 ans`,
        nature: 'repere',
      })
    }

    points.sort((a, b) => a.iso.localeCompare(b.iso) || a.ordre - b.ordre)
    return points.map(({ iso: _iso, ordre: _ordre, ...p }) => p)
  }, [echeances, personne])
}

export type { QuestionRdv }
