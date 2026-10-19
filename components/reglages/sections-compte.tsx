'use client'

// Réglages du compte : abonnement (§9), sécurité du coffre (§7) et droits sur les données.

import { useState } from 'react'
import Link from 'next/link'
import { Download, FileLock2, KeyRound, LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react'
import { useDossier, LIMITE_DOSSIERS } from '@/lib/store'
import { abonnementOuvert, DUREE_ESSAI_JOURS, finEssai, joursEssaiRestants, libelleStatut, type StatutAbonnement } from '@/lib/compte'
import { evaluerPhrase, ITERATIONS_PBKDF2 } from '@/lib/securite/crypto'
import { formatDateLongue, formatRelatif } from '@/lib/dates'
import { Card, CardTitle } from '@/components/ui/card'
import { BoutonPrincipal, BoutonSecondaire, Champ, Entree, MessageErreur, Selection } from '@/components/ui/formulaire'
import { useSecurite, telechargerBlob } from '@/components/securite/contexte-securite'
import { IndicateurRobustesse } from '@/components/securite/creation-coffre'
import { cn } from '@/lib/utils'

function isoJour(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function SectionAbonnement() {
  const { compte, actionsCompte } = useDossier()
  const ouvert = abonnementOuvert(compte)
  const { statut } = compte.abonnement
  const jours = joursEssaiRestants(compte)

  const simulations: { libelle: string; statut: StatutAbonnement; decalageJours?: number }[] = [
    { libelle: 'Essai en cours', statut: 'trialing', decalageJours: 0 },
    { libelle: 'Essai expiré', statut: 'trialing', decalageJours: DUREE_ESSAI_JOURS + 1 },
    { libelle: 'Abonnement actif', statut: 'active' },
    { libelle: 'Paiement en échec', statut: 'past_due' },
    { libelle: 'Abonnement terminé', statut: 'canceled' },
  ]

  return (
    <Card id="abonnement" className="scroll-mt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle>Abonnement</CardTitle>
        <span className={cn('rounded-full px-3 py-1 text-[13px]', ouvert ? 'bg-teal-100 text-teal-900' : 'bg-rouille/10 text-rouille')}>
          {statut === 'trialing' && !ouvert ? 'Essai terminé' : libelleStatut[statut]}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-[15px] leading-relaxed text-encre">
        {statut === 'trialing' && ouvert && (
          <p>
            Essai gratuit jusqu’au {formatDateLongue(isoJour(finEssai(compte)))}, soit encore {jours} jour{jours > 1 ? 's' : ''}. Aucune carte bancaire n’a été demandée.
          </p>
        )}
        {!ouvert && (
          <p>
            Vos dossiers restent consultables et exportables. Les modifications, l’ajout de documents et le partage reprendront dès la réactivation.
          </p>
        )}
        <ul className="mt-1 list-disc pl-5 text-encre-2">
          <li>Jusqu’à {LIMITE_DOSSIERS} personnes accompagnées par abonnement. Un dossier archivé ne compte plus.</li>
          <li>Les proches et professionnels que vous invitez n’ont rien à payer.</li>
          <li>Prix mensuel : [À COMPLÉTER]. Prix affichés toutes taxes comprises, en francs suisses.</li>
          <li>Paiement sur la page sécurisée de Stripe : aucune donnée de carte ne passe par Horizon Proche. La facture porte votre nom, jamais celui de la personne accompagnée.</li>
          <li>Sans abonnement, vous gardez toujours l’accès en lecture et l’export de vos documents.</li>
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <BoutonPrincipal disabled title="Le paiement sera branché avec le serveur">
          {statut === 'active' ? 'Gérer mon abonnement' : 'S’abonner'}
        </BoutonPrincipal>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-sable-2 p-4">
        <p className="text-[14px] font-medium text-encre">Simulateur du prototype</p>
        <p className="etiquette mt-1">
          Pour tester chaque situation. En production, seul le retour de Stripe pourra changer le statut.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {simulations.map((s) => (
            <button
              key={s.libelle}
              type="button"
              onClick={() => {
                const debut = s.decalageJours === undefined ? undefined : new Date(Date.now() - s.decalageJours * 86_400_000).toISOString()
                actionsCompte.simulerStatut(s.statut, debut)
              }}
              className="rounded-full border border-sable-2 px-3 py-1.5 text-[13px] text-encre hover:bg-teal-50"
            >
              {s.libelle}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function SectionSecurite() {
  const { compte, actionsCompte } = useDossier()
  const securite = useSecurite()
  const [mode, setMode] = useState<'aucun' | 'phrase' | 'code'>('aucun')
  const [actuelle, setActuelle] = useState('')
  const [nouvelle, setNouvelle] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [succes, setSucces] = useState<string | null>(null)
  const [nouveauCode, setNouveauCode] = useState<string | null>(null)
  const [occupe, setOccupe] = useState(false)
  const robustesse = evaluerPhrase(nouvelle)

  function fermer() {
    setMode('aucun')
    setActuelle('')
    setNouvelle('')
    setConfirmation('')
    setErreur(null)
  }

  async function changerPhrase() {
    if (!robustesse.acceptable) return setErreur(robustesse.message)
    if (nouvelle !== confirmation) return setErreur('Les deux saisies ne sont pas identiques.')
    setOccupe(true)
    const ok = await securite.changerPhrase(actuelle, nouvelle)
    setOccupe(false)
    if (!ok) return setErreur('La phrase secrète actuelle ne correspond pas.')
    actionsCompte.noterSecurite('Phrase secrète modifiée')
    fermer()
    setSucces('Phrase secrète modifiée. Utilisez-la dès la prochaine ouverture.')
  }

  async function regenerer() {
    setOccupe(true)
    const code = await securite.regenererCodeSecours(actuelle)
    setOccupe(false)
    if (!code) return setErreur('La phrase secrète ne correspond pas.')
    actionsCompte.noterSecurite('Nouveau code de secours créé (l’ancien ne fonctionne plus)')
    fermer()
    setNouveauCode(code)
  }

  return (
    <Card id="securite" className="scroll-mt-6">
      <CardTitle>Sécurité du coffre</CardTitle>
      <p className="mt-2 flex items-start gap-2 text-[15px] leading-relaxed text-encre-2">
        <ShieldCheck className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden />
        Vos dossiers et vos fichiers sont chiffrés sur cet appareil (AES-256-GCM, clé tirée de votre phrase secrète par {ITERATIONS_PBKDF2.toLocaleString('fr-CH')} itérations PBKDF2). Sans votre phrase secrète ou votre code de secours, personne ne peut les lire.
      </p>

      {succes && <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-[15px] text-teal-900" role="status">{succes}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Champ label="Verrouillage automatique" htmlFor="s-verrou" aide="Le coffre se referme après ce délai sans activité.">
          <Selection
            id="s-verrou"
            value={compte.securite.verrouillageMinutes}
            onChange={(e) => actionsCompte.setVerrouillage(Number(e.target.value) as 5 | 15 | 30)}
          >
            <option value={5}>Après 5 minutes</option>
            <option value={15}>Après 15 minutes</option>
            <option value={30}>Après 30 minutes</option>
          </Selection>
        </Champ>
        <BoutonSecondaire onClick={securite.verrouiller}>
          <LockKeyhole className="size-4" aria-hidden />
          Verrouiller maintenant
        </BoutonSecondaire>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-sable-2 pt-5">
        <BoutonSecondaire onClick={() => { fermer(); setSucces(null); setNouveauCode(null); setMode('phrase') }}>
          <KeyRound className="size-4" aria-hidden />
          Changer la phrase secrète
        </BoutonSecondaire>
        <BoutonSecondaire onClick={() => { fermer(); setSucces(null); setNouveauCode(null); setMode('code') }}>
          <FileLock2 className="size-4" aria-hidden />
          Créer un nouveau code de secours
        </BoutonSecondaire>
      </div>

      {mode !== 'aucun' && (
        <div className="mt-4 flex flex-col gap-4 rounded-lg bg-sable p-4">
          {erreur && <MessageErreur>{erreur}</MessageErreur>}
          <Champ label="Phrase secrète actuelle" htmlFor="s-actuelle">
            <Entree id="s-actuelle" type="password" autoComplete="current-password" value={actuelle} onChange={(e) => setActuelle(e.target.value)} />
          </Champ>
          {mode === 'phrase' && (
            <>
              <Champ label="Nouvelle phrase secrète" htmlFor="s-nouvelle">
                <Entree id="s-nouvelle" type="password" autoComplete="new-password" value={nouvelle} onChange={(e) => setNouvelle(e.target.value)} />
              </Champ>
              {nouvelle && <IndicateurRobustesse robustesse={robustesse} />}
              <Champ label="Confirmez-la" htmlFor="s-confirm">
                <Entree id="s-confirm" type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
              </Champ>
            </>
          )}
          {mode === 'code' && <p className="etiquette">L’ancien code de secours cessera immédiatement de fonctionner.</p>}
          <div className="flex justify-end gap-2">
            <BoutonSecondaire onClick={fermer}>Annuler</BoutonSecondaire>
            <BoutonPrincipal onClick={mode === 'phrase' ? changerPhrase : regenerer} disabled={occupe || !actuelle}>
              {occupe ? 'Vérification…' : mode === 'phrase' ? 'Enregistrer' : 'Créer le code'}
            </BoutonPrincipal>
          </div>
        </div>
      )}

      {nouveauCode && (
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-teal-700/25 bg-teal-50 p-4" role="status">
          <p className="text-[15px] text-encre">Votre nouveau code de secours. Il ne sera plus affiché.</p>
          <p className="select-all rounded-md bg-card px-3 py-3 text-center font-mono text-[18px] tracking-[0.12em] text-encre">{nouveauCode}</p>
          <div className="flex gap-2">
            <BoutonSecondaire
              onClick={() =>
                telechargerBlob(new Blob([`Horizon Proche — code de secours\n\n${nouveauCode}\n`], { type: 'text/plain' }), 'horizon-proche-code-de-secours.txt')
              }
            >
              <Download className="size-4" aria-hidden />
              Télécharger
            </BoutonSecondaire>
            <BoutonSecondaire onClick={() => setNouveauCode(null)}>Je l’ai conservé</BoutonSecondaire>
          </div>
        </div>
      )}

      <details className="mt-5 border-t border-sable-2 pt-4">
        <summary className="cursor-pointer text-[15px] text-teal-700">Journal de sécurité ({compte.securite.journal.length})</summary>
        <p className="etiquette mt-2">Ouvertures, changements de secrets, exports et téléchargements. Ce journal est chiffré avec le reste du coffre.</p>
        <ul className="mt-3 flex flex-col divide-y divide-sable-2">
          {compte.securite.journal.slice(0, 30).map((e) => (
            <li key={e.id} className="flex flex-wrap justify-between gap-2 py-2 text-[14px]">
              <span className="text-encre">{e.texte}</span>
              <span className="text-encre-2">{formatRelatif(e.quand)}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-5 border-t border-sable-2 pt-4 text-[14px] leading-relaxed text-encre-2">
        Accord pour les données sensibles donné le {formatDateLongue(compte.consentement.donneesSensiblesLe.slice(0, 10))} (politique du{' '}
        {formatDateLongue(compte.consentement.versionPolitique)}).{' '}
        <Link href="/confidentialite" target="_blank" className="text-teal-700 underline">
          Politique de confidentialité
        </Link>
        . Vous pouvez retirer cet accord à tout moment en supprimant vos données ci-dessous.
      </div>
    </Card>
  )
}

export function SectionDonnees() {
  const { actions, actionsCompte } = useDossier()
  const securite = useSecurite()
  const [reinit, setReinit] = useState(false)
  const [effacement, setEffacement] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [occupe, setOccupe] = useState(false)

  function exporterClair() {
    const json = actions.exporterJSON()
    telechargerBlob(new Blob([json], { type: 'application/json' }), `horizon-proche-export-${new Date().toISOString().slice(0, 10)}.json`)
    actionsCompte.noterSecurite('Export lisible de tous les dossiers')
  }

  async function sauvegarder() {
    setOccupe(true)
    try {
      actionsCompte.noterSecurite('Sauvegarde chiffrée téléchargée')
      await securite.telechargerSauvegarde()
    } finally {
      setOccupe(false)
    }
  }

  return (
    <Card>
      <CardTitle>Vos données</CardTitle>
      <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
        Elles vous appartiennent. Vous pouvez à tout moment en obtenir une copie, les emporter ailleurs ou les effacer.
        {securite.derniereEcriture && <> Dernier enregistrement chiffré {formatRelatif(securite.derniereEcriture.toISOString())}.</>}
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-encre">Sauvegarde chiffrée</p>
            <p className="etiquette">Recommandé. Tous les dossiers et fichiers, illisibles sans votre phrase secrète. Se restaure sur un autre appareil.</p>
          </div>
          <BoutonPrincipal onClick={sauvegarder} disabled={occupe} className="shrink-0">
            <FileLock2 className="size-4" aria-hidden />
            Télécharger la sauvegarde
          </BoutonPrincipal>
        </div>
        <div className="flex flex-col gap-2 border-t border-sable-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-encre">Export lisible</p>
            <p className="etiquette">Toutes les informations saisies, en clair (JSON), sans les fichiers. À ranger en lieu sûr : ce fichier n’est pas protégé.</p>
          </div>
          <BoutonSecondaire onClick={exporterClair} className="shrink-0">
            <Download className="size-4" aria-hidden />
            Exporter (JSON)
          </BoutonSecondaire>
        </div>
        <div className="flex flex-col gap-2 border-t border-sable-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-encre">Données de démonstration</p>
            <p className="etiquette">Revenir aux dossiers fictifs de Noah et Madeleine. Vos saisies seront remplacées.</p>
          </div>
          {reinit ? (
            <span className="flex shrink-0 gap-2">
              <button type="button" onClick={() => { actions.reinitialiser(); setReinit(false) }} className="inline-flex h-11 items-center rounded-md bg-rouille px-4 text-[15px] font-medium text-primary-foreground">
                Remplacer
              </button>
              <BoutonSecondaire onClick={() => setReinit(false)}>Non</BoutonSecondaire>
            </span>
          ) : (
            <BoutonSecondaire onClick={() => setReinit(true)} className="shrink-0">
              Réinitialiser
            </BoutonSecondaire>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-sable-2 pt-4">
          <div>
            <p className="text-[15px] font-medium text-encre">Supprimer toutes mes données</p>
            <p className="etiquette">
              Efface définitivement le coffre de cet appareil : dossiers, fichiers, journal. Pensez à télécharger une sauvegarde avant.
            </p>
          </div>
          {effacement ? (
            <div className="flex flex-col gap-3 rounded-lg bg-rouille/10 p-4">
              <Champ label="Pour confirmer, tapez EFFACER" htmlFor="d-effacer">
                <Entree id="d-effacer" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="off" />
              </Champ>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={confirmation.trim().toUpperCase() !== 'EFFACER'}
                  onClick={() => void securite.effacerTout()}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-rouille px-4 text-[15px] font-medium text-primary-foreground disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden />
                  Tout effacer définitivement
                </button>
                <BoutonSecondaire onClick={() => { setEffacement(false); setConfirmation('') }}>Annuler</BoutonSecondaire>
              </div>
            </div>
          ) : (
            <BoutonSecondaire onClick={() => setEffacement(true)} className="self-start">
              <Trash2 className="size-4" aria-hidden />
              Supprimer toutes mes données
            </BoutonSecondaire>
          )}
        </div>
      </div>
    </Card>
  )
}
