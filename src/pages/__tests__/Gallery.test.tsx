import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/GalleryModal', () => ({ default: () => null }))
vi.mock('../../components/Skeleton', () => ({ GallerySkeleton: () => <div>Skeleton</div> }))
vi.mock('../../components/ErrorBoundary', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../lib/storage', () => ({
  getPhotos: vi.fn(() => Promise.resolve([])),
  isAlbumUnlocked: vi.fn(() => false),
  lockAlbum: vi.fn(),
  getLikedPhotos: vi.fn(() => Promise.resolve([])),
  toggleLike: vi.fn(),
  authenticatePass: vi.fn(() => Promise.resolve(false)),
  authenticatePassWithPin: vi.fn(() => Promise.resolve(false)),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import Gallery from '../Gallery'

describe('Gallery', () => {
  it('renders gallery page', () => {
    render(<MemoryRouter><Gallery /></MemoryRouter>)
    expect(screen.getByText('GALERÍA')).toBeInTheDocument()
  })
})
