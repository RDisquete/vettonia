import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from '../SEO'

describe('SEO', () => {
  it('sets title in helmet', () => {
    render(
      <HelmetProvider>
        <SEO title="Test Page" description="A test page" />
      </HelmetProvider>
    )
    const helmet = document.querySelector('title')
    expect(helmet?.textContent).toBe('Test Page | Vettonia')
  })

  it('sets description meta', () => {
    render(
      <HelmetProvider>
        <SEO title="Test" description="My custom description" />
      </HelmetProvider>
    )
    const meta = document.querySelector('meta[name="description"]')
    expect(meta?.getAttribute('content')).toBe('My custom description')
  })

  it('sets og meta tags', () => {
    render(
      <HelmetProvider>
        <SEO title="Test" description="Desc" path="/test" />
      </HelmetProvider>
    )
    const ogTitle = document.querySelector('meta[property="og:title"]')
    expect(ogTitle?.getAttribute('content')).toBe('Test | Vettonia')
    const ogUrl = document.querySelector('meta[property="og:url"]')
    expect(ogUrl?.getAttribute('content')).toContain('/test')
  })

  it('sets noindex when specified', () => {
    render(
      <HelmetProvider>
        <SEO title="Test" description="Desc" noindex />
      </HelmetProvider>
    )
    const robots = document.querySelector('meta[name="robots"]')
    expect(robots?.getAttribute('content')).toBe('noindex')
  })

  it('sets article published time', () => {
    render(
      <HelmetProvider>
        <SEO title="Test" description="Desc" publishedAt="2026-06-01" type="article" />
      </HelmetProvider>
    )
    const time = document.querySelector('meta[property="article:published_time"]')
    expect(time?.getAttribute('content')).toBe('2026-06-01')
  })
})
