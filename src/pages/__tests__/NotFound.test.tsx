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

import NotFound from '../NotFound'

describe('NotFound', () => {
  it('renders 404 message', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>)
    expect(screen.getAllByText('404').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument()
  })
})
