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

import Info from '../Info'

describe('Info', () => {
  it('renders FAQ sections', () => {
    render(<MemoryRouter><Info /></MemoryRouter>)
    expect(screen.getAllByText('INFO').length).toBeGreaterThanOrEqual(1)
  })
})
