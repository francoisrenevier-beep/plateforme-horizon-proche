'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import {
  changerPhrase,
  evaluerPhrase,
  ouvrirAvecPhrase,
  ouvrirAvecSecours,
  type Enveloppe,
} from '@/lib/securite/crypto'
import { ecrireEnveloppe, effacerToutLeCoffre, lireTentatives, noterEchec } from '@/lib/securite/stockage'
import { BoutonDiscret, BoutonPrincipal, BoutonSecondaire, Champ, Entree, MessageErreur } from '@/components/ui/formulaire'
import { IndicateurRobustesse } from '@/components/securite/creation-coffre'

// Après 5 essais manqués, une pause de 30 secondes entre deux essais. La vraie protection contre
// les essais en série reste le coût de dérivation de la clé (PBKDF2, 600 000 itérations).
const SEUIL_PAUSE = 5
const PAUSE_SECONDES = 30

type Mode = 'phrase' | 'secours' | 'effacer'

export function Deverrouillage({
  enveloppe,
  onOuvert,
  onEfface,
}: {
  enveloppe: Enveloppe
  onOuvert: (cle: CryptoKey, parSecours: boolean, enveloppeMiseAJour?: Enveloppe) => Promise<void>
  onEfface: () => void
}) {
  const [mode, setMode] = useState<Mode>('phrase')
  const [phrase, setPhrase] = useState('')
  const [voir, setVoir] = useState(false)
  const [code, setCode] = useState('')
  const [nouvelle, setNouvelle] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [confirmEffacer, setConfirmEffacer] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [occupe, setOccupe] = useState(false)
  const [echecs, setEchecs] = useState(0)
  const [pauseJusqua, setPauseJusqua] = useState(0)
  const [maintenant, setMaintenant] = useState(Date.now())

  useEffect(() => {
    void lireTentatives().then((t) => {
      setEchecs(t.echecs)
      if (t.echecs >= SEUIL_PAUSE && t.dernierEchec) setPauseJusqua(new Date(t.dernierEchec).getTime() + PAUSE_SECONDES * 1000)
    })
  }, [])

  useEffect(() => {
    if (pauseJusqua <= Date.now()) return
    const t = setInterval(() => setMaintenant(Date.now()), 500)
    return () => clearInterval(t)
  }, [pauseJusqua])

  const resteSecondes = Math.max(0, Math.ceil((pauseJusqua - maintenant) / 1000))

  async function echec(message: string) {
    const t = await noterEchec()
    setEchecs(t.echecs)
    if (t.echecs >= SEUIL_PAUSE) {
      setPauseJusqua(Date.now() + PAUSE_SECONDES * 1000)
      setMaintenant(Date.now())
    }
    setErreur(message)
  }

  async function soumettrePhrase(e: FormEvent) {
    e.preventDefault()
    if (!phrase || resteSecondes > 0) return
    setOccupe(true)
    setErreur(null)
    try {
      const cle = await ouvrirAvecPhrase(enveloppe, phrase)
      if (!cle) return await echec('Cette phrase secrète ne correspond pas. Vérifiez les majuscules et les espaces.')
      setPhrase('')
      await onOuvert(cle, false)
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Ouverture impossible.')
    } finally {
      setOccupe(false)
    }
  }

  const robustesse = evaluerPhrase(nouvelle)

  async function soumettreSecours(e: FormEvent) {
    e.preventDefault()
    if (resteSecondes > 0) return
    if (!robustesse.acceptable) return setErreur(robustesse.message)
    if (nouvelle !== confirmation) return setErreur('Les deux saisies de la nouvelle phrase secrète ne sont pas identiques.')
    setOccupe(true)
    setErreur(null)
    try {
      const cle = await ouvrirAvecSecours(enveloppe, code)
      if (!cle) return await echec('Ce code de secours ne correspond pas.')
      const suivante = await changerPhrase(enveloppe, cle, nouvelle)
      await ecrireEnveloppe(suivante)
      await onOuvert(cle, true, suivante)
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Ouverture impossible.')
    } finally {
      setOccupe(false)
    }
  }

  async function effacer() {
    setOccupe(true)
    await effacerToutLeCoffre()
    setOccupe(false)
    onEfface()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 font-serif text-teal-900">H</span>
          <span className="font-serif text-xl text-teal-900">Horizon Proche</span>
        </div>

        <div className="rounded-xl border border-sable-2 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          {mode === 'phrase' && (
            <form onSubmit={soumettrePhrase} className="flex flex-col gap-5">
              <div>
                <h1 className="flex items-center gap-2 font-serif text-[24px] text-teal-900">
                  <LockKeyhole className="size-5" aria-hidden />
                  Votre coffre est verrouillé
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
                  Saisissez votre phrase secrète. Elle déchiffre vos dossiers sur cet appareil et n’est envoyée nulle part.
                </p>
              </div>
              {erreur && <MessageErreur>{erreur}</MessageErreur>}
              <Champ label="Phrase secrète" htmlFor="v-phrase">
                <div className="relative">
                  <Entree
                    id="v-phrase"
                    type={voir ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    autoFocus
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setVoir((v) => !v)}
                    aria-label={voir ? 'Masquer la phrase secrète' : 'Afficher la phrase secrète'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-encre-2 hover:text-teal-700"
                  >
                    {voir ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  </button>
                </div>
              </Champ>
              {resteSecondes > 0 && (
                <p className="etiquette" aria-live="polite">
                  Plusieurs essais manqués. Vous pourrez réessayer dans {resteSecondes} s.
                </p>
              )}
              <BoutonPrincipal type="submit" disabled={occupe || !phrase || resteSecondes > 0}>
                {occupe ? 'Déchiffrement…' : 'Ouvrir mon coffre'}
              </BoutonPrincipal>
              <div className="flex flex-col items-start gap-2 border-t border-sable-2 pt-4">
                <BoutonDiscret onClick={() => { setMode('secours'); setErreur(null) }}>
                  <KeyRound className="size-3.5" aria-hidden />
                  Phrase secrète oubliée ? Utiliser le code de secours
                </BoutonDiscret>
                <BoutonDiscret onClick={() => { setMode('effacer'); setErreur(null) }}>Ce n’est pas mon coffre, ou je veux repartir de zéro</BoutonDiscret>
              </div>
              {echecs > 0 && resteSecondes === 0 && (
                <p className="etiquette">
                  {echecs} essai{echecs > 1 ? 's' : ''} manqué{echecs > 1 ? 's' : ''} depuis la dernière ouverture.
                </p>
              )}
            </form>
          )}

          {mode === 'secours' && (
            <form onSubmit={soumettreSecours} className="flex flex-col gap-5">
              <div>
                <h1 className="font-serif text-[24px] text-teal-900">Ouvrir avec le code de secours</h1>
                <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
                  Le code de 24 caractères remis à la création du coffre. Vous choisissez ensuite une nouvelle phrase secrète ; vos données restent intactes.
                </p>
              </div>
              {erreur && <MessageErreur>{erreur}</MessageErreur>}
              <Champ label="Code de secours" htmlFor="v-code" aide="Les tirets et les espaces sont facultatifs.">
                <Entree id="v-code" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" spellCheck={false} className="font-mono tracking-wider" autoFocus />
              </Champ>
              <Champ label="Nouvelle phrase secrète" htmlFor="v-nouvelle">
                <Entree id="v-nouvelle" type="password" autoComplete="new-password" value={nouvelle} onChange={(e) => setNouvelle(e.target.value)} />
              </Champ>
              {nouvelle && <IndicateurRobustesse robustesse={robustesse} />}
              <Champ label="Confirmez la nouvelle phrase" htmlFor="v-confirm">
                <Entree id="v-confirm" type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
              </Champ>
              <BoutonPrincipal type="submit" disabled={occupe || !code || !nouvelle || resteSecondes > 0}>
                {occupe ? 'Vérification…' : 'Ouvrir et remplacer la phrase secrète'}
              </BoutonPrincipal>
              <BoutonSecondaire onClick={() => { setMode('phrase'); setErreur(null) }}>Retour</BoutonSecondaire>
            </form>
          )}

          {mode === 'effacer' && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-serif text-[24px] text-teal-900">Effacer ce coffre</h1>
                <p className="mt-2 text-[15px] leading-relaxed text-encre-2">
                  Tous les dossiers et fichiers enregistrés dans ce navigateur seront supprimés définitivement. Sans phrase secrète ni code de secours, personne ne peut les récupérer, Horizon Proche non plus.
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-encre-2">Si vous avez une sauvegarde, vous pourrez la restaurer ensuite.</p>
              </div>
              <Champ label="Pour confirmer, tapez EFFACER" htmlFor="v-effacer">
                <Entree id="v-effacer" value={confirmEffacer} onChange={(e) => setConfirmEffacer(e.target.value)} autoComplete="off" />
              </Champ>
              <button
                type="button"
                disabled={confirmEffacer.trim().toUpperCase() !== 'EFFACER' || occupe}
                onClick={effacer}
                className="inline-flex h-11 items-center justify-center rounded-md bg-rouille px-5 text-[15px] font-medium text-primary-foreground disabled:opacity-50"
              >
                Effacer définitivement
              </button>
              <BoutonSecondaire onClick={() => setMode('phrase')}>Annuler</BoutonSecondaire>
            </div>
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-encre-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
          Vos dossiers sont chiffrés sur cet appareil. Le coffre se referme seul après une période d’inactivité.
        </p>
      </div>
    </div>
  )
}
