import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../../components/Skeleton', () => ({
  SkeletonBox: ({ className }: any) => <div className={className} data-testid="skeleton-box" />,
  SkeletonText: ({ className }: any) => <div className={className} data-testid="skeleton-text" />,
}))

import MessageWall from '../MessageWall'

describe('MessageWall', () => {
  const defaultProps = {
    messages: [],
    msgText: '',
    msgAuthor: '',
    loading: false,
    onMsgTextChange: vi.fn(),
    onMsgAuthorChange: vi.fn(),
    onAdd: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders loading state', () => {
    render(<MemoryRouter><MessageWall {...defaultProps} loading={true} /></MemoryRouter>)
    const skeletons = screen.getAllByTestId('skeleton-box')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders empty state when no messages', () => {
    render(<MemoryRouter><MessageWall {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('MURO DE LA FAMA')).toBeInTheDocument()
    expect(screen.getByText('Nadie ha soltado palabra todavía')).toBeInTheDocument()
  })

  it('renders message form', () => {
    render(<MemoryRouter><MessageWall {...defaultProps} /></MemoryRouter>)
    expect(screen.getByPlaceholderText('Escribe algo. Una sensación, un grito, una dedicatoria...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu nombre o apodo')).toBeInTheDocument()
    expect(screen.getByText('Publicar')).toBeInTheDocument()
  })

  it('renders messages when provided', () => {
    const messages = [
      { id: '1', text: 'Great festival!', author: 'Alice', createdAt: new Date().toISOString() },
      { id: '2', text: 'Awesome!', author: 'Bob', createdAt: new Date().toISOString() },
    ]
    render(<MemoryRouter><MessageWall {...defaultProps} messages={messages} /></MemoryRouter>)
    expect(screen.getByText(/Great festival!/)).toBeInTheDocument()
    expect(screen.getByText(/Awesome!/)).toBeInTheDocument()
  })

  it('does not show empty state when messages exist', () => {
    const messages = [
      { id: '1', text: 'Hello', author: 'Test', createdAt: new Date().toISOString() },
    ]
    render(<MemoryRouter><MessageWall {...defaultProps} messages={messages} /></MemoryRouter>)
    expect(screen.queryByText('Nadie ha soltado palabra todavía')).not.toBeInTheDocument()
  })

  it('renders delete buttons for messages', () => {
    const messages = [
      { id: '1', text: 'Test', author: 'Test', createdAt: new Date().toISOString() },
    ]
    render(<MemoryRouter><MessageWall {...defaultProps} messages={messages} /></MemoryRouter>)
    expect(screen.getAllByText('Borrar').length).toBe(1)
  })
})
