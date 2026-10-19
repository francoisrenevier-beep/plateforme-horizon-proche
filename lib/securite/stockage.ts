// Stockage local du coffre (IndexedDB).
//
// Ce qui est écrit sur l'appareil :
//   meta/enveloppe   — la clé de coffre, enveloppée (illisible sans phrase secrète ou code de secours)
//   meta/etat        — l'état complet des dossiers, chiffré
//   meta/tentatives  — le nombre d'essais de phrase secrète manqués (aucune donnée personnelle)
//   fichiers/<id>    — chaque fichier, chiffré avec sa propre clé, elle-même enveloppée
//
// Rien d'autre. En particulier aucun nom, aucune date, aucun titre de document en clair.
// Quand le serveur Infomaniak arrivera, ce module deviendra un adaptateur de synchronisation
// qui pousse et récupère exactement ces mêmes blocs chiffrés.

import {
  aleatoire,
  chiffrerObjet,
  dechiffrerObjet,
  desenvelopperCle,
  envelopperCle,
  nouvelleCle,
  type Bloc,
  type Enveloppe,
} from '@/lib/securite/crypto'

const NOM_BASE = 'horizon-proche-coffre'
const VERSION_BASE = 1
const META = 'meta'
const FICHIERS = 'fichiers'

// Ancienne clé de la maquette, en clair. Migrée puis effacée à la création du coffre.
export const CLE_ANCIENNE_EN_CLAIR = 'horizon-proche:etat:v1'

export const TAILLE_MAX_FICHIER = 15 * 1024 * 1024

export type Tentatives = { echecs: number; dernierEchec?: string }

type FichierStocke = {
  cle: Bloc // clé du fichier, enveloppée par la clé de coffre
  iv: Uint8Array<ArrayBuffer>
  contenu: ArrayBuffer // chiffré
  meta: Bloc // nom, type, taille : chiffrés aussi
}

export type MetaFichier = { nom: string; type: string; taille: number }

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('Stockage local indisponible dans ce navigateur.'))
    const req = indexedDB.open(NOM_BASE, VERSION_BASE)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META)
      if (!db.objectStoreNames.contains(FICHIERS)) db.createObjectStore(FICHIERS)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('Ouverture du stockage impossible'))
  })
}

async function transaction<T>(magasin: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await ouvrir()
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(magasin, mode)
      const req = fn(tx.objectStore(magasin))
      let valeur: T | undefined
      if (req) req.onsuccess = () => (valeur = req.result)
      tx.oncomplete = () => resolve(valeur)
      tx.onerror = () => reject(tx.error ?? new Error('Erreur de stockage'))
      tx.onabort = () => reject(tx.error ?? new Error('Écriture interrompue (espace disque ?)'))
    })
  } finally {
    db.close()
  }
}

const lire = <T>(magasin: string, cle: string) => transaction<T>(magasin, 'readonly', (s) => s.get(cle) as IDBRequest<T>)
const ecrire = (magasin: string, cle: string, valeur: unknown) => transaction(magasin, 'readwrite', (s) => s.put(valeur, cle))
const effacer = (magasin: string, cle: string) => transaction(magasin, 'readwrite', (s) => s.delete(cle))

// --- Coffre ---------------------------------------------------------------

export async function lireEnveloppe(): Promise<Enveloppe | null> {
  return (await lire<Enveloppe>(META, 'enveloppe')) ?? null
}

export async function ecrireEnveloppe(e: Enveloppe): Promise<void> {
  await ecrire(META, 'enveloppe', e)
}

export async function lireEtatChiffre<T>(cle: CryptoKey): Promise<T | null> {
  const bloc = await lire<Bloc>(META, 'etat')
  if (!bloc) return null
  return dechiffrerObjet<T>(cle, bloc)
}

export async function ecrireEtatChiffre(cle: CryptoKey, etat: unknown): Promise<void> {
  await ecrire(META, 'etat', await chiffrerObjet(cle, etat))
}

export async function lireTentatives(): Promise<Tentatives> {
  return (await lire<Tentatives>(META, 'tentatives')) ?? { echecs: 0 }
}

export async function noterEchec(): Promise<Tentatives> {
  const t = await lireTentatives()
  const suivant = { echecs: t.echecs + 1, dernierEchec: new Date().toISOString() }
  await ecrire(META, 'tentatives', suivant)
  return suivant
}

export async function remettreTentativesAZero(): Promise<void> {
  await ecrire(META, 'tentatives', { echecs: 0 })
}

