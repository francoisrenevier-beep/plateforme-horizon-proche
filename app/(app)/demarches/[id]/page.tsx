'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Square, CheckSquare, ImageIcon, Plus, ExternalLink, Route, Pencil, Clock } from 'lucide-react'
import { fiches, type PieceAFournir } from '@/lib/fiches'
import { useDossier, useEcheances } from '@/lib/store'
import { StatutFicheBadge } from '@/components/statut-fiche'
import { CaptureFlow } from '@/components/capture-flow'
import { EcheanceItem } from '@/components/echeance-item'
import { FormulaireEcheance } from '@/components/formulaire-echeance'
import { Entree, ZoneTexte, BoutonPrincipal, BoutonSecondaire, BoutonSuppression, Champ } from '@/components/ui/formulaire'

export default function FichePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { personne, dossier, actions } = useDossier()
  const echeances = useEcheances()

  // L'identifiant peut désigner une démarche ouverte (qui pointe vers une fiche) ou une fiche du catalogue.
  const demarche = dossier.demarches.find((d) => d.id === id)
  const fiche = fiches[demarche?.ficheId ?? id]
  if (!fiche) notFound()

  const [capture, setCapture] = useState<string | null>(null)
  const [ajoutEcheance, setAjoutEcheance] = useState(false)
  const [editionSituation, setEditionSituation] = useState(false)
  const [suppression, setSuppression] = useState(false)

  const intervenant = dossier.intervenants.find((i) => i.id === fiche.q000decide.intervenantId)
  const liees = demarche ? echeances.filter((e) => e.demarcheId === demarche.id && !e.fait) : []

  return (
    <div className="flex flex-col gap-8">
      <Link href="/demarches" className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Toutes les démarches
      </Link>

      {/* En-tête toujours visible */}
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-sable-2 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[26px] text-teal-900">{fiche.titre}</h1>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-[13px] text-teal-900">{fiche.canton}</span>
          </div>
          <div className="mt-2">
            <StatutFicheBadge statut={fiche.statut} verifieLe={fiche.verifieLe} source={fiche.source} />
          </div>
        </div>
        {!demarche ? (
          <BoutonPrincipal
            className="h-10"
            onClick={() =>
              actions.ajouterDemarche({ id: fiche.id, ficheId: fiche.id, titre: fiche.titre, canton: fiche.canton === 'Vaud' ? 'VD' : fiche.canton, situation: '' })
            }
          >
            <Plus className="size-4" aria-hidden />
            Ouvrir cette démarche pour {personne.prenom}
          </BoutonPrincipal>
        ) : (
          <span className="etiquette pt-2">Démarche ouverte pour {personne.prenom}</span>
        )}
      </header>

      {fiche.statut !== 'verifiee' && (
        <p className="rounded-lg bg-sable px-5 py-4 text-[15px] leading-relaxed text-encre">
          {fiche.statut === 'brouillon'
            ? 'Cette fiche est un brouillon : plusieurs informations restent à compléter. Ne vous fiez qu’aux courriers que vous recevez.'
            : 'Cette fiche n’a pas encore été relue contre sa source. Les indications de durée et de procédure sont à confirmer auprès de l’autorité concernée.'}
        </p>
      )}

      {/* Où en êtes-vous — propre au dossier */}
      {demarche && (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-serif text-xl text-teal-900">Où en est {personne.prenom}</h2>
            {!editionSituation && (
              <button type="button" onClick={() => setEditionSituation(true)} className="inline-flex items-center gap-1.5 text-[13px] text-encre-2 hover:text-teal-700">
                <Pencil className="size-3.5" aria-hidden />
                Modifier
              </button>
            )}
          </div>
          {editionSituation ? (
            <FormulaireSituation
              situation={demarche.situation}
              prochaineAction={demarche.prochaineAction ?? ''}
              onAnnuler={() => setEditionSituation(false)}
              onEnregistrer={(situation, prochaineAction) => {
                actions.modifierDemarche(demarche.id, { situation, prochaineAction: prochaineAction || undefined })
                setEditionSituation(false)
              }}
            />
          ) : (
            <div className="mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-encre">
              <p>{demarche.situation || <span className="text-encre-2">Décrivez la situation en une ou deux phrases.</span>}</p>
              {demarche.prochaineAction && (
                <p>
                  Prochaine action : <span className="font-medium">{demarche.prochaineAction}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-5 border-t border-sable-2 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="etiquette">Échéances liées</h3>
              <button type="button" onClick={() => setAjoutEcheance(true)} className="inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
                <Clock className="size-4" aria-hidden />
                Noter une date lue sur un courrier
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {liees.length === 0 && <p className="text-[15px] text-encre-2">Aucune échéance rattachée.</p>}
              {liees.map((e) => (
                <EcheanceItem key={e.id} echeance={e} onBasculerFait={() => actions.basculerEcheanceFaite(e.id)} />
              ))}
            </div>
          </div>

          {fiche.parcoursId && (
            <div className="mt-5 border-t border-sable-2 pt-4">
              <Link href={`/parcours/${fiche.parcoursId}`} className="inline-flex items-center gap-2 text-[15px] text-teal-700 hover:underline">
                <Route className="size-4" aria-hidden />
                Voir toutes les étapes du parcours, dans l’ordre
              </Link>
            </div>
          )}
        </section>
      )}

      <Bloc numero={1} titre="À quel moment cela arrive">
        <p>{fiche.moment}</p>
      </Bloc>

      <Bloc numero={2} titre="Ce que cela change concrètement">
        <p>{fiche.changement}</p>
      </Bloc>

      {/* Étape particulière : question ouverte, jamais une tâche */}
      {fiche.questionProtection && (
        <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
          <h2 className="font-serif text-xl text-teal-900">Et la question de la protection ?</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-encre">{fiche.questionProtection.intro.replaceAll('Noah', personne.prenom)}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fiche.questionProtection.options.map((o) => (
              <div key={o.titre} className="rounded-lg border border-sable-2 bg-creme/60 p-4">
                <h3 className="font-serif text-[17px] text-teal-900">{o.titre}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-encre-2">{o.description}</p>
              </div>
            ))}
          </div>
          <p className="etiquette mt-4">Ces options sont présentées à titre d’information. Aucune n’est recommandée ni cochée par avance.</p>
        </section>
      )}

      <Bloc numero={3} titre="Qui décide, et où">
        <p>{fiche.q000decide.autorite}.</p>
        {intervenant ? (
          <Link href="/intervenants" className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            Voir la fiche de l’intervenant ({intervenant.organisation})
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        ) : (
          <Link href="/intervenants" className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
            Ajouter cette autorité à vos intervenants
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        )}
        <EncadreCantonal texte={fiche.q000decide.cantonal} />
      </Bloc>

      <Bloc numero={4} titre="Ce qu’il faut fournir">
        <ListeCochable
          pieces={fiche.pieces}
          cochees={demarche?.piecesCochees ?? []}
          onBasculer={demarche ? (pieceId) => actions.basculerPieceDemarche(demarche.id, pieceId) : undefined}
          documentsPresents={dossier.documents.map((d) => d.titre)}
          onAjouter={(texte) => setCapture(texte)}
        />
        {!demarche && <p className="etiquette mt-2">Ouvrez la démarche pour cocher les pièces réunies.</p>}
      </Bloc>

      <Bloc numero={5} titre="Combien de temps cela prend">
        <p>{fiche.duree}</p>
      </Bloc>

      <Bloc numero={6} titre="Et si la demande est refusée">
        <p>{fiche.refus}</p>
      </Bloc>

      {/* Erreurs fréquentes — en évidence sur fond teal-50 */}
      <section className="rounded-lg bg-teal-50 p-6">
        <h2 className="font-serif text-xl text-teal-900">Erreurs fréquentes</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {fiche.erreurs.map((e) => (
            <li key={e} className="flex gap-3 text-[15px] leading-relaxed text-encre">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden />
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* Ce que nous ne faisons pas */}
      <section className="rounded-lg bg-sable p-6">
        <h2 className="font-serif text-lg text-teal-900">Ce que nous ne faisons pas</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-encre">
          Nous n’établissons pas de conseil juridique. Pour un accompagnement personnalisé, adressez-vous à{' '}
          <a href="https://www.proinfirmis.ch/fr/prestations/vaud.html" target="_blank" rel="noreferrer" className="text-teal-700 underline">
            Pro Infirmis Vaud
          </a>{' '}
          ou au service social de votre commune.
        </p>
      </section>

      {demarche && (
        <div className="flex justify-end border-t border-sable-2 pt-6">
          <BoutonSuppression
            libelle="Clore cette démarche"
            arme={suppression}
            onArmer={() => setSuppression(true)}
            onAnnuler={() => setSuppression(false)}
            onConfirmer={() => actions.supprimerDemarche(demarche.id)}
          />
        </div>
      )}

      {capture !== null && <CaptureFlow titreInitial={capture} demarcheIdInitiale={demarche?.id} onClose={() => setCapture(null)} />}
      {ajoutEcheance && demarche && <FormulaireEcheance natureInitiale="delai" demarcheIdInitiale={demarche.id} onClose={() => setAjoutEcheance(false)} />}
    </div>
  )
}

function FormulaireSituation({
  situation,
  prochaineAction,
  onAnnuler,
  onEnregistrer,
}: {
  situation: string
  prochaineAction: string
  onAnnuler: () => void
  onEnregistrer: (situation: string, prochaineAction: string) => void
}) {
  const [s, setS] = useState(situation)
  const [pa, setPa] = useState(prochaineAction)
  return (
    <div className="mt-3 flex flex-col gap-4">
      <Champ label="Situation" htmlFor="d-sit">
        <ZoneTexte id="d-sit" rows={3} value={s} onChange={(e) => setS(e.target.value)} />
      </Champ>
      <Champ label="Prochaine action" htmlFor="d-pa">
        <Entree id="d-pa" value={pa} onChange={(e) => setPa(e.target.value)} />
      </Champ>
      <div className="flex justify-end gap-2">
        <BoutonSecondaire className="h-10" onClick={onAnnuler}>
          Annuler
        </BoutonSecondaire>
        <BoutonPrincipal className="h-10" onClick={() => onEnregistrer(s.trim(), pa.trim())}>
          Enregistrer
        </BoutonPrincipal>
      </div>
    </div>
  )
}

function Bloc({ numero, titre, children }: { numero: number; titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2 font-serif text-xl text-teal-900">
        <span className="etiquette text-encre-2">{numero}.</span>
        {titre}
      </h2>
      <div className="mt-3 text-[17px] leading-relaxed text-encre">{children}</div>
    </section>
  )
}

function EncadreCantonal({ texte }: { texte: string }) {
  return (
    <div className="mt-4 rounded-lg bg-teal-50 p-4">
      <p className="etiquette mb-1 flex items-center gap-1.5 text-teal-700">
        <ShieldCheck className="size-3.5" aria-hidden />
        Dans le canton de Vaud
      </p>
      <p className="text-[15px] leading-relaxed text-encre">{texte}</p>
    </div>
  )
}

function ListeCochable({
  pieces,
  cochees,
  onBasculer,
  documentsPresents,
  onAjouter,
}: {
  pieces: PieceAFournir[]
  cochees: string[]
  onBasculer?: (pieceId: string) => void
  documentsPresents: string[]
  onAjouter: (texte: string) => void
}) {
  return (
    <ul className="flex flex-col divide-y divide-sable-2 rounded-lg border border-sable-2 bg-card">
      {pieces.map((p) => {
        const coche = cochees.includes(p.id)
        const auCoffre = p.document && documentsPresents.includes(p.document)
        return (
          <li key={p.id} className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => onBasculer?.(p.id)}
              disabled={!onBasculer}
              aria-pressed={coche}
              aria-label={coche ? `Décocher ${p.texte}` : `Cocher ${p.texte}`}
              className="shrink-0 text-teal-700 disabled:opacity-50"
            >
              {coche ? <CheckSquare className="size-5" aria-hidden /> : <Square className="size-5 text-encre-2" aria-hidden />}
            </button>
            <span className="min-w-0 flex-1 text-[15px] text-encre">{p.texte}</span>
            {auCoffre ? (
              <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1.5 text-[13px] text-teal-700">
                <ImageIcon className="size-4" aria-hidden />
                {p.document}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAjouter(p.document ?? p.texte)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-sable-2 px-2.5 py-1.5 text-[13px] text-encre-2 hover:bg-teal-50"
              >
                <Plus className="size-3.5" aria-hidden />
                Ajouter
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
