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
import type { ItemOverride } from '@/types/domain'

export function BudgetStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, patch } = useWizard()
  const { estimate, isLoading, error, refresh } = useEstimate(id)
  const [cap, setCap] = useState<string>(
    event?.budgetCap != null ? String(event.budgetCap) : '',
  )
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const applyCap = async (rawValue: string) => {
    setCap(rawValue)
    const parsed = Number(rawValue)
    const budgetCap = rawValue === '' || Number.isNaN(parsed) ? undefined : parsed
    await patch({ budgetCap })
    await refresh()
  }

  const handleOverride = async (overrides: Record<string, ItemOverride>) => {
    await patch({ itemOverrides: overrides })
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
          title="Não conseguimos carregar o orçamento"
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

  const { items, keptTotal, cutTotal, withinBudget } = estimate.budget
  const { adults, children } = estimate.event.guests
  const guestCount = adults + children

  const totalCost = keptTotal + cutTotal
  const parsedCap = cap ? Number(cap) : 0
  const sliderMax = Math.ceil(Math.max(totalCost * 1.5, parsedCap * 1.2, 500) / 100) * 100
  
  const currentCapValue = cap === '' ? totalCost : parsedCap
  const fillPercentage = Math.min(100, (currentCapValue / sliderMax) * 100)
  const totalCostPercentage = Math.min(100, (totalCost / sliderMax) * 100)

  return (
    <div className="pb-32 relative min-h-screen">
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '0ms' }}>
        <Stepper current={5} />
      </div>
      
      {/* Hero Section: Total Cost */}
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '100ms' }} className="mb-10 text-center flex flex-col items-center">
        <h1 className="mb-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Custo Estimado</h1>
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-3xl font-medium text-primary/50">R$</span>
          <span className="text-6xl sm:text-7xl font-black tracking-tighter text-primary tabular-nums">
            {formatBRL(keptTotal).replace('R$', '').trim()}
          </span>
        </div>
        
        {cutTotal > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-sm font-bold text-error">
            <Icon name="check" size={16} />
            Você economizou {formatBRL(cutTotal)}
          </div>
        )}

        <button 
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-surface-container-highest/50 px-5 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-container-highest active:scale-95 ring-1 ring-outline-variant/30 shadow-sm"
        >
          <Icon name="edit" size={18} className="opacity-70" />
          Ficou pesado? Cortar gastos
        </button>
      </div>

      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '200ms' }}>
        {!withinBudget && (
          <div className="mb-10 flex items-start gap-3 rounded-2xl bg-error/10 p-5 text-error">
            <Icon name="close" size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-widest">Orçamento Estourado</p>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                O teto atual não cobre nem os itens essenciais mínimos.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Lista Final</h2>
          <span className="text-sm font-medium text-on-surface-variant">
            {items.length} itens
          </span>
        </div>

        <ItemList
          items={items}
          currentOverrides={event?.itemOverrides ?? {}}
          onOverride={handleOverride}
          guestCount={guestCount}
          showCuts
        />

        <RemovedItems
          removedItems={estimate.removedItems}
          currentOverrides={event?.itemOverrides ?? {}}
          onOverride={handleOverride}
        />
      </div>

      {/* Budget Modal Overlay */}
      <div 
        className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${isBudgetModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsBudgetModalOpen(false)}
        />
        
        <div 
          className={`relative w-full max-w-lg overflow-hidden rounded-[32px] bg-surface shadow-2xl transition-transform duration-300 ${isBudgetModalOpen ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-12 sm:scale-95'}`}
        >
          <div className="p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-on-surface mb-1">Teto de Gastos</h2>
                <p className="text-sm text-on-surface-variant">
                  Defina um limite e cortaremos o excedente automaticamente.
                </p>
              </div>
              <button 
                onClick={() => setIsBudgetModalOpen(false)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-container-highest/50 text-on-surface-variant transition hover:bg-error/10 hover:text-error"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Seu Limite
                </span>
                {cap === '' && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-primary">
                    Livre
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline justify-center border-b-2 border-outline-variant/30 focus-within:border-primary transition-colors pb-1 w-full max-w-[200px]">
                <span className="text-xl font-medium text-on-surface-variant/40 mr-1">R$</span>
                <input 
                  type="number" 
                  min={0}
                  value={cap}
                  onChange={(e) => applyCap(e.target.value)}
                  placeholder="---"
                  className="w-full bg-transparent text-center text-4xl font-black text-on-surface outline-none placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            <div className="relative h-12 w-full mb-8">
              <div className="absolute inset-y-3 inset-x-3 rounded-full bg-surface-container-highest overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-75 ease-out ${withinBudget ? 'bg-primary' : 'bg-primary'}`} 
                  style={{ width: `${fillPercentage}%` }} 
                />
                {parsedCap > 0 && parsedCap < totalCost && (
                  <div 
                    className="absolute top-0 bottom-0 bg-error/40 transition-all duration-75 ease-out"
                    style={{ left: `${fillPercentage}%`, width: `${totalCostPercentage - fillPercentage}%` }}
                  />
                )}
              </div>
              
              <div 
                className="absolute top-2 bottom-2 w-1 rounded-full bg-on-surface-variant/40 z-0 transition-all duration-75"
                style={{ left: `calc(${totalCostPercentage}% + 10px)` }}
              />

              <input
                type="range"
                min={0}
                max={sliderMax}
                step={50}
                value={currentCapValue}
                onChange={(e) => applyCap(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              
              <div
                className="absolute top-1/2 -mt-7 h-14 w-14 rounded-full bg-surface border-4 border-primary shadow-lg pointer-events-none flex items-center justify-center transition-all duration-75 ease-out z-20"
                style={{ left: `calc(${fillPercentage}% - 14px)` }}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
                  <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm px-2 mb-8">
               <span className="font-semibold text-on-surface-variant">Custo Estimado</span>
               <span className="font-bold tabular-nums text-on-surface">{formatBRL(totalCost)}</span>
            </div>

            <Button 
              className="w-full shadow-lg"
              onClick={() => setIsBudgetModalOpen(false)}
            >
              Aplicar e Fechar
            </Button>
          </div>
        </div>
      </div>



      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center border-t border-outline-variant/20 bg-background/80 px-4 py-4 pb-safe shadow-[var(--shadow-floating)] backdrop-blur-xl [animation:var(--animate-rise)_forwards]">
        <div className="w-full max-w-2xl flex items-center justify-between gap-4">
          <div className="flex min-w-0 shrink-0 flex-col">
            <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant sm:text-xs">Valor Final</span>
            <span className="text-lg font-bold text-primary tabular-nums sm:text-2xl">{formatBRL(keptTotal)}</span>
          </div>
          
          <div className="flex flex-1 gap-3 sm:flex-none">
            <Button
              variant="secondary"
              icon="arrow-left"
              onClick={() => navigate(`/events/${id}/items`)}
              className="px-4"
              aria-label="Voltar"
            />
            <Button
              className="flex-1 shadow-lg sm:w-56"
              iconRight="arrow-right"
              onClick={() => navigate(`/events/${id}/split`)}
            >
              Dividir custos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
