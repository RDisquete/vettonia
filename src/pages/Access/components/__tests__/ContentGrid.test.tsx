import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../lib/storage', () => ({ getPhotos: vi.fn(() => Promise.resolve([])) }))
vi.mock('../../../components/GalleryModal', () => ({ default: () => null }))

import ContentGrid from '../ContentGrid'

describe('ContentGrid', () => {
  it('renders content items', () => {
    render(<MemoryRouter><ContentGrid /></MemoryRouter>)
    expect(screen.getByText('Playlist Oficial')).toBeInTheDocument()
    expect(screen.getByText('Fondos de Pantalla')).toBeInTheDocument()
  })
})
