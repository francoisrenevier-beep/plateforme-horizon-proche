'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Flag,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  AlertCircle,
  HelpCircle,
  Plus,
  Pencil,
} from 'lucide-react'
import {
  useDossier,
  dateRepere,
  libelleRepere,
  avancementParcours,
  pertinenceParcours,
  documentPourPiece,
  piecesDuParcours,
  contactsDuParcours,
} from '@/lib/store'
import { parcours as catalogue, etapesDuParcours, CATEGORIES, type Parcours, type EtapeParcours } from '@/lib/parcours'
import type { Document, ParcoursSuivi, Personne, StatutEtape, SuiviEtape } from '@/lib/demo-data'
import { ajouterMois, aujourdhuiISO, formatDateLongue, formatMoisAnnee } from '@/lib/dates'
import { ZoneTexte, BoutonPrincipal, BoutonSecondaire, BoutonDiscret } from '@/components/ui/formulaire'
import { IconeDuParcours, BarreProgression } from '@/components/carte-parcours'
import { CaptureFlow } from '@/components/capture-flow'
import { LignePiece } from '@/components/ligne-piece'
import { cn } from '@/lib/utils'

// Une seule route pour deux moments : l'aperçu avant engagement (le parcours n'est pas suivi —
// la famille voit toutes les étapes et les pièces avant de décider) et le parcours actif
// (étapes en liste, une seule ouverte à la fois, cases à cocher, pièces et moments conseillés).

export default function ParcoursDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const p = catalogue[id]
  if (!p) notFound()

  const { personne, dossier, actions } = useDossier()
  const suivi = dossier.parcours[p.id]
  const actif = !!suivi?.active

  // `key` : l'état local (étape ouverte, notes en cours) repart de zéro quand on change de dossier.
  return actif ? (
    <ParcoursActif key={personne.id} p={p} personne={personne} suivi={suivi} documents={dossier.documents} />
  ) : (
    <Apercu key={personne.id} p={p} personne={personne} documents={dossier.documents} onAjouter={() => actions.activerParcours(p.id, true)} />
  )
}

// ---------------------------------------------------------------------------
// En-tête commun
// ---------------------------------------------------------------------------

function EnTete({ p, personne, children }: { p: Parcours; personne: Personne; children?: React.ReactNode }) {
  const categorie = CATEGORIES.find((c) => c.id === p.categorie)?.libelle
  const note = pertinenceParcours(p, personne)
  return (
    <header className="border-b border-sable-2 pb-6">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
          <IconeDuParcours icone={p.icone} className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-[26px] leading-tight text-teal-900">{p.titre}</h1>
          <p className="mt-1 text-[15px] text-encre-2">{p.positionnement}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categorie && <span className="rounded-full bg-teal-100 px-3 py-1 text-[13px] text-teal-900">{categorie}</span>}
            <span className="rounded-full bg-teal-50 px-3 py-1 text-[13px] text-teal-900">{p.canton}</span>
            {p.statut === 'provisoire' && <span className="rounded-full bg-sable px-3 py-1 text-[13px] text-encre-2">Provisoire</span>}
          </div>
        </div>
      </div>
      {children}
      {note && <p className="mt-4 rounded-md bg-sable px-3 py-2 text-[13px] text-encre">{note}</p>}
    </header>
  )
}

function Avertissement({ texte }: { texte: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-sable p-5">
      <Flag className="mt-0.5 size-5 shrink-0 text-ocre" aria-hidden />
      <p className="text-[15px] leading-relaxed text-encre">{texte}</p>
    </div>
  )
}

function Ressources({ p, prenom }: { p: Parcours; prenom: string }) {
  return (
    <>
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
          oublier ; les choix restent les vôtres, ceux de {prenom} et, le cas échéant, ceux de l’autorité.
        </p>
      </section>
    </>
  )
}

// ---------------------------------------------------------------------------
// Aperçu avant engagement
// ---------------------------------------------------------------------------

