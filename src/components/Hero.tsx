import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Gift } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { birthday } from '../data/birthday'
import { easeOut, spring } from '../lib/motion'
import { SplitText } from './SplitText'

/**
 * Opening sequence (≈2.5s, never blocks interaction, nav is usable immediately):
 * gift note → "50" materializes → name → date → tagline → scroll cue.
 * Afterwards, scrolling lets the content recede (scale + fade) as the next section arrives.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const lightX = useSpring(px, { stiffness: 60, damping: 18, mass: 1 })
  const lightY = useSpring(py, { stiffness: 60, damping: 18, mass: 1 })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const recedeScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const recedeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const recedeY = useTransform(scrollYProgress, [0, 1], [0, 56])

  // A soft light follows the pointer on desktop. Skipped for touch and reduced motion.
  useEffect(() => {
    if (reduce) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth - 0.5) * 36)
      py.set((event.clientY / window.innerHeight - 0.5) * 26)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, px, py])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-24 text-center"
    >
      {/* Light: a quiet pool behind the numeral, not a glow. */}
      <motion.div
        aria-hidden="true"
        style={{ x: lightX, y: lightY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: easeOut }}
        className="pointer-events-none absolute left-1/2 top-[40%] -z-10 size-[min(120vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
      />

      <motion.div
        style={reduce ? undefined : { scale: recedeScale, opacity: recedeOpacity, y: recedeY }}
        className="flex flex-col items-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.reveal, delay: 0.2 }}
          className="inline-flex max-w-full items-center gap-2 rounded-full bg-ink/[0.07] px-3.5 py-2 text-[0.8125rem] leading-snug tracking-[-0.006em] text-label-2 shadow-[inset_0_0_0_0.5px_color-mix(in_oklab,var(--ink)_10%,transparent)]"
        >
          <Gift size={15} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
          {birthday.hero.giftNote}
        </motion.p>

        {/* The number */}
        <motion.h1
          initial={{ opacity: 0, y: 28, scale: 1.04 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: easeOut, delay: 0.35 }}
          className="relative mt-8 text-[clamp(10rem,50vw,22rem)] font-semibold leading-[0.8] tracking-[-0.065em] sm:mt-10"
        >
          <span className="sr-only">{birthday.honoree.fullName}, 50 yaş</span>
          {/* Negative tracking also trims the last glyph's advance; the end padding keeps the
              gradient's paint box wide enough that the "0" is never clipped, and re-centres the pair. */}
          <span aria-hidden="true" className="gold-text block pb-[0.07em] pr-[0.07em]">
            {birthday.honoree.age}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.reveal, delay: 1 }}
          className="mt-8 text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.027em] text-label sm:mt-10"
        >
          {birthday.honoree.fullName}
        </motion.p>

        <motion.time
          dateTime="1976-11-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1.2 }}
          className="mt-2 text-[1.0625rem] tabular-nums tracking-[0.01em] text-label-2"
        >
          {birthday.honoree.birthDateLabel}
        </motion.time>

        <p className="mt-9 font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] italic leading-[1.32] tracking-[-0.012em] text-label/90 sm:mt-11">
          {birthday.hero.headlineLines.map((line, i) => (
            <SplitText
              key={line}
              text={line}
              className="block"
              delay={1.4 + i * 0.28}
              stagger={0.07}
              duration={0.9}
            />
          ))}
        </p>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <motion.a
          href="#anlar"
          aria-label={birthday.hero.scrollAria}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6 }}
          whileTap={{ scale: 0.96 }}
          className="flex min-h-11 flex-col items-center gap-2.5 rounded-full px-5 py-2 text-[0.8125rem] text-label-2 transition-colors duration-200 hover:text-label"
        >
          <span>{birthday.hero.scrollLabel}</span>
          <span aria-hidden="true" className="relative h-9 w-px overflow-hidden bg-ink/15">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
          </span>
        </motion.a>
      </div>
    </section>
  )
}
