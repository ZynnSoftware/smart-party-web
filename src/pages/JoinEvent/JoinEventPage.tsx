import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { SkeletonList } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { eventsService } from '@/services/events'

/**
 * Public entry point for an invite link. Signed-out visitors see a sign-in
 * prompt that returns to this exact URL; signed-in visitors auto-join and
 * are redirected to the event's dashboard.
 */
export function JoinEventPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { isLoaded, isSignedIn } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !id || !token) return

    eventsService
      .acceptInvite(id, token)
      .then(() => navigate(`/events/${id}/dashboard`, { replace: true }))
      .catch(() => setError('Este link de convite não é mais válido.'))
  }, [isLoaded, isSignedIn, id, token, navigate])

  if (!id || !token) {
    return (
      <>
        <Seo title="Convite para evento — reparteaí" description="Você foi convidado para um evento no reparteaí." path={`/events/${id}/join`} noindex />
        <TopBar />
        <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl px-5 py-20">
          <EmptyState illustration="error" title="Link inválido" description="Confira o link recebido e tente novamente." />
        </div>
      </>
    )
  }

  if (!isLoaded) {
    return (
      <>
        <Seo title="Convite para evento — reparteaí" description="Você foi convidado para um evento no reparteaí." path={`/events/${id}/join`} noindex />
        <TopBar />
        <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl px-5 py-20">
          <SkeletonList rows={2} />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Seo title="Convite para evento — reparteaí" description="Você foi convidado para um evento no reparteaí." path={`/events/${id}/join`} noindex />
        <TopBar />
        <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl px-5 py-20">
          <EmptyState
            illustration="error"
            title="Não foi possível entrar"
            description={error}
            action={<Button onClick={() => navigate('/')}>Voltar à Home</Button>}
          />
        </div>
      </>
    )
  }

  if (!isSignedIn) {
    return (
      <>
        <Seo title="Convite para evento — reparteaí" description="Você foi convidado para um evento no reparteaí." path={`/events/${id}/join`} noindex />
        <TopBar />
        <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl px-5 py-20">
          <EmptyState
            illustration="party"
            title="Você foi convidado para um evento"
            description="Entre com sua conta para ver os detalhes."
            action={
              <SignInButton mode="modal" forceRedirectUrl={window.location.href}>
                <Button icon="arrow-right">Entrar e ver o evento</Button>
              </SignInButton>
            }
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Seo title="Convite para evento — reparteaí" description="Você foi convidado para um evento no reparteaí." path={`/events/${id}/join`} noindex />
      <TopBar />
      <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl px-5 py-20">
        <SkeletonList rows={2} />
      </div>
    </>
  )
}
