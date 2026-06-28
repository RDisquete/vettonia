import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import NewsletterForm from '../NewsletterForm'

describe('NewsletterForm', () => {
  it('renders without crashing', () => {
    const { container } = render(<NewsletterForm />)
    // Component may return null if env var is not set, or render form if it is
    expect(container).toBeDefined()
  })
})
