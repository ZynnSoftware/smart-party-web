import { useState, useEffect } from 'react'
import { useWizard } from '@/contexts/WizardContext'
import { useEstimate } from '@/hooks/useEstimate'
import { useToast } from '@/contexts/ToastContext'
import { copyText } from '@/utils/clipboard'
import type { Payer, PaymentStatus, SplitMethod, Event } from '@/types/domain'
import { buildChargeMessage } from './ChargeModal'

const PERSON_SIZE = 1
const COUPLE_SIZE = 2

// Helper function to generate a unique ID for payers
export const generatePayerId = () => Math.random().toString(36).substring(2, 9)

function seedPayers(event: Event): Payer[] {
  if (event.payers && event.payers.length > 0) {
    // Migrate old payers without IDs to have IDs
    const migratedPayers = event.payers.map(p => ({
      ...p,
      id: p.id || generatePayerId()
    }))
    return migratedPayers
  }
  
  const payers: Payer[] = []
  const couples = event.guests.couples ?? 0
  for (let i = 0; i < couples; i++) {
    payers.push({ id: generatePayerId(), name: `Casal ${i + 1}`, size: COUPLE_SIZE })
  }

  const soloAdults = event.guests.adults - couples * 2
  for (let i = 0; i < soloAdults; i++) {
    payers.push({ id: generatePayerId(), name: `Convidado ${i + 1}`, size: PERSON_SIZE })
  }

  return payers
}

export function useSplitStep(id?: string) {
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
    commitPayers([...payers, { id: generatePayerId(), name: `${label} ${payers.length + 1}`, size }])
  }

  const renamePayer = (id: string, name: string) =>
    setPayers((current) =>
      current.map((payer) =>
        payer.id === id ? { ...payer, name } : payer,
      ),
    )

  const setPayerSize = (id: string, size: number) =>
    commitPayers(
      payers.map((payer) =>
        payer.id === id ? { ...payer, size } : payer,
      ),
    )

  const togglePayerDrinks = (id: string, drinksAlcohol: boolean) =>
    commitPayers(
      payers.map((payer) =>
        payer.id === id ? { ...payer, drinksAlcohol } : payer,
      ),
    )

  const removePayer = (id: string) =>
    commitPayers(payers.filter((payer) => payer.id !== id))

  const changeMethod = (nextMethod: SplitMethod) => {
    setMethod(nextMethod)
    void persist({ splitMethod: nextMethod })
  }

  const setCustomAmount = (name: string, amount: number | null) => {
    const splitShares = { ...(event?.splitShares ?? {}) }
    if (amount === null) {
      delete splitShares[name]
    } else {
      splitShares[name] = amount
    }
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

  return {
    estimate,
    isLoading,
    error,
    event,
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
  }
}
