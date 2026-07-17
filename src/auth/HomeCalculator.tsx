import { SignInButton } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Mood } from '@/types/domain'
import { pushEvent } from '@/utils/gtm'

/**
 * Rough per-adult cost baseline per mood, derived once from the real
 * consumption catalog (sum of perAdult * defaultUnitPrice per mood in
 * smart-party-api). Kept as a static snapshot here, not a live call to the
 * engine, so this teaser never needs auth or a network round trip — it's
 * meant to give a taste of the product, not the exact wizard result.
 *
 * Labels are intentionally shorter than the wizard's moodLabel() so the five
 * chips sit in tidy rows inside the calculator card.
 */
const CALCULATOR_MOODS: { mood: Mood; label: string; perAdultCost: number }[] = [
  { mood: 'classic-barbecue', label: 'Churrasco', perAdultCost: 114 },
  { mood: 'birthday', label: 'Aniversário', perAdultCost: 61 },
  { mood: 'happy-hour', label: 'Happy Hour', perAdultCost: 74 },
  { mood: 'kids-party', label: 'Infantil', perAdultCost: 95 },
  { mood: 'pool-party', label: 'Pool Party', perAdultCost: 105 },
  { mood: 'wedding', label: 'Casamento', perAdultCost: 147 },
]

const PRICE_BAND_SPREAD = 0.15
const MIN_GUESTS = 5
const MAX_GUESTS = 100
const GUEST_STEP = 5
const DEFAULT_GUESTS = 20
const COUNT_UP_DURATION_MS = 500

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

/** Animates a numeric display toward `target` whenever it changes, for the "aha" reveal. */
function useCountUp(target: number, durationMs: number): number {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)
  const rafRef = useRef<number>()

  useEffect(() => {
    const startValue = valueRef.current
    const startTime = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = startValue + (target - startValue) * eased
      valueRef.current = current
      setValue(current)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])

  return value
}

export function HomeCalculator() {
  const [selectedMood, setSelectedMood] = useState<Mood>(CALCULATOR_MOODS[0].mood)
  const [guests, setGuests] = useState(DEFAULT_GUESTS)

  const perAdultCost = CALCULATOR_MOODS.find((entry) => entry.mood === selectedMood)?.perAdultCost ?? 0
  const total = perAdultCost * guests
  const totalMin = total * (1 - PRICE_BAND_SPREAD)
  const totalMax = total * (1 + PRICE_BAND_SPREAD)

  const animatedMin = useCountUp(totalMin, COUNT_UP_DURATION_MS)
  const animatedMax = useCountUp(totalMax, COUNT_UP_DURATION_MS)

  function selectMood(mood: Mood) {
    setSelectedMood(mood)
    pushEvent('calculator_mood_select', { mood })
  }

  function commitGuests(value: number) {
    pushEvent('calculator_guests_change', { guests: value, mood: selectedMood })
  }

  function stepGuests(delta: number) {
    const next = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, guests + delta))
    setGuests(next)
    commitGuests(next)
  }

  return (
    <section id="calculadora" className="scroll-mt-24 pb-20">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Experimente agora
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
          Quanto vai custar a sua festa?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
          Antes de qualquer cadastro, veja o plano nascer: escolha o clima e arraste o número de convidados.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[32px] border border-outline-variant/30 bg-surface-container-lowest/70 shadow-[var(--shadow-card)] backdrop-blur-sm lg:grid-cols-[1.15fr_1fr]">
        {/* Controls */}
        <div className="flex flex-col justify-center gap-8 p-6 sm:p-10">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
              Clima da festa
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CALCULATOR_MOODS.map(({ mood, label }) => {
                const isSelected = mood === selectedMood
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => selectMood(mood)}
                    aria-pressed={isSelected}
                    className={`cursor-pointer truncate rounded-full border px-3 py-2.5 text-sm font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-on-primary shadow-md shadow-primary/25'
                        : 'border-outline-variant/40 bg-background/50 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                Convidados
              </p>
              <p className="text-2xl font-black tabular-nums text-on-surface">{guests}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir convidados"
                onClick={() => stepGuests(-GUEST_STEP)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-on-surface"
              >
                <Icon name="minus" size={16} />
              </button>

              <input
                type="range"
                min={MIN_GUESTS}
                max={MAX_GUESTS}
                step={GUEST_STEP}
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                onPointerUp={() => commitGuests(guests)}
                onKeyUp={() => commitGuests(guests)}
                aria-label="Número de convidados"
                className="h-2 w-full cursor-pointer accent-primary"
              />

              <button
                type="button"
                aria-label="Aumentar convidados"
                onClick={() => stepGuests(GUEST_STEP)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-on-surface"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden bg-gradient-to-br from-primary to-primary-container p-8 text-center sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-black/10 blur-2xl" />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-primary/80">
              Total estimado
            </p>
            <p className="mt-2 font-display text-3xl font-black tracking-tight tabular-nums text-on-primary sm:text-4xl">
              {formatBRL(animatedMin)}
              <span className="mx-1 font-bold text-on-primary/60">–</span>
              {formatBRL(animatedMax)}
            </p>
            <p className="mt-2 text-sm font-medium text-on-primary/75">
              ≈ {formatBRL(perAdultCost)} por convidado
            </p>
          </div>

          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button
              type="button"
              onClick={() =>
                pushEvent('calculator_cta_click', { mood: selectedMood, guests, total: Math.round(total) })
              }
              className="flex h-12 cursor-pointer items-center gap-2 rounded-full bg-background px-6 font-bold text-on-surface shadow-xl transition-transform hover:scale-[1.03] active:scale-95"
            >
              Ver a lista completa
              <Icon name="arrow-right" size={18} className="text-primary" />
            </button>
          </SignInButton>

          <p className="text-xs font-medium text-on-primary/70">
            Lista item a item, orçamento e divisão no Pix — grátis no primeiro evento.
          </p>
        </div>
      </div>
    </section>
  )
}
