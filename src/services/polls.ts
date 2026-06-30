import { getItem, setItem } from '../lib/persistence'
import { getAuthenticatedPass } from './album'
import type { PollOption, PollResult } from '../types'

const VOTES_KEY = 'poll_votes'
const RESULTS_KEY = 'poll_results'
const POLLS_KEY = 'polls'

const MEJOR_ACTUACION_POLL_ID = 'mejor-actuacion-2027'

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
  const local = getItem<Record<string, string[]>>(VOTES_KEY, {})
  return (local[pollId] || []).includes(pass)
}

export async function vote(pollId: string, optionId: string): Promise<boolean> {
  const pass = getAuthenticatedPass()
  if (!pass) return false
  const already = await hasUserVoted(pollId)
  if (already) return false
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
  _pollId: string,
  _onUpdate: () => void
): () => void {
  return () => {}
}
