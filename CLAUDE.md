# CLAUDE.md — Repères (accompagnement de proches)

> Document de travail. Rédigé par reconstruction à partir de la maquette v0
> existante (`accompagnement-de-proches.zip`), faute d'un document d'origine.
> Tout ce qui est marqué **[À VALIDER]** est une hypothèse ou une décision qui
> t'appartient — pas un fait établi. Corrige-moi directement dans ce fichier.

---

## §1 — Vision et contexte

Repères est un outil pour les proches aidants qui accompagnent une personne
dans ses démarches administratives, médicales et sociales : un parent d'enfant
en situation de handicap, l'enfant adulte d'un parent âgé, etc. Une même
personne (le·la titulaire) peut gérer plusieurs **dossiers** — un par personne
accompagnée.

Le besoin observé dans la maquette : centraliser ce qui est aujourd'hui
éparpillé (courriers, échéances, contacts, historique) et qui repose sur la
mémoire d'une seule personne.

Public pilote : Suisse romande, canton de Vaud (fiches de démarches,
intervenants, autorités — tous VD dans les données de démonstration).
**[À VALIDER]** — extension à d'autres cantons envisagée ou non.

Nom du produit : **Repères** (utilisé dans `app/layout.tsx` et
`app-shell.tsx`). **[À VALIDER]** — la maquette l'utilise partout, mais rien
n'indique que ce nom soit définitivement arrêté.

---

## §2 — Décisions non négociables

Ces règles sont déjà incarnées dans le code de la maquette. Elles ne se
discutent pas au fil de l'implémentation — un écart avec l'une d'elles est un
bug, pas une variante acceptable.

### 2.1 Séparation par dossier

Chaque personne accompagnée a son propre dossier (démarches, documents,
échéances, portrait, intervenants, accès). Le titulaire navigue entre dossiers
via le sélecteur de personne (`person-switcher.tsx`), jamais par un mélange de
données entre dossiers.

### 2.2 Distinction délai légal / jalon conseillé

C'est la distinction structurante du produit. Deux natures d'échéance
(`Echeance.nature: 'delai' | 'jalon'`), avec un traitement visuel strict et
constant, implémenté dans `components/echeance-item.tsx` :

| | Délai légal | Jalon conseillé |
|---|---|---|
| Sens | Date opposable, lue sur un courrier officiel | Recommandation de calendrier, pas une obligation |
| Bordure | 3px `--rouille` à gauche | aucune |
| Fond | `--card` | `--sable` |
| Icône | horloge (`Clock`) | drapeau (`Flag`) |
| Compte à rebours | oui, "Il reste N jours" | jamais |
| Étiquette | "Délai légal" | "Moment conseillé" |
| Provenance affichée | le courrier source | la règle de calendrier appliquée |

