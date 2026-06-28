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
vi.mock('../../services/auth', () => ({
  signUp: vi.fn(() => Promise.resolve({ passNumber: 'VET-000001' })),
  getCurrentUser: vi.fn(() => Promise.resolve(null)),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import Register from '../Register'

describe('Register', () => {
  it('renders registration form', () => {
    render(<MemoryRouter><Register /></MemoryRouter>)
    expect(screen.getByText('REGISTRO')).toBeInTheDocument()
  })
})
