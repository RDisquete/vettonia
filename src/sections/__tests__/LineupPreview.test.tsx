import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LineupPreview from '../LineupPreview'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/ArtistModal', () => ({
  default: ({ artist }: any) => artist ? <div data-testid="modal">Modal open</div> : null,
}))

describe('LineupPreview', () => {
  it('renders the AVANCE title', () => {
    render(<MemoryRouter><LineupPreview /></MemoryRouter>)
    expect(screen.getByText('AVANCE')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<MemoryRouter><LineupPreview /></MemoryRouter>)
    expect(screen.getByText('Lo que viene')).toBeInTheDocument()
  })

  it('renders preview rows (buttons)', () => {
    render(<MemoryRouter><LineupPreview /></MemoryRouter>)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(4)
  })

  it('renders stage info', () => {
    render(<MemoryRouter><LineupPreview /></MemoryRouter>)
    expect(screen.getByText('3 Escenarios')).toBeInTheDocument()
  })

  it('renders the link to full lineup', () => {
    render(<MemoryRouter><LineupPreview /></MemoryRouter>)
    const link = screen.getByText(/Ver cartel completo/)
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/lineup')
  })
})
