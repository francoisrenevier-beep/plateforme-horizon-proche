'use client'

import Link from 'next/link'
import { Check, FileText, FolderClosed, Camera } from 'lucide-react'
import type { Document } from '@/lib/demo-data'

// Une pièce demandée par une étape de parcours, rapprochée du coffre. Trois états :
// déjà au coffre (lien vers le document), à ajouter (ouvre la capture), ou simplement à réunir.
export function LignePiece({ piece, document, onAjouter }: { piece: string; document?: Document; onAjouter?: () => void }) {
  return (
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1">
      {document ? (
        <FolderClosed className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden />
      ) : (
        <FileText className="mt-1 size-4 shrink-0 text-encre-2" aria-hidden />
      )}
      <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-encre">{piece}</span>
      {document ? (
        <Link href={`/documents/${document.id}`} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[12px] text-teal-900 hover:bg-teal-100">
          <Check className="size-3" aria-hidden />
          Au coffre : {document.titre}
        </Link>
      ) : onAjouter ? (
        <button type="button" onClick={onAjouter} className="inline-flex items-center gap-1 text-[12px] text-encre-2 hover:text-teal-700">
          <Camera className="size-3" aria-hidden />
          Ajouter au coffre
        </button>
      ) : (
        <span className="etiquette">À réunir</span>
      )}
    </li>
  )
}
