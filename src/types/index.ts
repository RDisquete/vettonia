export type Artist = {
  slug: string
  name: string
  bio: string
  stage: string
  time: string
  image: string
  genre: string
}

export interface PublicPhoto {
  src: string
  rotate: string
  clip: string
  obj: string
}

export interface UploadedPhoto {
  id: string
  dataUrl: string
  caption: string
  author: string
  createdAt: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface WallMessage {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface PassInfo {
  name: string
  number: string
  createdAt: string
}

export type PassTheme = 'violeta' | 'coral' | 'arena' | 'noche' | 'oliva'

export interface Alert {
  id: string
  userId: string
  type: 'like' | 'message' | 'photo'
  message: string
  read: boolean
  createdAt: string
}

export const PASS_THEMES: Record<PassTheme, {
  label: string
  cardBgRgb: string
  titleColor: string
  accent: string
  muted: string
  solidBox: string
  solidBorder: string
  accentRgb: string
}> = {
  violeta: {
    label: 'Violeta',
    cardBgRgb: 'rgba(240,237,232,0.88)',
    titleColor: '#3a1a4a',
    accent: '#e85d6f',
    muted: 'rgba(58,26,74,0.5)',
    solidBox: 'rgba(232,93,111,0.45)',
    solidBorder: 'rgba(232,93,111,0.3)',
    accentRgb: '232,93,111',
  },
  coral: {
    label: 'Coral',
    cardBgRgb: 'rgba(232,93,111,0.92)',
    titleColor: '#ffffff',
    accent: '#3a1a4a',
    muted: 'rgba(255,255,255,0.6)',
    solidBox: 'rgba(58,26,74,0.4)',
    solidBorder: 'rgba(58,26,74,0.3)',
    accentRgb: '58,26,74',
  },
  arena: {
    label: 'Arena',
    cardBgRgb: 'rgba(139,105,20,0.92)',
    titleColor: '#ffffff',
    accent: '#D4A373',
    muted: 'rgba(255,255,255,0.6)',
    solidBox: 'rgba(212,163,115,0.4)',
    solidBorder: 'rgba(212,163,115,0.3)',
    accentRgb: '212,163,115',
  },
  noche: {
    label: 'Noche',
    cardBgRgb: 'rgba(17,17,19,0.92)',
    titleColor: '#ffffff',
    accent: '#e85d6f',
    muted: 'rgba(255,255,255,0.5)',
    solidBox: 'rgba(232,93,111,0.35)',
    solidBorder: 'rgba(232,93,111,0.25)',
    accentRgb: '232,93,111',
  },
  oliva: {
    label: 'Oliva',
    cardBgRgb: 'rgba(90,110,60,0.92)',
    titleColor: '#ffffff',
    accent: '#e8d5a3',
    muted: 'rgba(255,255,255,0.6)',
    solidBox: 'rgba(232,213,163,0.4)',
    solidBorder: 'rgba(232,213,163,0.3)',
    accentRgb: '232,213,163',
  },
}
