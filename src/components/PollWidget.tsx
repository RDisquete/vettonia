import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResults, hasUserVoted, vote, subscribeToPoll, getActivePollId, getPollOptions } from '../services/polls'
import { getAuthenticatedPass } from '../lib/storage'
import type { PollResult } from '../types'

export default function PollWidget() {
  const pollId = getActivePollId()
  const [results, setResults] = useState<PollResult[]>([])
  const [voted, setVoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [animatingResults, setAnimatingResults] = useState<Record<string, boolean>>({})
  const [voteError, setVoteError] = useState('')

  const pass = getAuthenticatedPass()

  const load = useCallback(async () => {
    setLoading(true)
    const [r, v] = await Promise.all([getResults(pollId), hasUserVoted(pollId)])
    setResults(r)
    setVoted(v)
    setLoading(false)
  }, [pollId])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const unsub = subscribeToPoll(pollId, () => {
      getResults(pollId).then(r => {
        setResults(prev => {
          r.forEach((opt, i) => {
            const old = prev[i]
            if (old && opt.percentage !== old.percentage) {
              setTimeout(() => setAnimatingResults(a => ({ ...a, [opt.optionId]: true })), 50)
            }
          })
          return r
        })
      })
    })
    return unsub
  }, [pollId])

  async function handleVote(optionId: string) {
    if (!pass) {
      setVoteError('Necesitas un pase para votar. Desbloquea el álbum primero.')
      return
    }
    setVoting(true)
    setVoteError('')
    const ok = await vote(pollId, optionId)
    if (ok) {
      setVoted(true)
      const r = await getResults(pollId)
      setResults(r)
    } else {
      setVoteError('No se pudo registrar tu voto. ¿Ya votaste?')
    }
    setVoting(false)
  }

  const options = getPollOptions()
  const totalVotes = results.reduce((a, r) => a + r.count, 0)

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <motion.h3
          className="font-heading text-2xl md:text-3xl text-white tracking-tight mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ¿Quién tuvo la mejor actuación?
        </motion.h3>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8">
          Vettonia 2026 · {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
        </p>

        {!pass && !loading && (
          <div className="border-l-4 border-t-2 border-r-2 border-b-2 border-arena/30 px-6 py-4 mb-6"
            style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0 100%)' }}>
            <p className="font-mono text-[11px] tracking-[0.2em] text-arena/70 uppercase">
              Desbloquea el álbum colaborativo para votar
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-white/5 animate-pulse"
                style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 0 100%)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {options.map((option, i) => {
                const result = results.find(r => r.optionId === option.id)
                const isAnimating = animatingResults[option.id]
                return voted ? (
                  <motion.div
                    key={option.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative overflow-hidden border-l-4 border-t-2 border-r-2 border-b-2 border-white/10 bg-white/5"
                    style={{ clipPath: 'polygon(1.5% 0, 100% 0, 98.5% 100%, 0 100%)' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violeta/30 to-coral/20 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isAnimating ? [1, 1.02, 1] : 1 }}
                      style={{ width: `${result?.percentage || 0}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between px-5 py-3.5">
                      <span className="font-mono text-sm text-white tracking-wider">
                        {option.text}
                      </span>
                      <span className="font-mono text-xs text-white/60 tabular-nums">
                        {result?.percentage || 0}%
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key={option.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.06 }}
                    disabled={voting || !pass}
                    onClick={() => handleVote(option.id)}
                    className="w-full text-left border-l-4 border-t-2 border-r-2 border-b-2 border-white/10 bg-white/5
                      hover:bg-white/10 hover:border-violeta/40 transition-all duration-300
                      disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ clipPath: 'polygon(1.5% 0, 100% 0, 98.5% 100%, 0 100%)' }}
                  >
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="font-mono text-sm text-white/80 tracking-wider group-hover:text-white">
                        {option.text}
                      </span>
                      <span className="text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase">
                        Votar
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {voteError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] tracking-[0.2em] text-coral mt-4"
          >
            {voteError}
          </motion.p>
        )}
      </div>
    </div>
  )
}
