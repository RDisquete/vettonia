const UCDN = 'images.unsplash.com'

export function isUnsplashUrl(url: string) {
  return url.includes(UCDN)
}

export function unsplashSrcset(url: string, widths = [400, 600, 800, 1200]): string {
  if (!isUnsplashUrl(url)) return ''
  const base = url.replace(/\?.*/, '')
  const params = new URLSearchParams(url.split('?')[1] || '')
  const q = params.get('q') || '80'
  const fit = params.get('fit') || ''
  const h = params.get('h') || ''
  return widths
    .map((w) => {
      const p = new URLSearchParams()
      p.set('w', String(w))
      p.set('q', q)
      if (fit) p.set('fit', fit)
      if (h) p.set('h', h)
      p.set('auto', 'format')
      return `${base}?${p.toString()} ${w}w`
    })
    .join(', ')
}

export function unsplashAutoFormat(url: string): string {
  if (!isUnsplashUrl(url)) return url
  if (url.includes('auto=format')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}auto=format`
}

export function imgAttributes(url: string, options?: { widths?: number[]; lazy?: boolean }) {
  const { widths, lazy = true } = options || {}
  const isUnsplash = isUnsplashUrl(url)
  const attrs: Record<string, string> = {}
  if (lazy) attrs.loading = 'lazy'
  attrs.decoding = 'async'
  if (isUnsplash) {
    attrs.src = unsplashAutoFormat(url)
    const srcset = unsplashSrcset(url, widths)
    if (srcset) attrs.srcset = srcset
    if (widths) attrs.sizes = '(max-width: 768px) 100vw, 50vw'
  }
  return attrs
}
