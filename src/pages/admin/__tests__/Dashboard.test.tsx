import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('../../../lib/storage', () => ({
  getPhotos: vi.fn(() => Promise.resolve([])),
  getPublishedArtists: vi.fn(() => Promise.resolve([])),
}))
vi.mock('../../../services/alerts', () => ({ getAlerts: vi.fn(() => Promise.resolve([])) }))
vi.mock('../../../components/SEO', () => ({ default: () => null }))
vi.mock('../../../components/Skeleton', () => ({ DashboardSkeleton: () => <div>Loading</div> }))

import Dashboard from '../Dashboard'

describe('Dashboard', () => {
  it('renders without crashing', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(await screen.findByText('Panel de control')).toBeInTheDocument()
  })
})
