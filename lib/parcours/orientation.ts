// « Je ne sais pas par où commencer » — des situations dites avec les mots des familles,
// chacune menant à un parcours. Contenu éditorial : à enrichir ici, pas dans les composants.

import type { CategorieParcours } from './types'

export type Situation = {
  id: string
  // Formulée à la première personne, comme la famille la dirait.
  texte: string
  parcoursId: string
  categorie: CategorieParcours
}

export const situations: Situation[] = [
  { id: 'diagnostic', texte: 'Nous venons de recevoir un diagnostic et je ne sais pas quoi faire en premier', parcoursId: 'apres-diagnostic', categorie: 'transversal' },
  { id: 'ecole', texte: 'Mon enfant a des besoins particuliers et va bientôt entrer à l’école', parcoursId: 'entree-ecole', categorie: 'enfant' },
  { id: 'ai-enfant', texte: 'On m’a dit de « faire une demande AI » pour mon enfant', parcoursId: 'premiere-demande-ai', categorie: 'enfant' },
  { id: 'majorite', texte: 'Mon enfant en situation de handicap va avoir 18 ans', parcoursId: 'transition-majorite', categorie: 'enfant' },
  { id: 'fin-ecole', texte: 'La scolarité de mon enfant se termine et je ne vois pas la suite', parcoursId: 'transition-formation', categorie: 'enfant' },
  { id: 'affaires', texte: 'Mon proche n’arrive plus à gérer ses affaires seul', parcoursId: 'curatelle', categorie: 'adulte' },
  { id: 'argent', texte: 'La rente ne suffit pas à couvrir les besoins', parcoursId: 'pc-subsides', categorie: 'adulte' },
  { id: 'logement', texte: 'Le logement n’est plus adapté', parcoursId: 'logement-moyens-auxiliaires', categorie: 'adulte' },
  { id: 'domicile', texte: 'Mon parent âgé veut rester chez lui mais a besoin d’aide', parcoursId: 'maintien-domicile', categorie: 'personne-agee' },
  { id: 'ems', texte: 'Le domicile ne suffit plus, on parle d’EMS', parcoursId: 'entree-ems', categorie: 'personne-agee' },
  { id: 'anticiper', texte: 'Je veux que mon proche puisse dire ce qu’il souhaite tant qu’il le peut', parcoursId: 'directives-mandat', categorie: 'personne-agee' },
  { id: 'epuise', texte: 'Je m’occupe d’un proche et je n’en peux plus', parcoursId: 'statut-proche-aidant', categorie: 'transversal' },
  { id: 'deces', texte: 'Un proche vient de mourir', parcoursId: 'deces', categorie: 'transversal' },
]
