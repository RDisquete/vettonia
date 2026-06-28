import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../Solids'

describe('Solids', () => {
  it('SolidBox renders with clipPath', () => {
    const { container } = render(<SolidBox className="w-4 h-4" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.style.clipPath).toBe('polygon(0 15%, 100% 0, 100% 85%, 0 100%)')
  })

  it('SolidDot renders a circle', () => {
    const { container } = render(<SolidDot className="w-6 h-6" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('rounded-full')
  })

  it('SolidLine renders a thin line', () => {
    const { container } = render(<SolidLine className="w-20 h-0.5" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('SolidRing renders a bordered circle', () => {
    const { container } = render(<SolidRing className="w-10 h-10" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('rounded-full')
    expect(el.className).toContain('border')
  })

  it('SolidTri renders with triangular clipPath', () => {
    const { container } = render(<SolidTri className="w-8 h-8" />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.style.clipPath).toBe('polygon(50% 0, 100% 100%, 0 100%)')
  })

  it('applies custom styles', () => {
    const { container } = render(<SolidBox className="w-5 h-5" style={{ backgroundColor: 'red' }} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.backgroundColor).toBe('red')
  })

  it('sets aria-hidden by default', () => {
    const { container } = render(<SolidDot className="w-3 h-3" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
