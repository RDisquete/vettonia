import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <>{children}</>,
  Routes: ({ children }: any) => <>{children}</>,
  Route: () => null,
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
}))
vi.mock('../components/ReminderManager', () => ({ default: () => null }))
vi.mock('../pages/Home', () => ({ default: () => <div>Home</div> }))
vi.mock('../pages/Gallery', () => ({ default: () => <div>Gallery</div> }))

import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
  })
})
