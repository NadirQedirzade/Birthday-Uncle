import { motion, useInView } from 'motion/react'
import { Fragment, useRef, type ElementType } from 'react'
import { cn } from '../lib/cn'
import { easeOut } from '../lib/motion'

interface SplitTextProps {
  text: string
  /** Wrapping element. Defaults to a span. */
  as?: ElementType
  id?: string
  className?: string
  /** Seconds before the first word. */
  delay?: number
  /** Seconds between words (30–80ms feels natural). */
  stagger?: number
  duration?: number
  /** Wait until the text scrolls into view instead of playing on mount. */
  inView?: boolean
  /** Purely visual repeat of text that is announced elsewhere. */
  decorative?: boolean
  /**
   * Classes for each animated word. Use this (not `className`) for `background-clip: text`
   * effects: the clip does not paint through transformed descendants.
   */
  wordClassName?: string
}

/**
 * Staggered word reveal: each word rises from behind a mask.
 * Screen readers get the whole sentence once; the animated words are aria-hidden.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  id,
  className,
  delay = 0,
  stagger = 0.07,
  duration = 1,
  inView = false,
  decorative = false,
  wordClassName,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.6 })
  const show = inView ? seen : true
  const words = text.split(' ')

  return (
    <Tag ref={ref} id={id} className={className} aria-hidden={decorative || undefined}>
      {!decorative && <span className="sr-only">{text}</span>}
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="split-mask">
              <motion.span
                className={cn('inline-block', wordClassName)}
                initial={{ y: '115%', opacity: 0 }}
                animate={show ? { y: '0%', opacity: 1 } : undefined}
                transition={{ duration, ease: easeOut, delay: delay + i * stagger }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
