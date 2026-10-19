# PROMPT — Étape serveur : synchronisation chiffrée chez Infomaniak

> À lancer dans Claude Code, sur une nouvelle branche, après fusion de la branche
> `prototype-coffre-chiffre`. Lis d'abord `CLAUDE.md` en entier, en particulier §2,
> §3.1.1, §3.2, §7 et §9. Tout écart avec ces sections est un bug.

## Contexte

Le prototype est fonctionnel et entièrement local. Chaque famille a un coffre
chiffré dans son navigateur (`lib/securite/`), avec phrase secrète, code de
secours, fichiers chiffrés, sauvegarde, effacement et mode dégradé. Il manque un
serveur pour : se connecter depuis plusieurs appareils, partager un dossier avec
un proche ou un professionnel, et encaisser l'abonnement.

Hébergement décidé : **Infomaniak, en Suisse**. Le serveur est **zéro
connaissance** : il stocke et redistribue des blocs chiffrés qu'il ne sait pas
lire.

## Ce que tu ne fais pas

- Tu ne déchiffres jamais rien côté serveur. Aucune route ne reçoit la phrase
  secrète, le code de secours ou une clé en clair.
- Tu n'ajoutes aucun service tiers appelé depuis le navigateur (mesure
  d'audience, police, script, suivi d'erreurs hébergé hors de Suisse) sans me
  demander. La CSP de `next.config.mjs` doit rester sans origine externe, sauf
  `connect-src` vers l'API si elle est sur un autre domaine.
- Tu ne modifies pas les écrans pour accéder au réseau : le branchement se fait
  dans `lib/securite/stockage.ts` (adaptateur) et `lib/store.tsx`.
- Tu ne remplis aucun `[À COMPLÉTER]` / `[À VÉRIFIER]` et tu ne touches pas au
  contenu des fiches et parcours.
- Tu ne retires pas le mode local : il reste le fonctionnement hors ligne.

## Étape 1 — Proposition d'architecture (aucun code)

Avant d'écrire du code, produis `docs/ARCHITECTURE-SERVEUR.md` et arrête-toi
pour validation. Il doit trancher, avec avantages et limites :

1. Offre Infomaniak visée (Jelastic Cloud, VPS, Public Cloud) et base de données
   (PostgreSQL managé ?). Région et localisation des données.
2. Authentification : bibliothèque retenue, compatible Next 16 (lis
   `node_modules/next/dist/docs/` avant de conclure). Le mot de passe de
   connexion est distinct de la phrase secrète du coffre ; dis s'il faut les
   fusionner plus tard (dérivation séparée type OPAQUE / SRP) et pourquoi.
3. Schéma : `comptes`, `beneficiaires` (avec `proprietaire_compte_id`),
   `acces` (rôle, périmètre, `depuis` / `jusqua`, révocation), `blocs`
   (état chiffré par dossier, version, horodatage), `fichiers` (blob chiffré),
   `cles_membres` (DEK du dossier enveloppée par la clé publique X25519 de
   chaque membre), `abonnements` (§9.2, adapté hors Supabase).
4. Contrôle d'accès : où et comment il est appliqué (requêtes paramétrées +
   vérification systématique dans un helper unique côté serveur), et la liste
   des tests qui le prouvent.
5. Passage d'une clé de coffre unique à une **clé par dossier** (nécessaire
   pour partager un dossier sans partager les autres) : plan de migration des
   coffres locaux existants.
6. Résolution des conflits entre appareils (version optimiste sur le bloc
   d'un dossier).
7. Stockage des fichiers chiffrés (Swiss Backup / stockage objet Infomaniak ?).
8. Sauvegardes serveur et délai d'effacement après suppression d'un compte.
9. Journalisation serveur : ce qui est journalisé (jamais de contenu), durée.

## Étape 2 — Implémentation (après validation)

Dans cet ordre, avec un commit par point :

1. Authentification et sessions (cookies `HttpOnly`, `Secure`,
   `SameSite=Lax`), protection CSRF, limitation de débit sur la connexion.
2. Schéma et migrations, contrôle d'accès, **tests du contrôle d'accès avant
   tout écran** : un invité limité au portrait ne reçoit aucun autre bloc ; un
   accès expiré ou révoqué ne reçoit plus rien ; un compte ne voit jamais le
   dossier d'un autre.
3. Clé par dossier et enveloppes X25519 (`@noble/curves`) pour les membres.
4. Adaptateur de synchronisation dans `lib/securite/stockage.ts` : pousse et
   récupère les mêmes blocs chiffrés qu'aujourd'hui. Hors ligne, l'application
   continue sur le coffre local.
5. Invitation d'un membre (`/acces`) et lien de consultation (`/partage`, clé
   dans le fragment `#`, expiration et révocation côté serveur).
6. Stripe (§9.3 à §9.9) : Checkout hébergé, webhook seul source de vérité,
   suppression du simulateur des réglages. Statut lu depuis le serveur.
7. Mise à jour de la page `/confidentialite` (faits techniques seulement) et de
   `CLAUDE.md` §3.2 et §7.

## Critères de fin

- `pnpm build` sans erreur de type (la vérification TypeScript est active).
- `python tests/e2e/coffre.py` vert, plus de nouveaux tests pour la
  synchronisation et le partage.
- Une capture des tables en base ne contient aucun nom, titre, date de
  naissance ou contenu de dossier lisible.
- `SUIVI.md` mis à jour : ce qui est fait, ce qui reste, les points `[À VALIDER]`.