function Apercu({ p, personne, documents, onAjouter }: { p: Parcours; personne: Personne; documents: Document[]; onAjouter: () => void }) {
  const [ouvertId, setOuvertId] = useState<string | null>(null)
  const etapes = etapesDuParcours(p)
  const repere = dateRepere(p, personne)
  const nbJalons = etapes.filter((e) => e.genereJalon && e.moisParRapportAuRepere !== null).length
  const pieces = piecesDuParcours(p)
  const contacts = contactsDuParcours(p)
  const delaiConfirme = p.delaiRealiste.statut === 'verifiee'

  const boutonAjout = (
    <BoutonPrincipal onClick={onAjouter}>
      <Plus className="size-4" aria-hidden />
      Ajouter au dossier de {personne.prenom}
    </BoutonPrincipal>
  )

  return (
    <div className="flex flex-col gap-8">
      <Link href="/accueil" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Accueil
      </Link>

      <EnTete p={p} personne={personne}>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-encre">{p.resume}</p>
        <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
          <div>
            <dt className="etiquette">Étapes</dt>
            <dd className="text-[15px] text-encre">{etapes.length}</dd>
          </div>
          <div>
            <dt className="etiquette">Qui décide</dt>
            <dd className="text-[15px] text-encre">{p.autorite}</dd>
          </div>
          <div>
            <dt className="etiquette">Délai réaliste</dt>
            <dd className="text-[15px] text-encre">
              <span className="font-medium">{p.delaiRealiste.texte}</span>
              {!delaiConfirme && <span className="etiquette"> — à confirmer</span>}
            </dd>
          </div>
        </dl>
        <div className="mt-6">{boutonAjout}</div>
      </EnTete>

      <Avertissement texte={p.avertissement} />

      {/* Ce que l'ajout va produire — transparence sur §2.2 */}
      <div className="rounded-lg border border-sable-2 bg-card p-5 text-[15px] leading-relaxed text-encre">
        <p className="etiquette mb-1">Ce que ce parcours ajoutera au dossier</p>
        {nbJalons > 0 ? (
          <p>
            {nbJalons} moment{nbJalons > 1 ? 's' : ''} conseillé{nbJalons > 1 ? 's' : ''} dans l’agenda de {personne.prenom},{' '}
            {p.repere === 'activation'
              ? 'comptés à partir du jour où vous l’ajoutez'
              : `calculés à partir du repère « ${libelleRepere(p, personne)} » (${formatDateLongue(repere)})`}
            . Aucun délai légal : ceux-ci ne viennent que des courriers que vous recevez.
          </p>
        ) : (
          <p>Aucun moment dans l’agenda : ce parcours ne propose pas de calendrier, seulement des étapes à suivre.</p>
        )}
      </div>

      {/* Toutes les étapes */}
      <section aria-labelledby="titre-etapes">
        <h2 id="titre-etapes" className="font-serif text-xl text-teal-900">
          Les étapes, dans l’ordre
        </h2>
        <p className="mt-1 text-[15px] text-encre-2">Ouvrez une étape pour lire le pourquoi et ce qu’il y a à faire.</p>
        <ol className="mt-5 flex flex-col gap-8">
          {p.phases.map((phase, i) => (
            <li key={phase.id}>
              <PhaseEnTete index={i} titre={phase.titre} sousTitre={phase.sousTitre} etapes={phase.etapes} repere={repere} prenom={personne.prenom} apercu />
              <div className="mt-3 flex flex-col gap-2">
                {phase.etapes.map((etape) => (
                  <CarteEtape
                    key={etape.id}
                    etape={etape}
                    actif={false}
                    ouvert={ouvertId === etape.id}
                    onToggle={() => setOuvertId((v) => (v === etape.id ? null : etape.id))}
                    repere={repere}
                    prenom={personne.prenom}
                    documents={documents}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Pièces à réunir */}
      {pieces.length > 0 && (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]" aria-labelledby="titre-pieces">
          <h2 id="titre-pieces" className="font-serif text-xl text-teal-900">
            Pièces à réunir
          </h2>
          <p className="mt-1 text-[15px] text-encre-2">
            Ce que les étapes demanderont. Ce qui est déjà au coffre de {personne.prenom} est signalé.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {pieces.map((pc) => (
              <LignePiece key={pc} piece={pc} document={documentPourPiece(pc, documents)} />
            ))}
          </ul>
        </section>
      )}

      {/* Vers qui se tourner */}
      {contacts.length > 0 && (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]" aria-labelledby="titre-contacts">
          <h2 id="titre-contacts" className="font-serif text-xl text-teal-900">
            Vers qui se tourner
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-sable-2">
            {contacts.map((c) => (
              <li key={c.nom} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <span>
                  <span className="text-[15px] font-medium text-encre">{c.nom}</span>
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
        </section>
      )}

      <div className="flex flex-col items-start gap-3 rounded-lg bg-teal-50 p-6">
        <p className="text-[15px] leading-relaxed text-encre">
          Vous pouvez retirer ce parcours du dossier à tout moment ; votre avancement est conservé si vous le reprenez.
        </p>
        {boutonAjout}
      </div>

      <Ressources p={p} prenom={personne.prenom} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Parcours actif
// ---------------------------------------------------------------------------

function ParcoursActif({ p, personne, suivi, documents }: { p: Parcours; personne: Personne; suivi: ParcoursSuivi; documents: Document[] }) {
  const { actions } = useDossier()
  const repere = dateRepere(p, personne, suivi)
  const etapes = useMemo(() => etapesDuParcours(p), [p])
  const av = avancementParcours(p, suivi)
  const [retrait, setRetrait] = useState(false)

  // Une seule étape ouverte à la fois : par défaut, la première qui reste à faire.
  const premiereAFaire = etapes.find((e) => (suivi.etapes[e.id]?.statut ?? 'a-faire') === 'a-faire')?.id ?? null
  const [ouvertId, setOuvertId] = useState<string | null>(premiereAFaire)

  const changerStatut = (etape: EtapeParcours, statut: StatutEtape) => {
    actions.setStatutEtape(p.id, etape.id, statut)
    if (statut !== 'a-faire' && ouvertId === etape.id) {
      // Passer à la suivante encore à faire, pour garder le fil.
      const i = etapes.findIndex((e) => e.id === etape.id)
      const suivante = etapes.slice(i + 1).find((e) => (suivi.etapes[e.id]?.statut ?? 'a-faire') === 'a-faire')
      setOuvertId(suivante?.id ?? null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/accueil" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Accueil
      </Link>

      <EnTete p={p} personne={personne}>
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] text-encre">
              {av.faites} étape{av.faites > 1 ? 's' : ''} sur {av.total}
            </span>
            <span className="etiquette">{av.pourcent} %</span>
          </div>
          <BarreProgression faites={av.faites} total={av.total} className="mt-1.5" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-[15px] text-encre">
            Repère : <span className="font-medium text-teal-900">{formatDateLongue(repere)}</span> — {libelleRepere(p, personne)}
          </span>
          {suivi.activeLe && <span className="etiquette">Ajouté au dossier le {formatDateLongue(suivi.activeLe)}</span>}
          {retrait ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-encre-2">Retirer ce parcours du dossier ? L’avancement est conservé.</span>
              <BoutonSecondaire className="h-9" onClick={() => setRetrait(false)}>Annuler</BoutonSecondaire>
              <BoutonSecondaire className="h-9 text-rouille" onClick={() => actions.activerParcours(p.id, false)}>Retirer</BoutonSecondaire>
            </span>
          ) : (
            <BoutonDiscret onClick={() => setRetrait(true)} className="hover:text-rouille">Retirer du dossier</BoutonDiscret>
          )}
        </div>
      </EnTete>

      <Avertissement texte={p.avertissement} />

      <ol className="flex flex-col gap-8">
        {p.phases.map((phase, i) => (
          <li key={phase.id}>
            <PhaseEnTete index={i} titre={phase.titre} sousTitre={phase.sousTitre} etapes={phase.etapes} repere={repere} prenom={personne.prenom} />
            <div className="mt-3 flex flex-col gap-2">
              {phase.etapes.map((etape) => (
                <CarteEtape
                  key={etape.id}
                  etape={etape}
                  actif
                  suivi={suivi.etapes[etape.id]}
                  ouvert={ouvertId === etape.id}
                  onToggle={() => setOuvertId((v) => (v === etape.id ? null : etape.id))}
                  repere={repere}
                  prenom={personne.prenom}
                  documents={documents}
                  onStatut={(s) => changerStatut(etape, s)}
                  onNote={(n) => actions.setNoteEtape(p.id, etape.id, n)}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>

      <Ressources p={p} prenom={personne.prenom} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Briques
// ---------------------------------------------------------------------------

function PhaseEnTete({
  index,
  titre,
  sousTitre,
  etapes,
  repere,
  prenom,
  apercu,
}: {
  index: number
  titre: string
  sousTitre: string
  etapes: EtapeParcours[]
  repere: string
  prenom: string
  apercu?: boolean
}) {
  const premiereDatee = etapes.find((e) => e.moisParRapportAuRepere !== null)
  const datePhase = premiereDatee ? ajouterMois(repere, premiereDatee.moisParRapportAuRepere!) : null
  return (
    <div className="flex items-baseline gap-3">
      <span className="etiquette">{index + 1}.</span>
      <div>
        <h2 className="font-serif text-[22px] text-teal-900">{titre}</h2>
        <p className="text-[15px] text-encre-2">
          {sousTitre}
          {datePhase && (apercu ? <> · vers {formatMoisAnnee(datePhase)}</> : <> · pour {prenom} : vers {formatMoisAnnee(datePhase)}</>)}
        </p>
      </div>
    </div>
  )
}

function CarteEtape({
  etape,
  actif,
  suivi,
  ouvert,
  onToggle,
  repere,
  prenom,
  documents,
  onStatut,
  onNote,
}: {
  etape: EtapeParcours
  actif: boolean
  suivi?: SuiviEtape
  ouvert: boolean
  onToggle: () => void
  repere: string
  prenom: string
  documents: Document[]
  onStatut?: (s: StatutEtape) => void
  onNote?: (n: string) => void
}) {
  const statut = suivi?.statut ?? 'a-faire'
  const [noteEdit, setNoteEdit] = useState(false)
  const [note, setNote] = useState(suivi?.note ?? '')
  const [capture, setCapture] = useState<string | null>(null)

  const auj = aujourdhuiISO()
  const dateISO = etape.moisParRapportAuRepere === null ? null : ajouterMois(repere, etape.moisParRapportAuRepere)
  const passe = dateISO !== null && dateISO < auj
  const question = !!etape.questionOuverte
  const fait = statut === 'fait'

  return (
    <article
      className={cn(
        'rounded-lg border bg-card shadow-[0_1px_3px_rgba(22,78,78,0.06)]',
        fait ? 'border-teal-100' : statut === 'pas-concerne' ? 'border-sable-2 opacity-60' : 'border-sable-2',
      )}
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">
        {/* Case à cocher (parcours actif) ou icône (aperçu) */}
        {actif && onStatut ? (
          <span className="mt-1 flex shrink-0 items-center">
            <input
              type="checkbox"
              checked={fait}
              onChange={() => onStatut(fait ? 'a-faire' : 'fait')}
              className="size-5 cursor-pointer accent-teal-700"
              aria-label={question ? `Nous en avons parlé : ${etape.titre}` : `Fait : ${etape.titre}`}
            />
          </span>
        ) : (
          <span
            className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full', question ? 'bg-teal-50 text-teal-700' : 'bg-sable-2/60 text-ocre')}
            aria-hidden
          >
            {question ? <HelpCircle className="size-4" strokeWidth={1.75} /> : <Flag className="size-4" strokeWidth={1.75} />}
          </span>
        )}

        <button type="button" onClick={onToggle} aria-expanded={ouvert} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span className="min-w-0 flex-1">
            <span className="etiquette block">
              {question ? 'Question ouverte' : 'Moment conseillé'} — {etape.quand}
              {dateISO && (
                <>
                  {' '}
                  · {actif ? `pour ${prenom} : ` : ''}
                  <span className={cn('font-medium', passe ? 'text-encre-2' : 'text-ocre')}>vers {formatMoisAnnee(dateISO)}</span>
                  {passe && actif && ' (moment passé)'}
                </>
              )}
            </span>
            <span className={cn('mt-0.5 block font-serif text-lg leading-snug text-teal-900', statut === 'pas-concerne' && 'line-through', fait && 'text-teal-700')}>
              {etape.titre}
            </span>
            {etape.concerne && <span className="mt-1 block text-[13px] text-encre-2">{etape.concerne}</span>}
            {fait && suivi?.faitLe && <span className="etiquette mt-1 block text-teal-700">{question ? 'Discutée' : 'Faite'} le {formatDateLongue(suivi.faitLe)}</span>}
            {statut === 'pas-concerne' && <span className="etiquette mt-1 block">Vous avez indiqué que cette étape ne vous concerne pas.</span>}
          </span>
          <ChevronDown className={cn('mt-1 size-5 shrink-0 text-encre-2 transition-transform', ouvert && 'rotate-180')} aria-hidden />
        </button>
      </div>

      {ouvert && (
        <div className="flex flex-col gap-5 border-t border-sable-2 px-4 py-5 sm:px-5 sm:pl-[3.75rem]">
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
            <Section titre="Pièces">
              <ul className="flex flex-col gap-2">
                {etape.pieces.map((pc) => (
                  <LignePiece key={pc} piece={pc} document={documentPourPiece(pc, documents)} onAjouter={actif ? () => setCapture(pc) : undefined} />
                ))}
              </ul>
            </Section>
          )}

          {/* Le moment conseillé tel qu'il apparaît dans l'agenda (§2.2 : jalon, jamais délai) */}
          {actif && etape.genereJalon && dateISO && (
            <div className="flex items-start gap-3 rounded-lg bg-sable p-4">
              <Flag className="mt-0.5 size-4 shrink-0 text-ocre" strokeWidth={1.75} aria-hidden />
              <p className="text-[14px] leading-relaxed text-encre">
                <span className="etiquette block">Dans l’agenda de {prenom}</span>
                Moment conseillé — <span className="font-medium text-ocre">vers {formatMoisAnnee(dateISO)}</span>. Ce n’est pas un
                délai : les seules dates opposables sont celles écrites sur vos courriers.
              </p>
            </div>
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

          {(etape.ficheId || etape.lienInterne) && (
            <div className="flex flex-wrap gap-4">
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
          )}

          {/* Suivi par la famille */}
          {actif && onStatut && onNote && (
            <div className="flex flex-col gap-3 rounded-lg border border-sable-2 bg-creme/60 p-4">
              <p className="etiquette">Où en êtes-vous ?</p>
              <div className="flex flex-wrap gap-2">
                <ChoixStatut actif={statut === 'a-faire'} onClick={() => onStatut('a-faire')}>
                  {question ? 'À discuter' : 'À faire'}
                </ChoixStatut>
                <ChoixStatut actif={fait} onClick={() => onStatut('fait')}>
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
            </div>
          )}
        </div>
      )}

      {capture && <CaptureFlow onClose={() => setCapture(null)} titreInitial={capture} />}
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
