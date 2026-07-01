import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResults, hasUserVoted, vote, subscribeToPoll, getActivePollId, getPollOptions } from '../services/polls'
import { getAuthenticatedPass, isAlbumUnlocked } from '../services/album'
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
  const unlocked = isAlbumUnlocked()

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
    if (!unlocked) {
      setVoteError('Desbloquea el álbum colaborativo para votar.')
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
    <div className="relative">
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violeta/30 dark:via-white/20 to-transparent" />
          <motion.h3
            className="font-heading text-2xl md:text-3xl text-violeta dark:text-white tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ¿Quién tuvo la mejor actuación?
          </motion.h3>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violeta/30 dark:via-white/20 to-transparent" />
        </div>

        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-violeta/40 dark:text-white/40 text-center mb-8">
          Vettonia 2027 · {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
        </p>

        {!unlocked && !loading && (
          <div className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/30 dark:border-coral/50 px-6 py-4 mb-6 relative group"
            style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-coral/5 dark:from-coral/10 to-transparent pointer-events-none" />
            <p className="font-mono text-[11px] tracking-[0.2em] text-coral/70 dark:text-coral/90 uppercase relative z-10">
              Desbloquea el álbum colaborativo para votar
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-violeta/10 dark:bg-white/10 animate-pulse"
                style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 0 100%)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
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
                    className="relative overflow-hidden border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/20 dark:border-white/20"
                    style={{ clipPath: 'polygon(1.5% 0, 100% 0, 98.5% 100%, 0 100%)' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violeta/20 dark:from-white/15 to-coral/10 dark:to-coral/15 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isAnimating ? [1, 1.02, 1] : 1 }}
                      style={{ width: `${result?.percentage || 0}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between px-5 py-4">
                      <span className="font-mono text-sm text-violeta dark:text-white tracking-wider">
                        {option.text}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-0.5 bg-violeta/10 dark:bg-white/10" />
                        <span className="font-mono text-xs text-violeta/60 dark:text-white/60 tabular-nums font-bold">
                          {result?.percentage || 0}%
                        </span>
                      </div>
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
                    className="w-full text-left border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 dark:border-white/30
                      hover:bg-violeta dark:hover:bg-white hover:border-violeta dark:hover:border-white transition-all duration-300
                      disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                    style={{ clipPath: 'polygon(1.5% 0, 100% 0, 98.5% 100%, 0 100%)' }}
                  >
                    <div className="flex items-center justify-between px-5 py-4">
                      <span className="font-mono text-sm text-violeta/80 dark:text-white/80 tracking-wider group-hover:text-white dark:group-hover:text-violeta transition-colors duration-300">
                        {option.text}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-violeta/40 dark:text-white/40 group-hover:text-white/80 dark:group-hover:text-violeta/80 group-hover:tracking-[0.5em] transition-all duration-300">
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
            className="font-mono text-[10px] tracking-[0.2em] text-coral mt-4 text-center"
          >
            {voteError}
          </motion.p>
        )}
      </div>
    </div>
  )
}
