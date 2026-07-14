import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { formatBRL } from '@/utils/money'
import type { Payer, SplitEntry, SplitMethod, PaymentStatus } from '@/types/domain'

const PERSON_SIZE = 1
const COUPLE_SIZE = 2

interface PayerRowProps {
  payer: Payer
  method: SplitMethod
  entry: SplitEntry | undefined
  onRename: (value: string) => void
  onRenameBlur: () => void
  onSize: (size: number) => void
  onToggleDrinks: (drinks: boolean) => void
  onAmount: (amount: number | null) => void
  onTogglePayment: (status: PaymentStatus) => void
  onRemove: () => void
}


function useFlash(value: number) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value > prevRef.current) {
      setFlash('up')
    } else if (value < prevRef.current) {
      setFlash('down')
    }
    prevRef.current = value

    const timer = setTimeout(() => setFlash(null), 800)
    return () => clearTimeout(timer)
  }, [value])

  return flash
}

export function PayerRow({
  payer,
  method,
  entry,
  onRename,
  onRenameBlur,
  onSize,
  onToggleDrinks,
  onAmount,
  onTogglePayment,
  onRemove,
}: PayerRowProps) {
  const status = entry?.status ?? 'pending'
  const isPaid = status === 'paid'
  const isCouple = payer.size >= COUPLE_SIZE
  const drinksAlcohol = payer.drinksAlcohol !== false
  const amount = entry?.amount ?? 0
  const isFixed = entry?.breakdown?.isFixed ?? false

  const flash = useFlash(amount)
  // Recomputed splits (e.g. toggling Álcool/Só Refri) can carry repeating
  // decimals; never surface the raw float in the editable field.
  const displayAmount = entry?.amount != null ? Math.round(entry.amount * 100) / 100 : ''
  const flashClass =
    flash === 'up' ? 'text-error' : flash === 'down' ? 'text-tertiary' : ''

  return (
    <div className="flex items-center gap-3 p-3 bg-surface rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20 transition-all hover:border-outline-variant/40">
      
      {/* Left: Status Avatar */}
      <button 
        type="button"
        onClick={() => onTogglePayment(status)}
        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isPaid 
            ? 'bg-primary text-on-primary shadow-sm' 
            : 'bg-surface-container-highest text-on-surface-variant/40 hover:text-on-surface-variant'
        }`}
        title={isPaid ? 'Marcar como Pendente' : 'Marcar como Pago'}
      >
        <Icon name={isPaid ? 'check' : 'person'} size={20} />
      </button>

      {/* Middle: Name & Inline Controls */}
      <div className="flex flex-col flex-1 min-w-0 py-0.5">
        <div className="relative group flex items-center">
          <input
            value={payer.name}
            onChange={(e) => onRename(e.target.value)}
            onBlur={onRenameBlur}
            placeholder="Nome do pagador"
            className="w-full text-base sm:text-lg font-bold tracking-tight text-on-surface bg-transparent outline-none truncate pr-6 placeholder:text-on-surface-variant/30 focus:text-primary"
          />
          <Icon name="edit" size={12} className="absolute right-2 opacity-0 transition-opacity group-focus-within:opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-focus-within:w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Size Segmented Control */}
          <div className="flex items-center p-0.5 bg-surface-container-highest/20 rounded-md ring-1 ring-outline-variant/10">
            <button 
              type="button"
              onClick={() => onSize(PERSON_SIZE)} 
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                !isCouple 
                  ? 'bg-surface shadow-sm text-on-surface' 
                  : 'text-on-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Icon name="person" size={10} /> Pessoa
            </button>
            <button 
              type="button"
              onClick={() => onSize(COUPLE_SIZE)} 
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                isCouple 
                  ? 'bg-surface shadow-sm text-on-surface' 
                  : 'text-on-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Icon name="couple" size={10} /> Casal
            </button>
          </div>

          {/* Drinks Segmented Control */}
          {method === 'custom' && (
            <div className="flex items-center p-0.5 bg-surface-container-highest/20 rounded-md ring-1 ring-outline-variant/10">
              <button 
                type="button"
                onClick={() => onToggleDrinks(true)} 
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  drinksAlcohol 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface-variant/50 hover:text-on-surface'
                }`}
              >
                🍻 Álcool
              </button>
              <button 
                type="button"
                onClick={() => onToggleDrinks(false)} 
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  !drinksAlcohol 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface-variant/50 hover:text-on-surface'
                }`}
              >
                🥤 Só Refri
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Amount, Extrato & Trash */}
      <div className="flex flex-col items-end shrink-0 pl-1">
        <div className="flex items-center gap-1 sm:gap-2">
          {method === 'custom' ? (
            <div className="flex items-center gap-1">
              {isFixed && (
                <button 
                  onClick={() => onAmount(null)} 
                  className="text-on-surface-variant/30 hover:text-primary transition-colors p-1"
                  title="Destravar valor"
                >
                  <Icon name="lock" size={12} />
                </button>
              )}
              <div
                className={`flex items-baseline gap-0.5 border-b transition-colors ${
                  isFixed ? 'border-transparent' : 'border-outline-variant/30 focus-within:border-primary'
                } ${flashClass}`}
                style={{ transition: flash ? 'none' : 'color 0.5s ease-out' }}
              >
                <span className="text-[10px] font-bold text-on-surface-variant/50">R$</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Auto"
                  value={displayAmount}
                  onChange={(e) => onAmount(e.target.value === '' ? null : Number(e.target.value))}
                  className={`w-20 sm:w-24 bg-transparent text-right text-lg sm:text-xl font-black tabular-nums outline-none transition-colors placeholder:text-on-surface-variant/30 ${
                    flashClass || (isFixed ? 'text-on-surface-variant/70' : 'text-on-surface')
                  }`}
                />
              </div>
            </div>
          ) : (
            <span className="text-lg sm:text-xl font-black tabular-nums text-primary pr-1">
              {formatBRL(amount)}
            </span>
          )}

          <button 
            onClick={onRemove} 
            className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant/30 hover:bg-error/10 hover:text-error transition-colors"
            title="Remover"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>

        {/* Mini Extrato aligned right but pushed left from trash */}
        <div className="pr-8 sm:pr-9 mt-0.5">
          {method === 'custom' && entry?.breakdown && !isFixed && (
            <span className="block text-[9px] font-medium tracking-wider text-on-surface-variant/50 text-right whitespace-nowrap">
              {formatBRL(entry.breakdown.food)} 🍔 {entry.breakdown.alcohol > 0 && `+ ${formatBRL(entry.breakdown.alcohol)} 🍻`}
            </span>
          )}
          {method === 'custom' && isFixed && (
            <span className="block text-[9px] font-medium tracking-wider text-on-surface-variant/50 text-right">
              Valor travado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
