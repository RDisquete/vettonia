import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../services/lineup', () => ({
  getAllArtists: vi.fn(() => Promise.resolve([])),
  upsertArtist: vi.fn(),
  deleteArtist: vi.fn(),
  publishArtist: vi.fn(),
  publishAllArtists: vi.fn(() => Promise.resolve(0)),
  seedFromStatic: vi.fn(() => Promise.resolve(0)),
  getAdminStages: vi.fn(() => Promise.resolve([])),
}))

vi.mock('../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))

import LineupManage from '../LineupManage'

describe('LineupManage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LineupManage /></MemoryRouter>)
    expect(screen.getByText('Cartel')).toBeInTheDocument()
  })
})
