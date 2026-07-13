import { api } from './api'

export interface UserProfile {
  id: string
  email: string
  subscriptionStatus: 'none' | 'active' | 'past_due' | 'canceled'
}

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await api.get('/me')
  return data
}
