import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import JsonLd from '../JsonLd'

describe('JsonLd', () => {
  it('renders ld+json script', () => {
    const data = { '@context': 'https://schema.org', name: 'Test' }
    render(
      <HelmetProvider>
        <JsonLd data={data} />
      </HelmetProvider>
    )
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThanOrEqual(1)
    const last = scripts[scripts.length - 1]
    expect(JSON.parse(last.textContent || '')).toEqual(data)
  })
})
