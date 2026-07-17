import { Button } from '@/components/ui/Button'
import type { EventEstimate } from '@/types/domain'
import { formatBRL } from '@/utils/money'

const COUPLE_SIZE = 2

export function buildChargeMessage(estimate: EventEstimate, pixKey: string): string {
  const { event, split } = estimate
  const methodLabel =
    split.method === 'equal' ? 'dividido igualmente' : 'valores personalizados'

  const guestLines = split.entries.map((entry) => {
    const status = entry.status === 'paid' ? '✅ pago' : '⏳ pendente'
    const kind = entry.size >= COUPLE_SIZE ? ' 👫' : ''
    return `• ${entry.name}${kind}: ${formatBRL(entry.amount)} (${status})`
  })

  const lines = [
    `🎉 *${event.name}*`,
    '',
    `💰 Total: *${formatBRL(split.total)}*`,
    '',
    `👥 Divisão (${methodLabel}):`,
    ...guestLines,
    '',
    `🧾 Em aberto: ${formatBRL(split.outstanding)}`,
  ]

  if (pixKey) {
    lines.push('', `🔑 *Pix:* ${pixKey}`)
  }

  lines.push('', '_Feito com reparteaí — organize a sua também_')
  return lines.join('\n')
}

interface ChargeModalProps {
  chargeMessage: string | null
  onClose: () => void
  onCopy: () => void
  justCopied: boolean
}

export function ChargeModal({ chargeMessage, onClose, onCopy, justCopied }: ChargeModalProps) {
  if (!chargeMessage) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-5 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cobrança"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col rounded-lg bg-surface-container-lowest p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]"
      >
        <h2 className="mb-1 text-lg font-bold">Cobrança pronta</h2>
        <p className="mb-3 text-sm text-on-surface-variant">
          Copie e cole no seu grupo do WhatsApp.
        </p>
        <textarea
          readOnly
          value={chargeMessage}
          onFocus={(e) => e.target.select()}
          rows={12}
          className="mb-4 w-full resize-none rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-base outline-none"
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button icon={justCopied ? 'check' : 'copy'} onClick={onCopy}>
            {justCopied ? 'Copiado!' : 'Copiar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
