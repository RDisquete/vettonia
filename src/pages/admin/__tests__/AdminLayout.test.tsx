import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

vi.mock('../../../services/auth', () => ({
  signInAdmin: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(() => Promise.resolve({ user: { id: '1', email: 'admin@test.com' } })),
  onAuthStateChange: vi.fn(() => vi.fn()),
}))
vi.mock('../../../components/Solids', () => ({
  SolidBox: () => null,
  SolidDot: () => null,
}))

import AdminLayout from '../AdminLayout'

describe('AdminLayout', () => {
  it('renders sidebar and children', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<p>Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })
})
