import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'
import { APPETITE_OPTIONS, DEFAULT_APPETITE } from '@/utils/appetite'
import type { Appetite, DietaryTag, Guests, Restrictions } from '@/types/domain'

const RESTRICTION_LABELS: Record<DietaryTag, string> = {
  vegan: 'Veganos',
  vegetarian: 'Vegetarianos',
  'gluten-free': 'Sem Glúten',
  'lactose-free': 'Sem Lactose',
}

const RESTRICTION_TAGS = Object.keys(RESTRICTION_LABELS) as DietaryTag[]

export function GuestsStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, patch, isSaving, error } = useWizard()

  // "Casais" is a UI convenience only — a couple is just 2 adults. We keep solo
  // adults and couples separate for entry, but the domain stays { adults, children }.
  const [couples, setCouples] = useState(event?.guests.couples ?? 0)
  const ADULTS_PER_COUPLE = 2
  const initialSoloAdults = event?.guests.adults 
    ? event.guests.adults - (event.guests.couples ?? 0) * ADULTS_PER_COUPLE
    : 1
  const [soloAdults, setSoloAdults] = useState(initialSoloAdults)
  const [children, setChildren] = useState(event?.guests.children ?? 0)
  const [appetite, setAppetite] = useState<Appetite>(
    event?.appetite ?? DEFAULT_APPETITE,
  )
  const [restrictions, setRestrictions] = useState<Restrictions>(
    event?.restrictions ?? {
      vegan: 0,
      vegetarian: 0,
      'gluten-free': 0,
      'lactose-free': 0,
    },
  )

  const totalAdults = soloAdults + couples * ADULTS_PER_COUPLE
  const total = totalAdults + children

  // Nielsen's Heuristics: Error Prevention
  const hasZeroGuests = total === 0
  const invalidRestrictions = Object.entries(restrictions).filter(([_, count]) => count > total)
  const canProceed = !hasZeroGuests && invalidRestrictions.length === 0

  const setRestriction = (tag: DietaryTag, value: number) =>
    setRestrictions((current) => ({ ...current, [tag]: value }))

  const handleNext = async () => {
    if (!canProceed) return
    const guests: Guests = { adults: totalAdults, children, couples }
    await patch({ guests, restrictions, appetite })
    navigate(`/events/${id}/notes`)
  }

  return (
    <div className="pb-32">
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '0ms' }}>
        <Stepper current={2} />
      </div>

      <div 
        className="mb-12"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '100ms' }}
      >
        <h1 className="mb-2 text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface">Quem vai à festa?</h1>
        <p className="text-base text-on-surface-variant">
          As quantidades e restrições ajustam a lista automaticamente.
        </p>
      </div>

      <div 
        className="mb-10"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '200ms' }}
      >
        <h2 className="mb-4 text-xl font-bold tracking-tight text-on-surface">Pessoas</h2>
        <div className="flex flex-col gap-1">
          <GuestRow
            icon="couple"
            title="Casais"
            hint="Contam como 2 adultos"
            value={couples}
            onChange={setCouples}
          />
          <GuestRow
            icon="person"
            title="Adultos solos"
            hint="12 anos ou mais"
            value={soloAdults}
            onChange={setSoloAdults}
          />
          <GuestRow
            icon="users"
            title="Crianças"
            hint="Menos de 12 anos (consomem 50%)"
            value={children}
            onChange={setChildren}
            last
          />
        </div>
      </div>

      <div 
        className="mb-10"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '300ms' }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">Apetite da galera</h2>
          <p className="text-sm text-on-surface-variant">
            Ajusta o perfil de consumo de toda a festa.
          </p>
        </div>
        
        <div className="flex w-full rounded-2xl bg-surface-container/40 p-1.5 shadow-inner backdrop-blur-sm">
          {APPETITE_OPTIONS.map((option) => {
            const isSelected = appetite === option.appetite
            return (
              <button
                key={option.appetite}
                type="button"
                onClick={() => setAppetite(option.appetite)}
                className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl py-3 px-1 text-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-surface-container-lowest text-primary shadow-[var(--shadow-card)] ring-1 ring-primary/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/40'
                }`}
              >
                <Icon name={option.icon} size={22} className={isSelected ? 'text-primary [animation:var(--animate-pop-in)]' : 'text-on-surface-variant/60'} />
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-on-surface-variant/80'}`}>
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
        
        <div className="mt-4 flex min-h-[40px] items-center justify-center rounded-xl bg-surface-container-lowest/50 px-4 py-2 text-center text-sm font-medium text-on-surface-variant border border-outline-variant/10 shadow-sm">
          {APPETITE_OPTIONS.find(o => o.appetite === appetite)?.hint}
        </div>
      </div>

      <div 
        className="mb-12"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '400ms' }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">Restrições Alimentares</h2>
          <p className="text-sm text-on-surface-variant">
            Alguém possui alguma necessidade especial?
          </p>
        </div>
        
        <div className="flex flex-col gap-1">
          {RESTRICTION_TAGS.map((tag, index) => (
            <div
              key={tag}
              className={`flex items-center justify-between py-4 ${
                index < RESTRICTION_TAGS.length - 1
                  ? 'border-b border-outline-variant/20'
                  : ''
              }`}
            >
              <p className="font-medium text-on-surface">{RESTRICTION_LABELS[tag]}</p>
              <Counter
                label={RESTRICTION_LABELS[tag]}
                value={restrictions[tag]}
                min={0}
                onChange={(value) => setRestriction(tag, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}
      
      {/* Nielsen's Heuristics: Help users recognize, diagnose, and recover from errors */}
      {(hasZeroGuests || invalidRestrictions.length > 0) && (
        <div className="mb-6 rounded-xl border border-error/20 bg-error/5 p-4 text-error">
          <p className="mb-1 font-bold">Ajustes necessários:</p>
          <ul className="list-disc pl-5 text-sm">
            {hasZeroGuests && (
              <li>Adicione pelo menos 1 convidado para calcularmos a festa.</li>
            )}
            {invalidRestrictions.map(([tag, count]) => (
              <li key={tag}>
                Há mais pessoas com restrição <b>({RESTRICTION_LABELS[tag as DietaryTag]}: {count})</b> do que o total de convidados na festa ({total}).
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center border-t border-outline-variant/20 bg-background/80 px-4 py-4 pb-safe shadow-[var(--shadow-floating)] backdrop-blur-xl [animation:var(--animate-rise)_forwards]">
        <div className="w-full max-w-2xl flex items-center justify-between gap-4">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Total Estimado</span>
            <span className="text-2xl font-bold text-primary">{total} Convidados</span>
          </div>
          
          <div className="flex flex-1 gap-3 sm:flex-none">
            <Button
              variant="secondary"
              icon="arrow-left"
              onClick={() => navigate('/new')}
              className="px-4"
              aria-label="Voltar"
            />
            <Button
              className="flex-1 shadow-lg sm:w-48"
              iconRight="arrow-right"
              onClick={handleNext}
              disabled={!canProceed}
              loading={isSaving}
            >
              {isSaving ? 'Salvando…' : 'Avançar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GuestRowProps {
  icon: IconName
  title: string
  hint: string
  value: number
  onChange: (value: number) => void
  last?: boolean
}

function GuestRow({ icon, title, hint, value, onChange, last }: GuestRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        last ? '' : 'border-b border-outline-variant/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
          <Icon name={icon} size={20} />
        </span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-on-surface-variant">{hint}</p>
        </div>
      </div>
      <Counter label={title} value={value} min={0} onChange={onChange} />
    </div>
  )
}
