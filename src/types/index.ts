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


