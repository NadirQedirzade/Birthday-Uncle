import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '../lib/cn'
import { spring } from '../lib/motion'

/**
 * Press feedback fires on pointer-down (not on release) and springs back critically damped.
 * Hover styling uses Tailwind's `hover:` which is already gated to hover-capable pointers.
 * Every target is at least 44×44 (HIG); the pill is 48 tall, like Apple's secondary buttons.
 */

const pill =
  'inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-full bg-ink/10 px-7 text-[1.0625rem] font-medium tracking-[-0.011em] text-label shadow-[inset_0_0.5px_0_var(--hl)] transition-colors duration-200 hover:bg-ink/[0.16] active:bg-ink/20'

export function PillLink({ className, children, ...props }: HTMLMotionProps<'a'>) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      transition={spring.press}
      className={cn(pill, className)}
      {...props}
    >
      {children}
    </motion.a>
  )
}

export function IconButton({ className, children, ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={spring.press}
      className={cn(
        'inline-flex size-11 shrink-0 select-none items-center justify-center rounded-full text-label transition-colors duration-200 hover:bg-ink/10 active:bg-ink/15 disabled:pointer-events-none disabled:opacity-35',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
