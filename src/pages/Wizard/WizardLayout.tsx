import { useEffect, useState } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'
import { SaveIndicator } from '@/components/SaveIndicator'
import { Icon } from '@/components/ui/Icon'
import { useWizard } from '@/contexts/WizardContext'

const WIZARD_STEPS = [
  { match: (path: string) => path === '/new', label: 'Clima da festa' },
  { match: (path: string) => path.endsWith('/guests'), label: 'Convidados' },
  { match: (path: string) => path.endsWith('/notes'), label: 'Considerações' },
  { match: (path: string) => path.endsWith('/items'), label: 'Itens' },
  { match: (path: string) => path.endsWith('/budget'), label: 'Orçamento' },
  { match: (path: string) => path.endsWith('/split'), label: 'Divisão' },
] as const

function currentWizardStepIndex(pathname: string): number {
  const index = WIZARD_STEPS.findIndex((step) => step.match(pathname))
  return index === -1 ? 0 : index
}

/** Desktop-only sidebar mirroring the mobile Stepper's progress, one row per wizard page. */
function WizardProgressSidebar({ currentIndex }: { currentIndex: number }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="Progresso" className="sticky top-24 flex flex-col gap-1">
        {WIZARD_STEPS.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isCurrent
                  ? 'bg-primary/10 text-primary'
                  : isDone
                    ? 'text-on-surface-variant'
                    : 'text-on-surface-variant/50'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                  isCurrent
                    ? 'border-primary text-primary'
                    : isDone
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-transparent'
                }`}
              >
                {isDone ? <Icon name="check" size={12} /> : index + 1}
              </span>
              {step.label}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

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
      <main className="mx-auto max-w-2xl px-5 py-8 lg:grid lg:max-w-5xl lg:grid-cols-[220px_1fr] lg:gap-12 xl:max-w-6xl">
        <WizardProgressSidebar currentIndex={currentWizardStepIndex(location.pathname)} />
        <div className="lg:max-w-2xl xl:max-w-3xl">
          <Outlet />
        </div>
      </main>
    </>
  )
}
