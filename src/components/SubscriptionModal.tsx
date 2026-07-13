import { useState } from 'react'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { createCheckoutSession } from '@/services/stripe'

interface SubscriptionModalProps {
  open: boolean
  onClose: () => void
}

const MONTHLY_PRICE_ID = 'price_1TsbcJK4gy9nvCQi0jCoj9am'
const ANNUAL_PRICE_ID = 'price_1TsbcZK4gy9nvCQi0NELNKP2'

export function SubscriptionModal({ open, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual')
  const [isLoading, setIsLoading] = useState(false)

  if (!open) return null

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)
      const priceId = selectedPlan === 'monthly' ? MONTHLY_PRICE_ID : ANNUAL_PRICE_ID
      const url = await createCheckoutSession(priceId)
      window.location.href = url
    } catch (err) {
      console.error('Failed to create checkout session', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 p-4 backdrop-blur-sm [animation:var(--animate-fade-in)]">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface p-6 shadow-2xl [animation:var(--animate-pop-in)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-surface-container-highest"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="sparkles" size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
            Desbloqueie o Premium
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Crie eventos ilimitados e organize as melhores festas com recursos avançados.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`relative flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-outline-variant/30 hover:border-outline-variant/60'
            }`}
          >
            <div>
              <p className="font-bold text-on-surface">Mensal</p>
              <p className="text-xs text-on-surface-variant">Para planejar a festa do mês</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-on-surface">R$ 9,90</p>
              <p className="text-[10px] uppercase text-on-surface-variant">/mês</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedPlan('annual')}
            className={`relative flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
              selectedPlan === 'annual'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-outline-variant/30 hover:border-outline-variant/60'
            }`}
          >
            <div className="absolute -top-3 left-4 rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-bold text-on-tertiary shadow-sm">
              MAIS POPULAR (33% OFF)
            </div>
            <div>
              <p className="font-bold text-on-surface">Anual</p>
              <p className="text-xs text-on-surface-variant">Para quem sempre reúne a galera</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-on-surface">R$ 79,90</p>
              <p className="text-[10px] uppercase text-on-surface-variant">/ano</p>
            </div>
          </button>
        </div>

        <div className="mt-8">
          <Button
            size="lg"
            className="w-full shadow-md"
            onClick={handleSubscribe}
            loading={isLoading}
          >
            {isLoading ? 'Redirecionando...' : 'Assinar e Continuar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
