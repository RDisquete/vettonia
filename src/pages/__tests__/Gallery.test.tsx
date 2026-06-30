import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/GalleryModal', () => ({ default: () => null }))
vi.mock('../../components/StoriesFeed', () => ({ default: () => null }))
vi.mock('../../services/reactions', () => ({
  getAllReactions: () => Promise.resolve({}),
  getUserReactions: () => Promise.resolve({}),
  toggleReaction: () => Promise.resolve(true),
  REACTION_TYPES: ['❤️', '🔥', '🎉'],
}))
vi.mock('../../services/realtime', () => ({
  subscribeToNewPhotos: () => () => {},
}))
vi.mock('../../components/Skeleton', () => ({ GallerySkeleton: () => <div>Skeleton</div> }))
vi.mock('../../components/ErrorBoundary', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../services/album', () => ({
  getPhotos: vi.fn(() => Promise.resolve([])),
  isAlbumUnlocked: vi.fn(() => false),
  lockAlbum: vi.fn(),
  getLikedPhotos: vi.fn(() => Promise.resolve([])),
  toggleLike: vi.fn(),
  authenticatePassWithPin: vi.fn(() => Promise.resolve(false)),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import Gallery from '../Gallery'

describe('Gallery', () => {
  it('renders gallery page', async () => {
    render(<MemoryRouter><Gallery /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText('GALERÍA')).toBeInTheDocument()
    })
  })
})
