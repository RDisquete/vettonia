import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p', h1: 'h1', h2: 'h2', button: 'button' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('../../../components/Reveal', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}))

vi.mock('../../../components/Solids', () => ({
  SolidBox: ({ className }: any) => <div className={className} data-testid="solid-box" />,
  SolidDot: ({ className }: any) => <div className={className} data-testid="solid-dot" />,
  SolidLine: ({ className }: any) => <div className={className} data-testid="solid-line" />,
  SolidRing: ({ className }: any) => <div className={className} data-testid="solid-ring" />,
  SolidTri: ({ className }: any) => <div className={className} data-testid="solid-tri" />,
}))

import LockedView from '../LockedView'

describe('LockedView', () => {
  const defaultProps = {
    code: '',
    error: false,
    inputRef: { current: null } as any,
    onCodeChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  it('renders lock message and access heading', () => {
    render(<MemoryRouter><LockedView {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('TU')).toBeInTheDocument()
    expect(screen.getByText('PASE')).toBeInTheDocument()
  })

  it('renders the code input', () => {
    render(<MemoryRouter><LockedView {...defaultProps} /></MemoryRouter>)
    expect(screen.getByPlaceholderText('TU CÓDIGO SECRETO')).toBeInTheDocument()
  })

  it('renders the Entrar button', () => {
    render(<MemoryRouter><LockedView {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('shows error message when error is true', () => {
    render(<MemoryRouter><LockedView {...defaultProps} error={true} /></MemoryRouter>)
    expect(screen.getByText('Código incorrecto')).toBeInTheDocument()
  })

  it('does not show error message when error is false', () => {
    render(<MemoryRouter><LockedView {...defaultProps} error={false} /></MemoryRouter>)
    expect(screen.queryByText('Código incorrecto')).not.toBeInTheDocument()
  })


  it('renders the accord link', () => {
    render(<MemoryRouter><LockedView {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('consigue el tuyo')).toBeInTheDocument()
  })
})