Règle absolue : **un jalon conseillé ne devient jamais visuellement ou
sémantiquement un délai légal.** L'outil ne transforme jamais un conseil en
obligation. Cette distinction doit rester lisible sans perception des
couleurs (forme de l'icône + bordure + libellé textuel, pas la couleur seule).

Tout composant qui affiche une échéance (accueil, page démarche, chronologie,
future page de présentation publique) doit respecter ce traitement — jamais
une variante simplifiée qui perdrait la distinction.

### 2.3 Le portrait est écrit à la première personne

`portraitNoah` (`lib/demo-data.ts`) structure le portrait en sept sections
fixes, toutes rédigées comme si la personne accompagnée parlait elle-même
("Je me repère mieux quand...", pas "Noah se repère mieux quand..."). Objectif :
un document transmissible tel quel à un nouvel intervenant, qui parle de la
personne à la première personne plutôt qu'en objet de dossier.

Sections fixes : Comment je communique · Ce qui me rassure · Ce qui me met en
difficulté · Le déroulé de ma journée · Ce que j'aime · Les gens qui comptent
pour moi · Mon histoire. Une section vide (`texte: null`) reste affichée comme
incomplète, pas masquée.

### 2.4 Accès granulaire, pas binaire

`Acces` (par dossier) associe à chaque personne un rôle et un périmètre de
visibilité en texte libre ("Tout le dossier, sauf le volet financier", "Le
portrait seulement"), avec une fenêtre temporelle (`depuis` / `jusqua`). Un
accès professionnel peut être limité au portrait, un accès parent peut exclure
le volet financier. Ce n'est jamais un simple binaire lecture/écriture global.

### 2.5 Jamais de fait métier inventé

Aucun contenu affiché à l'utilisateur ne doit présenter comme acquis un fait
métier — montant, délai, autorité compétente, référence légale — qui n'a pas
été validé. Dans `lib/fiches.ts`, chaque fiche cite sa source et sa date de
vérification (`verifieLe`, `source`). Là où un fait n'est pas confirmé, le
texte doit dire `[À COMPLÉTER]`, jamais une valeur plausible. Cette règle
s'applique au contenu éditorial (fiches, textes du site public) autant qu'au
code.

### 2.6 Les questions de protection restent des questions

`questionProtection` (fiche "Transition à la majorité") présente des options
(aucune mesure, procuration, mandat pour cause d'inaptitude, curatelle
limitée) sans en recommander une. C'est un choix qui appartient à la famille
et à l'autorité, jamais une tâche à cocher ni une suggestion implicite de
l'outil.

---

## §3 — Stack technique

### 3.1 Réelle (maquette v0, à vérifier en détail à l'étape 1)

D'après `package.json` : Next 16.3.0, React 19, Tailwind 4.3.3 (CSS-first,
`@tailwindcss/postcss`, pas de `tailwind.config`), `shadcn` 4.8.0,
`@base-ui/react` 1.5.0, `lucide-react` 1.16.0. Aucune dépendance Supabase
présente pour l'instant — la maquette n'a pas de backend.

### 3.2 Visée **[À VALIDER — confirmer que ces choix tiennent toujours]**

- Backend : Supabase (Postgres + `@supabase/ssr` + RLS).
- Authentification : Supabase Auth.
- Modèle de données pivot : table `beneficiaire` (un dossier = une personne
  accompagnée) et table `acces` (qui peut voir quoi, sur quel dossier, avec
  quelles limites — reflet direct du modèle observé en §2.4).
- Politiques RLS écrites et testées **avant** de brancher le moindre écran de
  l'application sur des données réelles (voir §8).

L'étape 1 doit vérifier précisément la compatibilité de ces choix avec les
versions réelles ci-dessus (notamment Next 16 + `@supabase/ssr`, et
`shadcn` + `@base-ui/react` plutôt que Radix).

---

## §4 — Vocabulaire du produit

À respecter tel quel dans le code (noms de variables, routes) et dans tout
texte utilisateur — ne pas re-traduire ou paraphraser ces termes :

- **Dossier** — l'ensemble des informations concernant une personne accompagnée.
- **Titulaire** — la personne qui crée et gère les dossiers (le proche aidant).
- **Démarche** — une procédure administrative à mener (ex. "Renouvellement API").
- **Fiche** (de démarche) — le contenu éditorial expliquant une démarche : le
  moment où elle se déclenche, ce qui change, l'autorité compétente, les
  pièces à fournir, la durée, les recours, les erreurs fréquentes.
- **Délai légal** / **Jalon conseillé** — voir §2.2. Ne jamais utiliser
  "échéance" seul dans un texte utilisateur quand la nature (délai/jalon)
  peut être précisée.
- **Portrait** — le document en sept sections à la première personne (§2.3).
- **Intervenant** — une personne ou une organisation en lien avec le dossier
  (gestionnaire AI, enseignant référent, médecin, autorité).
- **Coffre** — l'espace de stockage des documents du dossier.

---

## §5 — Modèle de contenu éditorial (fiches de démarche)

Une fiche (`lib/fiches.ts`) contient toujours, dans cet ordre logique :
1. Le moment où la démarche se déclenche.
2. Ce qui change concrètement.
3. Qui décide (autorité compétente, avec sa spécificité cantonale).
4. Les pièces à fournir (en pointant vers un document déjà présent au coffre
   quand il existe).
5. La durée de traitement.
6. Ce qui se passe en cas de refus (voie de recours).
7. Les erreurs fréquentes à éviter.
8. Le cas échéant, une question de protection ouverte (§2.6).

Chaque fiche cite sa source et sa date de vérification. Une fiche jamais
vérifiée ne doit pas être publiée sans indication claire de son statut.

---

## §6 — Écrans cibles

État déjà construit dans `app/(app)/` (maquette, données fictives) :

| Route | Écran |
|---|---|
| `/` | Accueil du dossier actif |
| `/demarches`, `/demarches/[id]` | Liste et détail d'une démarche |
| `/documents`, `/documents/[id]` | Coffre de documents |
| `/rendez-vous`, `/rendez-vous/[id]` | Rendez-vous, questions et pièces à emporter |
| `/portrait` | Portrait en sept sections |
| `/intervenants` | Contacts liés au dossier |
| `/acces` | Accès et rôles — accès nommés et permanents |
| `/partage` | Lien de consultation temporaire (durée limitée, révocable) — complémentaire à `/acces`, pas un doublon : un accès nommé (§2.4) donne une visibilité durable à une personne identifiée, un lien de partage donne une visibilité ponctuelle à qui le reçoit. Intégré à la navigation (`navBas`, après "Accès et rôles"). |

Présents dans la navigation (`app-shell.tsx`) mais **pas encore construits** :

| Route | Écran |
|---|---|
| `/echeances` | Vue consolidée des échéances (délais + jalons, tous types) |
| `/reglages` | Réglages du compte |

Hors `app/(app)/`, à créer (voir prompt d'amorçage, étape 3) :

| Route | Écran |
|---|---|
| `/` (site public) | Page de présentation publique |

Structure d'URL retenue (voir prompt d'amorçage, étape 2) : groupes de routes
`app/(site)/` et `app/(app)/` sans préfixe visible dans l'URL — `/` sert la
page publique, les routes applicatives gardent leurs chemins actuels
(`/demarches`, `/documents`, etc.). Choisie plutôt qu'un préfixe `/app/*` ou
un sous-domaine séparé, pour ne pas devoir toucher aux liens internes déjà
écrits dans `app-shell.tsx` et parce que la racine indexable sert mieux le
SEO qu'un chemin préfixé. Le `noindex` sur `(app)` (via les métadonnées du
layout du groupe) est la seule protection d'indexation nécessaire.

