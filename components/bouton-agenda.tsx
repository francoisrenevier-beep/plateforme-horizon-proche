'use client'

import { useState } from 'react'
import { CalendarPlus, Check } from 'lucide-react'
import { calendrierIcs, nomFichierIcs, telechargerIcs, type EvenementIcs } from '@/lib/ics'
import { cn } from '@/lib/utils'

// Télécharge un fichier .ics. Un même fichier s'ouvre dans Outlook, Google Calendar,
// Apple Calendrier et la plupart des agendas ; rien n'est envoyé à un service externe.
export function BoutonAgenda({
  evenements,
  nomCalendrier,
  nomFichier,
  libelle,
  variante = 'secondaire',
  className,
}: {
  evenements: EvenementIcs[]
  nomCalendrier: string
  nomFichier: string
  libelle: string
  variante?: 'principal' | 'secondaire' | 'lien'
  className?: string
}) {
  const [fait, setFait] = useState(false)
  const vide = evenements.length === 0

  const exporter = () => {
    if (vide) return
    telechargerIcs(nomFichierIcs(nomFichier), calendrierIcs(evenements, { nom: nomCalendrier }))
    setFait(true)
    setTimeout(() => setFait(false), 3000)
  }

  const classes =
    variante === 'principal'
      ? 'inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-teal-700'
      : variante === 'secondaire'
        ? 'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-sable-2 bg-card px-5 text-[15px] text-encre transition-colors hover:bg-teal-50'
        : 'inline-flex items-center gap-2 text-[15px] text-teal-700 transition-colors hover:text-teal-900 hover:underline'

  return (
    <button
      type="button"
      onClick={exporter}
      disabled={vide}
      title={vide ? 'Rien à exporter pour l’instant' : 'Fichier .ics — Outlook, Google Calendar, Apple Calendrier'}
      className={cn(classes, 'disabled:cursor-not-allowed disabled:opacity-50', className)}
    >
      {fait ? <Check className="size-4" aria-hidden /> : <CalendarPlus className="size-4" aria-hidden />}
      {fait ? 'Fichier téléchargé' : libelle}
    </button>
  )
}

// Phrase d'explication, à placer près d'un bouton d'export.
export function MentionAgenda({ className }: { className?: string }) {
  return (
    <p className={cn('etiquette', className)}>
      Le fichier obtenu (.ics) s’ouvre dans Outlook, Google Calendar, Apple Calendrier et la plupart des agendas. Sur
      téléphone, ouvrez-le depuis vos téléchargements pour l’ajouter à votre agenda.
    </p>
  )
}