// Droit à l'effacement : supprime la base entière et toute trace en clair.
export async function effacerToutLeCoffre(): Promise<void> {
  try {
    window.localStorage.removeItem(CLE_ANCIENNE_EN_CLAIR)
  } catch {
    // ignoré
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(NOM_BASE)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
    req.onblocked = () => resolve()
  })
}

// Demande au navigateur de ne pas évincer le coffre en cas de manque d'espace.
export async function demanderPersistance(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false
  } catch {
    return false
  }
}

// --- Fichiers -------------------------------------------------------------

export async function enregistrerFichier(cleCoffre: CryptoKey, id: string, fichier: File | Blob, nom: string): Promise<MetaFichier> {
  if (fichier.size > TAILLE_MAX_FICHIER) throw new Error('Ce fichier dépasse 15 Mo.')
  const cleFichier = await nouvelleCle()
  const iv = aleatoire(12)
  const contenu = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cleFichier, await fichier.arrayBuffer())
  const meta: MetaFichier = { nom, type: fichier.type || 'application/octet-stream', taille: fichier.size }
  const stocke: FichierStocke = {
    cle: await envelopperCle(cleFichier, cleCoffre),
    iv,
    contenu,
    meta: await chiffrerObjet(cleCoffre, meta),
  }
  await ecrire(FICHIERS, id, stocke)
  return meta
}

export async function lireFichier(cleCoffre: CryptoKey, id: string): Promise<{ blob: Blob; meta: MetaFichier } | null> {
  const s = await lire<FichierStocke>(FICHIERS, id)
  if (!s) return null
  const cleFichier = await desenvelopperCle(s.cle, cleCoffre, false)
  const clair = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: s.iv }, cleFichier, s.contenu)
  const meta = await dechiffrerObjet<MetaFichier>(cleCoffre, s.meta)
  return { blob: new Blob([clair], { type: meta.type }), meta }
}

export async function supprimerFichier(id: string): Promise<void> {
  await effacer(FICHIERS, id)
}

export async function listerIdsFichiers(): Promise<string[]> {
  return ((await transaction<IDBValidKey[]>(FICHIERS, 'readonly', (s) => s.getAllKeys())) ?? []).map(String)
}

// --- Sauvegarde chiffrée (export / restauration) -------------------------

export type Sauvegarde = {
  format: 'horizon-proche-sauvegarde'
  version: 1
  exporteeLe: string
  enveloppe: Enveloppe
  etat: Bloc
  fichiers: Record<string, { cle: Bloc; iv: string; contenu: string; meta: Bloc }>
}

const b64 = (o: ArrayBuffer | Uint8Array) => {
  const tab = o instanceof Uint8Array ? o : new Uint8Array(o)
  let bin = ''
  for (let i = 0; i < tab.length; i += 0x8000) bin += String.fromCharCode(...tab.subarray(i, i + 0x8000))
  return btoa(bin)
}
const deB64 = (s: string) => {
  const bin = atob(s)
  const tab = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) tab[i] = bin.charCodeAt(i)
  return tab
}

// La sauvegarde reste chiffrée de bout en bout : elle ne s'ouvre qu'avec la phrase secrète
// ou le code de secours en vigueur au moment de l'export.
export async function construireSauvegarde(): Promise<Sauvegarde> {
  const enveloppe = await lireEnveloppe()
  const etat = await lire<Bloc>(META, 'etat')
  if (!enveloppe || !etat) throw new Error('Aucun coffre à sauvegarder.')
  const fichiers: Sauvegarde['fichiers'] = {}
  for (const id of await listerIdsFichiers()) {
    const f = await lire<FichierStocke>(FICHIERS, id)
    if (f) fichiers[id] = { cle: f.cle, iv: b64(f.iv), contenu: b64(f.contenu), meta: f.meta }
  }
  return { format: 'horizon-proche-sauvegarde', version: 1, exporteeLe: new Date().toISOString(), enveloppe, etat, fichiers }
}

export async function restaurerSauvegarde(s: Sauvegarde): Promise<void> {
  if (s?.format !== 'horizon-proche-sauvegarde' || s.version !== 1) throw new Error('Ce fichier n’est pas une sauvegarde Horizon Proche.')
  await effacerToutLeCoffre()
  await ecrireEnveloppe(s.enveloppe)
  await ecrire(META, 'etat', s.etat)
  for (const [id, f] of Object.entries(s.fichiers)) {
    const deb = deB64(f.contenu)
    await ecrire(FICHIERS, id, { cle: f.cle, iv: deB64(f.iv), contenu: deb.buffer, meta: f.meta } satisfies FichierStocke)
  }
}
