import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { spring } from '../lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds. Use 0.04–0.08 steps between siblings for a stagger. */
  delay?: number
  /** Starting offset in px. Ignored automatically for reduced motion. */
  y?: number
}

/** Fades and lifts content once as it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...spring.reveal, delay }}
    >
      {children}
    </motion.div>
  )
}
