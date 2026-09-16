// Sélecteurs purs sur l'état d'un dossier. Aucun React ici : testables hors navigateur.

import type { Demarche, Document, DossierData, Echeance, ParcoursSuivi, Personne, Titulaire } from '@/lib/demo-data'
import { parcours as catalogueParcours, etapesDuParcours, type Parcours, type ContactEtape } from '@/lib/parcours'
import { fiches } from '@/lib/fiches'
import { aujourdhuiISO, ajouterAnnees, ajouterMois, formatDateLongue, formatMoisAnnee } from '@/lib/dates'

export function dateMajorite(naissanceISO: string): string {
  return ajouterAnnees(naissanceISO, 18)
}

// Rentrée scolaire de l'année des 4 ans. Règle HarmoS appliquée dans le canton de Vaud :
// l'enfant entre à l'école l'année civile où il a 4 ans révolus au 31 juillet [À VÉRIFIER].
// La date exacte de la rentrée varie ; on retient le 1er août comme repère de calcul.
export function dateEntreeEcole(naissanceISO: string): string {
  const [annee, mois, jour] = naissanceISO.split('-').map(Number)
  const avantAout = mois < 8 || (mois === 7 && jour <= 31)
  const anneeRentree = annee + 4 + (avantAout ? 0 : 1)
  return `${anneeRentree}-08-01`
}

// Le point du calendrier à partir duquel les moments d'un parcours sont calculés (§6.2).
export function dateRepere(p: Parcours, personne: Personne, suivi?: ParcoursSuivi): string {
  switch (p.repere) {
    case 'majorite':
      return dateMajorite(personne.naissanceISO)
    case 'entree-ecole':
      return dateEntreeEcole(personne.naissanceISO)
    case 'activation':
      return suivi?.activeLe ?? aujourdhuiISO()
  }
}

// Libellé du repère pour une famille (« Noah a 18 ans », « rentrée scolaire de Noah »).
export function libelleRepere(p: Parcours, personne: Personne): string {
  switch (p.repere) {
    case 'majorite':
      return `${personne.prenom} a 18 ans`
    case 'entree-ecole':
      return `rentrée scolaire de ${personne.prenom}`
    case 'activation':
      return 'début du parcours'
  }
}

// Jalons d'un parcours suivi. Toujours de nature « jalon » (§2.2) : jamais un délai légal.
export function jalonsDuParcours(p: Parcours, personne: Personne, suivi: ParcoursSuivi): Echeance[] {
  const repere = dateRepere(p, personne, suivi)
  const resultat: Echeance[] = []
  for (const etape of etapesDuParcours(p)) {
    if (!etape.genereJalon || etape.moisParRapportAuRepere === null) continue
    const statut = suivi.etapes[etape.id]?.statut ?? 'a-faire'
    if (statut === 'pas-concerne') continue
    resultat.push({
      id: `parcours:${p.id}:${etape.id}`,
      nature: 'jalon',
      titre: etape.titre,
      provenance: `Parcours « ${p.titre} » — ${etape.quand}`,
      dateISO: ajouterMois(repere, etape.moisParRapportAuRepere),
      fait: statut === 'fait',
      origine: 'parcours',
    })
  }
  return resultat
}

// Jalons calculés à partir de tous les parcours suivis du dossier.
export function jalonsDesParcours(dossier: DossierData, personne: Personne): Echeance[] {
  const resultat: Echeance[] = []
  for (const [parcoursId, suivi] of Object.entries(dossier.parcours)) {
    if (!suivi.active) continue
    const p = catalogueParcours[parcoursId]
    if (!p) continue
    resultat.push(...jalonsDuParcours(p, personne, suivi))
  }
  return resultat
}

// Prochain moment conseillé non fait d'un parcours, à partir d'aujourd'hui.
export function prochainJalonParcours(p: Parcours, personne: Personne, suivi: ParcoursSuivi): Echeance | undefined {
  const auj = aujourdhuiISO()
  return jalonsDuParcours(p, personne, suivi)
    .filter((j) => !j.fait && j.dateISO >= auj)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))[0]
}

