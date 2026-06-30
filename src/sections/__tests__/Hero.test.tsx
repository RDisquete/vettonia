import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../Hero'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

vi.mock('../../components/GreenLayer', () => ({
  default: () => <div data-testid="green-layer" />,
}))

describe('Hero', () => {
  it('renders the festival date', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('8 · 9 · 10')).toBeInTheDocument()
  })

  it('renders the month', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('octubre')).toBeInTheDocument()
  })

  it('renders the location', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('extremadura')).toBeInTheDocument()
  })

  it('renders the festival name text', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('Vett')).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    const logo = screen.getByAltText('Vettonia')
    expect(logo).toBeInTheDocument()
  })

  it('renders GreenLayer', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByTestId('green-layer')).toBeInTheDocument()
  })
})
