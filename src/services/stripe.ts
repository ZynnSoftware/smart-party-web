import { api } from './api'

export async function createCheckoutSession(priceId: string): Promise<string> {
  const { data } = await api.post('/stripe/create-checkout-session', { priceId })
  return data.url
}

export async function createPortalSession(): Promise<string> {
  const { data } = await api.post('/stripe/create-portal-session')
  return data.url
}

