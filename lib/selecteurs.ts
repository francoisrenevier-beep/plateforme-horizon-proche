// Sélecteurs purs sur l'état d'un dossier. Aucun React ici : testables hors navigateur.

import type { Demarche, DossierData, Echeance, Personne, Titulaire } from '@/lib/demo-data'
import { parcours as catalogueParcours, etapesDuParcours } from '@/lib/parcours'
import { fiches } from '@/lib/fiches'
import { aujourdhuiISO, ajouterAnnees, ajouterMois, formatDateLongue, formatMoisAnnee } from '@/lib/dates'

export function dateMajorite(naissanceISO: string): string {
  return ajouterAnnees(naissanceISO, 18)
}

// Jalons calculés à partir des parcours suivis. Toujours de nature « jalon » (§2.2).
export function jalonsDesParcours(dossier: DossierData, personne: Personne): Echeance[] {
  const resultat: Echeance[] = []
  for (const [parcoursId, suivi] of Object.entries(dossier.parcours)) {
    if (!suivi.active) continue
    const p = catalogueParcours[parcoursId]
    if (!p) continue
    const repere = p.repere === 'majorite' ? dateMajorite(personne.naissanceISO) : aujourdhuiISO()
    for (const etape of etapesDuParcours(p)) {
      if (!etape.genereJalon || etape.moisParRapportAuRepere === null) continue
      const statut = suivi.etapes[etape.id]?.statut ?? 'a-faire'
      if (statut === 'pas-concerne') continue
      resultat.push({
        id: `parcours:${parcoursId}:${etape.id}`,
        nature: 'jalon',
        titre: etape.titre,
        provenance: `Parcours « ${p.titre} » — ${etape.quand}`,
        dateISO: ajouterMois(repere, etape.moisParRapportAuRepere),
        fait: statut === 'fait',
        origine: 'parcours',
      })
    }
  }
  return resultat
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

