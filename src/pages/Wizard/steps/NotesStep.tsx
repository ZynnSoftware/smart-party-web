import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Stepper } from '@/components/Stepper'
import { useWizard } from '@/contexts/WizardContext'

export function NotesStep() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, patch, isSaving, error } = useWizard()

  const [notes, setNotes] = useState(event?.notes ?? '')

  const handleNext = async () => {
    await patch({ notes })
    navigate(`/events/${id}/items`)
  }

  return (
    <div className="pb-32">
      <div style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '0ms' }}>
        <Stepper current={3} />
      </div>

      <div 
        className="mb-8"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '100ms' }}
      >
        <h1 className="mb-2 text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface">Considerações</h1>
        <p className="text-base text-on-surface-variant">
          Algum pedido especial? O que não pode faltar de jeito nenhum?
        </p>
      </div>

      <div 
        className="mb-12"
        style={{ animation: 'var(--animate-rise)', animationFillMode: 'both', animationDelay: '200ms' }}
      >
        <div className="group relative">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Tio João só bebe cerveja sem álcool, precisa de bastante gelo..."
            rows={8}
            className="w-full resize-none bg-transparent text-xl font-medium leading-relaxed tracking-tight text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 sm:text-2xl"
          />
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center border-t border-outline-variant/20 bg-background/80 px-4 py-4 pb-safe shadow-[var(--shadow-floating)] backdrop-blur-xl [animation:var(--animate-rise)_forwards]">
        <div className="w-full max-w-2xl flex items-center gap-3">
          <Button
            variant="secondary"
            icon="arrow-left"
            onClick={() => navigate(`/events/${id}/guests`)}
            className="px-4"
            aria-label="Voltar"
          />
          <Button
            className="flex-1 shadow-lg"
            iconRight="arrow-right"
            onClick={handleNext}
            loading={isSaving}
          >
            {isSaving ? 'Gerando Lista…' : 'Gerar Lista de Compras'}
          </Button>
        </div>
      </div>
    </div>
  )
}
