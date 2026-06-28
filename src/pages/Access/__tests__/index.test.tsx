import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock('../../../components/HamburgerNav', () => ({ default: () => <nav>Nav</nav> }))
vi.mock('../../../sections/Footer', () => ({ default: () => <footer>Footer</footer> }))
vi.mock('../../../components/SEO', () => ({ default: () => null }))
vi.mock('../../../components/Reveal', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('../../../components/ErrorBoundary', () => ({ default: ({ children }: any) => <>{children}</> }))

vi.mock('../components/LockedView', () => ({ default: () => <div>Locked</div> }))
vi.mock('../components/PassCard', () => ({ default: () => <div>PassCard</div> }))
vi.mock('../components/PassHeader', () => ({ default: () => <div>PassHeader</div> }))
vi.mock('../components/PassPerks', () => ({ default: () => <div>PassPerks</div> }))
vi.mock('../components/PassStats', () => ({ default: () => <div>PassStats</div> }))
vi.mock('../components/ContentGrid', () => ({ default: () => <div>ContentGrid</div> }))
vi.mock('../components/MessageWall', () => ({ default: () => <div>MessageWall</div> }))

vi.mock('../hooks', () => ({
  useAccess: () => ({
    unlocked: false, tab: 'pase', setTab: vi.fn(),
    code: '', setCode: vi.fn(), codeError: false, setCodeError: vi.fn(),
    handleSubmit: vi.fn(), handleLogout: vi.fn(),
  }),
  usePass: () => ({
    passLoading: false, passPhoto: null, passInfo: { number: '', name: '' },
    editingName: false, setEditingName: vi.fn(), nameInput: '', setNameInput: vi.fn(),
    handleSaveName: vi.fn(), handlePhoto: vi.fn(),
    pin: null, showPinInput: false, setShowPinInput: vi.fn(),
    pinInput: '', setPinInput: vi.fn(), handleSetPin: vi.fn(),
  }),
  useMessages: () => ({
    messages: [], msgText: '', msgAuthor: '', msgLoading: false,
    setMsgText: vi.fn(), setMsgAuthor: vi.fn(),
    handleAddMessage: vi.fn(), handleDeleteMessage: vi.fn(),
  }),
  useStats: () => ({
    stats: { photosUploaded: 0, totalLikes: 0, uniqueAuthors: 0, joinDate: '' },
    photos: [], statsLoading: false,
  }),
}))

import AccessPage from '../index'

describe('AccessPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MemoryRouter><AccessPage /></MemoryRouter>)
    expect(container).toBeDefined()
  })
})
