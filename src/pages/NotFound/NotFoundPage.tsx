import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-background">
      <Seo
        title="Página não encontrada — reparteaí"
        description="A página que você tentou acessar não existe ou foi movida."
        path="/404"
        noindex
      />
      <TopBar />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[-12%] h-[380px] w-[380px] rounded-full bg-tertiary-container/15 blur-[100px]" />
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center [animation:var(--animate-fade-in)]">
        <span
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 [animation:var(--animate-rise)]"
        >
          <Logo size={36} />
        </span>

        <h1
          className="mt-8 font-display text-7xl font-black leading-none tracking-tight text-on-surface sm:text-8xl [animation:var(--animate-rise)]"
          style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}
        >
          404
        </h1>

        <h2
          className="mt-4 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl [animation:var(--animate-rise)]"
          style={{ animationDelay: '140ms', animationFillMode: 'backwards' }}
        >
          Essa festa não rolou por aqui
        </h2>

        <p
          className="mx-auto mt-3 max-w-sm text-on-surface-variant [animation:var(--animate-rise)]"
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          A página que você procura não existe, foi movida ou o link está incorreto.
        </p>

        <div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row [animation:var(--animate-rise)]"
          style={{ animationDelay: '260ms', animationFillMode: 'backwards' }}
        >
          <Link to="/">
            <Button size="lg" icon="arrow-left" className="w-full sm:w-auto">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
