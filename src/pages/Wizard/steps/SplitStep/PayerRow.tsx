import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
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
  onAmount: (amount: number) => void
  onTogglePayment: (status: PaymentStatus) => void
  onRemove: () => void
}

function SizeChip({ active, icon, onClick, children }: { active: boolean, icon: IconName, onClick: () => void, children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full ${
        active ? 'bg-on-surface text-surface' : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      <Icon name={icon} size={14} />
      {children}
    </button>
  )
}

export function PayerRow({
  payer,
  method,
  entry,
  onRename,
  onRenameBlur,
  onSize,
  onAmount,
  onTogglePayment,
  onRemove,
}: PayerRowProps) {
  const status = entry?.status ?? 'pending'
  const isPaid = status === 'paid'
  const isCouple = payer.size >= COUPLE_SIZE

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-surface-container-highest/30 p-4 transition-all hover:bg-surface-container-highest/50">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 group flex items-center">
            <input
              value={payer.name}
              onChange={(e) => onRename(e.target.value)}
              onBlur={onRenameBlur}
              placeholder="Nome do pagador"
              className="w-full min-w-0 bg-transparent py-1 text-lg sm:text-xl font-bold tracking-tight text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 focus:text-primary pr-6"
            />
            <Icon 
              name="edit" 
              size={14} 
              className="absolute right-2 opacity-30 transition-opacity group-focus-within:opacity-0 pointer-events-none" 
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-focus-within:w-full" />
        </div>
        
        <button
          type="button"
          aria-label={`Remover ${payer.name}`}
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant/40 transition hover:bg-error/10 hover:text-error"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full bg-surface-container-highest/50 p-1">
          <SizeChip active={!isCouple} icon="person" onClick={() => onSize(PERSON_SIZE)}>
            1
          </SizeChip>
          <SizeChip active={isCouple} icon="couple" onClick={() => onSize(COUPLE_SIZE)}>
            2
          </SizeChip>
        </div>

        <div className="flex items-center gap-3">
          {method === 'custom' ? (
            <div className="flex items-baseline gap-1 border-b-2 border-outline-variant/30 focus-within:border-primary transition-colors pb-0.5">
              <span className="text-sm font-bold text-on-surface-variant/40">R$</span>
              <input
                type="number"
                min={0}
                defaultValue={entry?.amount ?? 0}
                onBlur={(e) => onAmount(Number(e.target.value))}
                className="w-16 sm:w-20 bg-transparent text-right text-xl font-black tabular-nums text-on-surface outline-none"
              />
            </div>
          ) : (
            <span className="text-xl font-black tabular-nums text-primary">
              {formatBRL(entry?.amount ?? 0)}
            </span>
          )}

          <button
            type="button"
            onClick={() => onTogglePayment(status)}
            className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
              isPaid
                ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                : 'bg-surface-container-highest text-on-surface-variant/50 hover:bg-surface-container-highest/80 hover:text-on-surface-variant'
            }`}
          >
            {isPaid && <Icon name="check" size={14} className="-ml-1" />}
            {isPaid ? 'Pago' : 'Pendente'}
          </button>
        </div>
      </div>
    </div>
  )
}
