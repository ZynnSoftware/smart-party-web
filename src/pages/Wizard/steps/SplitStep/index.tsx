import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/Stepper'
import { useToast } from '@/contexts/ToastContext'
import { eventsService } from '@/services/events'
import { CostSummary } from './CostSummary'
import { PixKeyCard } from './PixKeyCard'
import { PayerRow } from './PayerRow'
import { ChargeModal } from './ChargeModal'
import { useSplitStep } from './useSplitStep'

export function SplitStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()

  const {
    estimate,
    isLoading,
    error,
    payers,
    method,
    pixKey,
    setPixKey,
    isFinalizeOpen,
    setFinalizeOpen,
    isFinalizing,
    setFinalizing,
    chargeMessage,
    setChargeMessage,
    justCopied,
    addPayer,
    renamePayer,
    setPayerSize,
    togglePayerDrinks,
    removePayer,
    changeMethod,
    setCustomAmount,
    togglePayment,
    savePixKey,
    openCharge,
    copyCharge,
    commitPayers,
    PERSON_SIZE,
    COUPLE_SIZE
  } = useSplitStep(id)

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
        <div className="flex flex-col gap-4">
          {payers.map((payer) => (
            <PayerRow
              key={payer.id}
              payer={payer}
              method={method}
              entry={split.entries.find((entry) => entry.name === payer.name)}
              onRename={(value) => renamePayer(payer.id!, value)}
              onRenameBlur={() => commitPayers(payers)}
              onSize={(size) => setPayerSize(payer.id!, size)}
              onToggleDrinks={(drinks) => togglePayerDrinks(payer.id!, drinks)}
              onAmount={(amount) => setCustomAmount(payer.name, amount)}
              onTogglePayment={(status) => togglePayment(payer.name, status)}
              onRemove={() => removePayer(payer.id!)}
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
