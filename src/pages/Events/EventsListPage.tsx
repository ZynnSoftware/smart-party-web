import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { TopBar } from '@/components/TopBar'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { useEvents } from '@/hooks/useEvents'
import { useToast } from '@/contexts/ToastContext'
import { formatBRL } from '@/utils/money'
import { moodImage, moodLabel } from '@/utils/moods'
import { activeRestrictionLabels } from '@/utils/restrictions'
import { eventStage } from '@/utils/eventStage'
import type { EventSummary } from '@/types/domain'
import { getUserProfile } from '@/services/auth'
import { SubscriptionModal } from '@/components/SubscriptionModal'
import { pushEvent } from '@/utils/gtm'

const MORNING_STARTS_AT = 5
const AFTERNOON_STARTS_AT = 12
const EVENING_STARTS_AT = 18
const CARD_STAGGER_MS = 70

function greetingForNow(): string {
  const currentHour = new Date().getHours()
  if (currentHour >= MORNING_STARTS_AT && currentHour < AFTERNOON_STARTS_AT) return 'Bom dia'
  if (currentHour >= AFTERNOON_STARTS_AT && currentHour < EVENING_STARTS_AT) return 'Boa tarde'
  return 'Boa noite'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function navigationTarget(event: EventSummary): string {
  return event.finalizedAt ? `/events/${event.id}/dashboard` : `/events/${event.id}/items`
}

export function EventsListPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { events, isLoading, error, removeEvent } = useEvents()
  const { showToast } = useToast()

  const [pendingDelete, setPendingDelete] = useState<EventSummary | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getUserProfile()
      .then((profile) => setIsPremium(profile.subscriptionStatus === 'active'))
      .catch((err) => console.error('Failed to load user profile', err))
  }, [])

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const name = pendingDelete.name
    setPendingDelete(null)
    await removeEvent(pendingDelete.id)
    showToast(`"${name}" excluído`)
  }

  const openEvent = (event: EventSummary) => {
    pushEvent('event_card_clicked', { event_id: event.id, finalized: !!event.finalizedAt })
    navigate(navigationTarget(event))
  }

  // The newest in-progress event gets the spotlight; the rest go to the grid.
  const spotlight = events.find((event) => !event.finalizedAt) ?? null
  const gridEvents = spotlight
    ? events.filter((event) => event.id !== spotlight.id)
    : events

  const inProgressCount = events.filter((event) => !event.finalizedAt).length
  const plannedTotal = events.reduce((sum, event) => sum + event.estimatedTotal, 0)
  const firstName = user?.firstName

  return (
    <>
      <TopBar />
      <main className="relative mx-auto max-w-5xl overflow-x-clip px-5 pb-16 pt-10 [animation:var(--animate-fade-in)] xl:max-w-6xl">
        {/* Ambient backdrop: soft brand glows behind the hero, both themes. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-tertiary-container/10 blur-3xl" />
        </div>

        {/* ─── Hero ─── */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
              {greetingForNow()}
              {firstName ? `, ${firstName}` : ''}
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl">
                Meus Eventos
              </h1>
              {isPremium && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-primary/20">
                  PRO
                </span>
              )}
            </div>
            <p className="mt-2 max-w-md text-on-surface-variant">
              Continue de onde parou ou planeje uma nova festa.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            {!isPremium && (
              <Button
                variant="secondary"
                icon="sparkles"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 justify-center sm:flex-none"
              >
                Assinar Premium
              </Button>
            )}
            <Button
              icon="plus"
              onClick={() => {
                pushEvent('event_create_clicked')
                navigate('/new')
              }}
              className="flex-1 justify-center sm:flex-none"
            >
              Criar
            </Button>
          </div>
        </div>

        {/* ─── Stats strip ─── */}
        {!isLoading && !error && events.length > 0 && (
          <div className="mb-10 grid grid-cols-3 gap-3 [animation:var(--animate-rise)]">
            <StatTile icon="party" label="Eventos" value={String(events.length)} />
            <StatTile icon="flag" label="Em andamento" value={String(inProgressCount)} />
            <StatTile icon="wallet" label="Total planejado" value={formatBRL(plannedTotal)} />
          </div>
        )}

        {isLoading && <SkeletonList rows={3} />}

        {error && (
          <EmptyState illustration="error" title="Algo deu errado" description={error} />
        )}

        {!isLoading && !error && events.length === 0 && (
          <EmptyState
            title="Nenhum evento por aqui ainda"
            description="Que tal planejar sua próxima festa? Leva menos de um minuto."
            action={
              <Button icon="sparkles" onClick={() => {
                pushEvent('event_create_clicked')
                navigate('/new')
              }}>
                Planejar meu primeiro evento
              </Button>
            }
          />
        )}

        {/* ─── Spotlight: the newest in-progress event ─── */}
        {spotlight && (
          <SpotlightCard
            event={spotlight}
            onOpen={() => openEvent(spotlight)}
            onDelete={() => setPendingDelete(spotlight)}
          />
        )}

        {/* ─── Grid with the remaining events ─── */}
        {gridEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gridEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                staggerMs={index * CARD_STAGGER_MS}
                onOpen={() => openEvent(event)}
                onDelete={() => setPendingDelete(event)}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        danger
        title="Excluir evento"
        description={
          pendingDelete
            ? `Tem certeza que deseja excluir "${pendingDelete.name}"? Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <SubscriptionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

interface StatTileProps {
  icon: string
  label: string
  value: string
}

/** Small glass tile for the header stats strip. */
function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/70 px-4 py-3.5 shadow-[var(--shadow-card)] backdrop-blur-sm">
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
        <Icon name={icon as never} size={20} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-on-surface-variant">{label}</p>
        <p className="truncate text-lg font-extrabold tabular-nums tracking-tight text-on-surface">
          {value}
        </p>
      </div>
    </div>
  )
}

interface EventCardActions {
  event: EventSummary
  onOpen: () => void
  onDelete: () => void
}

function cardKeyboardHandler(onOpen: () => void) {
  return (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      keyEvent.preventDefault()
      onOpen()
    }
  }
}

/** Wide hero card for the event the host is most likely to resume. */
function SpotlightCard({ event, onOpen, onDelete }: EventCardActions) {
  const stage = eventStage(event)
  const [restriction] = activeRestrictionLabels(event.restrictions)
  const progressPercent = Math.round((stage.index / stage.total) * 100)

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onOpen}
      onKeyDown={cardKeyboardHandler(onOpen)}
      className="group relative mb-8 flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-outline-variant/30 bg-surface-container-lowest shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-floating)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row [animation:var(--animate-rise)]"
    >
      <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
        <img
          src={moodImage(event.mood)}
          alt=""
          width={560}
          height={320}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent sm:bg-gradient-to-r" />
        <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-on-surface backdrop-blur-sm">
          {moodLabel(event.mood)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Continue planejando
            </p>
            <h2 className="mt-1 truncate text-2xl font-extrabold tracking-tight text-on-surface">
              {event.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-on-surface-variant">
              <span>{event.guests.adults} adultos</span>
              {event.guests.children > 0 && (
                <>
                  <span aria-hidden className="opacity-40">·</span>
                  <span>{event.guests.children} crianças</span>
                </>
              )}
              {restriction && (
                <>
                  <span aria-hidden className="opacity-40">·</span>
                  <span className="font-medium text-tertiary">{restriction}</span>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Excluir ${event.name}`}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              onDelete()
            }}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition hover:bg-error-container hover:text-error"
          >
            <Icon name="trash" size={18} />
          </button>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-on-surface-variant">
            <span>Etapa: {stage.label}</span>
            <span className="tabular-nums">{progressPercent}%</span>
          </div>
          <div
            role="img"
            aria-label={`Etapa: ${stage.label}`}
            className="h-1.5 overflow-hidden rounded-full bg-surface-container-high"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-xs text-on-surface-variant">
              {event.finalizedAt ? 'Total final' : 'Total estimado'}
            </p>
            <p className="text-xl font-extrabold tabular-nums tracking-tight text-on-surface">
              {formatBRL(event.estimatedTotal)}
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
            Continuar
            <Icon name="arrow-right" size={16} />
          </span>
        </div>
      </div>
    </article>
  )
}

