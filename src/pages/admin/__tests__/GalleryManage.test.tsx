import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../services/album', () => ({
  getPhotos: vi.fn(() => Promise.resolve([])),
  updatePhotoStatus: vi.fn(),
}))

vi.mock('../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))

import GalleryManage from '../GalleryManage'

describe('GalleryManage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><GalleryManage /></MemoryRouter>)
    expect(screen.getByText('Galería')).toBeInTheDocument()
  })
})
