import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ setView: vi.fn(), remove: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn(), on: vi.fn() })),
    circle: vi.fn(() => ({ addTo: vi.fn() })),
    latLng: vi.fn(),
    divIcon: vi.fn(() => ({})),
  },
}))
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: ({ children }: any) => <div>{children}</div>,
  useMap: () => ({ flyTo: vi.fn() }),
  useMapEvents: () => ({}),
  Circle: () => null,
}))
vi.mock('../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../components/SEO', () => ({ default: () => null }))
vi.mock('../../data/lineup', () => ({
  stages: [
    { name: 'A', artists: [{ slug: 'a1', name: 'Artist 1', bio: '', stage: 'A', time: '20:00', image: '', genre: 'Rock' }] },
    { name: 'B', artists: [] },
    { name: 'C', artists: [] },
  ],
  allArtists: [{ slug: 'a1', name: 'Artist 1', bio: '', stage: 'A', time: '20:00', image: '', genre: 'Rock' }],
}))

import MapPage from '../MapPage'

describe('MapPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MapPage />)
    expect(container).toBeDefined()
  })
})
