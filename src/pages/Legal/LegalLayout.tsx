import type { ReactNode } from 'react'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'

type LegalLayoutProps = {
  title: string
  description: string
  path: string
  updatedAt: string
  children: ReactNode
}

/** Shared shell for public legal pages (Termos, Privacidade) — plain prose, no markdown lib. */
export function LegalLayout({ title, description, path, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-background">
      <Seo title={`${title} — reparteaí`} description={description} path={path} />
      <TopBar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="font-display text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">
          Última atualização: {updatedAt}
        </p>

        <div className="prose-legal mt-8 flex flex-col gap-6 text-on-surface-variant">
          {children}
        </div>
      </main>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-extrabold tracking-tight text-on-surface">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed">{children}</div>
    </section>
  )
}
