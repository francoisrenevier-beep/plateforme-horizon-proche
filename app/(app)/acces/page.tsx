'use client'

import { useState } from 'react'
import { Shield, Clock, Eye, X, Plus, Pencil } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { formatMoisAnnee, aujourdhuiISO, formatDateLongue } from '@/lib/dates'
import type { Acces } from '@/lib/demo-data'
import { Card } from '@/components/ui/card'
import { Modale, Champ, Entree, Selection, BoutonPrincipal, BoutonSecondaire, Pied, MessageErreur } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

const roleTons: Record<string, string> = {
  Titulaire: 'bg-teal-900 text-creme',
  Parent: 'bg-teal-100 text-teal-900',
  Proche: 'bg-teal-100 text-teal-900',
  Professionnel: 'bg-sable text-encre',
  Curateur: 'bg-sable text-encre',
}

const ROLES = ['Parent', 'Proche', 'Professionnel', 'Curateur']

// Périmètres proposés, en texte libre modifiable (CLAUDE.md §2.4 : jamais un binaire global).
const PERIMETRES = [
  'Tout le dossier, sauf le volet financier',
  'Le portrait seulement',
  'Le portrait et les rendez-vous',
  'Les documents d’une démarche seulement',
  'L’ensemble du dossier, y compris le volet financier',
]

