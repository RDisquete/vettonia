import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { refreshAchievements } from '../services/achievements'
import type { AchievementDef } from '../types'

export default function AchievementGrid() {
  const [achievements, setAchievements] = useState<(AchievementDef & { unlocked: boolean; progress: number })[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await refreshAchievements()
    setAchievements(result)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <p className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase">Logros</p>
        <h2 className="font-heading text-violeta text-3xl font-extrabold leading-[0.9] tracking-[-0.05em] mt-2">
          Tus insignias
        </h2>
        <p className="font-mono text-[10px] tracking-[0.3em] text-black/40 mt-3">
          {unlockedCount}/{achievements.length} desbloqueados
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/40 animate-pulse"
              style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`relative border-2 p-4 flex flex-col items-center text-center transition-all duration-300 ${
                a.unlocked
                  ? 'bg-white/80 border-violeta/30'
                  : 'bg-white/30 border-black/10'
              }`}
              style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
            >
              <span className={`text-3xl sm:text-4xl leading-none mb-2 transition-all duration-300 ${
                a.unlocked ? '' : 'grayscale opacity-40'
              }`}>
                {a.icon}
              </span>
              <span className={`font-heading text-xs font-bold tracking-[-0.01em] leading-tight ${
                a.unlocked ? 'text-violeta' : 'text-black/40'
              }`}>
                {a.label}
              </span>
              <span className={`font-mono text-[7px] tracking-[0.2em] uppercase mt-1 ${
                a.unlocked ? 'text-black/50' : 'text-black/30'
              }`}>
                {a.description}
              </span>
              {a.target > 1 && (
                <div className="w-full mt-2.5">
                  <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violeta to-coral rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (a.progress / a.target) * 100)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`font-mono text-[7px] tracking-[0.15em] mt-1 block ${
                    a.unlocked ? 'text-violeta/60' : 'text-black/30'
                  }`}>
                    {Math.min(a.progress, a.target)}/{a.target}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
