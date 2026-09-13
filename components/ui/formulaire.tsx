'use client'

// Briques de formulaire partagées. Même vocabulaire visuel que le reste de l'application :
// hauteur 44px, bord `sable-2`, fond `card`, focus visible géré globalement dans globals.css.

import { useEffect, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modale({
  titre,
  sousTitre,
  onClose,
  children,
  large,
}: {
  titre: string
  sousTitre?: string
  onClose: () => void
  children: ReactNode
  large?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          'flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl bg-card sm:rounded-xl',
          large ? 'max-w-2xl' : 'max-w-lg',
        )}
      >
        <div className="flex items-center justify-between border-b border-sable-2 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg text-teal-900">{titre}</h2>
            {sousTitre && <p className="etiquette">{sousTitre}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 items-center justify-center rounded-md text-encre-2 hover:bg-sable"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export function Champ({
  label,
  aide,
  htmlFor,
  children,
  obligatoire,
}: {
  label: string
  aide?: string
  htmlFor?: string
  children: ReactNode
  obligatoire?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[15px] font-medium text-encre">
        {label}
        {obligatoire && <span className="text-encre-2"> *</span>}
      </label>
      {aide && <p className="etiquette -mt-0.5">{aide}</p>}
      {children}
    </div>
  )
}

const classesEntree =
  'h-11 w-full rounded-md border border-sable-2 bg-card px-3 text-[15px] text-encre outline-none placeholder:text-encre-2'

export function Entree({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(classesEntree, className)} {...props} />
}

export function ZoneTexte({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full resize-y rounded-md border border-sable-2 bg-card p-3 text-[15px] leading-relaxed text-encre outline-none placeholder:text-encre-2',
        className,
      )}
      {...props}
    />
  )
}

export function Selection({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(classesEntree, 'appearance-none', className)} {...props}>
      {children}
    </select>
  )
}

export function BoutonPrincipal({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-900 px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function BoutonSecondaire({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-sable-2 bg-card px-5 text-[15px] text-encre transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function BoutonDiscret({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn('inline-flex items-center gap-1.5 text-[13px] text-encre-2 transition-colors hover:text-teal-700', className)}
      {...props}
    >
      {children}
    </button>
  )
}

// Suppression en deux temps, sans fenêtre native : un premier clic arme, le second confirme.
export function BoutonSuppression({
  arme,
  onArmer,
  onConfirmer,
  onAnnuler,
  libelle = 'Supprimer',
  className,
}: {
  arme: boolean
  onArmer: () => void
  onConfirmer: () => void
  onAnnuler: () => void
  libelle?: string
  className?: string
}) {
  if (!arme) {
    return (
      <button
        type="button"
        onClick={onArmer}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-md border border-rouille/30 px-4 text-[15px] text-rouille transition-colors hover:bg-rouille/10',
          className,
        )}
      >
        {libelle}
      </button>
    )
  }
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <span className="text-[15px] text-encre">Confirmer ?</span>
      <button
        type="button"
        onClick={onConfirmer}
        className="inline-flex h-11 items-center rounded-md bg-rouille px-4 text-[15px] font-medium text-primary-foreground hover:bg-rouille/90"
      >
        Oui, {libelle.toLowerCase()}
      </button>
      <button type="button" onClick={onAnnuler} className="inline-flex h-11 items-center rounded-md border border-sable-2 px-4 text-[15px] text-encre hover:bg-sable">
        Non
      </button>
    </span>
  )
}

export function Pied({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-sable-2 pt-4">{children}</div>
}

export function MessageErreur({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-md bg-rouille/10 px-3 py-2 text-[15px] text-rouille">
      {children}
    </p>
  )
}
