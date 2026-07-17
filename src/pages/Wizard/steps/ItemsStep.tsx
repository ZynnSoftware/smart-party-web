import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'
import { useEstimate } from '@/hooks/useEstimate'
import { ItemList, RemovedItems } from '../ItemList'
import { formatBRL } from '@/utils/money'
import type { ItemOverride, ExtraItem } from '@/types/domain'

export function ItemsStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, patch } = useWizard()
  const { estimate, isLoading, error, refresh } = useEstimate(id)

  const [newCustomName, setNewCustomName] = useState('')
  const [newCustomPrice, setNewCustomPrice] = useState('')
  const [justAdded, setJustAdded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOverride = async (overrides: Record<string, ItemOverride>) => {
    await patch({ itemOverrides: overrides })
    await refresh()
  }

  const handleAddCustom = async () => {
    if (!newCustomName.trim()) return
    
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 800)

    const cleanPrice = newCustomPrice.replace(/[^\d.,]/g, '').replace(',', '.')
    const price = parseFloat(cleanPrice) || 0
    const newItem: ExtraItem = {
      id: `custom_${Date.now()}`,
      name: newCustomName.trim(),
      quantity: 1,
      unitPrice: price,
    }
    const extraItems = [...(event?.extraItems ?? []), newItem]
    await patch({ extraItems })
    setNewCustomName('')
    setNewCustomPrice('')
    await refresh()
  }

  if (isLoading && !estimate) {
    return (
      <div>
        <Stepper current={4} />
        <SkeletonList rows={5} />
      </div>
    )
  }
  if (error) {
    return (
      <div className="py-10">
        <EmptyState
          illustration="error"
          title="Não conseguimos carregar a lista"
          description={error}
          action={
            <Button icon="restore" onClick={() => refresh()}>
              Tentar de novo
            </Button>
          }
        />
      </div>
    )
  }
  if (!estimate) return null

  const { items, keptTotal } = estimate.budget
  const { adults, children } = estimate.event.guests
  const guestCount = adults + children

  return (
    <div className="pb-32">
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '0ms' }}>
        <Stepper current={4} />
      </div>
      
      <div 
        className="mb-8"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '100ms' }}
      >
        <h1 className="mb-2 text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface">Lista de compras</h1>
        <p className="text-base text-on-surface-variant">
          Geramos tudo a partir dos convidados e das suas anotações. Ajuste como quiser.
        </p>
      </div>

      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '200ms' }}>
        <ItemList
          items={items}
          currentOverrides={event?.itemOverrides ?? {}}
          onOverride={handleOverride}
          guestCount={guestCount}
        />

        <RemovedItems
          removedItems={estimate.removedItems}
          currentOverrides={event?.itemOverrides ?? {}}
          onOverride={handleOverride}
        />
      </div>

      {/* Floating action to add an extra item / review notes — a supporting action,
          so it stays visually lighter than the primary "Orçamento e Divisão" CTA below. */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-24 right-5 sm:bottom-28 sm:right-10 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-surface-container-lowest text-primary shadow-[var(--shadow-card)] transition-transform hover:scale-105 hover:border-primary hover:shadow-[var(--shadow-floating)] active:scale-95"
        aria-label="Adicionar item ou ver considerações"
      >
        <Icon name="plus" size={22} />
      </button>

      {/* Modal for Extras & Notes */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-background/80 backdrop-blur-md sm:items-center sm:justify-center sm:p-5">
          <div className="flex w-full flex-col bg-surface sm:w-[600px] sm:max-h-[90vh] sm:rounded-3xl sm:shadow-2xl border-t sm:border border-outline-variant/20 overflow-hidden" style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDuration: '0.3s' }}>
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4 bg-surface-container-lowest">
              <h2 className="text-xl font-extrabold text-on-surface">Ajustes da Lista</h2>
              <button onClick={() => setIsMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest/50 text-on-surface-variant transition hover:bg-surface-container-highest">
                <Icon name="close" size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-surface">
              {event?.notes && (
                <div className="mb-10 flex items-start gap-3 rounded-2xl bg-tertiary/10 p-5 text-tertiary">
                  <Icon name="sparkles" size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-widest">Suas Considerações</p>
                    <p className="text-sm font-medium leading-relaxed opacity-90 whitespace-pre-wrap">{event.notes}</p>
                  </div>
                </div>
              )}

              <div className={`rounded-[28px] p-6 transition-all duration-700 ease-out ${justAdded ? 'bg-primary/10 scale-[1.02] ring-2 ring-primary' : 'bg-surface-container/30 scale-100 ring-1 ring-outline-variant/20'}`}>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  Adicionar Extra {justAdded && <Icon name="check" className="text-primary [animation:var(--animate-rise)_forwards]" size={16} />}
                </h3>
                <div className="flex flex-col gap-3">
                  <input
                    value={newCustomName}
                    onChange={(e) => setNewCustomName(e.target.value)}
                    placeholder="Nome (Ex: Bolo de nozes...)"
                    className="w-full border-b-2 border-outline-variant/30 bg-transparent px-2 py-3 text-lg font-medium text-on-surface outline-none transition focus:border-primary placeholder:text-on-surface-variant/40"
                  />
                  <input
                    value={newCustomPrice}
                    onChange={(e) => setNewCustomPrice(e.target.value)}
                    placeholder="Preço Unitário (Ex: R$ 15,00)"
                    inputMode="numeric"
                    className="w-full border-b-2 border-outline-variant/30 bg-transparent px-2 py-3 text-lg font-medium text-on-surface outline-none transition focus:border-primary placeholder:text-on-surface-variant/40"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      className="rounded-full transition-transform active:scale-95"
                      onClick={() => {
                        setNewCustomName('')
                        setNewCustomPrice('')
                      }}
                      disabled={justAdded}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 rounded-full transition-transform active:scale-95"
                      icon="plus"
                      onClick={handleAddCustom}
                      disabled={!newCustomName.trim() || justAdded}
                    >
                      {justAdded ? 'Adicionado com sucesso!' : 'Incluir na Lista'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center border-t border-outline-variant/20 bg-background/80 px-4 py-4 pb-safe shadow-[var(--shadow-floating)] backdrop-blur-xl [animation:var(--animate-rise)_forwards]">
        <div className="w-full max-w-2xl flex items-center justify-between gap-4">
          <div className="flex min-w-0 shrink-0 flex-col">
            <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant sm:text-xs">Total Estimado</span>
            <span className="text-lg font-bold text-primary tabular-nums sm:text-2xl">{formatBRL(keptTotal)}</span>
          </div>

          <div className="flex flex-1 gap-3 sm:flex-none">
            <Button
              variant="secondary"
              icon="arrow-left"
              onClick={() => navigate(`/events/${id}/notes`)}
              className="px-4"
              aria-label="Voltar"
            />
            <Button
              className="flex-1 shadow-lg sm:w-56"
              iconRight="arrow-right"
              onClick={() => navigate(`/events/${id}/budget`)}
            >
              Orçamento e Divisão
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
