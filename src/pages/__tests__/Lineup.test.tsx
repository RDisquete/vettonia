import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/ArtistModal', () => ({ default: () => null }))
vi.mock('../../components/Reveal', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../services/lineup', () => ({
  getPublishedStages: () => Promise.resolve([
    { name: 'A', artists: [{ slug: 'a1', name: 'Artist 1', bio: '', stage: 'A', time: '20:00', image: '', genre: 'Rock' }] },
    { name: 'B', artists: [] },
    { name: 'C', artists: [] },
  ]),
}))

import Lineup from '../Lineup'

describe('Lineup', () => {
  it('renders lineup page', async () => {
    render(<MemoryRouter><Lineup /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getAllByText('CARTEL').length).toBeGreaterThanOrEqual(1)
    })
  })
})
