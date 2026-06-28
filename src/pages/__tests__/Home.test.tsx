import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', h1: 'h1', p: 'p' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/JsonLd', () => ({ default: () => null }))

vi.mock('../../sections/Hero', () => ({ default: () => <section>Hero</section> }))
vi.mock('../../sections/LiveTicker', () => ({ default: () => <div>Ticker</div> }))
vi.mock('../../sections/Manifiesto', () => ({ default: () => <section>Manifiesto</section> }))
vi.mock('../../sections/LineupPreview', () => ({ default: () => <section>LineupPreview</section> }))
vi.mock('../../sections/Mapa', () => ({ default: () => <section>Mapa</section> }))
vi.mock('../../sections/Galeria', () => ({ default: () => <section>Galeria</section> }))
vi.mock('../../sections/SubeTuFoto', () => ({ default: () => <section>SubeTuFoto</section> }))
vi.mock('../../sections/Acceso', () => ({ default: () => <section>Acceso</section> }))

import Home from '../Home'

describe('Home', () => {
  it('renders home page', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('Hero')).toBeInTheDocument()
    expect(screen.getByText('Manifiesto')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
