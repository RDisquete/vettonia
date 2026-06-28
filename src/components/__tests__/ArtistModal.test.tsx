import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ArtistModal from '../ArtistModal'

const artist = {
  slug: 'test-artist',
  name: 'Test Artist',
  bio: 'A great performer',
  stage: 'Escenario A',
  time: '22:00',
  image: 'https://example.com/img.jpg',
  genre: 'Rock',
}

function renderModal(overrides: Record<string, unknown> = {}) {
  return render(
    <MemoryRouter>
      <ArtistModal
        artist={artist}
        onClose={vi.fn()}
        {...overrides}
      />
    </MemoryRouter>
  )
}

describe('ArtistModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <MemoryRouter>
        <ArtistModal artist={null} onClose={vi.fn()} />
      </MemoryRouter>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders artist name and bio', () => {
    renderModal()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('A great performer')).toBeInTheDocument()
  })

  it('renders genre', () => {
    renderModal()
    expect(screen.getByText('Rock')).toBeInTheDocument()
  })

  it('renders stage and time', () => {
    renderModal()
    expect(screen.getByText('Escenario A')).toBeInTheDocument()
    expect(screen.getByText('22:00')).toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has a close button', () => {
    renderModal()
    expect(screen.getByText('✕ Cerrar')).toBeInTheDocument()
  })

  it('renders the artist image', () => {
    renderModal()
    const img = screen.getByAltText('Test Artist')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('shows override stage/time when provided', () => {
    renderModal({ stage: 'Escenario B', time: '23:30' })
    expect(screen.getByText('Escenario B')).toBeInTheDocument()
    expect(screen.getByText('23:30')).toBeInTheDocument()
  })
})