// Avancement d'un parcours : étapes faites sur étapes concernées.
export function avancementParcours(p: Parcours, suivi?: ParcoursSuivi): { faites: number; total: number; pourcent: number } {
  const etapes = etapesDuParcours(p).filter((e) => (suivi?.etapes[e.id]?.statut ?? 'a-faire') !== 'pas-concerne')
  const faites = etapes.filter((e) => suivi?.etapes[e.id]?.statut === 'fait').length
  return { faites, total: etapes.length, pourcent: etapes.length ? Math.round((faites / etapes.length) * 100) : 0 }
}

// Parcours suivis du dossier, dans l'ordre du catalogue, avec leur suivi.
export function parcoursSuivis(dossier: DossierData): { p: Parcours; suivi: ParcoursSuivi }[] {
  return Object.values(catalogueParcours)
    .filter((p) => dossier.parcours[p.id]?.active)
    .map((p) => ({ p, suivi: dossier.parcours[p.id] }))
}

// Note affichée quand le repère d'un parcours est déjà passé pour cette personne. Jamais bloquant.
export function pertinenceParcours(p: Parcours, personne: Personne): string | null {
  if (p.repere === 'majorite' && personne.age >= 18) {
    return `Ce parcours s’adresse à une personne mineure. ${personne.prenom} a ${personne.age} ans.`
  }
  if (p.repere === 'entree-ecole' && personne.age >= 6) {
    return `Ce parcours concerne l’entrée à l’école. ${personne.prenom} a ${personne.age} ans.`
  }
  return null
}

// Avancement d'une démarche : pièces réunies, et étapes du parcours si la fiche y renvoie.
export function avancementDemarche(demarche: Demarche, dossier: DossierData): { faites: number; total: number; libelle: string } {
  const fiche = demarche.ficheId ? fiches[demarche.ficheId] : undefined
  if (fiche?.parcoursId && dossier.parcours[fiche.parcoursId]?.active) {
    const p = catalogueParcours[fiche.parcoursId]
    const suivi = dossier.parcours[fiche.parcoursId]
    const etapes = etapesDuParcours(p).filter((e) => (suivi.etapes[e.id]?.statut ?? 'a-faire') !== 'pas-concerne')
    const faites = etapes.filter((e) => suivi.etapes[e.id]?.statut === 'fait').length
    return { faites, total: etapes.length, libelle: `${faites} étapes sur ${etapes.length}` }
  }
  const total = fiche?.pieces.length ?? 0
  const faites = fiche ? fiche.pieces.filter((p) => demarche.piecesCochees.includes(p.id)).length : 0
  return { faites, total, libelle: total ? `${faites} pièces sur ${total} réunies` : 'aucune pièce listée' }
}

export function contexteCourt(personne: Personne, dossier: DossierData): string {
  const n = dossier.demarches.length
  return `Dossier de ${personne.prenom}, ${personne.age} ans · ${n} démarche${n > 1 ? 's' : ''} en cours`
}

export function libelleDate(e: Echeance): string {
  if (e.date) return e.date
  return e.nature === 'delai' ? `avant le ${formatDateLongue(e.dateISO)}` : `vers ${formatMoisAnnee(e.dateISO)}`
}

export function nomTitulaire(t: Titulaire): string {
  return `${t.prenom} ${t.nom}`
}


// Document du coffre correspondant à une pièce demandée par une étape. Rapprochement par le
// titre (« Copie de la décision AI en cours » ↔ « Décision AI ») : volontairement prudent, une
// pièce sans correspondance reste simplement « à réunir ».
export function documentPourPiece(piece: string, documents: Document[]): Document | undefined {
  const texte = piece.toLowerCase()
  return documents.find((d) => d.titre.length >= 4 && texte.includes(d.titre.toLowerCase()))
}

// Toutes les pièces d'un parcours, dédoublonnées, dans l'ordre des étapes.
export function piecesDuParcours(p: Parcours): string[] {
  const vues = new Set<string>()
  const resultat: string[] = []
  for (const e of etapesDuParcours(p)) {
    for (const pc of e.pieces ?? []) {
      if (vues.has(pc)) continue
      vues.add(pc)
      resultat.push(pc)
    }
  }
  return resultat
}

// Tous les contacts d'un parcours, dédoublonnés par nom.
export function contactsDuParcours(p: Parcours): ContactEtape[] {
  const vus = new Map<string, ContactEtape>()
  for (const e of etapesDuParcours(p)) {
    for (const c of e.contacts ?? []) if (!vus.has(c.nom)) vus.set(c.nom, c)
  }
  return [...vus.values()]
}
