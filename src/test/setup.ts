import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './mocks/server'

// Treat every test as a signed-in user so Clerk-dependent UI (TopBar, gates)
// renders without a real Clerk context.
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    getToken: async () => 'test-token',
  }),
  ClerkProvider: ({ children }: { children?: unknown }) => children,
  SignedIn: ({ children }: { children?: unknown }) => children,
  SignedOut: () => null,
  UserButton: () => null,
  SignInButton: ({ children }: { children?: unknown }) => children,
  SignUpButton: ({ children }: { children?: unknown }) => children,
}))

// jsdom does not implement matchMedia — ThemeProvider relies on it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
