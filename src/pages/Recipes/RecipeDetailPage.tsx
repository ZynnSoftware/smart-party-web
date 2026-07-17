import { Link, useParams } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Seo } from '@/components/Seo'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/EmptyState'
import { findRecipeBySlug } from '@/data/recipes'
import { moodImage, moodLabel } from '@/utils/moods'

export function RecipeDetailPage() {
  const { slug } = useParams()
  const recipe = slug ? findRecipeBySlug(slug) : undefined

  if (!recipe) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <Seo
          title="Receita não encontrada — reparteaí"
          description="Essa receita não existe ou foi movida."
          path="/receitas"
          noindex
        />
        <TopBar />
        <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-20">
          <EmptyState
            illustration="error"
            title="Receita não encontrada"
            description="Confira o link ou veja outras receitas disponíveis."
            action={
              <Link to="/receitas">
                <Button>Ver todas as receitas</Button>
              </Link>
            }
          />
        </div>

        <Footer />
      </div>
    )
  }

  const imageUrl = `https://www.reparteai.com.br${moodImage(recipe.mood)}`

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: 'reparteaí',
    },
    recipeYield: `${recipe.servings} porções`,
    recipeCategory: moodLabel(recipe.mood),
    recipeCuisine: 'Brasileira',
    prepTime: `PT${recipe.prepTimeMinutes}M`,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step) => ({
      '@type': 'HowToStep',
      text: step,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.reparteai.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Receitas', item: 'https://www.reparteai.com.br/receitas' },
      { '@type': 'ListItem', position: 3, name: recipe.name, item: `https://www.reparteai.com.br/receitas/${recipe.slug}` },
    ],
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-background">
      <Seo
        title={`${recipe.name} — reparteaí`}
        description={recipe.description}
        path={`/receitas/${recipe.slug}`}
        image={imageUrl}
        jsonLd={[recipeJsonLd, breadcrumbJsonLd]}
      />
      <TopBar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link to="/receitas" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface">
          <Icon name="arrow-left" size={16} />
          Todas as receitas
        </Link>

        <img
          src={moodImage(recipe.mood)}
          alt={recipe.name}
          width={800}
          height={400}
          fetchPriority="high"
          className="aspect-[2/1] w-full rounded-3xl object-cover"
        />

        <span className="mt-6 inline-block text-xs font-bold uppercase tracking-wide text-primary">
          {moodLabel(recipe.mood)}
        </span>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
          {recipe.name}
        </h1>
        <p className="mt-3 text-on-surface-variant">{recipe.description}</p>

        <div className="mt-4 flex gap-6 text-sm font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Icon name="users" size={16} />
            {recipe.servings} porções
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="flag" size={16} />
            {recipe.prepTimeMinutes} min
          </span>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_1.4fr]">
          <section>
            <h2 className="font-extrabold tracking-tight text-on-surface">Ingredientes</h2>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex gap-2">
                  <Icon name="check" size={14} className="mt-1 shrink-0 text-primary" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-on-surface">Modo de preparo</h2>
            <ol className="mt-3 space-y-3 text-sm text-on-surface-variant">
              {recipe.instructions.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 rounded-[32px] bg-gradient-to-br from-primary to-primary-container p-10 text-center shadow-[var(--shadow-floating)]">
          <Icon name="sparkles" size={32} className="text-on-primary" />
          <h2 className="text-2xl font-black tracking-tight text-on-primary">
            Monte a lista de compras dessa festa em segundos
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
