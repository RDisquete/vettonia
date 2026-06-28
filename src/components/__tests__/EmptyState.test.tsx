import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EmptyState from '../EmptyState'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('EmptyState', () => {
  it('renders title', () => {
    renderWithRouter(<EmptyState title="No hay nada" />)
    expect(screen.getByText('No hay nada')).toBeInTheDocument()
  })

  it('renders description', () => {
    renderWithRouter(<EmptyState title="Vacío" description="No hay contenido" />)
    expect(screen.getByText('No hay contenido')).toBeInTheDocument()
  })

  it('renders icon', () => {
    renderWithRouter(<EmptyState title="Ops" icon="★" />)
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('renders action link with to', () => {
    renderWithRouter(<EmptyState title="Vacío" action={{ label: 'Ir', to: '/test' }} />)
    expect(screen.getByText('Ir')).toBeInTheDocument()
    expect(screen.getByText('Ir').closest('a')).toHaveAttribute('href', '/test')
  })

  it('renders action button with onClick', () => {
    const onClick = vi.fn()
    renderWithRouter(<EmptyState title="Vacío" action={{ label: 'Click', onClick }} />)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
