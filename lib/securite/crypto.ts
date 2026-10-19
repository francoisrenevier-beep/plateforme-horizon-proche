// Chiffrement côté navigateur (CLAUDE.md §7).
//
// Principe « zéro connaissance » : rien de ce que la famille saisit ne quitte l'appareil en
// clair. Le serveur (à venir, chez Infomaniak) ne recevra que des blocs chiffrés qu'il est
// incapable de lire, faute de posséder la clé.
//
// Hiérarchie des clés, reprise du spike cryptographique :
//
//   phrase secrète ──PBKDF2──▶ clé d'enveloppe A ─┐
//                                                 ├─ enveloppent la même clé de coffre (DEK)
//   code de secours ─PBKDF2──▶ clé d'enveloppe B ─┘
//
//   clé de coffre (DEK, AES-256-GCM) ── chiffre l'état complet des dossiers
//                                    └─ enveloppe une clé par fichier (FEK)
//
// Changer de phrase secrète ne rechiffre pas les données : seule l'enveloppe A est refaite.
//
// Choix du prototype : PBKDF2-SHA-256 (natif dans tous les navigateurs, y compris Safari iOS).
// La cible de production reste Argon2id (@noble/hashes) une fois le spike mesuré sur appareil
// réel. Le champ `kdf` de l'enveloppe permet de migrer sans casser les coffres existants.

export const ITERATIONS_PBKDF2 = 600_000
const LONGUEUR_SEL = 16
const LONGUEUR_IV = 12

export type Bloc = { iv: string; ct: string }

export type ParametresKdf = { algo: 'PBKDF2-SHA256'; iterations: number; sel: string }

export type Enveloppe = {
  version: 1
  creeLe: string
  // Clé de coffre enveloppée par la phrase secrète
  parPhrase: { kdf: ParametresKdf; cle: Bloc }
  // La même clé de coffre enveloppée par le code de secours
  parSecours: { kdf: ParametresKdf; cle: Bloc }
  // Petit témoin chiffré : permet de vérifier la clé sans déchiffrer tout l'état
  temoin: Bloc
}

const encodeur = new TextEncoder()
const decodeur = new TextDecoder()

function subtle(): SubtleCrypto {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Ce navigateur ne permet pas le chiffrement (contexte non sécurisé ou navigateur trop ancien).')
  }
  return crypto.subtle
}

// --- Encodage -------------------------------------------------------------

export function versBase64(octets: ArrayBuffer | Uint8Array): string {
  const tab = octets instanceof Uint8Array ? octets : new Uint8Array(octets)
  let bin = ''
  for (let i = 0; i < tab.length; i += 0x8000) bin += String.fromCharCode(...tab.subarray(i, i + 0x8000))
  return btoa(bin)
}

export function depuisBase64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64)
  const tab = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) tab[i] = bin.charCodeAt(i)
  return tab
}

export function aleatoire(n: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(new ArrayBuffer(n)))
}

// --- Dérivation et clés ---------------------------------------------------

export function nouveauxParametresKdf(): ParametresKdf {
  return { algo: 'PBKDF2-SHA256', iterations: ITERATIONS_PBKDF2, sel: versBase64(aleatoire(LONGUEUR_SEL)) }
}

// Normalise le secret : la même phrase tapée sur un téléphone ou un ordinateur doit donner la même clé.
function normaliserSecret(secret: string): string {
  return secret.normalize('NFC')
}

export async function deriverCleEnveloppe(secret: string, kdf: ParametresKdf): Promise<CryptoKey> {
  const base = await subtle().importKey('raw', encodeur.encode(normaliserSecret(secret)), 'PBKDF2', false, ['deriveKey'])
  return subtle().deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: depuisBase64(kdf.sel), iterations: kdf.iterations },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey'],
  )
}

export async function nouvelleCle(): Promise<CryptoKey> {
  // Extractible uniquement pour pouvoir être enveloppée ; elle n'est jamais exportée en clair.
  return subtle().generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'])
}

export async function envelopperCle(cle: CryptoKey, par: CryptoKey): Promise<Bloc> {
  const iv = aleatoire(LONGUEUR_IV)
  const ct = await subtle().wrapKey('raw', cle, par, { name: 'AES-GCM', iv })
  return { iv: versBase64(iv), ct: versBase64(ct) }
}

export async function desenvelopperCle(bloc: Bloc, par: CryptoKey, extractible = true): Promise<CryptoKey> {
  return subtle().unwrapKey(
    'raw',
    depuisBase64(bloc.ct),
    par,
    { name: 'AES-GCM', iv: depuisBase64(bloc.iv) },
    { name: 'AES-GCM', length: 256 },
    extractible,
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'],
  )
}

// --- Chiffrement de données ----------------------------------------------

export async function chiffrerOctets(cle: CryptoKey, donnees: Uint8Array<ArrayBuffer> | ArrayBuffer): Promise<Bloc> {
  const iv = aleatoire(LONGUEUR_IV)
  const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, cle, donnees)
  return { iv: versBase64(iv), ct: versBase64(ct) }
}

export async function dechiffrerOctets(cle: CryptoKey, bloc: Bloc): Promise<ArrayBuffer> {
  return subtle().decrypt({ name: 'AES-GCM', iv: depuisBase64(bloc.iv) }, cle, depuisBase64(bloc.ct))
}

