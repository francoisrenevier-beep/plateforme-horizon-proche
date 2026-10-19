'use client'

// Messages de compte affichés au-dessus du contenu : mode dégradé, fin d'essai, alertes de
// sécurité, échec d'enregistrement, et rappel quand une modification a été refusée.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Info, PauseCircle, X } from 'lucide-react'
import { useDossier } from '@/lib/store'
import { joursEssaiRestants, libelleStatut } from '@/lib/compte'
import { useSecurite } from '@/components/securite/contexte-securite'

export function BandeauCompte() {
  const { compte, lectureSeule, refus } = useDossier()
  const { echecsAvantOuverture, ouvertParSecours, erreurEcriture } = useSecurite()
  const [alerteVue, setAlerteVue] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!refus) return
    setToast(true)
    const t = setTimeout(() => setToast(false), 6000)
    return () => clearTimeout(t)
  }, [refus])

  const jours = joursEssaiRestants(compte)
  const essaiBientotFini = compte.abonnement.statut === 'trialing' && !lectureSeule && jours <= 7

  return (
    <>
      <div className="flex flex-col">
        {lectureSeule && (
          <div role="status" className="flex items-start gap-3 border-b border-sable-2 bg-sable px-5 py-3 text-[14px] text-encre md:px-10">
            <PauseCircle className="mt-0.5 size-4 shrink-0 text-rouille" aria-hidden />
            <p className="leading-relaxed">
              <strong className="font-medium">
                {compte.abonnement.statut === 'trialing' ? 'Votre essai gratuit est terminé.' : `${libelleStatut[compte.abonnement.statut]}.`}
              </strong>{' '}
              Vos dossiers restent consultables et vous pouvez tout exporter. Les modifications, les ajouts et le partage sont en pause.{' '}
              <Link href="/reglages#abonnement" className="text-teal-700 underline">
                Réactiver
              </Link>
            </p>
          </div>
        )}
        {essaiBientotFini && (
          <div className="flex items-start gap-3 border-b border-sable-2 bg-teal-50 px-5 py-3 text-[14px] text-encre md:px-10">
            <Info className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
            <p>
              Essai gratuit : {jours} jour{jours > 1 ? 's' : ''} restant{jours > 1 ? 's' : ''}. Vos données ne seront jamais bloquées, même sans abonnement.{' '}
              <Link href="/reglages#abonnement" className="text-teal-700 underline">
                Voir l’abonnement
              </Link>
            </p>
          </div>
        )}
        {!alerteVue && (ouvertParSecours || echecsAvantOuverture > 0) && (
          <div role="alert" className="flex items-start gap-3 border-b border-sable-2 bg-card px-5 py-3 text-[14px] text-encre md:px-10">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ocre" aria-hidden />
            <p className="flex-1 leading-relaxed">
              {ouvertParSecours
                ? 'Coffre ouvert avec le code de secours et nouvelle phrase secrète enregistrée. Générez un nouveau code de secours : l’ancien reste valable tant que vous ne l’avez pas remplacé.'
                : `${echecsAvantOuverture} essai${echecsAvantOuverture > 1 ? 's' : ''} de phrase secrète manqué${echecsAvantOuverture > 1 ? 's' : ''} avant cette ouverture. Si ce n’était pas vous, changez votre phrase secrète.`}{' '}
              <Link href="/reglages#securite" className="text-teal-700 underline">
                Sécurité
              </Link>
            </p>
            <button type="button" onClick={() => setAlerteVue(true)} aria-label="Fermer ce message" className="text-encre-2 hover:text-encre">
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}
        {erreurEcriture && (
          <div role="alert" className="border-b border-sable-2 bg-rouille/10 px-5 py-3 text-[14px] text-rouille md:px-10">
            Vos dernières modifications n’ont pas pu être enregistrées ({erreurEcriture}). Exportez une sauvegarde depuis les réglages.
          </div>
        )}
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6">
        {toast && (
          <p className="pointer-events-auto max-w-md rounded-lg bg-encre px-4 py-3 text-[14px] leading-relaxed text-creme shadow-lg">
            Modification non enregistrée : votre dossier est en consultation seule tant que l’abonnement n’est pas réactivé.
          </p>
        )}
      </div>
    </>
  )
}
