import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/test/mocks/server'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { JoinEventPage } from './JoinEventPage'

const API_URL = 'http://localhost:3000'
const ROUTE = '/events/evt-1/join?token=valid-token'

function renderJoinPage() {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[ROUTE]}>
          <Routes>
            <Route path="/events/:id/join" element={<JoinEventPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  )
}

const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }))

vi.mock('@clerk/clerk-react', () => ({
  useAuth: mockUseAuth,
  useUser: () => ({ isLoaded: true, isSignedIn: true, user: { firstName: 'Teste', imageUrl: '' } }),
  SignedIn: ({ children }: { children?: unknown }) => children,
  SignedOut: () => null,
  UserButton: () => null,
  SignInButton: ({ children }: { children?: unknown }) => children,
  SignUpButton: ({ children }: { children?: unknown }) => children,
}))

afterEach(() => {
  mockUseAuth.mockReset()
})

describe('JoinEventPage', () => {
  it('prompts sign-in when the visitor is not authenticated', () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })

    renderJoinPage()

    expect(screen.getByText('Você foi convidado para um evento')).toBeInTheDocument()
  })

  it('accepts the invite and redirects when the visitor is signed in', async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })
    server.use(
      http.post(`${API_URL}/events/:id/join`, () => HttpResponse.json({ id: 'evt-1' })),
    )

    renderJoinPage()

    await waitFor(() => expect(screen.queryByText('Você foi convidado para um evento')).not.toBeInTheDocument())
  })

  it('shows an error when the invite link is invalid', async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })
    server.use(
      http.post(`${API_URL}/events/:id/join`, () => new HttpResponse(null, { status: 404 })),
    )

    renderJoinPage()

    await waitFor(() => expect(screen.getByText('Não foi possível entrar')).toBeInTheDocument())
  })
})