interface GridCardProps extends EventCardActions {
  staggerMs: number
}

/** Compact grid card for the remaining events. */
function EventCard({ event, staggerMs, onOpen, onDelete }: GridCardProps) {
  const stage = eventStage(event)
  const [restriction] = activeRestrictionLabels(event.restrictions)

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onOpen}
      onKeyDown={cardKeyboardHandler(onOpen)}
      style={{ animationDelay: `${staggerMs}ms`, animationFillMode: 'backwards' }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:border-outline-variant/60 hover:shadow-[var(--shadow-floating)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [animation:var(--animate-rise)]"
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={moodImage(event.mood)}
          alt=""
          width={400}
          height={112}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-0.5 text-xs font-medium text-on-surface backdrop-blur-sm">
          {moodLabel(event.mood)}
        </span>
        {event.finalizedAt ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-tertiary-container px-2.5 py-0.5 text-xs font-semibold text-on-tertiary">
            <Icon name="check" size={12} />
            Finalizado
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm">
            Em andamento
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="truncate font-bold tracking-tight text-on-surface">{event.name}</h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-on-surface-variant">
            <span>{event.guests.adults} adultos</span>
            {event.guests.children > 0 && (
              <>
                <span aria-hidden className="opacity-40">·</span>
                <span>{event.guests.children} crianças</span>
              </>
            )}
            {restriction && (
              <>
                <span aria-hidden className="opacity-40">·</span>
                <span className="font-medium text-tertiary">{restriction}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1" role="img" aria-label={`Etapa: ${stage.label}`}>
            {Array.from({ length: stage.total }, (_, step) => (
              <span
                key={step}
                className={`h-1 w-[18px] rounded-full ${
                  step < stage.index
                    ? stage.isDone
                      ? 'bg-tertiary'
                      : 'bg-primary'
                    : 'bg-surface-container-high'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-on-surface-variant">{stage.label}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <p className="text-xs text-on-surface-variant">
              {event.finalizedAt ? 'Total final' : 'Total estimado'}
            </p>
            <p className="font-extrabold tabular-nums text-on-surface">
              {formatBRL(event.estimatedTotal)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">{formatDate(event.createdAt)}</span>
            <button
              type="button"
              aria-label={`Excluir ${event.name}`}
              onClick={(clickEvent) => {
                clickEvent.stopPropagation()
                onDelete()
              }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition hover:bg-error-container hover:text-error"
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Action strip: makes the card read as a button and previews what's inside. */}
      <div className="flex items-center justify-between border-t border-outline-variant/20 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary transition-colors group-hover:bg-primary/10">
        <span className="truncate">
          {event.finalizedAt
            ? 'Dar baixa: compras e pagamentos'
            : 'Continuar planejamento'}
        </span>
        <Icon
          name="arrow-right"
          size={14}
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </article>
  )
}