Le composant `chronologie.tsx` (chronologie signature : aujourd'hui → futur,
mêlant délais, jalons et repères comme les anniversaires) est une pièce
centrale, à valoriser en priorité sur la page de présentation publique.

Le composant `capture-flow.tsx` (163 lignes, non encore audité en détail à ce
stade) gère vraisemblablement l'ajout d'un document ou d'une démarche — à
vérifier à l'étape 1.

### 6.1 Cohérence visuelle des tokens

`acces/page.tsx`, `intervenants/page.tsx` et `partage/page.tsx` utilisaient à
l'origine un vocabulaire de classes étranger à `globals.css`
(`text-ancre`, `bg-sauge`, `border-line`, `bg-surface`), y compris un titre de
page "— Le Fil" et un domaine `lefil.ch` — résidu d'une génération v0 pour un
autre produit, collée sans harmonisation. Corrigé : ces trois pages utilisent
maintenant exactement les tokens déclarés dans `globals.css` (`encre`,
`encre-2`, `sable-2`, `card`, `teal-100`, `teal-50`), la classe `.etiquette`
pour les petites légendes (jamais en majuscules, conformément à sa définition
dans `globals.css`), et le nom "Repères". Toute page future doit être vérifiée
contre `globals.css` avant d'être considérée terminée — aucune classe de
couleur qui n'y est pas déclarée.

---

## §7 — Sécurité et confidentialité **[À VALIDER dans son ensemble]**

Rien n'est tranché à ce stade sur : l'hébergement des données, qui peut y
accéder au niveau infrastructure, la politique de rétention/suppression, les
engagements de non-revente/non-exploitation publicitaire du contenu, les
modalités d'export d'un dossier. Toute page publique (voir §2.5) doit laisser
ces réponses en `[À COMPLÉTER]` tant qu'elles ne sont pas validées ici même.

---

## §8 — Ordre de construction

1. Authentification (Supabase Auth) et modèle `beneficiaire` / `acces` avec
   politiques RLS écrites et **testées**.
2. Séparation public / application (voir prompt d'amorçage, étape 2).
3. Page de présentation publique (étape 3).
4. Branchement progressif des écrans existants sur les données réelles,
   dossier par dossier, en respectant strictement §2 à chaque étape.
5. Écrans manquants (`/echeances`, `/reglages`) une fois le modèle de données
   réel en place.

Aucun écran de `(app)` ne doit être branché sur des données réelles avant que
l'étape 1 soit close.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
