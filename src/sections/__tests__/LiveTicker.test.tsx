import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LiveTicker from '../LiveTicker'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

describe('LiveTicker', () => {
  it('renders "En vivo" text', () => {
    render(<LiveTicker />)
    expect(screen.getByText('En vivo')).toBeInTheDocument()
  })

  it('renders artist names in the ticker', () => {
    render(<LiveTicker />)
    const items = screen.getAllByText(/SÔR/)
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/RUIDO RUIDO/).length).toBeGreaterThanOrEqual(1)
  })

  it('has a link to youtube', () => {
    render(<LiveTicker />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://youtube.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders stage labels in ticker items', () => {
    render(<LiveTicker />)
    const items = screen.getAllByText(/Escenario/)
    expect(items.length).toBeGreaterThanOrEqual(2)
  })
})
