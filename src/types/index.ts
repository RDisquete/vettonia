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

export type ReactionType = '❤️' | '🔥' | '🎉'

export interface PhotoReaction {
  id: string
  photoId: string
  passNumber: string
  type: ReactionType
  createdAt: string
}

export interface PhotoReactionCount {
  type: ReactionType
  count: number
}

export interface FavoriteEntry {
  artistSlug: string
  addedAt: string
}

export interface Poll {
  id: string
  question: string
  active: boolean
  createdAt: string
}

export interface PollOption {
  id: string
  pollId: string
  text: string
}

export interface PollVote {
  id: string
  optionId: string
  pollId: string
  passNumber: string
  createdAt: string
}

export interface PollResult {
  optionId: string
  text: string
  count: number
  percentage: number
}

export interface AchievementDef {
  id: string
  label: string
  description: string
  icon: string
  target: number
}

export interface AchievementState {
  unlocked: boolean
  progress: number
}

export interface Alert {
  id: string
  userId: string
  type: 'like' | 'message' | 'photo'
  message: string
  read: boolean
  createdAt: string
}


