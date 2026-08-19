'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { personnes, type Personne } from '@/lib/demo-data'

type PersonContextValue = {
  personne: Personne
  setPersonneId: (id: string) => void
}

const PersonContext = createContext<PersonContextValue | null>(null)

export function PersonProvider({ children }: { children: ReactNode }) {
  const [personneId, setPersonneId] = useState(personnes[0].id)
  const personne = personnes.find((p) => p.id === personneId) ?? personnes[0]
  return (
    <PersonContext.Provider value={{ personne, setPersonneId }}>
      {children}
    </PersonContext.Provider>
  )
}

export function usePersonne() {
  const ctx = useContext(PersonContext)
  if (!ctx) throw new Error('usePersonne doit être utilisé dans un PersonProvider')
  return ctx
}
