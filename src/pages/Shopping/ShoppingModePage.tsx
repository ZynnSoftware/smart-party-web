import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { useEstimate } from '@/hooks/useEstimate'
import { useToast } from '@/contexts/ToastContext'
import { eventsService } from '@/services/events'
import { formatBRL, formatQuantity } from '@/utils/money'
import type { EstimatedItem, ItemCategory } from '@/types/domain'

/** Supermarket aisle walking order — meat counter first, disposables last. */
const AISLE_ORDER: ItemCategory[] = [
  'meat',
  'side',
  'bread',
  'dessert',
  'drink-non-alcoholic',
  'drink-alcoholic',
  'disposable',
  'extra',
]

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  meat: 'Carnes',
  side: 'Acompanhamentos',
  bread: 'Pães',
  dessert: 'Sobremesas',
  'drink-non-alcoholic': 'Bebidas',
  'drink-alcoholic': 'Bebidas Alcoólicas',
  disposable: 'Descartáveis',
  extra: 'Extras',
}

/**
 * Focused in-store companion: big touch targets, aisle ordering, instant
 * (optimistic) check-off and a running cart subtotal. Built for one hand on
 * the phone and the other on the cart.
 */
export function ShoppingModePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { estimate, isLoading, error, refresh } = useEstimate(id)
  const { showToast } = useToast()

  const [purchased, setPurchased] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (estimate?.event) setPurchased(new Set(estimate.event.purchasedItems ?? []))
  }, [estimate?.event])

  // Items actually worth buying: budget cuts stay out of the cart.
  const shoppingItems = useMemo(
    () => (estimate?.budget.items ?? []).filter((item) => !item.cutByBudget),
    [estimate?.budget.items],
  )

  const grouped = useMemo(() => {
    const byCategory = new Map<ItemCategory, EstimatedItem[]>()
    for (const category of AISLE_ORDER) byCategory.set(category, [])
    for (const item of shoppingItems) {
      const category = (item.category as ItemCategory) ?? 'extra'
      const bucket = byCategory.get(category) ?? byCategory.get('extra')!
      bucket.push(item)
    }
    return [...byCategory.entries()].filter(([, items]) => items.length > 0)
  }, [shoppingItems])

  const purchasedCount = shoppingItems.filter((item) => purchased.has(item.itemId)).length
  const totalCount = shoppingItems.length
  const progressPercent = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0
  const cartTotal = shoppingItems
    .filter((item) => purchased.has(item.itemId))
    .reduce((sum, item) => sum + item.totalPrice, 0)
  const estimatedTotal = shoppingItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const isAllDone = totalCount > 0 && purchasedCount === totalCount

  const toggleItem = async (itemId: string) => {
    // Optimistic: flip locally first — store connectivity is never reliable.
    setPurchased((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })

    try {
      if (id) await eventsService.toggleChecklist(id, itemId)
    } catch {
      // Don't refresh() here: a background refetch failing while offline would
      // flip the page into the full error state below and also overwrite any
      // other not-yet-synced optimistic taps. The local check mark stays as-is
      // and the toast is the only feedback — safe to retry once back online.
      showToast('Sem conexão — tente marcar de novo')
    }
  }

  if (isLoading && !estimate) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <SkeletonList rows={6} />
      </div>
    )
  }

  // Only block the whole screen when we truly have no data to show — a background
  // refresh failing after the list already loaded shouldn't wipe out the checklist.
  if (!estimate) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <EmptyState
          illustration="error"
          title="Não conseguimos carregar a lista"
          description={error ?? undefined}
          action={
            <Button icon="restore" onClick={() => refresh()}>
              Tentar de novo
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-10">
      {/* Compact sticky header: every vertical pixel matters in the aisle. */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pb-3 pt-4">
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => navigate(`/events/${id}/dashboard`)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest transition active:scale-95"
          >
            <Icon name="arrow-left" size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-on-surface">{estimate.event.name}</p>
            <p className="text-xs font-medium text-on-surface-variant">Modo mercado</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-extrabold tabular-nums text-primary">
              {purchasedCount}/{totalCount}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              itens
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 pb-3">
          <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isAllDone ? 'bg-tertiary' : 'bg-primary'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-variant">
              No carrinho:{' '}
              <span className="tabular-nums text-on-surface">{formatBRL(cartTotal)}</span>
            </span>
            <span className="text-on-surface-variant">
              Estimado:{' '}
              <span className="tabular-nums text-on-surface">{formatBRL(estimatedTotal)}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-4 [animation:var(--animate-fade-in)]">
        {isAllDone && (
          <div className="mb-4 flex items-center gap-4 rounded-3xl bg-tertiary-container/15 p-5 [animation:var(--animate-pop-in)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tertiary text-on-tertiary">
              <Icon name="check" size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-on-surface">Tudo comprado!</p>
              <p className="text-sm text-on-surface-variant">
                {formatBRL(cartTotal)} no carrinho. Boa festa!
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate(`/events/${id}/dashboard`)}
              className="shrink-0"
            >
              Painel
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {grouped.map(([category, items]) => {
            // Remaining items float to the top of each aisle group.
            const sorted = [...items].sort(
              (a, b) => Number(purchased.has(a.itemId)) - Number(purchased.has(b.itemId)),
            )
            const doneInCategory = items.filter((item) => purchased.has(item.itemId)).length
            const categoryDone = doneInCategory === items.length

            return (
              <section key={category} className={categoryDone ? 'opacity-60' : ''}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <span className="flex items-center gap-1 text-xs font-semibold tabular-nums text-on-surface-variant">
                    {categoryDone && <Icon name="check" size={14} className="text-tertiary" />}
                    {doneInCategory}/{items.length}
                  </span>
                </div>

                <div className="overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest shadow-[var(--shadow-card)]">
                  {sorted.map((item, index) => {
                    const isChecked = purchased.has(item.itemId)
                    return (
                      <button
                        key={item.itemId}
                        type="button"
                        onClick={() => toggleItem(item.itemId)}
                        aria-pressed={isChecked}
                        className={`flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left transition-all active:scale-[0.99] ${
                          index > 0 ? 'border-t border-outline-variant/15' : ''
                        } ${isChecked ? 'bg-surface-container/40' : 'hover:bg-surface-container-low/50'}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            isChecked
                              ? 'border-tertiary bg-tertiary text-on-tertiary'
                              : 'border-outline-variant'
                          }`}
                        >
                          {isChecked && <Icon name="check" size={16} />}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate font-bold transition-colors ${
                              isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-xs font-medium text-on-surface-variant">
                            {formatBRL(item.unitPrice)}/{item.unit}
                          </span>
                        </span>

                        <span className="shrink-0 text-right">
                          <span
                            className={`block text-lg font-extrabold tabular-nums ${
                              isChecked ? 'text-on-surface-variant' : 'text-primary'
                            }`}
                          >
                            {formatQuantity(item.quantity, item.unit)}
                          </span>
                          <span className="text-xs font-medium tabular-nums text-on-surface-variant">
                            {formatBRL(item.totalPrice)}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
