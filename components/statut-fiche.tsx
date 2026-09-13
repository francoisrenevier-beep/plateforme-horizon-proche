import type { StatutFiche } from '@/lib/fiches'
import { cn } from '@/lib/utils'

// Statut de vérification d'une fiche (CLAUDE.md §2.5 et §5), toujours visible.
export function StatutFicheBadge({ statut, verifieLe, source }: { statut: StatutFiche; verifieLe?: string; source?: string }) {
  const libelle =
    statut === 'verifiee'
      ? `Vérifiée${verifieLe ? ` le ${verifieLe}` : ''}`
      : statut === 'a-verifier'
        ? `À vérifier${verifieLe ? ` · rédigée le ${verifieLe}` : ''}`
        : 'Brouillon'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px]',
        statut === 'verifiee' ? 'bg-teal-100 text-teal-900' : statut === 'a-verifier' ? 'bg-sable text-encre' : 'bg-rouille/10 text-rouille',
      )}
      title={source ? `Source : ${source}` : undefined}
    >
      {libelle}
      {source && <span className="text-encre-2">· {source}</span>}
    </span>
  )
}
