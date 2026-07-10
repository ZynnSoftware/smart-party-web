import { formatBRL } from '@/utils/money'

interface CostSummaryProps {
  total: number
  outstanding: number
  perPerson: number | null
  payersCount: number
  totalPeople: number
}

export function CostSummary({
  total,
  outstanding,
  perPerson,
  payersCount,
  totalPeople,
}: CostSummaryProps) {
  return (
    <div className="mb-10 text-center flex flex-col items-center sticky top-4 z-10 py-4 backdrop-blur-xl bg-background/60 [animation:var(--animate-rise)_forwards]">
      <h2 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Valor Total</h2>
      <div className="flex items-baseline justify-center gap-1 mb-3">
        <span className="text-3xl font-medium text-primary/50">R$</span>
        <span className="text-6xl sm:text-7xl font-black tracking-tighter text-primary tabular-nums">
          {formatBRL(total).replace('R$', '').trim()}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        {outstanding > 0 ? (
          <span className="inline-flex items-center rounded-full bg-error/10 px-3 py-1 font-bold text-error">
            Falta {formatBRL(outstanding)}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
            Tudo pago!
          </span>
        )}
        <span className="text-on-surface-variant font-medium">
          {perPerson !== null 
            ? `${formatBRL(perPerson)} / cabeça` 
            : 'Valores customizados'}
        </span>
      </div>
      
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant/50">
        Dividido entre {payersCount} pagadores ({totalPeople} convidados)
      </p>
    </div>
  )
}
