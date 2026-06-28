/** Re-exports from src/services for backward compatibility */
export {
  isAlbumUnlocked,
  unlockAlbum,
  lockAlbum,
  getPhotos,
  uploadPhoto,
  deletePhoto,
  updatePhotoStatus,
  getLikedPhotos,
  toggleLike,
  authenticatePass,
  authenticatePassWithPin,
  getAuthenticatedPass,
} from '../services/album'

export {
  getPassInfo,
  setPassName,
  getPassPhoto,
  setPassPhoto,
  initPassInfo,
  getPassPin,
  setPassPin,
} from '../services/pass'

export {
  getMessages,
  addMessage,
  deleteMessage,
} from '../services/messages'

export { getPassStats } from '../services/stats'
export type { PassStats } from '../services/stats'

export {
  getAlerts,
  addAlert,
  markAlertRead,
  deleteAlert,
} from '../services/alerts'

export {
  getPublishedArtists,
  getPublishedStages,
  getAllArtists,
  getAdminStages,
  upsertArtist,
  deleteArtist,
  publishArtist,
  publishAllArtists,
  seedFromStatic,
  getArtistBySlugFromService,
} from '../services/lineup'
