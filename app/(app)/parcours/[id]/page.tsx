'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Flag,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Route,
  Pencil,
} from 'lucide-react'
import { useDossier, dateMajorite } from '@/lib/store'
import { parcours as catalogue, type EtapeParcours, type Source } from '@/lib/parcours'
import type { StatutEtape, SuiviEtape } from '@/lib/demo-data'
import { ajouterMois, aujourdhuiISO, formatDateLongue, formatMoisAnnee } from '@/lib/dates'
import { ZoneTexte, BoutonPrincipal, BoutonSecondaire } from '@/components/ui/formulaire'
import { cn } from '@/lib/utils'

export default function ParcoursDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const p = catalogue[id]
  if (!p) notFound()

  const { personne, dossier, actions } = useDossier()
  const suivi = dossier.parcours[p.id]
  const actif = !!suivi?.active
  const repere = p.repere === 'majorite' ? dateMajorite(personne.naissanceISO) : aujourdhuiISO()
  const auj = aujourdhuiISO()

  const toutes = p.phases.flatMap((ph) => ph.etapes)
  const concernees = toutes.filter((e) => (suivi?.etapes[e.id]?.statut ?? 'a-faire') !== 'pas-concerne')
  const faites = concernees.filter((e) => suivi?.etapes[e.id]?.statut === 'fait').length

  return (
    <div className="flex flex-col gap-8">
      <Link href="/parcours" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Tous les parcours
      </Link>

      <header className="border-b border-sable-2 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[26px] text-teal-900">{p.titre}</h1>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-[13px] text-teal-900">{p.canton}</span>
        </div>
        <p className="etiquette mt-1">{p.public}</p>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-encre">{p.resume}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {p.repere === 'majorite' && (
            <span className="text-[15px] text-encre">
              Repère : <span className="font-medium text-teal-900">{formatDateLongue(repere)}</span> — {personne.prenom} a 18 ans
            </span>
          )}
          {actif ? (
            <>
              <span className="etiquette">
                {faites} étape{faites > 1 ? 's' : ''} sur {concernees.length}
              </span>
              <button type="button" onClick={() => actions.activerParcours(p.id, false)} className="text-[13px] text-encre-2 hover:text-rouille">
                Ne plus suivre ce parcours
              </button>
            </>
          ) : (
            <BoutonPrincipal onClick={() => actions.activerParcours(p.id, true)} className="h-10">
              <Route className="size-4" aria-hidden />
              Suivre ce parcours pour {personne.prenom}
            </BoutonPrincipal>
          )}
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-lg bg-sable p-5">
        <Flag className="mt-0.5 size-5 shrink-0 text-ocre" aria-hidden />
        <p className="text-[15px] leading-relaxed text-encre">{p.avertissement}</p>
      </div>

      {/* Phases */}
      <ol className="flex flex-col gap-10">
        {p.phases.map((phase, i) => {
          const premiereDatee = phase.etapes.find((e) => e.moisParRapportAuRepere !== null)
          const datePhase = premiereDatee ? ajouterMois(repere, premiereDatee.moisParRapportAuRepere!) : null
          return (
            <li key={phase.id}>
              <div className="flex items-baseline gap-3">
                <span className="etiquette">{i + 1}.</span>
                <div>
                  <h2 className="font-serif text-[22px] text-teal-900">{phase.titre}</h2>
                  <p className="text-[15px] text-encre-2">
                    {phase.sousTitre}
                    {datePhase && (
                      <>
                        {' '}
                        · pour {personne.prenom} : vers {formatMoisAnnee(datePhase)}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {phase.etapes.map((etape) => (
                  <CarteEtape
                    key={etape.id}
                    etape={etape}
                    suivi={suivi?.etapes[etape.id]}
                    actif={actif}
                    repere={repere}
                    auj={auj}
                    prenom={personne.prenom}
                    onStatut={(s) => actions.setStatutEtape(p.id, etape.id, s)}
                    onNote={(n) => actions.setNoteEtape(p.id, etape.id, n)}
                  />
                ))}
              </div>
            </li>
          )
        })}
      </ol>

      {/* Ressources */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
        <h2 className="font-serif text-xl text-teal-900">Pour aller plus loin</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {p.ressources.map((r) => (
            <li key={r.titre} className="text-[15px] leading-relaxed text-encre">
              <span className="font-medium">{r.titre}</span> — {r.texte}{' '}
              {r.lien && (
                <a href={r.lien.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-teal-700 underline">
                  {r.lien.libelle}
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-sable p-6">
        <h2 className="font-serif text-lg text-teal-900">Ce que nous ne faisons pas</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-encre">
          Nous n’établissons pas de conseil juridique et ne décidons de rien à votre place. Ce parcours vous aide à ne rien
          oublier ; les choix restent les vôtres, ceux de {personne.prenom} et, le cas échéant, ceux de l’autorité.
        </p>
      </section>
    </div>
  )
}

function CarteEtape({
  etape,
  suivi,
  actif,
  repere,
  auj,
  prenom,
  onStatut,
  onNote,
}: {
  etape: EtapeParcours
  suivi?: SuiviEtape
  actif: boolean
  repere: string
  auj: string
  prenom: string
  onStatut: (s: StatutEtape) => void
  onNote: (n: string) => void
}) {
  const statut = suivi?.statut ?? 'a-faire'
  const [ouvert, setOuvert] = useState(statut === 'a-faire' && !!actif && etape.moisParRapportAuRepere !== null && ajouterMois(repere, etape.moisParRapportAuRepere) <= ajouterMois(auj, 3))
  const [noteEdit, setNoteEdit] = useState(false)
  const [note, setNote] = useState(suivi?.note ?? '')

  const dateISO = etape.moisParRapportAuRepere === null ? null : ajouterMois(repere, etape.moisParRapportAuRepere)
  const passe = dateISO !== null && dateISO < auj
  const question = !!etape.questionOuverte

  return (
    <article
      className={cn(
        'rounded-lg border bg-card shadow-[0_1px_3px_rgba(22,78,78,0.06)]',
        statut === 'fait' ? 'border-teal-100' : statut === 'pas-concerne' ? 'border-sable-2 opacity-60' : 'border-sable-2',
      )}
    >
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <span
          className={cn(
            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
            statut === 'fait' ? 'bg-teal-100 text-teal-900' : question ? 'bg-teal-50 text-teal-700' : 'bg-sable-2/60 text-ocre',
          )}
          aria-hidden
        >
          {statut === 'fait' ? <Check className="size-5" strokeWidth={2} /> : question ? <HelpCircle className="size-5" strokeWidth={1.75} /> : <Flag className="size-5" strokeWidth={1.75} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="etiquette block">
            {question ? 'Question ouverte' : 'Moment conseillé'} — {etape.quand}
            {dateISO && (
              <>
                {' '}
                · pour {prenom} : <span className={cn('font-medium', passe ? 'text-encre-2' : 'text-ocre')}>vers {formatMoisAnnee(dateISO)}</span>
                {passe && ' (moment passé)'}
              </>
            )}
          </span>
          <span className={cn('mt-0.5 block font-serif text-lg text-teal-900', statut === 'pas-concerne' && 'line-through')}>{etape.titre}</span>
          {etape.concerne && <span className="mt-1 block text-[13px] text-encre-2">{etape.concerne}</span>}
          {statut === 'fait' && suivi?.faitLe && <span className="etiquette mt-1 block text-teal-700">{question ? 'Discutée' : 'Faite'} le {formatDateLongue(suivi.faitLe)}</span>}
          {statut === 'pas-concerne' && <span className="etiquette mt-1 block">Vous avez indiqué que cette étape ne vous concerne pas.</span>}
        </span>
        <ChevronDown className={cn('mt-1 size-5 shrink-0 text-encre-2 transition-transform', ouvert && 'rotate-180')} aria-hidden />
      </button>

      {ouvert && (
        <div className="flex flex-col gap-5 border-t border-sable-2 px-5 py-5 sm:pl-[4.5rem]">
          <Section titre="Pourquoi">
            <p>{etape.pourquoi}</p>
          </Section>

          {question && (
            <div className="rounded-lg bg-teal-50 p-4 text-[15px] leading-relaxed text-encre">
              Cette étape est une question à instruire, pas une tâche à accomplir. Aucune option n’est recommandée ni
              cochée par avance.{' '}
              {etape.ficheId && (
                <Link href={`/demarches/${etape.ficheId}`} className="text-teal-700 underline">
                  Voir les options dans la fiche de démarche
                </Link>
              )}
            </div>
          )}

          <Section titre={question ? 'Comment l’aborder' : 'Ce qu’il y a à faire'}>
            <ul className="flex flex-col gap-2">
              {etape.aFaire.map((a) => (
                <li key={a} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Section>

          {etape.contacts && etape.contacts.length > 0 && (
            <Section titre="Vers qui se tourner">
              <ul className="flex flex-col divide-y divide-sable-2 rounded-lg border border-sable-2">
                {etape.contacts.map((c) => (
                  <li key={c.nom} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-2.5">
                    <span>
                      <span className="font-medium text-encre">{c.nom}</span>
                      <span className="etiquette block">{c.role}</span>
                    </span>
                    {c.lien && (
                      <a href={c.lien.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] text-teal-700 underline">
                        {c.lien.libelle}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {etape.pieces && etape.pieces.length > 0 && (
            <Section titre="Pièces utiles">
              <ul className="flex flex-col gap-1.5">
                {etape.pieces.map((pc) => (
                  <li key={pc} className="flex gap-3">
                    <FileText className="mt-1 size-4 shrink-0 text-encre-2" aria-hidden />
                    <span>{pc}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {etape.pointsAttention && etape.pointsAttention.length > 0 && (
            <div className="rounded-lg bg-sable p-4">
              <p className="etiquette mb-1 flex items-center gap-1.5">
                <AlertCircle className="size-3.5" aria-hidden />
                Points d’attention
              </p>
              <ul className="flex flex-col gap-1 text-[15px] leading-relaxed text-encre">
                {etape.pointsAttention.map((pa) => (
                  <li key={pa}>{pa}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {etape.ficheId && (
              <Link href={`/demarches/${etape.ficheId}`} className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
                <FileText className="size-4" aria-hidden />
                Fiche de démarche
              </Link>
            )}
            {etape.lienInterne && (
              <Link href={etape.lienInterne.href} className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
                {etape.lienInterne.libelle}
                <ExternalLink className="size-3.5" aria-hidden />
              </Link>
            )}
          </div>

          <Sources sources={etape.sources} />

          {/* Suivi par la famille */}
          <div className="flex flex-col gap-3 rounded-lg border border-sable-2 bg-creme/60 p-4">
            {actif ? (
              <>
                <p className="etiquette">Où en êtes-vous ?</p>
                <div className="flex flex-wrap gap-2">
                  <ChoixStatut actif={statut === 'a-faire'} onClick={() => onStatut('a-faire')}>
                    {question ? 'À discuter' : 'À faire'}
                  </ChoixStatut>
                  <ChoixStatut actif={statut === 'fait'} onClick={() => onStatut('fait')}>
                    <Check className="size-3.5" aria-hidden />
                    {question ? 'Nous en avons parlé' : 'Fait'}
                  </ChoixStatut>
                  <ChoixStatut actif={statut === 'pas-concerne'} onClick={() => onStatut('pas-concerne')}>
                    Pas concerné
                  </ChoixStatut>
                </div>
                {noteEdit ? (
                  <div className="flex flex-col gap-2">
                    <ZoneTexte rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ce qui a été dit, décidé, ou reste à clarifier…" aria-label="Note personnelle" />
                    <div className="flex justify-end gap-2">
                      <BoutonSecondaire className="h-10" onClick={() => { setNote(suivi?.note ?? ''); setNoteEdit(false) }}>Annuler</BoutonSecondaire>
                      <BoutonPrincipal className="h-10" onClick={() => { onNote(note.trim()); setNoteEdit(false) }}>Enregistrer la note</BoutonPrincipal>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    {suivi?.note ? <p className="whitespace-pre-line text-[15px] leading-relaxed text-encre">{suivi.note}</p> : <p className="text-[15px] text-encre-2">Aucune note.</p>}
                    <button type="button" onClick={() => setNoteEdit(true)} className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
                      <Pencil className="size-3.5" aria-hidden />
                      {suivi?.note ? 'Modifier la note' : 'Ajouter une note'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[15px] text-encre-2">Suivez ce parcours pour noter votre avancement et vos remarques sur chaque étape.</p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="etiquette mb-1.5">{titre}</h3>
      <div className="text-[15px] leading-relaxed text-encre">{children}</div>
    </section>
  )
}

function ChoixStatut({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-md border px-4 text-[15px] transition-colors',
        actif ? 'border-teal-700 bg-teal-100 text-teal-900' : 'border-sable-2 bg-card text-encre hover:bg-teal-50',
      )}
    >
      {children}
    </button>
  )
}

function Sources({ sources }: { sources: Source[] }) {
  return (
    <div className="rounded-lg border border-dashed border-sable-2 p-3">
      <p className="etiquette mb-1 flex items-center gap-1.5">
        <ShieldCheck className="size-3.5" aria-hidden />
        Sources
      </p>
      <ul className="flex flex-col gap-1">
        {sources.map((s) => (
          <li key={s.libelle} className="flex flex-wrap items-baseline gap-x-2 text-[13px] text-encre">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer" className="text-teal-700 underline">
                {s.libelle}
              </a>
            ) : (
              <span>{s.libelle}</span>
            )}
            <span className={cn('rounded-full px-2 py-0.5 text-[11px]', s.statut === 'verifiee' ? 'bg-teal-100 text-teal-900' : 'bg-sable text-encre-2')}>
              {s.statut === 'verifiee' ? `vérifiée${s.verifieLe ? ` le ${s.verifieLe}` : ''}` : 'à vérifier'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
