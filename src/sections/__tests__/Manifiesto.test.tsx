import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Manifiesto from '../Manifiesto'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

describe('Manifiesto', () => {
  it('renders "ESTO NO ES" text', () => {
    render(<MemoryRouter><Manifiesto /></MemoryRouter>)
    expect(screen.getByText('ESTO NO ES')).toBeInTheDocument()
  })

  it('renders "UN FESTIVAL" text', () => {
    render(<MemoryRouter><Manifiesto /></MemoryRouter>)
    expect(screen.getByText('UN FESTIVAL.')).toBeInTheDocument()
  })

  it('renders "ES UN PLAN." text', () => {
    render(<MemoryRouter><Manifiesto /></MemoryRouter>)
    expect(screen.getByText('ES UN PLAN.')).toBeInTheDocument()
  })

  it('renders the Extremadura location and year', () => {
    render(<MemoryRouter><Manifiesto /></MemoryRouter>)
    expect(screen.getByText('EXTREMADURA 2026')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<MemoryRouter><Manifiesto /></MemoryRouter>)
    expect(screen.getByText(/Tres días sin cobertura/)).toBeInTheDocument()
  })
})