export async function chiffrerObjet(cle: CryptoKey, objet: unknown): Promise<Bloc> {
  return chiffrerOctets(cle, encodeur.encode(JSON.stringify(objet)) as Uint8Array<ArrayBuffer>)
}

export async function dechiffrerObjet<T>(cle: CryptoKey, bloc: Bloc): Promise<T> {
  return JSON.parse(decodeur.decode(await dechiffrerOctets(cle, bloc))) as T
}

// --- Code de secours ------------------------------------------------------

// 24 caractères dans un alphabet sans ambiguïté (pas de 0/O, 1/I/L), groupés par 4.
// 24 × log2(31) ≈ 119 bits d'entropie.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function nouveauCodeSecours(): string {
  const octets = aleatoire(24)
  const car = Array.from(octets, (o) => ALPHABET[o % ALPHABET.length])
  return car.join('').match(/.{4}/g)!.join('-')
}

export function normaliserCodeSecours(saisie: string): string {
  const brut = saisie.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
  return brut.match(/.{1,4}/g)?.join('-') ?? ''
}

// --- Création et ouverture d'une enveloppe -------------------------------

const TEMOIN = 'horizon-proche:coffre'

export async function creerEnveloppe(
  phrase: string,
  codeSecours: string,
  cleCoffre?: CryptoKey,
): Promise<{ enveloppe: Enveloppe; cle: CryptoKey }> {
  const cle = cleCoffre ?? (await nouvelleCle())
  const kdfA = nouveauxParametresKdf()
  const kdfB = nouveauxParametresKdf()
  const [a, b] = await Promise.all([deriverCleEnveloppe(phrase, kdfA), deriverCleEnveloppe(codeSecours, kdfB)])
  const enveloppe: Enveloppe = {
    version: 1,
    creeLe: new Date().toISOString(),
    parPhrase: { kdf: kdfA, cle: await envelopperCle(cle, a) },
    parSecours: { kdf: kdfB, cle: await envelopperCle(cle, b) },
    temoin: await chiffrerObjet(cle, TEMOIN),
  }
  return { enveloppe, cle }
}

async function verifierTemoin(cle: CryptoKey, enveloppe: Enveloppe): Promise<void> {
  const t = await dechiffrerObjet<string>(cle, enveloppe.temoin)
  if (t !== TEMOIN) throw new Error('Témoin invalide')
}

// Renvoie la clé de coffre, ou null si le secret est faux (AES-GCM refuse alors le déchiffrement).
export async function ouvrirAvecPhrase(enveloppe: Enveloppe, phrase: string): Promise<CryptoKey | null> {
  try {
    const a = await deriverCleEnveloppe(phrase, enveloppe.parPhrase.kdf)
    const cle = await desenvelopperCle(enveloppe.parPhrase.cle, a)
    await verifierTemoin(cle, enveloppe)
    return cle
  } catch {
    return null
  }
}

export async function ouvrirAvecSecours(enveloppe: Enveloppe, code: string): Promise<CryptoKey | null> {
  try {
    const b = await deriverCleEnveloppe(normaliserCodeSecours(code), enveloppe.parSecours.kdf)
    const cle = await desenvelopperCle(enveloppe.parSecours.cle, b)
    await verifierTemoin(cle, enveloppe)
    return cle
  } catch {
    return null
  }
}

// Remplace l'enveloppe « phrase secrète » sans toucher aux données.
export async function changerPhrase(enveloppe: Enveloppe, cle: CryptoKey, nouvellePhrase: string): Promise<Enveloppe> {
  const kdf = nouveauxParametresKdf()
  const a = await deriverCleEnveloppe(nouvellePhrase, kdf)
  return { ...enveloppe, parPhrase: { kdf, cle: await envelopperCle(cle, a) } }
}

// Remplace le code de secours (l'ancien cesse immédiatement de fonctionner).
export async function changerCodeSecours(enveloppe: Enveloppe, cle: CryptoKey, nouveauCode: string): Promise<Enveloppe> {
  const kdf = nouveauxParametresKdf()
  const b = await deriverCleEnveloppe(nouveauCode, kdf)
  return { ...enveloppe, parSecours: { kdf, cle: await envelopperCle(cle, b) } }
}

// --- Robustesse d'une phrase secrète -------------------------------------

export type Robustesse = { niveau: 0 | 1 | 2 | 3; message: string; acceptable: boolean }

const TROP_COURANTES = ['motdepasse', 'password', '123456', 'azerty', 'qwerty', 'horizon', 'proche', 'soleil', 'bonjour']

export function evaluerPhrase(phrase: string): Robustesse {
  const p = phrase.trim()
  if (p.length < 12) return { niveau: 0, message: 'Au moins 12 caractères. Une courte phrase que vous retenez facilement fonctionne très bien.', acceptable: false }
  const minuscule = p.toLowerCase()
  if (TROP_COURANTES.some((m) => minuscule.includes(m)) && p.length < 20)
    return { niveau: 1, message: 'Elle contient un mot très courant. Allongez-la ou choisissez d’autres mots.', acceptable: false }
  if (new Set(p).size < 6) return { niveau: 1, message: 'Trop de caractères répétés.', acceptable: false }
  const mots = p.split(/\s+/).filter(Boolean).length
  if (p.length >= 20 || mots >= 4) return { niveau: 3, message: 'Très bonne phrase secrète.', acceptable: true }
  return { niveau: 2, message: 'Correcte. Quelques mots de plus la rendraient plus solide.', acceptable: true }
}
