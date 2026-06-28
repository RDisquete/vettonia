import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GreenLayer from '../GreenLayer'

describe('GreenLayer', () => {
  it('renders decorative elements', () => {
    const { container } = render(<GreenLayer />)
    expect(container.querySelectorAll('[class*="absolute"]').length).toBeGreaterThan(0)
  })

  it('renders clip-path polygons', () => {
    const { container } = render(<GreenLayer />)
    const els = container.querySelectorAll('[style*="clip-path"]')
    expect(els.length).toBeGreaterThanOrEqual(2)
  })

  it('renders solids (boxes, dots, lines)', () => {
    const { container } = render(<GreenLayer />)
    expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelectorAll('.rotate-45').length).toBe(1)
  })
})
