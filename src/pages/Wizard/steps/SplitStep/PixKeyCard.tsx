import { Icon } from '@/components/ui/Icon'

interface PixKeyCardProps {
  pixKey: string
  onChange: (value: string) => void
  onSave: () => void
}

export function PixKeyCard({ pixKey, onChange, onSave }: PixKeyCardProps) {
  return (
    <div className="mb-8 rounded-3xl bg-surface-container-highest/20 p-5 ring-1 ring-outline-variant/10">
      <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
        <Icon name="key" size={14} className="text-primary" />
        Sua chave Pix <span className="font-medium text-on-surface-variant/40">(opcional)</span>
      </label>
      <div className="relative group mt-3">
        <input
          value={pixKey}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onSave}
          placeholder="CPF, e-mail ou telefone"
          className="w-full min-w-0 bg-transparent pb-2 text-lg font-bold tracking-tight text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 focus:text-primary"
        />
        <div className="h-[2px] w-full bg-outline-variant/30 transition-colors duration-300 group-focus-within:bg-primary" />
      </div>
      <p className="mt-3 text-[11px] font-medium text-on-surface-variant/50">
        Ela aparecerá na mensagem de cobrança quando você gerar o rateio para enviar aos convidados.
      </p>
    </div>
  )
}
