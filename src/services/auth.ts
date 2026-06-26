import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { setItem } from '../lib/persistence'
import { nextPassNumber } from './pass'
import type { PassInfo } from '../types'

export async function signUp(email: string, password: string, name: string) {
  if (!HAS_SUPABASE || !supabase) throw new Error('Supabase no disponible')
  const passNumber = nextPassNumber()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
      pass_number: passNumber,
    })
    await supabase.from('passes').upsert({
      number: passNumber,
      name,
    })
    const info: PassInfo = {
      name,
      number: passNumber,
      createdAt: new Date().toISOString(),
    }
    setItem('pass_info', info)
  }
  return { ...data, passNumber }
}

export async function signIn(email: string, password: string) {
  if (!HAS_SUPABASE || !supabase) throw new Error('Supabase no disponible')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInAdmin(email: string, password: string) {
  return signIn(email, password)
}

export async function signOut() {
  if (!HAS_SUPABASE || !supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) console.warn('signOut error:', error)
}

export async function getCurrentUser() {
  if (!HAS_SUPABASE || !supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getProfile() {
  if (!HAS_SUPABASE || !supabase) return null
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return data as { id: string; name: string; email: string; pass_number: string } | null
}

export async function getSession() {
  if (!HAS_SUPABASE || !supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback: (session: unknown) => void) {
  if (!HAS_SUPABASE || !supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return data.subscription.unsubscribe
}

export async function signInPass(passNumber: string, pin: string) {
  if (!HAS_SUPABASE || !supabase) throw new Error('Supabase no disponible')
  const email = `pass-${passNumber.replace(/-/g, '').toLowerCase()}@vettonia.app`
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pin })
  if (error) throw error
  return data
}

export async function signUpPass(passNumber: string, pin: string) {
  if (!HAS_SUPABASE || !supabase) throw new Error('Supabase no disponible')
  const email = `pass-${passNumber.replace(/-/g, '').toLowerCase()}@vettonia.app`
  const { data, error } = await supabase.auth.signUp({ email, password: pin })
  if (error) throw error
  return data
}
