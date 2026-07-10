import axios from 'axios'

// Defaults to the Vite proxy path ('/api'); tests and other envs override via VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({ baseURL: API_URL })

/**
 * The services layer stays vendor-neutral: it asks an injected provider for a
 * token and knows nothing about Clerk. AuthTokenBridge wires the real provider.
 */
type TokenProvider = () => Promise<string | null>

let getToken: TokenProvider = async () => null

export function setTokenProvider(provider: TokenProvider) {
  getToken = provider
}

api.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
