import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  pop: {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  creep: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
}

interface RevealProps {
  as?: keyof typeof variants
  delay?: number
  className?: string
  children: ReactNode
}

export default function Reveal({ as = 'pop', delay = 0, className, children }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants[as]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