export default function AccesPage() {
  const { personne, dossier, actions } = useDossier()
  const [ajout, setAjout] = useState(false)
  const [enEdition, setEnEdition] = useState<Acces | null>(null)
  const [retrait, setRetrait] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="etiquette">Dossier de {personne.prenom}</p>
        <h1 className="mt-1 font-serif text-[26px] text-teal-900">Accès et rôles</h1>
        <p className="mt-2 max-w-xl text-pretty leading-relaxed text-encre-2">
          Vous décidez qui voit quoi, et pour combien de temps. Chaque accès est limité et peut être retiré à tout moment.
          Personne n’est ajouté sans votre geste.
        </p>
      </header>

      {/* Principe de confiance, sobre */}
      <Card className="flex items-start gap-3 border-teal-700/25 bg-teal-50 p-4">
        <Shield className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
        <p className="text-sm leading-relaxed text-teal-900">
          Un accès ne donne jamais le droit d’agir à votre place. Il permet seulement de consulter la partie du dossier que
          vous avez choisi de partager. Être invité sur un dossier est gratuit.
        </p>
      </Card>

      <ul className="flex flex-col gap-3">
        {dossier.acces.map((a) => (
          <li key={a.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-creme font-serif text-lg text-encre ring-1 ring-sable-2">{a.nom.charAt(0)}</span>
                  <div>
                    <h3 className="font-medium text-encre">{a.nom}</h3>
                    <span className={cn('mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', roleTons[a.role] ?? 'bg-sable text-encre')}>{a.role}</span>
                  </div>
                </div>
                {a.role !== 'Titulaire' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setEnEdition(a)} className="inline-flex items-center gap-1.5 rounded-lg border border-sable-2 px-3 py-1.5 text-sm text-encre hover:bg-teal-50">
                      <Pencil className="size-3.5" aria-hidden />
                      Modifier
                    </button>
                    {retrait === a.id ? (
                      <span className="inline-flex items-center gap-2 text-sm">
                        Retirer l’accès de {a.nom} ?
                        <button type="button" onClick={() => { actions.retirerAcces(a.id); setRetrait(null) }} className="rounded-lg bg-rouille px-3 py-1.5 text-sm text-primary-foreground">
                          Oui
                        </button>
                        <button type="button" onClick={() => setRetrait(null)} className="rounded-lg border border-sable-2 px-3 py-1.5 text-sm">
                          Non
                        </button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setRetrait(a.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rouille/30 px-3 py-1.5 text-sm text-rouille transition-colors hover:bg-rouille/10">
                        <X className="size-3.5" aria-hidden />
                        Retirer l’accès
                      </button>
                    )}
                  </div>
                )}
              </div>

              <dl className="mt-4 grid gap-3 border-t border-sable-2 pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Eye className="mt-0.5 size-4 shrink-0 text-encre-2" aria-hidden />
                  <div>
                    <dt className="etiquette">Peut voir</dt>
                    <dd className="text-sm text-encre">{a.peutVoir}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0 text-encre-2" aria-hidden />
                  <div>
                    <dt className="etiquette">Durée</dt>
                    <dd className="text-sm text-encre">
                      depuis {a.depuis} · jusqu’à {a.jusqua}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setAjout(true)}
        className="w-full rounded-xl border border-dashed border-sable-2 py-4 text-sm text-encre-2 transition-colors hover:border-teal-700 hover:text-teal-900"
      >
        <Plus className="mr-1 inline size-4" aria-hidden />
        Inviter une personne à consulter une partie du dossier
      </button>

      <p className="etiquette">
        L’envoi effectif d’une invitation nécessitera un compte pour la personne invitée : cette partie n’est pas encore
        branchée. Les accès notés ici décrivent ce que vous avez décidé.
      </p>

      {(ajout || enEdition) && (
        <FormulaireAcces
          acces={enEdition ?? undefined}
          onClose={() => {
            setAjout(false)
            setEnEdition(null)
          }}
        />
      )}
    </div>
  )
}

function FormulaireAcces({ acces, onClose }: { acces?: Acces; onClose: () => void }) {
  const { actions } = useDossier()
  const [nom, setNom] = useState(acces?.nom ?? '')
  const [role, setRole] = useState(acces?.role ?? 'Proche')
  const [peutVoir, setPeutVoir] = useState(acces?.peutVoir ?? PERIMETRES[0])
  const [sansLimite, setSansLimite] = useState(!acces || acces.jusqua === 'sans limite')
  const [jusquaISO, setJusquaISO] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)

  const enregistrer = () => {
    if (!nom.trim()) return setErreur('Indiquez le nom de la personne.')
    if (!peutVoir.trim()) return setErreur('Décrivez ce que cette personne peut voir.')
    if (!sansLimite && !jusquaISO) return setErreur('Indiquez jusqu’à quand, ou choisissez « sans limite ».')
    const jusqua = sansLimite ? 'sans limite' : formatDateLongue(jusquaISO)
    if (acces) {
      actions.modifierAcces(acces.id, { nom: nom.trim(), role, peutVoir: peutVoir.trim(), jusqua })
    } else {
      actions.ajouterAcces({ nom: nom.trim(), role, peutVoir: peutVoir.trim(), depuis: formatMoisAnnee(aujourdhuiISO()), jusqua })
    }
    onClose()
  }

  return (
    <Modale titre={acces ? `Modifier l’accès de ${acces.nom}` : 'Inviter une personne'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erreur && <MessageErreur>{erreur}</MessageErreur>}
        <Champ label="Nom" htmlFor="a-nom" obligatoire>
          <Entree id="a-nom" value={nom} onChange={(e) => setNom(e.target.value)} autoFocus />
        </Champ>
        <Champ label="Rôle" htmlFor="a-role">
          <Selection id="a-role" value={role} onChange={(e) => setRole(e.target.value)}>
            {[...new Set([role, ...ROLES])].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Selection>
        </Champ>
        <Champ label="Ce que cette personne peut voir" htmlFor="a-voir" obligatoire aide="Choisissez une proposition ou décrivez le périmètre avec vos mots.">
          <div className="flex flex-wrap gap-1.5">
            {PERIMETRES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeutVoir(p)}
                className={cn('rounded-full border px-3 py-1 text-[13px]', peutVoir === p ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 hover:bg-teal-50')}
              >
                {p}
              </button>
            ))}
          </div>
          <Entree id="a-voir" value={peutVoir} onChange={(e) => setPeutVoir(e.target.value)} className="mt-1" />
        </Champ>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-[15px] font-medium text-encre">Jusqu’à quand</legend>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-[15px]">
              <input type="radio" name="a-limite" checked={sansLimite} onChange={() => setSansLimite(true)} />
              Sans limite
            </label>
            <label className="inline-flex items-center gap-2 text-[15px]">
              <input type="radio" name="a-limite" checked={!sansLimite} onChange={() => setSansLimite(false)} />
              Jusqu’au
            </label>
            <Entree type="date" value={jusquaISO} disabled={sansLimite} onChange={(e) => setJusquaISO(e.target.value)} aria-label="Date de fin d’accès" className="w-44" min={aujourdhuiISO()} />
          </div>
        </fieldset>
        <Pied>
          <BoutonSecondaire onClick={onClose}>Annuler</BoutonSecondaire>
          <BoutonPrincipal onClick={enregistrer}>{acces ? 'Enregistrer' : 'Accorder l’accès'}</BoutonPrincipal>
        </Pied>
      </div>
    </Modale>
  )
}
