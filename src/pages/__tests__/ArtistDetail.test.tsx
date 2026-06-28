import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/JsonLd', () => ({ default: () => null }))

import ArtistDetail from '../ArtistDetail'

describe('ArtistDetail', () => {
  it('renders artist when found', () => {
    render(
      <MemoryRouter initialEntries={['/artists/sor']}>
        <Routes>
          <Route path="/artists/:slug" element={<ArtistDetail />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /SÔR/ })).toBeInTheDocument()
  })

  it('renders 404 when artist not found', () => {
    render(
      <MemoryRouter initialEntries={['/artists/unknown']}>
        <Routes>
          <Route path="/artists/:slug" element={<ArtistDetail />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
