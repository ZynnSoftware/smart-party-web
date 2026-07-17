import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SkeletonList } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ShareEventModal } from '@/components/ShareEventModal'
import { useEstimate } from '@/hooks/useEstimate'
import { eventsService } from '@/services/events'
import { formatBRL } from '@/utils/money'
import { moodImage, moodLabel } from '@/utils/moods'
import { generatePixPayload } from '@/utils/pix'
import { useToast } from '@/contexts/ToastContext'
import type { ItemCategory } from '@/types/domain'

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  meat: 'Carnes',
  'drink-alcoholic': 'Bebidas Alcoólicas',
  'drink-non-alcoholic': 'Bebidas não Alcoólicas',
  side: 'Acompanhamentos',
  bread: 'Pães',
  dessert: 'Sobremesas',
  disposable: 'Descartáveis',
  extra: 'Extras',
}

export function EventDashboardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { estimate, isLoading, error, refresh } = useEstimate(id)
  const { showToast } = useToast()

  // Local state for optimistic updates
  const [optimisticPurchased, setOptimisticPurchased] = useState<Set<string>>(new Set())
  const [optimisticPayments, setOptimisticPayments] = useState<Record<string, 'pending' | 'paid'>>({})
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)

  useEffect(() => {
    if (estimate?.event) setInviteToken(estimate.event.inviteToken)
  }, [estimate?.event])

  // Initialize optimistic state when data loads
  useEffect(() => {
    if (estimate?.event) {
      setOptimisticPurchased(new Set(estimate.event.purchasedItems || []))
      setOptimisticPayments(estimate.event.payments || {})
    }
  }, [estimate?.event])

  if (isLoading) {
    return (
      <>
        <TopBar />
        <div className="mx-auto max-w-2xl px-5 py-20">
          <SkeletonList rows={5} />
        </div>
      </>
    )
  }

  if (error || !estimate) {
    return (
      <>
        <TopBar />
        <div className="mx-auto max-w-2xl px-5 py-20">
          <EmptyState
            illustration="error"
            title="Evento não encontrado"
            description="Não conseguimos carregar os dados deste evento."
            action={<Button onClick={() => navigate('/')}>Voltar à Home</Button>}
          />
        </div>
      </>
    )
  }

  const { event, budget, split } = estimate

  const toggleCheck = async (itemId: string) => {
    // Optimistic update
    setOptimisticPurchased((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
    
    try {
      if (id) await eventsService.toggleChecklist(id, itemId)
    } catch {
      showToast('Erro ao salvar item no servidor')
      void refresh()
    }
  }

  const togglePayment = async (payerName: string) => {
    // Optimistic update
    setOptimisticPayments((prev) => ({
      ...prev,
      [payerName]: prev[payerName] === 'paid' ? 'pending' : 'paid'
    }))

    try {
      if (id) await eventsService.togglePayment(id, payerName)
    } catch {
      showToast('Erro ao atualizar status de pagamento')
      void refresh()
    }
  }

  const handleShareWhatsApp = () => {
    if (!event.pixKey) return
    
    const text = `🎉 *${event.name}* tá chegando!\n\nA sua parte do rateio ficou *${formatBRL(perPersonCost)}*.\nFaz o PIX pra confirmar sua presença!\n\n🔑 Chave PIX: ${event.pixKey}\n\nTamo junto!`
    
    if (navigator.share) {
      navigator.share({
        title: 'Rateio da Festa',
        text: text,
      }).catch(console.error)
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  // Group items by category
  const groupedItems = budget.items.reduce<Record<string, typeof budget.items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const totalAdults = event.guests.adults
  const perPersonCost = totalAdults > 0 ? budget.keptTotal / totalAdults : 0

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-2xl pb-24 [animation:var(--animate-fade-in)]">
        
        {/* Hero Area */}
        <div className="relative overflow-hidden rounded-b-[40px] bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
          <div className="absolute inset-0 z-0">
            <img 
              src={moodImage(event.mood)} 
              alt={event.name} 
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center px-6 pb-10 pt-8 text-center">
            <span className="mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
              {moodLabel(event.mood)}
            </span>
            <h1 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              {event.name}
            </h1>
            
            <div className="mt-8 flex w-full max-w-md gap-4">
              <div className="flex-1 rounded-3xl border border-outline-variant/30 bg-surface/80 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total da Festa</p>
                <p className="mt-1 text-2xl font-black text-on-surface">{formatBRL(budget.keptTotal)}</p>
              </div>
              <div className="flex-1 rounded-3xl border border-outline-variant/30 bg-primary/10 p-4 shadow-sm backdrop-blur-xl text-primary">
                <p className="text-xs font-bold uppercase tracking-wider text-primary/80">Por Convidado</p>
                <p className="mt-1 text-2xl font-black">{formatBRL(perPersonCost)}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                icon="pencil"
                className="rounded-full"
                onClick={() => navigate(`/events/${event.id}/items`)}
              >
                Editar Festa
              </Button>
              <Button
                variant="secondary"
                icon="share"
                className="rounded-full"
                onClick={() => setIsShareOpen(true)}
              >
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {isShareOpen && (
          <ShareEventModal
            eventId={event.id}
            inviteToken={inviteToken}
            onClose={() => setIsShareOpen(false)}
            onTokenChange={setInviteToken}
          />
        )}

        <div className="px-5 mt-6 flex flex-col gap-8">
          
          {/* PIX Area (Placeholder for QR Code logic) */}
          <section className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <Icon name="wallet" size={24} className="text-tertiary" />
                <h2 className="font-bold text-on-surface">Cobrancinha PIX</h2>
              </div>
            </div>
            
            <div className="p-6">
              {event.pixKey ? (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex items-center justify-center rounded-2xl bg-surface-container-highest p-4 shadow-inner">
                    <QRCodeSVG
                      value={generatePixPayload(event.pixKey, perPersonCost, 'REPARTEAI ORGANIZADOR')}
                      size={140}
                      level="M"
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant">
                    Escaneie para pagar a sua parte!
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1">
                    <Icon name="person" size={14} className="text-on-surface-variant" />
                    <span className="text-xs font-bold">{event.pixKey}</span>
                  </div>
                  <Button 
                    className="mt-6 w-full sm:w-auto" 
                    icon="person" 
                    onClick={handleShareWhatsApp}
                  >
                    Compartilhar no WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-on-surface-variant">
                    Você não cadastrou uma chave PIX.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => navigate(`/events/${event.id}/split`)}
                  >
                    Configurar agora
                  </Button>
                </div>
              )}
            </div>
            
            {/* Payers List */}
            <div className="border-t border-outline-variant/20 bg-surface-container-low/30 px-6 py-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status da Galera</p>
              <div className="flex flex-col gap-2">
                {split.entries.map((entry, idx) => {
                  const status = optimisticPayments[entry.name] ?? entry.status
                  const isPaid = status === 'paid'

                  return (
                    <button 
                      key={idx} 
                      onClick={() => togglePayment(entry.name)}
                      className="group flex w-full items-center justify-between rounded-xl bg-surface p-3 shadow-sm border border-outline-variant/20 transition hover:bg-surface-container-low active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${isPaid ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-transparent group-hover:border-primary/50'}`}>
                          {isPaid && <Icon name="check" size={14} />}
                        </div>
                        <p className={`font-medium text-sm transition-colors ${isPaid ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                          {entry.name}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className={`font-bold transition-colors ${isPaid ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                          {formatBRL(entry.amount)}
                        </p>
                        {isPaid ? (
                          <span className="text-[10px] font-bold uppercase text-primary">
                            Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-on-surface-variant rounded-full border border-outline-variant/50 px-2 py-0.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            Dar baixa
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant/20 bg-surface-container-low/50 px-6 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Icon name="check" size={24} className="text-primary" />
                  <h2 className="font-bold text-on-surface">Lista de Compras</h2>
                </div>
                <p className="mt-1 text-xs text-on-surface-variant">Marque os itens no mercado.</p>
              </div>
              <Button
                iconRight="arrow-right"
                onClick={() => navigate(`/events/${event.id}/shopping`)}
                className="shrink-0"
              >
                Modo Mercado
              </Button>
            </div>
            
            <div className="p-2 sm:p-4">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h3 className="mb-2 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">
                    {CATEGORY_LABELS[category as ItemCategory] || category}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {items.map((item) => {
                      const isChecked = optimisticPurchased.has(item.itemId)
                      return (
                        <button
                          key={item.itemId}
                          onClick={() => toggleCheck(item.itemId)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all active:scale-[0.98] ${
                            isChecked ? 'bg-surface-container/50 opacity-60' : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                              isChecked ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant'
                            }`}>
                              {isChecked && <Icon name="check" size={14} />}
                            </div>
                            <span className={`font-medium text-sm transition-all ${isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold transition-all ${isChecked ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
