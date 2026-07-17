
const STEP_LABELS = ['Mood', 'Convidados', 'Considerações', 'Lista', 'Divisão'] as const

interface StepperProps {
  current: number
}

export function Stepper({ current }: StepperProps) {
  const total = STEP_LABELS.length
  const progressPercent = (current / total) * 100
  const currentLabel = STEP_LABELS[current - 1] || ''

  return (
    <nav className="mb-10 lg:hidden" aria-label="Progresso">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1.5 font-medium tracking-tight">
            <span className="text-2xl text-on-surface">0{current}</span>
            <span className="text-sm text-on-surface-variant/50">/ 0{total}</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {currentLabel}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest/30 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
