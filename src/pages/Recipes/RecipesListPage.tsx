import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'
import { Icon } from '@/components/ui/Icon'
import { RECIPES } from '@/data/recipes'
import { moodImage, moodLabel } from '@/utils/moods'

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.reparteai.com.br/' },
    { '@type': 'ListItem', position: 2, name: 'Receitas', item: 'https://www.reparteai.com.br/receitas' },
  ],
}

export function RecipesListPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-background">
      <Seo
        title="Receitas para festas por tipo de evento — reparteaí"
        description="Receitas prontas para churrasco, aniversário e outros tipos de festa, com quantidades pensadas para grupos grandes."
        path="/receitas"
        jsonLd={BREADCRUMB_JSON_LD}
      />
      <TopBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
            Receitas por tipo de festa
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-on-surface-variant">
            Quantidades pensadas para grupos, prontas para virar lista de compras no reparteaí.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {RECIPES.map((recipe) => (
            <Link
              key={recipe.slug}
              to={`/receitas/${recipe.slug}`}
              className="group flex items-start gap-4 rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={moodImage(recipe.mood)}
                alt={recipe.name}
                width={80}
                height={80}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {moodLabel(recipe.mood)}
                </span>
                <h2 className="mt-1 font-extrabold tracking-tight text-on-surface group-hover:text-primary">
                  {recipe.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  {recipe.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 rounded-[32px] bg-gradient-to-br from-primary to-primary-container p-10 text-center shadow-[var(--shadow-floating)]">
          <Icon name="sparkles" size={32} className="text-on-primary" />
          <h2 className="text-2xl font-black tracking-tight text-on-primary">
            Quer a lista de compras e o orçamento prontos?
          </h2>
          <p className="max-w-sm font-medium text-on-primary/85">
            O reparteaí calcula quantidade, preço e divide a conta entre os convidados automaticamente.
          </p>
          <Link
            to="/"
            className="mt-2 flex h-12 items-center gap-2 rounded-full bg-background px-6 font-bold text-on-surface shadow-xl transition-transform hover:scale-[1.03]"
          >
            Criar meu evento grátis
            <Icon name="arrow-right" size={18} className="text-primary" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
