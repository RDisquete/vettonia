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
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/Reveal', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../components/ErrorBoundary', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../lib/storage', () => ({
  isAlbumUnlocked: vi.fn(() => false),
  getAuthenticatedPass: vi.fn(() => null),
}))
vi.mock('../../services/auth', () => ({
  getCurrentUser: vi.fn(() => Promise.resolve(null)),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import Upload from '../Upload'

describe('Upload', () => {
  it('renders upload page', () => {
    render(<MemoryRouter><Upload /></MemoryRouter>)
    expect(screen.getByText('SUBE TUS')).toBeInTheDocument()
  })
})
