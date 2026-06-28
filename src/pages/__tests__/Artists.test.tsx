import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../components/ArtistModal', () => ({ default: () => null }))
vi.mock('../../components/FavoriteButton', () => ({ default: () => null }))
vi.mock('../../services/favorites', () => ({
  getFavorites: () => Promise.resolve(new Set()),
  toggleFavorite: () => Promise.resolve(true),
}))
const mockArtist = vi.hoisted(() => ({ slug: 'a', name: 'Artist A', bio: '', stage: 'A', time: '', image: '', genre: 'Rock' }))
vi.mock('../../data/lineup', () => ({
  stages: [
    { name: 'A', artists: [mockArtist] },
    { name: 'B', artists: [mockArtist] },
    { name: 'C', artists: [mockArtist] },
  ],
  allArtists: [mockArtist],
  allGenres: ['Rock'],
}))

import Artists from '../Artists'

describe('Artists', () => {
  it('renders artist grid', () => {
    render(<MemoryRouter><Artists /></MemoryRouter>)
    expect(screen.getAllByText('ARTISTAS').length).toBeGreaterThanOrEqual(1)
  })
})
