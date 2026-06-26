type SkeletonProps = { className?: string }

export function SkeletonBox({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-violeta/10 rounded-none ${className}`} />
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-violeta/10 rounded-none h-3 ${className}`} />
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-violeta/10 rounded-full ${className}`} />
}

export function PhotoCardSkeleton() {
  return (
    <div className="border border-violeta/10 bg-white/60 overflow-hidden">
      <SkeletonBox className="w-full aspect-square" />
      <div className="p-2 space-y-1.5">
        <SkeletonText className="w-2/3 h-2.5" />
        <SkeletonText className="w-1/2 h-2" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-2 border-violeta/10 p-4 bg-white">
            <SkeletonBox className="w-16 h-8" />
            <SkeletonText className="w-24 h-2.5 mt-2" />
          </div>
        ))}
      </div>
      <div>
        <SkeletonText className="w-32 h-4 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <PhotoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function GalleryManageSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 bg-white border border-violeta/10 p-3">
          <SkeletonBox className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-1/3 h-3" />
            <SkeletonText className="w-1/2 h-2.5" />
          </div>
          <SkeletonText className="w-12 h-3" />
        </div>
      ))}
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="columns-2 sm:columns-3 gap-2 space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="break-inside-avoid overflow-hidden border border-violeta/10"
          style={{ aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '3/4' }}>
          <SkeletonBox className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}
