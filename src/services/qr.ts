import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem } from '../lib/persistence'
import type { PassInfo } from '../types'

const INFO_KEY = 'pass_info'

export interface PassQRData {
  v: 1
  n: string
  p: string
}

export function encodePassQR(name: string, passNumber: string): string {
  const data: PassQRData = { v: 1, n: name, p: passNumber }
  return JSON.stringify(data)
}

export function decodePassQR(qrContent: string): PassQRData | null {
  try {
    const data = JSON.parse(qrContent) as PassQRData
    if (data.v === 1 && data.n !== undefined && data.p !== undefined) return data
    return null
  } catch {
    return null
  }
}

export async function validatePassQR(qrContent: string): Promise<{ valid: boolean; name?: string; number?: string }> {
  const data = decodePassQR(qrContent)
  if (!data) return { valid: false }

  if (HAS_SUPABASE && supabase) {
    try {
      const { data: pass } = await supabase
        .from('passes')
        .select('number, name')
        .eq('number', data.p)
        .maybeSingle()
      if (pass && pass.name === data.n) {
        return { valid: true, name: pass.name, number: pass.number }
      }
      return { valid: false }
    } catch {
      return { valid: false }
    }
  }

  const local = getItem<PassInfo>(INFO_KEY, { name: '', number: '', createdAt: '' })
  if (local.number === data.p && local.name === data.n) {
    return { valid: true, name: local.name, number: local.number }
  }

  return { valid: false }
}
