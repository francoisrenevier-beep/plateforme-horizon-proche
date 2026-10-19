'use client'

// Première ouverture : information, consentement explicite, choix du point de départ,
// phrase secrète, code de secours. Rien n'est écrit sur l'appareil avant la dernière étape.

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Download, Eye, EyeOff, FileUp, LockKeyhole, Printer, ShieldCheck } from 'lucide-react'
import { creerEtatInitial, creerEtatVide, type Etat } from '@/lib/demo-data'
import { normaliser } from '@/lib/store'
import { nouveauCompte, VERSION_POLITIQUE } from '@/lib/compte'
import { evaluerPhrase, nouveauCodeSecours, type Robustesse } from '@/lib/securite/crypto'
import { CLE_ANCIENNE_EN_CLAIR, restaurerSauvegarde, type Sauvegarde } from '@/lib/securite/stockage'
import { estISOValide } from '@/lib/dates'
import { BoutonPrincipal, BoutonSecondaire, Champ, Entree, MessageErreur } from '@/components/ui/formulaire'
import { telechargerBlob } from '@/components/securite/contexte-securite'
import { cn } from '@/lib/utils'

type Depart = 'demo' | 'vide' | 'reprise'
const ETAPES = ['Bienvenue', 'Votre accord', 'Point de départ', 'Phrase secrète', 'Code de secours']

export function IndicateurRobustesse({ robustesse }: { robustesse: Robustesse }) {
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              robustesse.niveau > i ? (robustesse.niveau === 1 ? 'bg-rouille' : robustesse.niveau === 2 ? 'bg-ocre' : 'bg-teal-700') : 'bg-sable-2',
            )}
          />
        ))}
      </div>
      <p className={cn('text-[13px]', robustesse.acceptable ? 'text-encre-2' : 'text-rouille')}>{robustesse.message}</p>
    </div>
  )
}

function lireAncienEtat(): Etat | null {
  try {
    const brut = window.localStorage.getItem(CLE_ANCIENNE_EN_CLAIR)
    if (!brut) return null
    const parse = JSON.parse(brut) as Record<string, unknown>
    return normaliser({ ...parse, compte: nouveauCompte() })
  } catch {
    return null
  }
}

