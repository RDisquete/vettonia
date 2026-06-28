import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Countdown from '../Countdown'

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders countdown blocks', () => {
    render(<Countdown />)
    expect(screen.getByText('Días')).toBeInTheDocument()
    expect(screen.getByText('Horas')).toBeInTheDocument()
    expect(screen.getByText('Min')).toBeInTheDocument()
    expect(screen.getByText('Seg')).toBeInTheDocument()
  })

  it('returns null when festival is over', () => {
    vi.setSystemTime(new Date('2026-08-20T12:00:00'))
    const { container } = render(<Countdown />)
    expect(container.innerHTML).toBe('')
  })

  it('updates every second', () => {
    render(<Countdown />)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('Días')).toBeInTheDocument()
  })
})
