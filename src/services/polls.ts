import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'
import { getAuthenticatedPass } from './album'
import type { PollOption, PollResult } from '../types'

const VOTES_KEY = 'poll_votes'
const RESULTS_KEY = 'poll_results'
const POLLS_KEY = 'polls'

const MEJOR_ACTUACION_POLL_ID = 'mejor-actuacion-2026'

const DEFAULT_OPTIONS: PollOption[] = [
  { id: 'sor', pollId: MEJOR_ACTUACION_POLL_ID, text: 'SÔR' },
  { id: 'laura-aire', pollId: MEJOR_ACTUACION_POLL_ID, text: 'LAURA AIRE' },
  { id: 'kurado', pollId: MEJOR_ACTUACION_POLL_ID, text: 'KURADO' },
  { id: 'mujer-canibal', pollId: MEJOR_ACTUACION_POLL_ID, text: 'MUJER CANÍBAL' },
  { id: 'sen-sen', pollId: MEJOR_ACTUACION_POLL_ID, text: 'SEN SEN' },
  { id: 'zeta', pollId: MEJOR_ACTUACION_POLL_ID, text: 'ZETA' },
]

export function getActivePollId(): string {
  return MEJOR_ACTUACION_POLL_ID
}

export function getPollOptions(): PollOption[] {
  return getItem<PollOption[]>(POLLS_KEY, DEFAULT_OPTIONS)
}

export async function getResults(pollId: string): Promise<PollResult[]> {
  const options = getPollOptions()
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .rpc('get_poll_results', { p_poll_id: pollId })
      if (data) {
        const total = data.reduce((a: number, r: any) => a + r.vote_count, 0) || 1
        const results: PollResult[] = data.map((r: any) => ({
          optionId: r.option_id,
          text: options.find(o => o.id === r.option_id)?.text || r.option_id,
          count: r.vote_count,
          percentage: Math.round((r.vote_count / total) * 100),
        }))
        setItem(RESULTS_KEY, { [pollId]: Object.fromEntries(results.map(r => [r.optionId, r.count])) })
        return results
      }
    } catch {
      const { data } = await supabase
        .from('poll_votes')
        .select('option_id')
        .eq('poll_id', pollId)
      if (data) {
        const counts: Record<string, number> = {}
        data.forEach(v => { counts[v.option_id] = (counts[v.option_id] || 0) + 1 })
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
        return options.map(o => ({
          optionId: o.id,
          text: o.text,
          count: counts[o.id] || 0,
          percentage: Math.round(((counts[o.id] || 0) / total) * 100),
        }))
      }
    }
  }
  const local = getItem<Record<string, Record<string, number>>>(RESULTS_KEY, {})
  const counts = local[pollId] || {}
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  return options.map(o => ({
    optionId: o.id,
    text: o.text,
    count: counts[o.id] || 0,
    percentage: Math.round(((counts[o.id] || 0) / total) * 100),
  }))
}

export async function hasUserVoted(pollId: string): Promise<boolean> {
  const pass = getAuthenticatedPass()
  if (!pass) return false
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('poll_votes')
        .select('id', { count: 'exact', head: true })
        .eq('poll_id', pollId)
        .eq('pass_number', pass)
      if (data && data.length > 0) return true
    } catch {}
  }
  const local = getItem<Record<string, string[]>>(VOTES_KEY, {})
  return (local[pollId] || []).includes(pass)
}

export async function vote(pollId: string, optionId: string): Promise<boolean> {
  const pass = getAuthenticatedPass()
  if (!pass) return false
  const already = await hasUserVoted(pollId)
  if (already) return false
  if (HAS_SUPABASE && supabase) {
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({ id: crypto.randomUUID(), poll_id: pollId, option_id: optionId, pass_number: pass })
      if (!error) {
        const local = getItem<Record<string, string[]>>(VOTES_KEY, {})
        if (!local[pollId]) local[pollId] = []
        local[pollId].push(pass)
        setItem(VOTES_KEY, local)
        return true
      }
    } catch {}
  }
  const local = getItem<Record<string, string[]>>(VOTES_KEY, {})
  if (!local[pollId]) local[pollId] = []
  local[pollId].push(pass)
  setItem(VOTES_KEY, local)
  const results = getItem<Record<string, Record<string, number>>>(RESULTS_KEY, {})
  if (!results[pollId]) results[pollId] = {}
  results[pollId][optionId] = (results[pollId][optionId] || 0) + 1
  setItem(RESULTS_KEY, results)
  return true
}

export function subscribeToPoll(
  pollId: string,
  onUpdate: () => void
): () => void {
  const sb = supabase
  if (!HAS_SUPABASE || !sb) return () => {}
  const channel = sb
    .channel(`poll-${pollId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'poll_votes', filter: `poll_id=eq.${pollId}` },
      () => { onUpdate() }
    )
    .subscribe()
  return () => { sb.removeChannel(channel) }
}
