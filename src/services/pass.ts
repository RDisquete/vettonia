import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { compressImage, blobToDataUrl } from '../lib/image'
import { getItem, setItem, getRaw, setRaw } from '../lib/persistence'
import type { PassInfo } from '../types'

const INFO_KEY = 'pass_info'
const PHOTO_KEY = 'pass_photo'
const COUNTER_KEY = 'pass_counter'
const PIN_KEY = 'pass_pin'

export function nextPassNumber(): string {
  const raw = getRaw(COUNTER_KEY)
  const count = raw ? parseInt(raw, 10) : 0
  const next = count + 1
  setRaw(COUNTER_KEY, String(next))
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `VET-${String(next).padStart(6, '0')}${rand}`
}

export async function initPassInfo(): Promise<void> {
  const existing = getRaw(INFO_KEY)
  let info: PassInfo

  if (existing) {
    info = JSON.parse(existing) as PassInfo
  } else {
    info = {
      name: '',
      number: nextPassNumber(),
      createdAt: new Date().toISOString(),
    }
    setItem(INFO_KEY, info)
  }

  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.from('passes').upsert({
        number: info.number,
        name: info.name,
        created_at: info.createdAt,
        photo_url: null,
      }, { onConflict: 'number' })
    } catch {}
  }
}

export async function getPassInfo(): Promise<PassInfo> {
  const local = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })

  if (HAS_SUPABASE && supabase && local.number) {
    try {
      const { data } = await supabase
        .from('passes')
        .select('*')
        .eq('number', local.number)
        .maybeSingle()
      if (data) {
        const info: PassInfo = {
          name: data.name || '',
          number: data.number,
          createdAt: data.created_at,
        }
        setItem(INFO_KEY, info)
        return info
      }
    } catch {}
  }

  return local
}

export async function setPassName(name: string): Promise<void> {
  const info = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
  info.name = name
  setItem(INFO_KEY, info)

  if (HAS_SUPABASE && supabase && info.number) {
    try {
      await supabase.from('passes').upsert({
        number: info.number,
        name,
      }, { onConflict: 'number' })
    } catch {}
  }
}

export async function getPassPhoto(): Promise<string | null> {
  if (HAS_SUPABASE && supabase) {
    try {
      const info = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
      if (info.number) {
        const { data } = await supabase
          .from('passes')
          .select('photo_url')
          .eq('number', info.number)
          .maybeSingle()
        if (data?.photo_url) {
          setRaw(PHOTO_KEY, data.photo_url)
          return data.photo_url
        }
      }
    } catch {}
  }
  return getRaw(PHOTO_KEY)
}

export async function setPassPhoto(file: File): Promise<string> {
  if (HAS_SUPABASE && supabase) {
    try {
      const info = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
      if (info.number) {
        const ext = file.name.split('.').pop() || 'jpg'
        const storagePath = `pass-photos/${info.number}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(storagePath, file, { upsert: true, contentType: file.type })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('photos')
            .getPublicUrl(storagePath)
          if (urlData) {
            await supabase.from('passes').upsert({
              number: info.number,
              photo_url: urlData.publicUrl,
            }, { onConflict: 'number' })
            setRaw(PHOTO_KEY, urlData.publicUrl)
            return urlData.publicUrl
          }
        }
      }
    } catch {}
  }

  const compressed = await compressImage(file)
  const dataUrl = await blobToDataUrl(compressed)
  setRaw(PHOTO_KEY, dataUrl)
  return dataUrl
}

export function getPassPin(): string | null {
  return getRaw(PIN_KEY)
}

export async function setPassPin(pin: string): Promise<void> {
  setRaw(PIN_KEY, pin)
  const info = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
  if (HAS_SUPABASE && supabase && info.number) {
    try {
      await supabase.from('passes').upsert({
        number: info.number,
        pin,
      }, { onConflict: 'number' })
    } catch {}
  }
}

export async function verifyPassPin(passNumber: string, pin: string): Promise<boolean> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('passes')
        .select('number')
        .eq('number', passNumber)
        .eq('pin', pin)
        .maybeSingle()
      if (data) return true
    } catch {}
  }

  const localPin = getRaw(PIN_KEY)
  const localPass = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
  if (localPass.number === passNumber && localPin === pin) return true

  return false
}
