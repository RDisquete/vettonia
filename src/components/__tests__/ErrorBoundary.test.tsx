import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

const ThrowTest = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) throw new Error('Test error')
  return <p>All good</p>
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>Works fine</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('Works fine')).toBeInTheDocument()
  })

  it('catches errors and shows fallback UI', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowTest shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    expect(screen.getByText('No pudimos cargar esta sección.')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('retry button re-renders children', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowTest shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
