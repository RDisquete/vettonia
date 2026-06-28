import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import Contact from '../Contact'

describe('Contact', () => {
  it('renders contact form', () => {
    render(<MemoryRouter><Contact /></MemoryRouter>)
    expect(screen.getAllByText('CONTACTO').length).toBeGreaterThanOrEqual(1)
  })
})
