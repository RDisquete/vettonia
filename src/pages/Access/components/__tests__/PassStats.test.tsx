import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../../components/Solids', () => ({
  SolidBox: () => null,
  SolidDot: () => null,
}))
vi.mock('../../../../components/Skeleton', () => ({
  SkeletonBox: () => <div>SkeletonBox</div>,
  SkeletonText: () => <div>SkeletonText</div>,
}))
vi.mock('../../../../components/EmptyState', () => ({ default: () => null }))
vi.mock('../../../../components/GalleryModal', () => ({ default: () => null }))

import PassStats from '../PassStats'

describe('PassStats', () => {
  it('renders stats after loading', async () => {
    render(
      <MemoryRouter>
        <PassStats
          stats={{ photosUploaded: 42, totalLikes: 128, uniqueAuthors: 15, joinDate: '2027-06-01' }}
          messageCount={5}
          photos={[]}
          loading={false}
        />
      </MemoryRouter>
    )
    expect(await screen.findByText('42')).toBeInTheDocument()
    expect(await screen.findByText('128')).toBeInTheDocument()
    expect(await screen.findByText('15')).toBeInTheDocument()
  })
})
