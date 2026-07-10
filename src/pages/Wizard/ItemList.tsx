import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Counter } from '@/components/ui/Counter'
import { Icon } from '@/components/ui/Icon'
import { formatBRL, formatQuantity } from '@/utils/money'
import type { EstimatedItem, ItemOverride, RemovedItem } from '@/types/domain'

interface ItemListProps {
  items: EstimatedItem[]
  currentOverrides: Record<string, ItemOverride>
  onOverride: (overrides: Record<string, ItemOverride>) => void
  /** Headcount used to show an approximate per-person portion. */
  guestCount?: number
  /** When true, dims items cut by the budget instead of hiding them. */
  showCuts?: boolean
}

const QUANTITY_STEP = 0.5

/** Editable shopping list shared by the Items step and the Budget step. */
export function ItemList({
  items,
  currentOverrides,
  onOverride,
  guestCount = 0,
  showCuts = false,
}: ItemListProps) {
  const setOverride = (itemId: string, override: ItemOverride) => {
    onOverride({
      ...currentOverrides,
      [itemId]: { ...currentOverrides[itemId], ...override },
    })
  }

  const CATEGORY_MAP: Record<string, { title: string; icon: string; color: string }> = {
    'meat': { title: 'Carnes e Proteínas', icon: '🥩', color: 'bg-red-500/10 text-red-500' },
    'drink-alcoholic': { title: 'Bebidas Alcoólicas', icon: '🍻', color: 'bg-amber-500/10 text-amber-500' },
    'drink-non-alcoholic': { title: 'Bebidas sem Álcool', icon: '🥤', color: 'bg-blue-500/10 text-blue-500' },
    'side': { title: 'Acompanhamentos', icon: '🥗', color: 'bg-emerald-500/10 text-emerald-500' },
    'bread': { title: 'Pães', icon: '🥖', color: 'bg-orange-500/10 text-orange-500' },
    'dessert': { title: 'Sobremesas', icon: '🍰', color: 'bg-pink-500/10 text-pink-500' },
    'disposable': { title: 'Descartáveis', icon: '🍽️', color: 'bg-gray-500/10 text-gray-500' },
    'extra': { title: 'Extras & Inclusões', icon: '✨', color: 'bg-primary/10 text-primary' }
  }

  const [forceExpand, setForceExpand] = useState<boolean | null>(null)

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'extra'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, EstimatedItem[]>)

  return (
    <div>
      <div className="mb-6 flex items-center justify-end">
        <button 
          type="button"
          onClick={() => setForceExpand(prev => prev === true ? false : true)}
          className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20 active:scale-95"
        >
          <Icon name="chevron-down" size={16} className={`transition-transform duration-300 ${forceExpand ? 'rotate-180' : 'rotate-0'}`} />
          {forceExpand ? 'Recolher Tudo' : 'Expandir Tudo'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <CategoryGroup
            key={category}
            category={category}
            catItems={catItems}
            meta={CATEGORY_MAP[category] || CATEGORY_MAP['extra']}
            showCuts={showCuts}
            guestCount={guestCount}
            setOverride={setOverride}
            forceExpand={forceExpand}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryGroup({ category, catItems, meta, showCuts, guestCount, setOverride, forceExpand }: any) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (forceExpand !== null) {
      setIsOpen(forceExpand)
    }
  }, [forceExpand])

  const catTotal = catItems.reduce((acc: number, item: any) => acc + item.totalPrice, 0)

  return (
    <div className={`flex flex-col rounded-[28px] border transition-all duration-300 ${isOpen ? 'border-outline-variant/30 bg-surface-container-lowest/70 shadow-sm' : 'border-transparent bg-surface-container/30 hover:bg-surface-container/50'}`}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer outline-none group text-left"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <span className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl ${meta.color} text-2xl sm:text-3xl shadow-sm ring-1 ring-black/5 shrink-0 transition-transform group-hover:scale-105 group-active:scale-95 bg-surface-container-lowest`}>
            {meta.icon}
          </span>
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-on-surface truncate">
              {meta.title}
            </h2>
            <p className="text-sm font-semibold text-primary truncate">
              {formatBRL(catTotal)} <span className="font-medium text-on-surface-variant/60 ml-1">· {catItems.length} {catItems.length === 1 ? 'item' : 'itens'}</span>
            </p>
          </div>
        </div>
        
        <div className={`flex shrink-0 items-center justify-center p-2 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <Icon name="chevron-down" size={28} />
        </div>
      </button>
      
      <div 
        className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 max-h-[5000px] border-t border-outline-variant/20' : 'opacity-0 max-h-0'}`}
      >
        <div className="flex flex-col p-2 sm:p-4">
          {catItems.map((item: any, index: number) => {
            const isCut = showCuts && item.cutByBudget
            const isLast = index === catItems.length - 1
            return (
              <div
                key={item.itemId}
                className={`group relative flex flex-wrap items-center justify-between gap-4 p-4 ${isLast ? '' : 'border-b border-outline-variant/20'} transition-all hover:bg-surface-container-lowest rounded-2xl ${
                  isCut ? 'opacity-40' : ''
                }`}
              >
                <button
                  type="button"
                  aria-label={`Remover ${item.name}`}
                  onClick={() => setOverride(item.itemId, { removed: true })}
                  className="absolute right-2 top-4 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant opacity-70 transition hover:bg-error/10 hover:text-error sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Icon name="close" size={18} />
                </button>

                <div className="min-w-[160px] flex-1 pr-10 sm:pr-12">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-bold text-on-surface sm:text-lg">{item.name}</p>
                    {item.essential && !item.isCustom && (
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                        Essencial
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-on-surface-variant">
                      {formatQuantity(item.quantity, item.unit)} · {formatBRL(item.unitPrice)}/{item.unit}
                    </p>
                    {guestCount > 0 && (
                      <p className="text-xs text-on-surface-variant/50 hidden sm:block">
                        (~ {formatQuantity(item.quantity / guestCount, item.unit)}/pessoa)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
                  <Counter
                    label={item.name}
                    value={item.quantity}
                    min={0}
                    step={QUANTITY_STEP}
                    onChange={(quantity) => setOverride(item.itemId, { quantity })}
                  />
                  <p className="min-w-[90px] text-right text-lg font-bold text-primary tabular-nums">
                    {formatBRL(item.totalPrice)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface RemovedItemsProps {
  removedItems: RemovedItem[]
  currentOverrides: Record<string, ItemOverride>
  onOverride: (overrides: Record<string, ItemOverride>) => void
}

/** Panel listing removed suggestions, each restorable back into the list. */
export function RemovedItems({
  removedItems,
  currentOverrides,
  onOverride,
}: RemovedItemsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (removedItems.length === 0) return null

  const restore = (itemId: string) => {
    onOverride({
      ...currentOverrides,
      [itemId]: { ...currentOverrides[itemId], removed: false },
    })
  }

  return (
    <div className="flex flex-col mt-4">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-3 flex items-center justify-between px-2 cursor-pointer transition-opacity hover:opacity-80 outline-none"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-highest/40 text-2xl shadow-sm ring-1 ring-black/5 text-on-surface-variant grayscale shrink-0">
            ♻️
          </span>
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold tracking-tight text-on-surface opacity-60 sm:text-2xl">
              Lixeira
            </h2>
            <p className="text-sm font-semibold text-on-surface-variant/70">
              {removedItems.length} {removedItems.length === 1 ? 'item removido' : 'itens removidos'}
            </p>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest/50 text-on-surface-variant transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <Icon name="keyboard-arrow-down" size={20} />
        </div>
      </button>
      
      <div 
        className={`flex flex-col rounded-[28px] border border-outline-variant/30 bg-surface-container-lowest/40 shadow-sm overflow-hidden transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100 max-h-[5000px] mt-1 p-5 sm:p-6' : 'opacity-0 scale-y-0 max-h-0 border-transparent overflow-hidden'}`}
      >
        <p className="mb-4 text-sm font-medium text-on-surface-variant">
          Tirou sem querer? Toque para trazer de volta.
        </p>
        <div className="flex flex-wrap gap-2">
          {removedItems.map((item) => (
            <button
              key={item.itemId}
              type="button"
              onClick={() => restore(item.itemId)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface-variant ring-1 ring-outline-variant/30 transition hover:bg-primary/10 hover:text-primary hover:ring-primary/30 shadow-sm"
            >
              <Icon name="restore" size={16} className="text-primary/70" />
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
