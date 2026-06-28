import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PassPerks from '../PassPerks'

describe('PassPerks', () => {
  it('renders perks list', () => {
    render(<MemoryRouter><PassPerks /></MemoryRouter>)
    expect(screen.getByText('Álbum privado')).toBeInTheDocument()
    expect(screen.getByText('Contenido exclusivo')).toBeInTheDocument()
    expect(screen.getByText('Muro de la fama')).toBeInTheDocument()
  })
})
