import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Acceso from '../Acceso'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

const mockUnlockAlbum = vi.fn()
vi.mock('../../services/album', () => ({
  unlockAlbum: (...args: any[]) => mockUnlockAlbum(...args),
}))

describe('Acceso', () => {
  it('renders the code input and submit button', () => {
    render(<MemoryRouter><Acceso /></MemoryRouter>)
    expect(screen.getByPlaceholderText('TU CÓDIGO SECRETO')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('shows error with wrong code', () => {
    mockUnlockAlbum.mockReturnValue(false)
    render(<MemoryRouter><Acceso /></MemoryRouter>)
    const input = screen.getByPlaceholderText('TU CÓDIGO SECRETO')
    const button = screen.getByText('Entrar')
    fireEvent.change(input, { target: { value: 'WRONG' } })
    fireEvent.click(button)
    expect(screen.getByText('Código incorrecto')).toBeInTheDocument()
  })

  it('shows success state with correct code', () => {
    mockUnlockAlbum.mockReturnValue(true)
    render(<MemoryRouter><Acceso /></MemoryRouter>)
    const input = screen.getByPlaceholderText('TU CÓDIGO SECRETO')
    const button = screen.getByText('Entrar')
    fireEvent.change(input, { target: { value: 'CORRECT' } })
    fireEvent.click(button)
    expect(screen.getByText('Pase activado')).toBeInTheDocument()
    expect(screen.getByText('Entrar al hub')).toBeInTheDocument()
  })
})
