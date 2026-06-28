import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../services/alerts', () => ({
  getAlerts: vi.fn(() => Promise.resolve([])),
  addAlert: vi.fn(),
  markAlertRead: vi.fn(),
  deleteAlert: vi.fn(),
}))

vi.mock('../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))

import Alerts from '../Alerts'

describe('Alerts', () => {
  it('renders without crashing', async () => {
    const { container } = render(<MemoryRouter><Alerts /></MemoryRouter>)
    expect(container).toBeDefined()
  })
})
