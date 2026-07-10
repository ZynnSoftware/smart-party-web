import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function EventsListPage() {
  const navigate = useNavigate()
  const { events, isLoading, error, removeEvent } = useEvents()
  const { showToast } = useToast()
  const [pendingDelete, setPendingDelete] = useState<EventSummary | null>(null)

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const name = pendingDelete.name
    setPendingDelete(null)
    await removeEvent(pendingDelete.id)
    showToast(`"${name}" excluído`)
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-2xl px-5 py-8 [animation:var(--animate-fade-in)]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Eventos</h1>
            <p className="mt-1 text-on-surface-variant">
              Continue de onde parou ou planeje uma nova festa.
            </p>
          </div>
          <Button icon="plus" onClick={() => navigate('/new')}>
            Criar
          </Button>
        </div>

        {isLoading && <SkeletonList rows={3} />}

        {error && (
          <EmptyState
            illustration="error"
            title="Algo deu errado"
            description={error}
          />
        )}

        {!isLoading && !error && events.length === 0 && (
          <EmptyState
            title="Nenhum evento por aqui ainda"
            description="Que tal planejar sua próxima festa? Leva menos de um minuto."
            action={
              <Button icon="sparkles" onClick={() => navigate('/new')}>
                Planejar meu primeiro evento
              </Button>
            }
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const stage = eventStage(event)
            const [restriction] = activeRestrictionLabels(event.restrictions)

            return (
              <article
                key={event.id}
                tabIndex={0}
                role="button"
                onClick={() => navigate(`/events/${event.id}/items`)}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                    keyEvent.preventDefault()
                    navigate(`/events/${event.id}/items`)
                  }
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest transition-all duration-200 hover:-translate-y-0.5 hover:border-outline-variant/60 hover:shadow-[var(--shadow-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="relative h-20">
                  <img
                    src={moodImage(event.mood)}
                    alt=""
                    width={400}
                    height={80}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-on-surface backdrop-blur-sm">
                    {moodLabel(event.mood)}
                  </span>
                  {event.finalizedAt ? (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-tertiary-container px-2 py-0.5 text-xs font-semibold text-on-tertiary">
                      <Icon name="check" size={12} />
                      Finalizado
                    </span>
                  ) : (
                    <span className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm">
                      Em andamento
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h2 className="truncate font-semibold tracking-tight text-on-surface">
                      {event.name}
                    </h2>
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
                    <div
                      className="flex gap-1"
                      role="img"
                      aria-label={`Etapa: ${stage.label}`}
                    >
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
                    <span className="text-xs font-medium text-on-surface-variant">
                      {stage.label}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-1">
                    <div>
                      <p className="text-xs text-on-surface-variant">
                        {event.finalizedAt ? 'Total final' : 'Total estimado'}
                      </p>
                      <p className="font-semibold tabular-nums text-on-surface">
                        {formatBRL(event.estimatedTotal)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant">
                        {formatDate(event.createdAt)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Excluir ${event.name}`}
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation()
                          setPendingDelete(event)
                        }}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition hover:bg-error-container hover:text-error"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
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
    </>
  )
}
