// Utilitaires de dates. Toutes les dates stockées sont en ISO (AAAA-MM-JJ) ;
// les libellés lisibles sont dérivés ici, jamais saisis à la main.

const JOUR_MS = 24 * 60 * 60 * 1000

function versDate(iso: string): Date {
  // Interprétation en heure locale (pas UTC) pour éviter les décalages d'un jour.
  const [a, m, j] = iso.slice(0, 10).split('-').map(Number)
  return new Date(a, (m ?? 1) - 1, j ?? 1)
}

function versISO(d: Date): string {
  const a = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const j = String(d.getDate()).padStart(2, '0')
  return `${a}-${m}-${j}`
}

export function aujourdhuiISO(): string {
  return versISO(new Date())
}

export function maintenantISO(): string {
  return new Date().toISOString()
}

export function estISOValide(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(versDate(iso).getTime())
}

// "3 octobre 2026"
export function formatDateLongue(iso: string): string {
  return new Intl.DateTimeFormat('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' }).format(versDate(iso))
}

// "3 oct. 2026"
export function formatDateMoyenne(iso: string): string {
  return new Intl.DateTimeFormat('fr-CH', { day: 'numeric', month: 'short', year: 'numeric' }).format(versDate(iso))
}

// "03.10.2026"
export function formatDateCourte(iso: string): string {
  const d = versDate(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

// "octobre 2026"
export function formatMoisAnnee(iso: string): string {
  return new Intl.DateTimeFormat('fr-CH', { month: 'long', year: 'numeric' }).format(versDate(iso))
}

// Nombre de jours entre deux dates ISO (b - a), arrondi.
export function joursEntre(aISO: string, bISO: string): number {
  return Math.round((versDate(bISO).getTime() - versDate(aISO).getTime()) / JOUR_MS)
}

export function ajouterMois(iso: string, mois: number): string {
  const d = versDate(iso)
  const jour = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + mois)
  const dernierJour = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(jour, dernierJour))
  return versISO(d)
}

export function ajouterAnnees(iso: string, annees: number): string {
  return ajouterMois(iso, annees * 12)
}

// Âge révolu à une date donnée (par défaut aujourd'hui).
export function ageA(naissanceISO: string, dateISO: string = aujourdhuiISO()): number {
  const n = versDate(naissanceISO)
  const d = versDate(dateISO)
  let age = d.getFullYear() - n.getFullYear()
  const anniversairePasse =
    d.getMonth() > n.getMonth() || (d.getMonth() === n.getMonth() && d.getDate() >= n.getDate())
  if (!anniversairePasse) age -= 1
  return age
}

// Libellé d'une échéance selon sa nature (voir CLAUDE.md §2.2).
// Un délai est daté au jour ; un jalon est un moment approximatif, jamais une date butoir.
export function libelleEcheance(nature: 'delai' | 'jalon', dateISO: string): string {
  return nature === 'delai' ? `avant le ${formatDateLongue(dateISO)}` : `vers ${formatMoisAnnee(dateISO)}`
}

// "il y a 3 jours", "hier", "à l'instant"
export function formatRelatif(isoDateTime: string, maintenant: Date = new Date()): string {
  const t = new Date(isoDateTime).getTime()
  const diffMin = Math.round((maintenant.getTime() - t) / 60000)
  if (diffMin < 1) return 'à l’instant'
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  const diffJ = Math.round(diffH / 24)
  if (diffJ === 1) return 'hier'
  if (diffJ < 7) return `il y a ${diffJ} jours`
  const diffS = Math.round(diffJ / 7)
  if (diffS < 5) return `il y a ${diffS} semaine${diffS > 1 ? 's' : ''}`
  return `le ${formatDateCourte(isoDateTime)}`
}

export function decalerJours(iso: string, jours: number): string {
  const d = versDate(iso)
  d.setDate(d.getDate() + jours)
  return versISO(d)
}
