import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Reveal from '../Reveal'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
}))

describe('Reveal', () => {
  it('renders children', () => {
    render(<Reveal><p>Visible</p></Reveal>)
    expect(screen.getByText('Visible')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(<Reveal className="custom-class"><span>Test</span></Reveal>)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('renders with default pop variant', () => {
    const { container } = render(<Reveal><span>Test</span></Reveal>)
    expect(container.querySelector('div')).toBeInTheDocument()
  })
})
