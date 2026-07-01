import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../Footer'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p' },
  AnimatePresence: ({ children }: any) => children,
}))

describe('Footer', () => {
  it('renders VETTONIA text and the credit line', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    expect(screen.getByText('VETTONIA')).toBeInTheDocument()
    expect(screen.getByText(/rdisquete/)).toBeInTheDocument()
    expect(screen.getByText(/rdisquete/).closest('a')).toHaveAttribute('href', 'https://rdisquete.es')
  })

  it('renders the logo image', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const logo = screen.getByAltText('Vettonia')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/vettonia-logo.png')
  })

  it('renders the copyright year', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    expect(screen.getByText('© 2027')).toBeInTheDocument()
  })
})
