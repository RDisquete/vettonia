import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../PassQR', () => ({ default: () => null }))

import PassCard from '../PassCard'

describe('PassCard', () => {
  it('renders loading state', () => {
    render(<PassCard passPhoto={null} passNumber="" passName="" loading={true} />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders the pass number and name', () => {
    render(<PassCard passPhoto={null} passNumber="VET-000001" passName="Rafael" />)
    expect(screen.getByText('VETTONIA')).toBeInTheDocument()
    expect(screen.getByText('Rafael')).toBeInTheDocument()
    expect(screen.getByText('VET-000001')).toBeInTheDocument()
  })

  it('shows Sin nombre when name is empty', () => {
    render(<PassCard passPhoto={null} passNumber="VET-000002" passName="" />)
    expect(screen.getByText('Sin nombre')).toBeInTheDocument()
  })

  it('renders the year 2026', () => {
    render(<PassCard passPhoto={null} passNumber="VET-000003" passName="Test" />)
    expect(screen.getByText('2026')).toBeInTheDocument()
  })

  it('renders fallback Unsplash image when no photo', () => {
    const { container } = render(<PassCard passPhoto={null} passNumber="VET-000004" passName="Test" />)
    const imgs = container.querySelectorAll('img')
    const fallback = Array.from(imgs).find(img => img.getAttribute('src')?.includes('unsplash'))
    expect(fallback).toBeTruthy()
  })

  it('renders the pass photo when provided', () => {
    const photoUrl = 'https://example.com/photo.jpg'
    const { container } = render(<PassCard passPhoto={photoUrl} passNumber="VET-000005" passName="Test" />)
    const imgs = container.querySelectorAll('img')
    const passImg = Array.from(imgs).find(img => img.getAttribute('src') === photoUrl)
    expect(passImg).toBeTruthy()
  })

  it('rendes labels for titular and pass number', () => {
    render(<PassCard passPhoto={null} passNumber="VET-000006" passName="Ana" />)
    expect(screen.getByText('Titular')).toBeInTheDocument()
    expect(screen.getByText('Nº de pase')).toBeInTheDocument()
  })

  it('displays the watermark Vett/onia', () => {
    const { container } = render(<PassCard passPhoto={null} passNumber="VET-000007" passName="Test" />)
    expect(container.textContent).toContain('Vett')
    expect(container.textContent).toContain('onia')
  })
})
