import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Mapa from '../Mapa'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

describe('Mapa', () => {
  it('renders the location question text', () => {
    render(<MemoryRouter><Mapa /></MemoryRouter>)
    expect(screen.getByText('¿Dónde estás?')).toBeInTheDocument()
  })

  it('renders the main heading text', () => {
    render(<MemoryRouter><Mapa /></MemoryRouter>)
    expect(screen.getByText(/AQUÍ/)).toBeInTheDocument()
    expect(screen.getByText(/NADA/)).toBeInTheDocument()
    expect(screen.getByText(/QUEDA LEJOS./)).toBeInTheDocument()
  })

  it('renders the "Encuéntrame" link', () => {
    render(<MemoryRouter><Mapa /></MemoryRouter>)
    const link = screen.getByText('Encuéntrame')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/map')
  })

  it('renders the description text', () => {
    render(<MemoryRouter><Mapa /></MemoryRouter>)
    expect(screen.getByText(/Dinos dónde estás/)).toBeInTheDocument()
  })
})
