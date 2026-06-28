import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageTransition from '../PageTransition'

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <p>Hello</p>
      </PageTransition>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('wraps in motion.div', () => {
    const { container } = render(
      <PageTransition>
        <span>Item</span>
      </PageTransition>
    )
    expect(container.querySelector('[style]')).toBeInTheDocument()
  })
})
