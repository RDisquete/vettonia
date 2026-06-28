import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', p: 'p', h1: 'h1' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../../components/Reveal', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../../components/Solids', () => ({
  SolidBox: () => null, SolidDot: () => null, SolidLine: () => null,
  SolidRing: () => null, SolidTri: () => null,
}))

import PassHeader from '../PassHeader'

describe('PassHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(<MemoryRouter><PassHeader tab="pase" onTabChange={vi.fn()} onLogout={vi.fn()} /></MemoryRouter>)
    expect(container).toBeDefined()
  })
})