export function CreationCoffre({
  onCreer,
  onRestaure,
}: {
  onCreer: (etat: Etat, phrase: string, code: string) => Promise<void>
  onRestaure: () => Promise<void>
}) {
  const [etape, setEtape] = useState(0)
  const [erreur, setErreur] = useState<string | null>(null)
  const [occupe, setOccupe] = useState(false)

  // Accord
  const [accordSensible, setAccordSensible] = useState(false)
  const [accordLegitime, setAccordLegitime] = useState(false)

  // Départ
  const [ancien, setAncien] = useState<Etat | null>(null)
  const [depart, setDepart] = useState<Depart>('demo')
  const [tPrenom, setTPrenom] = useState('')
  const [tNom, setTNom] = useState('')
  const [tVille, setTVille] = useState('')
  const [pPrenom, setPPrenom] = useState('')
  const [pNom, setPNom] = useState('')
  const [pNaissance, setPNaissance] = useState('')
  const [pContexte, setPContexte] = useState('')

  // Secrets
  const [phrase, setPhrase] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [voir, setVoir] = useState(false)
  const code = useMemo(() => nouveauCodeSecours(), [])
  const [codeConserve, setCodeConserve] = useState(false)
  const [copie, setCopie] = useState(false)
  const robustesse = evaluerPhrase(phrase)
  const fichierRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const a = lireAncienEtat()
    if (a) {
      setAncien(a)
      setDepart('reprise')
    }
  }, [])

  function suivant() {
    setErreur(null)
    if (etape === 1 && !(accordSensible && accordLegitime)) return setErreur('Les deux accords sont nécessaires pour ouvrir un dossier.')
    if (etape === 2 && depart === 'vide') {
      if (!tPrenom.trim() || !pPrenom.trim()) return setErreur('Indiquez au moins votre prénom et celui de la personne accompagnée.')
      if (!estISOValide(pNaissance)) return setErreur('La date de naissance de la personne accompagnée est nécessaire : elle sert à calculer les étapes de son parcours.')
    }
    if (etape === 3) {
      if (!robustesse.acceptable) return setErreur(robustesse.message)
      if (phrase !== confirmation) return setErreur('Les deux saisies ne sont pas identiques.')
    }
    setEtape((e) => e + 1)
  }

  function etatDeDepart(): Etat {
    const maintenant = new Date().toISOString()
    let etat: Etat
    if (depart === 'reprise' && ancien) etat = ancien
    else if (depart === 'vide')
      etat = creerEtatVide(
        { prenom: tPrenom.trim(), nom: tNom.trim(), ville: tVille.trim(), canton: 'VD' },
        { prenom: pPrenom.trim(), nom: pNom.trim(), naissanceISO: pNaissance, contexte: pContexte.trim() },
      )
    else etat = creerEtatInitial()
    return {
      ...etat,
      compte: {
        ...etat.compte,
        consentement: { donneesSensiblesLe: maintenant, legitimiteLe: maintenant, versionPolitique: VERSION_POLITIQUE },
      },
    }
  }

  async function creer() {
    if (!codeConserve) return setErreur('Confirmez que vous avez mis le code de secours en lieu sûr.')
    setOccupe(true)
    setErreur(null)
    try {
      await onCreer(etatDeDepart(), phrase, code)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'La création du coffre a échoué.')
      setOccupe(false)
    }
  }

  async function restaurer(f: File | undefined) {
    if (!f) return
    setOccupe(true)
    setErreur(null)
    try {
      const s = JSON.parse(await f.text()) as Sauvegarde
      await restaurerSauvegarde(s)
      await onRestaure()
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Ce fichier ne peut pas être restauré.')
      setOccupe(false)
    }
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(code)
      setCopie(true)
      setTimeout(() => setCopie(false), 1500)
    } catch {
      // presse-papiers indisponible
    }
  }

  function imprimer() {
    const w = window.open('', '_blank', 'width=600,height=500')
    if (!w) return
    w.document.write(
      `<!doctype html><meta charset="utf-8"><title>Code de secours</title><body style="font-family:system-ui;padding:40px"><h1 style="font-size:20px">Horizon Proche — code de secours</h1><p>Ce code ouvre votre coffre si vous oubliez votre phrase secrète. Conservez-le avec vos papiers importants.</p><p style="font:24px monospace;letter-spacing:2px;border:1px solid #999;padding:16px;display:inline-block">${code}</p><p style="color:#666">Créé le ${new Date().toLocaleDateString('fr-CH')}</p><script>print()</script></body>`,
    )
    w.document.close()
  }

  return (
    <div className="flex min-h-screen justify-center bg-creme px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 font-serif text-teal-900">H</span>
          <span className="font-serif text-xl text-teal-900">Horizon Proche</span>
        </div>

        <ol className="mb-4 flex gap-1.5" aria-label="Étapes">
          {ETAPES.map((nom, i) => (
            <li key={nom} className="flex-1">
              <span className={cn('block h-1 rounded-full', i <= etape ? 'bg-teal-700' : 'bg-sable-2')} aria-hidden />
              <span className="sr-only">
                {nom}
                {i === etape ? ' (étape en cours)' : ''}
              </span>
            </li>
          ))}
        </ol>
        <p className="etiquette mb-3">
          Étape {etape + 1} sur {ETAPES.length} · {ETAPES[etape]}
        </p>

        <div className="rounded-xl border border-sable-2 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          {erreur && (
            <div className="mb-5">
              <MessageErreur>{erreur}</MessageErreur>
            </div>
          )}

          {etape === 0 && (
            <div className="flex flex-col gap-5">
              <h1 className="font-serif text-[26px] leading-tight text-teal-900">Un coffre pour les démarches de votre proche</h1>
              <p className="text-[15px] leading-relaxed text-encre-2">
                Avant de commencer, voici comment vos informations sont protégées. Elles concernent la santé et la vie d’une personne qui compte pour vous : elles méritent le plus grand soin.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ['Chiffré sur votre appareil', 'Tout ce que vous saisissez est chiffré avant d’être enregistré. Les fichiers aussi, un par un.'],
                  ['Vous seul·e avez la clé', 'Votre phrase secrète ne quitte jamais votre appareil. Personne ne peut lire vos dossiers sans elle, Horizon Proche non plus.'],
                  ['Rien n’est vendu ni analysé', 'Aucune publicité, aucun outil de mesure d’audience, aucune revente. Vous pouvez tout exporter ou tout effacer à tout moment.'],
                ].map(([titre, texte]) => (
                  <li key={titre} className="flex gap-3 rounded-lg bg-sable px-4 py-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
                    <span>
                      <span className="block text-[15px] font-medium text-encre">{titre}</span>
                      <span className="block text-[14px] leading-relaxed text-encre-2">{texte}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 sm:flex-row">
                <BoutonPrincipal onClick={suivant} className="flex-1">
                  Commencer
                </BoutonPrincipal>
                <BoutonSecondaire onClick={() => fichierRef.current?.click()} disabled={occupe}>
                  <FileUp className="size-4" aria-hidden />
                  Restaurer une sauvegarde
                </BoutonSecondaire>
                <input ref={fichierRef} type="file" accept=".hpcoffre,application/json" className="hidden" onChange={(e) => restaurer(e.target.files?.[0])} />
              </div>
            </div>
          )}

          {etape === 1 && (
            <div className="flex flex-col gap-5">
              <h1 className="font-serif text-[24px] text-teal-900">Votre accord</h1>
              <p className="text-[15px] leading-relaxed text-encre-2">
                Un dossier contient des informations sur la santé, le handicap ou la situation sociale d’une personne. Ce sont des données dites sensibles. Nous vous demandons donc un accord explicite, que vous pourrez retirer à tout moment en effaçant votre coffre.
              </p>
              <label className="flex cursor-pointer gap-3 rounded-lg border border-sable-2 p-4 hover:bg-teal-50">
                <input type="checkbox" checked={accordSensible} onChange={(e) => setAccordSensible(e.target.checked)} className="mt-1 size-4 accent-[var(--teal-700)]" />
                <span className="text-[15px] leading-relaxed text-encre">
                  J’accepte que les informations que je saisis, y compris des données de santé, soient enregistrées sous forme chiffrée pour organiser l’accompagnement.
                </span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-lg border border-sable-2 p-4 hover:bg-teal-50">
                <input type="checkbox" checked={accordLegitime} onChange={(e) => setAccordLegitime(e.target.checked)} className="mt-1 size-4 accent-[var(--teal-700)]" />
                <span className="text-[15px] leading-relaxed text-encre">
                  J’agis avec l’accord de la personne accompagnée, ou en tant que son représentant légal, ou parce qu’elle n’est pas en mesure de donner son avis et que je l’accompagne au quotidien.
                </span>
              </label>
              <p className="text-[14px] text-encre-2">
                Le détail figure dans la{' '}
                <Link href="/confidentialite" target="_blank" className="text-teal-700 underline">
                  politique de confidentialité
                </Link>
                .
              </p>
              <div className="flex gap-2">
                <BoutonSecondaire onClick={() => setEtape(0)}>Retour</BoutonSecondaire>
                <BoutonPrincipal onClick={suivant} className="flex-1" disabled={!(accordSensible && accordLegitime)}>
                  Continuer
                </BoutonPrincipal>
              </div>
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-5">
              <h1 className="font-serif text-[24px] text-teal-900">Par où commencer ?</h1>
              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Point de départ</legend>
                {ancien && (
                  <OptionDepart actif={depart === 'reprise'} onChoisir={() => setDepart('reprise')} titre="Reprendre les données déjà saisies dans ce navigateur">
                    Elles étaient enregistrées sans chiffrement. Elles seront chiffrées, puis la copie en clair sera effacée.
                  </OptionDepart>
                )}
                <OptionDepart actif={depart === 'demo'} onChoisir={() => setDepart('demo')} titre="Découvrir avec un exemple">
                  Deux dossiers fictifs (Noah, 16 ans, et Madeleine, 84 ans) pour explorer librement. Vous pourrez les remplacer par les vôtres.
                </OptionDepart>
                <OptionDepart actif={depart === 'vide'} onChoisir={() => setDepart('vide')} titre="Créer mon propre dossier">
                  Vous commencez avec la personne que vous accompagnez.
                </OptionDepart>
              </fieldset>

              {depart === 'vide' && (
                <div className="flex flex-col gap-4 border-t border-sable-2 pt-5">
                  <p className="etiquette">Vous</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ label="Prénom" htmlFor="c-tprenom" obligatoire>
                      <Entree id="c-tprenom" value={tPrenom} onChange={(e) => setTPrenom(e.target.value)} autoComplete="given-name" />
                    </Champ>
                    <Champ label="Nom" htmlFor="c-tnom">
                      <Entree id="c-tnom" value={tNom} onChange={(e) => setTNom(e.target.value)} autoComplete="family-name" />
                    </Champ>
                  </div>
                  <Champ label="Commune" htmlFor="c-tville">
                    <Entree id="c-tville" value={tVille} onChange={(e) => setTVille(e.target.value)} />
                  </Champ>
                  <p className="etiquette mt-2">La personne que vous accompagnez</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ label="Prénom" htmlFor="c-pprenom" obligatoire>
                      <Entree id="c-pprenom" value={pPrenom} onChange={(e) => setPPrenom(e.target.value)} />
                    </Champ>
                    <Champ label="Nom" htmlFor="c-pnom">
                      <Entree id="c-pnom" value={pNom} onChange={(e) => setPNom(e.target.value)} />
                    </Champ>
                  </div>
                  <Champ label="Date de naissance" htmlFor="c-pnaiss" obligatoire>
                    <Entree id="c-pnaiss" type="date" value={pNaissance} onChange={(e) => setPNaissance(e.target.value)} />
                  </Champ>
                  <Champ label="Situation en quelques mots" htmlFor="c-pctx" aide="Facultatif. N’indiquez que ce qui vous est utile.">
                    <Entree id="c-pctx" value={pContexte} onChange={(e) => setPContexte(e.target.value)} placeholder="Scolarisé en école spécialisée" />
                  </Champ>
                </div>
              )}

              <div className="flex gap-2">
                <BoutonSecondaire onClick={() => setEtape(1)}>Retour</BoutonSecondaire>
                <BoutonPrincipal onClick={suivant} className="flex-1">
                  Continuer
                </BoutonPrincipal>
              </div>
            </div>
          )}

          {etape === 3 && (
            <div className="flex flex-col gap-5">
              <h1 className="flex items-center gap-2 font-serif text-[24px] text-teal-900">
                <LockKeyhole className="size-5" aria-hidden />
                Votre phrase secrète
              </h1>
              <p className="text-[15px] leading-relaxed text-encre-2">
                C’est elle qui ferme le coffre. Choisissez une courte phrase dont vous vous souviendrez, par exemple quatre mots qui n’ont rien à voir entre eux. Nous ne pourrons jamais la retrouver pour vous.
              </p>
              <Champ label="Phrase secrète" htmlFor="c-phrase">
                <div className="relative">
                  <Entree id="c-phrase" type={voir ? 'text' : 'password'} autoComplete="new-password" value={phrase} onChange={(e) => setPhrase(e.target.value)} className="pr-12" autoFocus />
                  <button
                    type="button"
                    onClick={() => setVoir((v) => !v)}
                    aria-label={voir ? 'Masquer' : 'Afficher'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-encre-2 hover:text-teal-700"
                  >
                    {voir ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  </button>
                </div>
              </Champ>
              {phrase && <IndicateurRobustesse robustesse={robustesse} />}
              <Champ label="Confirmez-la" htmlFor="c-confirm">
                <Entree id="c-confirm" type={voir ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
              </Champ>
              <div className="flex gap-2">
                <BoutonSecondaire onClick={() => setEtape(2)}>Retour</BoutonSecondaire>
                <BoutonPrincipal onClick={suivant} className="flex-1" disabled={!phrase || !confirmation}>
                  Continuer
                </BoutonPrincipal>
              </div>
            </div>
          )}

          {etape === 4 && (
            <div className="flex flex-col gap-5">
              <h1 className="font-serif text-[24px] text-teal-900">Votre code de secours</h1>
              <p className="text-[15px] leading-relaxed text-encre-2">
                Si vous oubliez votre phrase secrète, ce code est le seul moyen de rouvrir le coffre. Imprimez-le ou notez-le, et rangez-le avec vos papiers importants. Il ne sera plus affiché.
              </p>
              <p className="select-all rounded-lg border border-sable-2 bg-sable px-4 py-5 text-center font-mono text-[19px] tracking-[0.12em] text-encre sm:text-[21px]">{code}</p>
              <div className="flex flex-wrap gap-2">
                <BoutonSecondaire onClick={copier}>
                  {copie ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copie ? 'Copié' : 'Copier'}
                </BoutonSecondaire>
                <BoutonSecondaire
                  onClick={() =>
                    telechargerBlob(
                      new Blob([`Horizon Proche — code de secours\n\n${code}\n\nCréé le ${new Date().toLocaleDateString('fr-CH')}. Conservez ce code avec vos papiers importants.\n`], { type: 'text/plain' }),
                      'horizon-proche-code-de-secours.txt',
                    )
                  }
                >
                  <Download className="size-4" aria-hidden />
                  Télécharger
                </BoutonSecondaire>
                <BoutonSecondaire onClick={imprimer}>
                  <Printer className="size-4" aria-hidden />
                  Imprimer
                </BoutonSecondaire>
              </div>
              <label className="flex cursor-pointer gap-3 rounded-lg border border-sable-2 p-4 hover:bg-teal-50">
                <input type="checkbox" checked={codeConserve} onChange={(e) => setCodeConserve(e.target.checked)} className="mt-1 size-4 accent-[var(--teal-700)]" />
                <span className="text-[15px] text-encre">J’ai mis ce code en lieu sûr.</span>
              </label>
              <div className="flex gap-2">
                <BoutonSecondaire onClick={() => setEtape(3)} disabled={occupe}>
                  Retour
                </BoutonSecondaire>
                <BoutonPrincipal onClick={creer} className="flex-1" disabled={!codeConserve || occupe}>
                  {occupe ? 'Chiffrement en cours…' : 'Ouvrir mon coffre'}
                </BoutonPrincipal>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OptionDepart({ actif, onChoisir, titre, children }: { actif: boolean; onChoisir: () => void; titre: string; children: React.ReactNode }) {
  return (
    <label className={cn('flex cursor-pointer gap-3 rounded-lg border p-4', actif ? 'border-teal-700 bg-teal-50' : 'border-sable-2 hover:bg-teal-50')}>
      <input type="radio" name="depart" checked={actif} onChange={onChoisir} className="mt-1 size-4 accent-[var(--teal-700)]" />
      <span>
        <span className="block text-[15px] font-medium text-encre">{titre}</span>
        <span className="block text-[14px] leading-relaxed text-encre-2">{children}</span>
      </span>
    </label>
  )
}
