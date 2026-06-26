import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  publishedAt?: string
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://vettoniafestival.netlify.app'
const DEFAULT_IMAGE = '/hero.jpg'

export default function SEO({ title, description, path = '', image, type = 'website', noindex, publishedAt }: Props) {
  const fullTitle = `${title} | Vettonia`
  const url = path ? `${SITE_URL}${path}` : SITE_URL
  const ogImage = image || DEFAULT_IMAGE
  const fullImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_ES" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {noindex && <meta name="robots" content="noindex" />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
    </Helmet>
  )
}
