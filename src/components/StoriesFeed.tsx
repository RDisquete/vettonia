import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { UploadedPhoto, ReactionType } from '../types'
import { REACTION_TYPES } from '../services/reactions'

interface ReactionCount {
  type: ReactionType
  count: number
}

interface StoriesFeedProps {
  photos: UploadedPhoto[]
  userReactions: Record<string, ReactionType[]>
  reactionCounts: Record<string, ReactionCount[]>
  onToggleReaction: (photoId: string, type: ReactionType) => void
  newPhotoIds: Set<string>
}

function StoryCard({ photo, userReactions, reactionCounts, onToggleReaction, isNew }: {
  photo: UploadedPhoto
  userReactions: ReactionType[]
  reactionCounts: ReactionCount[]
  onToggleReaction: (photoId: string, type: ReactionType) => void
  isNew: boolean
}) {
  const isLiked = userReactions.includes('❤️')
  const isFired = userReactions.includes('🔥')
  const isPartied = userReactions.includes('🎉')

  return (
    <motion.div
      initial={isNew ? { scale: 0.85, opacity: 0 } : false}
      animate={isNew ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative w-full h-[90vh] sm:h-[85vh] flex-shrink-0 snap-start overflow-hidden bg-carbón"
    >
      <img
        src={photo.dataUrl}
        alt={photo.caption}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-5 pb-8">
        {photo.caption && (
          <p className="font-ui text-white/95 text-sm sm:text-base leading-relaxed italic drop-shadow-md max-w-lg">
            &ldquo;{photo.caption}&rdquo;
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <span className="font-mono text-white/60 text-[8px] tracking-[0.2em] uppercase">{photo.author}</span>
          <span className="text-white/30 text-[6px]">·</span>
          <span className="font-mono text-white/30 text-[7px] tracking-[0.15em]">
            {new Date(photo.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4">
          {REACTION_TYPES.map((type: ReactionType) => {
            const isActiveReaction =
              type === '❤️' ? isLiked :
              type === '🔥' ? isFired :
              type === '🎉' ? isPartied : false
            const count = reactionCounts?.find(r => r.type === type)?.count || 0
            return (
              <button
                key={type}
                onClick={() => onToggleReaction(photo.id, type)}
                className={`text-xl sm:text-2xl transition-all cursor-pointer active:scale-90 ${
                  isActiveReaction ? 'scale-110 drop-shadow-lg brightness-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {type}
                {count > 0 && (
                  <span className="font-mono text-white/80 text-[9px] ml-1 align-middle">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {isNew && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute top-4 right-4 bg-coral text-white font-mono text-[7px] tracking-[0.3em] uppercase px-3 py-1.5"
          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
        >
          Nueva
        </motion.div>
      )}
    </motion.div>
  )
}

export default function StoriesFeed({ photos, userReactions, reactionCounts, onToggleReaction, newPhotoIds }: StoriesFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((index: number) => {
    const el = containerRef.current
    if (!el) return
    const child = el.children[index] as HTMLElement
    if (child) child.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight)
      setCurrentIndex(Math.min(idx, photos.length - 1))
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [photos.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        scrollTo(Math.min(currentIndex + 1, photos.length - 1))
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollTo(Math.max(currentIndex - 1, 0))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, scrollTo, photos.length])

  if (photos.length === 0) return null

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-1.5 py-3 px-5 bg-arena/80 backdrop-blur-sm sticky top-0 z-10">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              i === currentIndex ? 'w-6 bg-coral' : 'w-2 bg-violeta/20 hover:bg-violeta/40'
            }`}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="w-full h-[90vh] sm:h-[85vh] overflow-y-auto snap-y snap-mandatory scroll-smooth"
        onTouchStart={(e) => { touchY.current = e.touches[0].clientY }}
        onTouchEnd={(e) => {
          const delta = touchY.current - e.changedTouches[0].clientY
          if (Math.abs(delta) > 50) {
            if (delta > 0) scrollTo(Math.min(currentIndex + 1, photos.length - 1))
            else scrollTo(Math.max(currentIndex - 1, 0))
          }
        }}
      >
        <AnimatePresence initial={false}>
          {photos.map(photo => (
            <StoryCard
              key={photo.id}
              photo={photo}
              userReactions={userReactions[photo.id] || []}
              reactionCounts={reactionCounts[photo.id] || []}
              onToggleReaction={onToggleReaction}
              isNew={newPhotoIds.has(photo.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 py-3 bg-arena/80 backdrop-blur-sm">
        <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">
          {currentIndex + 1} / {photos.length}
        </span>
        {newPhotoIds.size > 0 && (
          <button
            onClick={() => scrollTo(0)}
            className="font-mono text-coral text-[7px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer animate-pulse"
          >
            {newPhotoIds.size} foto{newPhotoIds.size > 1 ? 's' : ''} nueva{newPhotoIds.size > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  )
}
