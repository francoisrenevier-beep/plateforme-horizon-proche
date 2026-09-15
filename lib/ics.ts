// Export au format iCalendar (RFC 5545).
//
// Un fichier .ics s'importe dans Outlook, Google Calendar, Apple Calendrier et la plupart des
// agendas. Le fichier est produit dans le navigateur : aucune donnée du dossier ne part vers un
// service externe, c'est la famille qui ouvre le fichier dans l'agenda de son choix.
//
// Choix d'implémentation :
//  - Les événements datés sont écrits en UTC (suffixe Z), l'heure murale étant interprétée dans le
//    fuseau Europe/Zurich. Le décalage est calculé pour la date concernée, donc l'heure d'été est
//    correcte sans table codée en dur.
//  - Les événements sans heure sont des journées entières (VALUE=DATE), ce qui est le cas des
//    délais légaux et des moments conseillés.
//  - Les `uid` sont stables : réimporter le même fichier met l'événement à jour au lieu d'en
//    créer un doublon.

const PRODID = '-//Horizon Proche//Agenda//FR'
const FUSEAU = 'Europe/Zurich'
const DUREE_DEFAUT_MINUTES = 60

export type EvenementIcs = {
  // Identifiant stable dans le temps (sans le domaine, ajouté ici).
  uid: string
  titre: string
  dateISO: string
  // Heure telle que la famille l'a saisie (« 14h30 », « 14:30 », « 9 h »). Absente : journée entière.
  heure?: string
  dureeMinutes?: number
  lieu?: string
  description?: string
  // Rappel, en minutes avant le début. Absent : aucun rappel.
  rappelMinutesAvant?: number
}

// « 14h30 », « 14:30 », « 14 h 30 », « 9h », « 09.30 » → { heures, minutes }
export function analyserHeure(heure?: string): { heures: number; minutes: number } | null {
  if (!heure) return null
  const m = heure.trim().match(/^(\d{1,2})\s*(?:[h:.]\s*(\d{1,2})?)?\s*$/i)
  if (!m) return null
  const heures = Number(m[1])
  const minutes = m[2] ? Number(m[2]) : 0
  if (heures > 23 || minutes > 59) return null
  return { heures, minutes }
}

// Décalage du fuseau, en minutes, à un instant donné.
function decalageMinutes(fuseau: string, instant: Date): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: fuseau,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const p: Record<string, string> = {}
  for (const part of fmt.formatToParts(instant)) {
    if (part.type !== 'literal') p[part.type] = part.value
  }
  const heures = Number(p.hour) % 24 // certains moteurs rendent « 24 » pour minuit
  const commeUTC = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), heures, Number(p.minute), Number(p.second))
  return (commeUTC - instant.getTime()) / 60000
}

// Heure murale à Zurich → instant absolu.
export function instantDepuisHeureLocale(dateISO: string, heures: number, minutes: number, fuseau = FUSEAU): Date {
  const [a, mo, j] = dateISO.split('-').map(Number)
  const suppose = Date.UTC(a, mo - 1, j, heures, minutes)
  // Première approximation, puis une correction : elle suffit, sauf exactement au saut d'heure.
  let instant = suppose - decalageMinutes(fuseau, new Date(suppose)) * 60000
  instant = suppose - decalageMinutes(fuseau, new Date(instant)) * 60000
  return new Date(instant)
}

function deuxChiffres(n: number): string {
  return String(n).padStart(2, '0')
}

function horodatageUTC(d: Date): string {
  return (
    `${d.getUTCFullYear()}${deuxChiffres(d.getUTCMonth() + 1)}${deuxChiffres(d.getUTCDate())}` +
    `T${deuxChiffres(d.getUTCHours())}${deuxChiffres(d.getUTCMinutes())}${deuxChiffres(d.getUTCSeconds())}Z`
  )
}

function dateSeule(dateISO: string): string {
  return dateISO.slice(0, 10).replaceAll('-', '')
}

