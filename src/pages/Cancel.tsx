import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/EmptyState'

export function CancelPage() {
  const navigate = useNavigate()

  return (
    <>
      <TopBar />
      <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-5 py-20 text-center [animation:var(--animate-fade-in)]">
        <EmptyState
          illustration="error"
          title="Pagamento Cancelado"
          description="Você cancelou a transação. Nenhuma cobrança foi feita."
          action={
            <Button onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          }
        />
      </main>
    </>
  )
}
