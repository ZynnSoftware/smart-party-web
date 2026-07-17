import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.reparteai.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/moods/mood_classic_barbecue.png`

type SeoProps = {
  title: string
  description: string
  /** Path only, e.g. "/events/123/join" — combined with SITE_URL for canonical/og:url. */
  path: string
  /** Set for any route that requires auth or is user-specific — keeps it out of the index. */
  noindex?: boolean
  image?: string
  /** Structured data (schema.org) to embed as JSON-LD. Omit if the page has nothing to describe. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function Seo({ title, description, path, noindex = false, image = DEFAULT_IMAGE, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((entry, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(entry)}
          </script>
        ))}
    </Helmet>
  )
}
