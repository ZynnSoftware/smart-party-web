import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'
import type { Mood, Restrictions } from '@/types/domain'

interface MoodOption {
  mood: Mood
  title: string
  description: string
  icon: IconName
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    mood: 'classic-barbecue',
    title: 'Churrasco Clássico',
    description: 'Carnes, cerveja gelada e amigos.',
    icon: 'party',
  },
  {
    mood: 'birthday',
    title: 'Festa de Aniversário',
    description: 'Bolo, balões e muita comemoração.',
    icon: 'sparkles',
  },
  {
    mood: 'intimate',
    title: 'Reunião Íntima',
    description: 'Vinho, queijos e conversas tranquilas.',
    icon: 'moon',
  },
  {
    mood: 'large-event',
    title: 'Grande Evento',
    description: 'Muitos convidados, logística completa.',
    icon: 'users',
  },
  {
    mood: 'casual-burger',
    title: 'Noite do Hambúrguer',
    description: 'Hambúrgueres, fritas e cerveja.',
    icon: 'party',
  },
  {
    mood: 'happy-hour',
    title: 'Happy Hour / Boteco',
    description: 'Foco em bebidas geladas e petiscos.',
    icon: 'party',
  },
  {
    mood: 'kids-party',
    title: 'Festa Infantil',
    description: 'Salgadinhos, doces e muito refrigerante.',
    icon: 'sparkles',
  },
  {
    mood: 'brunch',
    title: 'Brunch / Café',
    description: 'Pães, frios, bolos e café.',
    icon: 'sun',
  },
  {
    mood: 'pool-party',
    title: 'Pool Party',
    description: 'Muita água, gelo e bebidas refrescantes.',
    icon: 'sun',
  },
  {
    mood: 'baby-shower',
    title: 'Chá de Bebê',
    description: 'Sanduíches, salgadinhos e docinhos.',
    icon: 'sparkles',
  },
]

const EMPTY_RESTRICTIONS: Restrictions = {
  vegan: 0,
  vegetarian: 0,
  'gluten-free': 0,
  'lactose-free': 0,
}

const DEFAULT_ADULTS = 0

export function MoodStep() {
  const navigate = useNavigate()
  const { startDraft, isSaving, error } = useWizard()
  const [selected, setSelected] = useState<Mood | null>(null)
  const [name, setName] = useState('')

  // Only the mood is required; the name is optional and defaults from the mood.
  const canProceed = Boolean(selected)

  const handleNext = async () => {
    if (!selected) return
    const fallbackName = MOOD_OPTIONS.find(
      (option) => option.mood === selected,
    )!.title
    try {
      const created = await startDraft({
        name: name.trim() || fallbackName,
        mood: selected,
        guests: { adults: DEFAULT_ADULTS, children: 0 },
        restrictions: EMPTY_RESTRICTIONS,
      })
      navigate(`/events/${created.id}/guests`)
    } catch {
      // startDraft already surfaced the error via context; stay on this step.
    }
  }

  return (
    <div className="pb-28">
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '0ms' }}>
        <Stepper current={1} />
      </div>

      <div 
        className="mb-12"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '100ms' }}
      >
        <label className="block">
          <input
            value={name}
            onChange={(changeEvent) => setName(changeEvent.target.value)}
            placeholder="Dê um nome para a festa..."
            className="w-full bg-transparent text-4xl font-extrabold tracking-tighter text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 sm:text-5xl"
          />
        </label>
      </div>

      <div 
        className="mb-4"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '200ms' }}
      >
        <h2 className="text-xl font-bold tracking-tight">Qual o clima?</h2>
        <p className="text-sm text-on-surface-variant">
          A vibe personaliza toda a lista de compras.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOOD_OPTIONS.map((option, index) => {
          const isSelected = selected === option.mood
          // Image name maps from the mood type e.g. 'classic-barbecue' -> 'mood_classic_barbecue.png'
          const imageFileName = `mood_${option.mood.replace('-', '_')}.png`
          
          return (
            <button
              key={option.mood}
              type="button"
              onClick={() => setSelected(option.mood)}
              style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: `${250 + index * 50}ms` }}
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-primary shadow-md scale-[0.98]'
                  : 'border-transparent shadow-[var(--shadow-card)] hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container">
                <img 
                  src={`/moods/${imageFileName}`} 
                  alt={option.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className={`flex flex-1 flex-col justify-between p-3 transition-colors ${isSelected ? 'bg-primary/5' : 'bg-surface-container-lowest'}`}>
                <div>
                  <span className="flex items-start justify-between gap-1 font-bold leading-tight">
                    {option.title}
                    {isSelected && (
                      <Icon
                        name="check"
                        size={16}
                        className="shrink-0 text-primary [animation:var(--animate-pop-in)]"
                      />
                    )}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant line-clamp-2">
                    {option.description}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {canProceed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-outline-variant/20 bg-background/80 px-4 py-4 pb-safe shadow-[var(--shadow-floating)] backdrop-blur-xl [animation:var(--animate-rise)_forwards]">
          <div className="w-full max-w-2xl">
            <Button
              size="lg"
              className="w-full shadow-lg"
              iconRight="arrow-right"
              onClick={handleNext}
              loading={isSaving}
            >
              {isSaving ? 'Criando…' : 'Continuar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
