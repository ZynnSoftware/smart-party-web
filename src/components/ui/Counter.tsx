import { Icon } from './Icon'

interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
  label: string
}

/** The +/- stepper used throughout the prototype (guests, quantities). */
export function Counter({ value, onChange, min = 0, step = 1, label }: CounterProps) {
  const decrease = () => onChange(Math.max(min, roundStep(value - step)))
  const increase = () => onChange(roundStep(value + step))

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Diminuir ${label}`}
        onClick={decrease}
        disabled={value <= min}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition hover:bg-surface-container-high active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="minus" size={18} />
      </button>
      <span className="min-w-9 text-center text-lg font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Aumentar ${label}`}
        onClick={increase}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition hover:brightness-95 active:scale-95"
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  )
}

function roundStep(value: number): number {
  return Math.round(value * 100) / 100
}
