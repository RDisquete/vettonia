import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HamburgerNav from '../HamburgerNav'

const mockGetCurrentUser = vi.fn()
const mockSignOut = vi.fn()

vi.mock('../../services/auth', () => ({
  getCurrentUser: (...args: unknown[]) => mockGetCurrentUser(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

function renderNav() {
  return render(
    <MemoryRouter>
      <HamburgerNav />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetCurrentUser.mockResolvedValue(null)
})

describe('HamburgerNav', () => {
  it('renders the hamburger button', () => {
    renderNav()
    expect(screen.getByLabelText('Menú')).toBeInTheDocument()
  })

  it('opens the menu on hamburger click', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    renderNav()
    fireEvent.click(screen.getByLabelText('Menú'))
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Cartel')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })

  it('shows Acceder when user is not logged in', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    renderNav()
    fireEvent.click(screen.getByLabelText('Menú'))
    expect(screen.getByText('Acceder')).toBeInTheDocument()
  })

  it('shows Cerrar sesión when user is logged in', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: 'user-1' })
    renderNav()
    fireEvent.click(screen.getByLabelText('Menú'))
    expect(await screen.findByText('Cerrar sesión')).toBeInTheDocument()
    expect(screen.queryByText('Acceder')).not.toBeInTheDocument()
  })

  it('has a close button inside the menu', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    renderNav()
    fireEvent.click(screen.getByLabelText('Menú'))
    expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument()
  })

  it('renders the logo inside the menu', async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    renderNav()
    fireEvent.click(screen.getByLabelText('Menú'))
    const logo = screen.getByAltText('Vettonia')
    expect(logo).toBeInTheDocument()
  })
})