function jourSuivant(dateISO: string): string {
  const [a, mo, j] = dateISO.split('-').map(Number)
  const d = new Date(Date.UTC(a, mo - 1, j + 1))
  return `${d.getUTCFullYear()}-${deuxChiffres(d.getUTCMonth() + 1)}-${deuxChiffres(d.getUTCDate())}`
}

// Échappement des valeurs de texte (RFC 5545 §3.3.11).
export function echapper(texte: string): string {
  return texte
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(/\r\n|\r|\n/g, '\\n')
}

// Pliage des lignes à 75 octets (RFC 5545 §3.1), sans couper un caractère multi-octet.
export function plierLigne(ligne: string): string {
  const encodeur = new TextEncoder()
  if (encodeur.encode(ligne).length <= 75) return ligne
  const morceaux: string[] = []
  let courant = ''
  let octets = 0
  let limite = 75
  for (const caractere of ligne) {
    const taille = encodeur.encode(caractere).length
    if (octets + taille > limite) {
      morceaux.push(courant)
      courant = caractere
      octets = taille + 1 // l'espace de continuation compte dans la ligne suivante
      limite = 75
    } else {
      courant += caractere
      octets += taille
    }
  }
  if (courant) morceaux.push(courant)
  return morceaux.join('\r\n ')
}

function evenement(ev: EvenementIcs, horodatage: string, domaine: string): string[] {
  const lignes: string[] = ['BEGIN:VEVENT', `UID:${ev.uid}@${domaine}`, `DTSTAMP:${horodatage}`]

  const h = analyserHeure(ev.heure)
  if (h) {
    const debut = instantDepuisHeureLocale(ev.dateISO, h.heures, h.minutes)
    const fin = new Date(debut.getTime() + (ev.dureeMinutes ?? DUREE_DEFAUT_MINUTES) * 60000)
    lignes.push(`DTSTART:${horodatageUTC(debut)}`, `DTEND:${horodatageUTC(fin)}`)
  } else {
    // Journée entière : DTEND est exclusif, donc le lendemain.
    lignes.push(`DTSTART;VALUE=DATE:${dateSeule(ev.dateISO)}`, `DTEND;VALUE=DATE:${dateSeule(jourSuivant(ev.dateISO))}`)
  }

  lignes.push(`SUMMARY:${echapper(ev.titre)}`)
  if (ev.lieu) lignes.push(`LOCATION:${echapper(ev.lieu)}`)
  if (ev.description) lignes.push(`DESCRIPTION:${echapper(ev.description)}`)

  if (typeof ev.rappelMinutesAvant === 'number') {
    lignes.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${echapper(ev.titre)}`,
      `TRIGGER:-PT${ev.rappelMinutesAvant}M`,
      'END:VALARM',
    )
  }

  lignes.push('END:VEVENT')
  return lignes
}

export function calendrierIcs(
  evenements: EvenementIcs[],
  options: { nom?: string; maintenant?: Date; domaine?: string } = {},
): string {
  const horodatage = horodatageUTC(options.maintenant ?? new Date())
  const domaine = options.domaine ?? 'horizon-proche.ch'
  const lignes: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:${PRODID}`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH']
  if (options.nom) {
    lignes.push(`X-WR-CALNAME:${echapper(options.nom)}`)
  }
  lignes.push(`X-WR-TIMEZONE:${FUSEAU}`)
  for (const ev of evenements) lignes.push(...evenement(ev, horodatage, domaine))
  lignes.push('END:VCALENDAR')
  return lignes.map(plierLigne).join('\r\n') + '\r\n'
}

// Nom de fichier sûr : sans accents ni caractères réservés.
export function nomFichierIcs(base: string): string {
  const sansAccent = base.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '')
  const propre = sansAccent
    .replaceAll(/[^a-zA-Z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
    .toLowerCase()
  return `${propre || 'agenda'}.ics`
}

// Déclenche le téléchargement du fichier. À n'appeler que côté navigateur.
export function telechargerIcs(nomFichier: string, contenu: string): void {
  const blob = new Blob([contenu], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = nomFichier
  document.body.appendChild(lien)
  lien.click()
  lien.remove()
  // Laisse au navigateur le temps d'ouvrir le fichier avant de libérer l'URL.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
