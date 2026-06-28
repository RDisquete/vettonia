interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
  overlay?: boolean
}

export default function FavoriteButton({ isFavorite, onToggle, size = 'sm', overlay }: FavoriteButtonProps) {
  const sz = size === 'md' ? 'text-lg' : 'text-sm'
  const pad = size === 'md' ? 'p-2' : 'p-1.5'
  const activeBg = 'bg-coral text-white shadow-md shadow-coral/30'
  const inactiveBg = overlay
    ? 'bg-black/40 text-white/70 backdrop-blur-sm hover:bg-coral hover:text-white hover:shadow-md hover:shadow-coral/30'
    : 'bg-arena-oscuro/60 text-violeta/50 hover:bg-coral hover:text-white hover:shadow-md hover:shadow-coral/30'

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onToggle() } }}
      className={`${sz} ${pad} leading-none inline-flex items-center justify-center rounded-full transition-all cursor-pointer select-none outline-none focus:outline-2 focus:outline-coral/60 active:scale-90 ${isFavorite ? activeBg : inactiveBg}`}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {isFavorite ? '★' : '☆'}
    </span>
  )
}
