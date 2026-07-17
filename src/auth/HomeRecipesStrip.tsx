import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import type { Mood } from '@/types/domain'
import { moodImage, moodLabel } from '@/utils/moods'
import { pushEvent } from '@/utils/gtm'

/**
 * Curated metadata-only teaser of the recipe catalog. Deliberately NOT imported
 * from data/recipes.ts: that module is lazy-loaded (its full text would bloat
 * the landing bundle), so this strip carries just the fields it renders. Slugs
 * must match existing entries in data/recipes.ts.
 */
const FEATURED_RECIPES: { slug: string; mood: Mood; name: string; servings: number }[] = [
  { slug: 'picanha-na-brasa-para-15-pessoas', mood: 'classic-barbecue', name: 'Picanha na brasa', servings: 15 },
  { slug: 'bolo-de-aniversario-para-15-pessoas', mood: 'birthday', name: 'Bolo de aniversário', servings: 15 },
  { slug: 'petiscos-de-boteco-para-15-pessoas', mood: 'happy-hour', name: 'Petiscos de boteco', servings: 15 },
  { slug: 'espetinhos-de-frango-para-15-pessoas', mood: 'pool-party', name: 'Espetinhos de frango', servings: 15 },
  { slug: 'hamburguer-artesanal-para-10-pessoas', mood: 'casual-burger', name: 'Hambúrguer artesanal', servings: 10 },
  { slug: 'docinhos-finos-para-casamento-para-100-convidados', mood: 'wedding', name: 'Docinhos finos', servings: 100 },
  { slug: 'feijoada-para-50-pessoas', mood: 'large-event', name: 'Feijoada completa', servings: 50 },
  { slug: 'tabua-de-brunch-para-8-pessoas', mood: 'brunch', name: 'Tábua de brunch', servings: 8 },
]

export function HomeRecipesStrip() {
  return (
    <section className="pb-20">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          E depois da lista, o cardápio
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
          Receitas na medida da sua festa
        </h2>
        <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
          Quantidades pensadas para grupos — do churrasco de 15 ao casamento de 100 convidados.
        </p>
      </div>

      {/* Full-bleed scroll strip: cards escape the page gutter on the right. */}
      <div className="-mx-6 overflow-x-auto px-6 pb-4 [scrollbar-width:thin]">
        <div className="flex w-max gap-4">
          {FEATURED_RECIPES.map((recipe) => (
            <Link
              key={recipe.slug}
              to={`/receitas/${recipe.slug}`}
              onClick={() => pushEvent('home_recipe_click', { slug: recipe.slug, mood: recipe.mood })}
              className="group w-56 shrink-0 overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/70 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={moodImage(recipe.mood)}
                  alt={recipe.name}
                  width={224}
                  height={140}
                  loading="lazy"
                  className="aspect-[8/5] w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-on-surface backdrop-blur-sm">
                  {moodLabel(recipe.mood)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-extrabold leading-snug tracking-tight text-on-surface group-hover:text-primary">
                  {recipe.name}
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                  <Icon name="users" size={13} />
                  {recipe.servings} porções
                </p>
              </div>
            </Link>
          ))}

          {/* Trailing card pushing to the full catalog. */}
          <Link
            to="/receitas"
            onClick={() => pushEvent('home_recipes_view_all')}
            className="flex w-56 shrink-0 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:bg-primary/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="arrow-right" size={22} />
            </span>
            <p className="font-extrabold tracking-tight text-primary">Ver todas as 40 receitas</p>
          </Link>
        </div>
      </div>
    </section>
  )
}
