import { memo } from 'react'

type Props = { className?: string; children?: React.ReactNode; style?: React.CSSProperties }

export const SolidBox = memo(function SolidBox({ className = '', style }: Props) {
  return <div aria-hidden="true" className={`absolute ${className}`}
    style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)', ...style }} />
})

export const SolidTri = memo(function SolidTri({ className = '', style }: Props) {
  return <div aria-hidden="true" className={`absolute ${className}`}
    style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', ...style }} />
})

export const SolidDot = memo(function SolidDot({ className = '', style }: Props) {
  return <div aria-hidden="true" className={`absolute rounded-full ${className}`} style={style} />
})

export const SolidLine = memo(function SolidLine({ className = '', style }: Props) {
  return <div aria-hidden="true" className={`absolute ${className}`} style={style} />
})

export const SolidRing = memo(function SolidRing({ className = '', style }: Props) {
  return <div aria-hidden="true" className={`absolute rounded-full border ${className}`} style={style} />
})
