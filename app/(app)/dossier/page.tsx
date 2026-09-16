'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartHandshake, Users, Shield, Link2, ChevronRight, Camera, FolderClosed } from 'lucide-react'
import { useDossier, parcoursSuivis, piecesDuParcours, documentPourPiece } from '@/lib/store'
import { formatRelatif } from '@/lib/dates'
import { CaptureFlow, DocIcon } from '@/components/capture-flow'
import { LignePiece } from '@/components/ligne-piece'
import { IconeDuParcours } from '@/components/carte-parcours'
import { BoutonPrincipal } from '@/components/ui/formulaire'

// « Mon dossier » : ce que les parcours en cours demandent comme pièces, rapproché du coffre,
// et les autres volets du dossier (portrait, intervenants, accès, partage).
export default function DossierPage() {
  const { personne, dossier } = useDossier()
  const [capture, setCapture] = useState<string | null>(null)

  const suivis = parcoursSuivis(dossier)
  const sectionsRemplies = dossier.portrait.filter((s) => s.texte).length
  const nonClasses = dossier.documents.filter((d) => !d.classe).length
  const recents = [...dossier.documents].sort((a, b) => (b.ajouteLe ?? '').localeCompare(a.ajouteLe ?? '')).slice(0, 5)

  const volets = [
    { href: '/portrait', icon: HeartHandshake, titre: 'Portrait', detail: `${sectionsRemplies} section${sectionsRemplies > 1 ? 's' : ''} sur 7` },
    { href: '/intervenants', icon: Users, titre: 'Intervenants', detail: `${dossier.intervenants.length} contact${dossier.intervenants.length > 1 ? 's' : ''}` },
    { href: '/acces', icon: Shield, titre: 'Accès et rôles', detail: `${dossier.acces.length} personne${dossier.acces.length > 1 ? 's' : ''}` },
    { href: '/partage', icon: Link2, titre: 'Partager un lien', detail: 'Consultation temporaire' },
  ]

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-serif text-[26px] text-teal-900">Le dossier de {personne.prenom}</h1>
        <p className="mt-1 text-encre-2">{personne.contexte}</p>
      </header>

      {/* Volets du dossier */}
      <nav aria-label="Volets du dossier" className="grid gap-3 sm:grid-cols-2">
        {volets.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="flex items-center gap-4 rounded-lg border border-sable-2 bg-card p-4 shadow-[0_1px_3px_rgba(22,78,78,0.06)] transition-colors hover:bg-teal-50"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sable text-teal-700">
              <v.icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg text-teal-900">{v.titre}</span>
              <span className="etiquette">{v.detail}</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-encre-2" aria-hidden />
          </Link>
        ))}
      </nav>

      {/* Pièces demandées par les parcours en cours */}
      <section aria-labelledby="titre-pieces">
        <h2 id="titre-pieces" className="font-serif text-xl text-teal-900">
          Pièces à réunir
        </h2>
        <p className="mt-1 text-[15px] text-encre-2">
          Ce que les parcours en cours demanderont. Ce qui est déjà au coffre est signalé ; le reste peut être ajouté d’ici.
        </p>
        {suivis.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-sable-2 p-6 text-center text-[15px] text-encre-2">
            Aucun parcours en cours pour {personne.prenom}.{' '}
            <Link href="/accueil" className="text-teal-700 underline">
              Choisir un parcours
            </Link>
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {suivis.map(({ p }) => {
              const pieces = piecesDuParcours(p)
              const reunies = pieces.filter((pc) => documentPourPiece(pc, dossier.documents)).length
              return (
                <article key={p.id} className="rounded-lg border border-sable-2 bg-card p-5 shadow-[0_1px_3px_rgba(22,78,78,0.06)]">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                      <IconeDuParcours icone={p.icone} className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/parcours/${p.id}`} className="font-serif text-lg leading-snug text-teal-900 hover:underline">
                        {p.titre}
                      </Link>
                      <p className="etiquette">
                        {pieces.length === 0 ? 'Aucune pièce listée' : `${reunies} pièce${reunies > 1 ? 's' : ''} sur ${pieces.length} au coffre`}
                      </p>
                    </div>
                  </div>
                  {pieces.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2 border-t border-sable-2 pt-4">
                      {pieces.map((pc) => (
                        <LignePiece key={pc} piece={pc} document={documentPourPiece(pc, dossier.documents)} onAjouter={() => setCapture(pc)} />
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Le coffre */}
      <section className="rounded-lg border border-sable-2 bg-card p-6 shadow-[0_1px_3px_rgba(22,78,78,0.06)]" aria-labelledby="titre-coffre">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="titre-coffre" className="font-serif text-xl text-teal-900">
              Le coffre
            </h2>
            <p className="etiquette mt-1">
              {dossier.documents.length} document{dossier.documents.length > 1 ? 's' : ''}
              {nonClasses > 0 && ` · ${nonClasses} à classer`}
            </p>
          </div>
          <BoutonPrincipal className="h-10" onClick={() => setCapture('')}>
            <Camera className="size-4" aria-hidden />
            Ajouter un document
          </BoutonPrincipal>
        </div>
        {recents.length > 0 && (
          <ul className="mt-4 flex flex-col divide-y divide-sable-2">
            {recents.map((d) => (
              <li key={d.id}>
                <Link href={`/documents/${d.id}`} className="flex items-center gap-3 py-3 transition-colors hover:text-teal-700">
                  <DocIcon type={d.type} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] text-encre">{d.titre}</span>
                    <span className="etiquette">
                      {d.emetteur} · {d.date}
                      {d.ajouteLe && ` · ajouté ${formatRelatif(d.ajouteLe)}`}
                    </span>
                  </span>
                  {!d.classe && <span className="rounded-full bg-sable px-2 py-0.5 text-[12px] text-encre-2">À classer</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/documents" className="mt-4 inline-flex items-center gap-1.5 text-[15px] text-teal-700 hover:underline">
          <FolderClosed className="size-4" aria-hidden />
          Ouvrir le coffre
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </section>

      {capture !== null && <CaptureFlow onClose={() => setCapture(null)} titreInitial={capture || undefined} />}
    </div>
  )
}
