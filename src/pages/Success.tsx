import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/EmptyState'

export function SuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Optionally: verify the session ID with the backend here.
  }, [sessionId])

  return (
    <>
      <TopBar />
      <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-5 py-20 text-center [animation:var(--animate-fade-in)]">
        <EmptyState
          illustration="party"
          title="Pagamento Confirmado!"
          description="Obrigado por adquirir o Smart Party Premium. Aproveite os novos recursos!"
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
