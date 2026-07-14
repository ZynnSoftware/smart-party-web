import { useEffect, useState } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'
import { SaveIndicator } from '@/components/SaveIndicator'
import { useWizard } from '@/contexts/WizardContext'

/**
 * Ensures the event is loaded into the wizard context. The event is created at
 * step 1, but on a hard refresh of a later step we must reload it by id.
 */
export function WizardLayout() {
  const { id } = useParams()
  const location = useLocation()
  const { event, loadEvent } = useWizard()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id || event?.id === id) return
    loadEvent(id).catch(() => setFailed(true))
  }, [id, event?.id, loadEvent])

  // Scroll to top automatically when navigating between wizard steps
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (failed) {
    return (
      <>
        <TopBar />
        <p className="mx-auto max-w-2xl px-5 py-10 text-error">
          Evento não encontrado.
        </p>
      </>
    )
  }

  return (
    <>
      <TopBar />
      <SaveIndicator />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <Outlet />
      </main>
    </>
  )
}
