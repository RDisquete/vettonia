import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, HAS_SUPABASE } from './env'

export const supabase = HAS_SUPABASE
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  : null
