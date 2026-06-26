export const ALBUM_CODE = (import.meta.env.VITE_ALBUM_CODE || 'VETTONIA').trim().toUpperCase()

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const HAS_SUPABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY)
