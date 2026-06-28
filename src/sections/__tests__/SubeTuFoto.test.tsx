import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SubeTuFoto from '../SubeTuFoto'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

describe('SubeTuFoto', () => {
  it('renders "Sube tu foto" link', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    expect(screen.getByText('Sube tu foto →')).toBeInTheDocument()
  })

  it('renders "ESTO TAMBIÉN" text', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    expect(screen.getByText('ESTO TAMBIÉN')).toBeInTheDocument()
  })

  it('renders "ES TUYO." text', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    expect(screen.getByText('ES TUYO.')).toBeInTheDocument()
  })

  it('renders the share call-to-action', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    expect(screen.getByText('Comparte')).toBeInTheDocument()
  })

  it('renders the upload link pointing to /upload', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    const link = screen.getByText('Sube tu foto →').closest('a')
    expect(link).toHaveAttribute('href', '/upload')
  })

  it('renders the no-registration text', () => {
    render(<MemoryRouter><SubeTuFoto /></MemoryRouter>)
    expect(screen.getByText('Sin registro · sin límites')).toBeInTheDocument()
  })
})
