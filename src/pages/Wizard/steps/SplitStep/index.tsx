import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'
import { useToast } from '@/contexts/ToastContext'
import { useEstimate } from '@/hooks/useEstimate'
import { eventsService } from '@/services/events'
import { copyText } from '@/utils/clipboard'
import type { Event, Payer, PaymentStatus, SplitMethod } from '@/types/domain'

import { CostSummary } from './CostSummary'
import { PixKeyCard } from './PixKeyCard'
import { PayerRow } from './PayerRow'
import { ChargeModal, buildChargeMessage } from './ChargeModal'

const PERSON_SIZE = 1
const COUPLE_SIZE = 2

function seedPayers(event: Event): Payer[] {
  if (event.payers.length > 0) return event.payers
  
  const payers: Payer[] = []
  const couples = event.guests.couples ?? 0
  for (let i = 0; i < couples; i++) {
    payers.push({ name: `Casal ${i + 1}`, size: COUPLE_SIZE })
  }

  const soloAdults = event.guests.adults - couples * 2
  for (let i = 0; i < soloAdults; i++) {
    payers.push({ name: `Convidado ${i + 1}`, size: PERSON_SIZE })
  }

  return payers
}

export function SplitStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, patch } = useWizard()
  const { showToast } = useToast()
  const { estimate, isLoading, error, refresh } = useEstimate(id)

  const [payers, setPayers] = useState<Payer[]>([])
  const [method, setMethod] = useState<SplitMethod>('equal')
  const [pixKey, setPixKey] = useState('')
  const [isFinalizeOpen, setFinalizeOpen] = useState(false)
  const [isFinalizing, setFinalizing] = useState(false)
  const [chargeMessage, setChargeMessage] = useState<string | null>(null)
  const [justCopied, setJustCopied] = useState(false)

  useEffect(() => {
    if (!event) return
    setMethod(event.splitMethod)
    setPixKey(event.pixKey ?? '')
    setPayers(seedPayers(event))
  }, [event])

  const persist = async (payload: Parameters<typeof patch>[0]) => {
    await patch(payload)
    await refresh()
  }

  const commitPayers = (nextPayers: Payer[]) => {
    setPayers(nextPayers)
    void persist({ payers: nextPayers })
  }

  const addPayer = (size: number) => {
    const label = size === COUPLE_SIZE ? 'Casal' : 'Convidado'
    commitPayers([...payers, { name: `${label} ${payers.length + 1}`, size }])
  }

  const renamePayer = (index: number, name: string) =>
    setPayers((current) =>
      current.map((payer, position) =>
        position === index ? { ...payer, name } : payer,
      ),
    )

  const setPayerSize = (index: number, size: number) =>
    commitPayers(
      payers.map((payer, position) =>
        position === index ? { ...payer, size } : payer,
      ),
    )

  const removePayer = (index: number) =>
    commitPayers(payers.filter((_, position) => position !== index))

  const changeMethod = (nextMethod: SplitMethod) => {
    setMethod(nextMethod)
    void persist({ splitMethod: nextMethod })
  }

  const setCustomAmount = (name: string, amount: number) => {
    const splitShares = { ...(event?.splitShares ?? {}), [name]: amount }
    void persist({ splitShares })
  }

  const togglePayment = (name: string, current: PaymentStatus) => {
    const next: PaymentStatus = current === 'paid' ? 'pending' : 'paid'
    const payments = { ...(event?.payments ?? {}), [name]: next }
    void persist({ payments })
  }

  const savePixKey = () => void persist({ pixKey: pixKey.trim() })

  const openCharge = () => {
    if (!estimate) return
    setChargeMessage(buildChargeMessage(estimate, pixKey.trim()))
    setJustCopied(false)
  }

  const copyCharge = async () => {
    if (!chargeMessage) return
    const copied = await copyText(chargeMessage)
    setJustCopied(copied)
    if (copied) {
      showToast('Cobrança copiada!')
      window.setTimeout(() => setJustCopied(false), 2_000)
    } else {
      showToast('Não consegui copiar — selecione o texto e copie', 'error')
    }
  }

  const handleFinalize = async () => {
    if (!id) return
    setFinalizing(true)
    try {
      await eventsService.finalize(id)
      setFinalizeOpen(false)
      showToast('Evento finalizado! 🎉')
      navigate('/')
    } finally {
      setFinalizing(false)
    }
  }

  if (isLoading && !estimate) {
    return (
      <div>
        <Stepper current={5} />
        <SkeletonList rows={4} />
      </div>
    )
  }
  if (error) return <p className="py-10 text-error">{error}</p>
  if (!estimate) return null

  const { split } = estimate
  const isFinalized = estimate.event.finalizedAt !== null
  const totalPeople = split.entries.reduce((sum, entry) => sum + entry.size, 0)
  const perPerson =
    split.method === 'equal' && totalPeople > 0 ? split.total / totalPeople : null

  return (
    <div>
      <Stepper current={5} />
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Divisão de custos</h1>
      <p className="mb-6 text-on-surface-variant">
        Monte os pagadores (pessoa ou casal) e acompanhe os pagamentos.
      </p>

      <CostSummary
        total={split.total}
        outstanding={split.outstanding}
        perPerson={perPerson}
        payersCount={payers.length}
        totalPeople={totalPeople}
      />

      {/* Segmented Control for Method */}
      <div className="mb-6 mx-auto max-w-sm w-full p-1 bg-surface-container-highest/30 rounded-full flex items-center ring-1 ring-outline-variant/20">
        <button
          type="button"
          onClick={() => changeMethod('equal')}
          className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            method === 'equal' 
              ? 'bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-on-surface' 
              : 'text-on-surface-variant/70 hover:text-on-surface'
          }`}
        >
          Iguais
        </button>
        <button
          type="button"
          onClick={() => changeMethod('custom')}
          className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            method === 'custom' 
              ? 'bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-on-surface' 
              : 'text-on-surface-variant/70 hover:text-on-surface'
          }`}
        >
          Customizado
        </button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-2">
          {payers.map((payer, index) => (
            <PayerRow
              key={index}
              payer={payer}
              method={method}
              entry={split.entries.find((entry) => entry.name === payer.name)}
              onRename={(value) => renamePayer(index, value)}
              onRenameBlur={() => commitPayers(payers)}
              onSize={(size) => setPayerSize(index, size)}
              onAmount={(amount) => setCustomAmount(payer.name, amount)}
              onTogglePayment={(status) => togglePayment(payer.name, status)}
              onRemove={() => removePayer(index)}
            />
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button 
            onClick={() => addPayer(PERSON_SIZE)}
            className="flex-1 rounded-[24px] border border-dashed border-outline-variant/40 py-4 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface transition-all"
          >
            <Icon name="person" size={20} className="mb-1 opacity-70" />
            <span className="text-xs font-bold uppercase tracking-widest">+ Pessoa</span>
          </button>
          <button 
            onClick={() => addPayer(COUPLE_SIZE)}
            className="flex-1 rounded-[24px] border border-dashed border-outline-variant/40 py-4 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface transition-all"
          >
            <Icon name="couple" size={20} className="mb-1 opacity-70" />
            <span className="text-xs font-bold uppercase tracking-widest">+ Casal</span>
          </button>
        </div>
      </div>

      <PixKeyCard pixKey={pixKey} onChange={setPixKey} onSave={savePixKey} />

      {isFinalized && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-tertiary-container/40 p-4">
          <Icon name="check" size={16} className="text-tertiary" />
          <span className="text-sm font-bold uppercase tracking-widest text-tertiary">
            Evento finalizado
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" icon="share" onClick={openCharge}>
          Gerar cobrança
        </Button>
        {!isFinalized && (
          <Button
            variant="secondary"
            className="w-full"
            icon="flag"
            onClick={() => setFinalizeOpen(true)}
          >
            Finalizar evento
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full"
          icon="arrow-left"
          onClick={() => navigate('/')}
        >
          Voltar aos eventos
        </Button>
      </div>

      <ChargeModal
        chargeMessage={chargeMessage}
        onClose={() => setChargeMessage(null)}
        onCopy={copyCharge}
        justCopied={justCopied}
      />

      <ConfirmDialog
        open={isFinalizeOpen}
        title="Finalizar evento"
        description="Isso marca o evento como concluído. Você ainda poderá consultá-lo na sua lista."
        confirmLabel={isFinalizing ? 'Finalizando…' : 'Finalizar'}
        onConfirm={handleFinalize}
        onCancel={() => setFinalizeOpen(false)}
      />
    </div>
  )
}
