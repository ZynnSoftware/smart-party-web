import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'
import type { Mood, Restrictions } from '@/types/domain'
import { SubscriptionModal } from '@/components/SubscriptionModal'
import { MOOD_FILTER_LABELS, MOOD_FILTER_TAGS, type MoodFilterTag } from '@/utils/moods'

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
  {
    mood: 'new-years',
    title: 'Ano Novo / Réveillon',
    description: 'Espumante, ceia e virada da meia-noite.',
    icon: 'sparkles',
  },
  {
    mood: 'wedding',
    title: 'Casamento / Noivado',
    description: 'Canapés, espumante e bolo de casamento.',
    icon: 'party',
  },
  {
    mood: 'graduation',
    title: 'Formatura',
    description: 'Brinde, salgadinhos e comemoração.',
    icon: 'sparkles',
  },
  {
    mood: 'family-lunch',
    title: 'Almoço em Família',
    description: 'Carnes, acompanhamentos e sobremesa.',
    icon: 'users',
  },
  {
    mood: 'office-party',
    title: 'Confraternização',
    description: 'Petiscos, pizza e cerveja com a equipe.',
    icon: 'users',
  },
  {
    mood: 'rooftop',
    title: 'Sunset / Terraço',
    description: 'Drinks, petiscos gourmet e vista.',
    icon: 'sun',
  },
  {
    mood: 'game-night',
    title: 'Noite de Jogos',
    description: 'Pizza, snacks e petiscos rápidos.',
    icon: 'moon',
  },
  {
    mood: 'picnic',
    title: 'Piquenique',
    description: 'Pães, frios, frutas e sucos ao ar livre.',
    icon: 'sun',
  },
  {
    mood: 'halloween',
    title: 'Halloween',
    description: 'Docinhos, salgados temáticos e susto.',
    icon: 'sparkles',
  },
  {
    mood: 'secret-santa',
    title: 'Amigo Secreto',
    description: 'Panetone, espumante e salgadinhos.',
    icon: 'party',
  },
]

const MOODS_WITH_IMAGE = new Set<Mood>([
  'classic-barbecue',
  'birthday',
  'intimate',
  'large-event',
  'casual-burger',
  'happy-hour',
  'kids-party',
  'brunch',
  'pool-party',
  'baby-shower',
  'new-years',
  'wedding',
  'graduation',
  'family-lunch',
  'office-party',
  'rooftop',
  'game-night',
  'picnic',
  'halloween',
  'secret-santa',
])

const FILTER_TAG_ORDER: MoodFilterTag[] = [
  'bebidas',
  'carne-nobre',
  'infantil',
  'doce',
  'ao-ar-livre',
  'intimista',
  'formal',
  'corporativo',
  'sazonal',
  'economico',
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<MoodFilterTag | null>(null)

  // Only the mood is required; the name is optional and defaults from the mood.
  const canProceed = Boolean(selected)

  const visibleOptions = useMemo(() => {
    if (!activeFilter) return MOOD_OPTIONS
    return MOOD_OPTIONS.filter((option) => MOOD_FILTER_TAGS[option.mood].includes(activeFilter))
  }, [activeFilter])

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
    } catch (err: any) {
      if (err?.code === 'FREE_LIMIT_REACHED') {
        setIsModalOpen(true)
      }
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

      <div
        className="relative mb-4 -mx-4"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '225ms' }}
      >
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 24px), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 16px, black calc(100% - 24px), transparent)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveFilter(null)}
            className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeFilter === null
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
            }`}
          >
            Todos
          </button>
          {FILTER_TAG_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter((current) => (current === tag ? null : tag))}
              className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === tag
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
              }`}
            >
              {MOOD_FILTER_LABELS[tag]}
            </button>
          ))}
          <div className="shrink-0 basis-2" aria-hidden="true" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleOptions.map((option, index) => {
          const isSelected = selected === option.mood
          // Image name maps from the mood type e.g. 'classic-barbecue' -> 'mood_classic_barbecue.png'
          const imageFileName = `mood_${option.mood.replace('-', '_')}.png`
          const hasImage = MOODS_WITH_IMAGE.has(option.mood)

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
                {hasImage ? (
                  <img
                    src={`/moods/${imageFileName}`}
                    alt={option.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                    <Icon
                      name={option.icon}
                      size={28}
                      className="text-primary/60 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}
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

      <SubscriptionModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
