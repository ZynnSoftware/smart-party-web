import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { EventsListPage } from './EventsListPage'

function renderPage() {
  return render(
    <ThemeProvider>
      <ToastProvider>
        <MemoryRouter>
          <EventsListPage />
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>,
  )
}

describe('EventsListPage', () => {
  it('renders the saved events with their estimated total', async () => {
    renderPage()

    expect(await screen.findByText('Churras de teste')).toBeInTheDocument()
    expect(screen.getByText('R$ 254,40')).toBeInTheDocument()
    expect(screen.getByText(/Churrasco Clássico/)).toBeInTheDocument()
  })

  it('removes an event after confirming in the dialog', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('Churras de teste')
    await user.click(screen.getByLabelText('Excluir Churras de teste'))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    await waitFor(() =>
      expect(screen.queryByText('Churras de teste')).not.toBeInTheDocument(),
    )
  })

  it('keeps the event when the dialog is cancelled', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('Churras de teste')
    await user.click(screen.getByLabelText('Excluir Churras de teste'))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Churras de teste')).toBeInTheDocument()
  })
})
