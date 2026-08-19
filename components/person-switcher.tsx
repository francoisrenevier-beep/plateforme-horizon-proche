'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Check } from 'lucide-react'
import { personnes } from '@/lib/demo-data'
import { usePersonne } from '@/components/person-context'
import { cn } from '@/lib/utils'

export function PersonSwitcher() {
  const { personne, setPersonneId } = usePersonne()
  const [ouvert, setOuvert] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-haspopup="menu"
        className="flex w-full items-center gap-3 rounded-lg border border-sable-2 bg-card p-3 text-left transition-colors hover:bg-teal-50"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-100 font-serif text-lg text-teal-900">
          {personne.initiale}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-serif text-lg text-teal-900">{personne.prenom}</span>
          <span className="etiquette block">{personne.age} ans</span>
        </span>
        <ChevronDown className={cn('size-4 text-encre-2 transition-transform', ouvert && 'rotate-180')} aria-hidden />
      </button>

      {ouvert && (
        <div
          role="menu"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-sable-2 bg-card shadow-[0_8px_24px_rgba(22,78,78,0.12)]"
        >
          {personnes.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitemradio"
              aria-checked={p.id === personne.id}
              onClick={() => {
                setPersonneId(p.id)
                setOuvert(false)
              }}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-teal-50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-serif text-teal-900">
                {p.initiale}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] text-encre">{p.prenom}</span>
                <span className="etiquette block">{p.age} ans</span>
              </span>
              {p.id === personne.id && <Check className="size-4 text-teal-700" aria-label="Sélectionné" />}
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 border-t border-sable-2 px-3 py-3 text-left text-[15px] text-teal-700 transition-colors hover:bg-teal-50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-sable-2">
              <Plus className="size-4" aria-hidden />
            </span>
            Ajouter une personne
          </button>
        </div>
      )}
    </div>
  )
}
