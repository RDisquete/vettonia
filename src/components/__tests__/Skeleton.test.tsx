import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonBox, SkeletonText, SkeletonCircle, PhotoCardSkeleton, DashboardSkeleton, GalleryManageSkeleton, GallerySkeleton } from '../Skeleton'

describe('Skeleton', () => {
  describe('SkeletonBox', () => {
    it('renders with animate-pulse', () => {
      const { container } = render(<SkeletonBox className="w-10 h-10" />)
      expect(container.firstChild).toHaveClass('animate-pulse')
    })
  })

  describe('SkeletonText', () => {
    it('renders with h-3 by default', () => {
      const { container } = render(<SkeletonText />)
      expect(container.firstChild).toHaveClass('h-3')
    })
  })

  describe('SkeletonCircle', () => {
    it('renders rounded-full', () => {
      const { container } = render(<SkeletonCircle className="w-6 h-6" />)
      expect(container.firstChild).toHaveClass('rounded-full')
    })
  })

  describe('PhotoCardSkeleton', () => {
    it('renders skeleton card structure', () => {
      const { container } = render(<PhotoCardSkeleton />)
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('DashboardSkeleton', () => {
    it('renders dashboard grid', () => {
      const { container } = render(<DashboardSkeleton />)
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(8)
    })
  })

  describe('GalleryManageSkeleton', () => {
    it('renders 5 skeleton rows', () => {
      const { container } = render(<GalleryManageSkeleton />)
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('GallerySkeleton', () => {
    it('renders 6 skeleton items', () => {
      const { container } = render(<GallerySkeleton />)
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(6)
    })
  })
})
