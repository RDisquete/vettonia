import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Galeria from '../Galeria'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

vi.mock('../../components/GalleryModal', () => ({
  default: () => null,
}))

describe('Galeria', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><Galeria /></MemoryRouter>)
    expect(screen.getByText('GALERÍA')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<MemoryRouter><Galeria /></MemoryRouter>)
    expect(screen.getByText('Las pruebas del delito')).toBeInTheDocument()
  })

  it('renders the gallery album link', () => {
    render(<MemoryRouter><Galeria /></MemoryRouter>)
    expect(screen.getByText('Ver el álbum →')).toBeInTheDocument()
  })
})
