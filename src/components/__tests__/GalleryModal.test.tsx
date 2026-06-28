import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GalleryModal from '../GalleryModal'

const images = [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
  'https://example.com/photo3.jpg',
]

describe('GalleryModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <GalleryModal images={images} open={false} onClose={() => {}} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders the first image when open', () => {
    render(
      <GalleryModal images={images} open={true} onClose={() => {}} />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('sets role and aria attributes', () => {
    render(
      <GalleryModal images={images} open={true} onClose={() => {}} />
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Visor de fotos')
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(
      <GalleryModal images={images} open={true} onClose={onClose} />
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('navigates to next image on ArrowRight', () => {
    render(
      <GalleryModal images={images} open={true} initialIndex={0} onClose={() => {}} />
    )
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to previous image on ArrowLeft', () => {
    render(
      <GalleryModal images={images} open={true} initialIndex={1} onClose={() => {}} />
    )
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps around to last image when going prev from first', () => {
    render(
      <GalleryModal images={images} open={true} initialIndex={0} onClose={() => {}} />
    )
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('wraps around to first image when going next from last', () => {
    render(
      <GalleryModal images={images} open={true} initialIndex={2} onClose={() => {}} />
    )
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('has prev and next buttons', () => {
    render(
      <GalleryModal images={images} open={true} onClose={() => {}} />
    )
    expect(screen.getByLabelText('Anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Siguiente')).toBeInTheDocument()
  })

  it('has a download link', () => {
    render(
      <GalleryModal images={images} open={true} onClose={() => {}} />
    )
    const link = screen.getByText('DESCARGAR')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', images[0])
    expect(link).toHaveAttribute('download')
  })

  it('has a close button with aria-label', () => {
    render(
      <GalleryModal images={images} open={true} onClose={() => {}} />
    )
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
  })

  it('images have descriptive alt text showing count', () => {
    render(
      <GalleryModal images={images} open={true} initialIndex={1} onClose={() => {}} />
    )
    const img = screen.getByAltText('Foto 2 de 3')
    expect(img).toBeInTheDocument()
  })
})
