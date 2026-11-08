import { motion, useInView } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useRef } from 'react'
import { birthday } from '../data/birthday'
import { letter } from '../data/message'
import { easeOut, spring } from '../lib/motion'
import { PillLink } from './Button'
import { Sparkles } from './Sparkles'
import { SplitText } from './SplitText'

/**
 * The closing screen. Celebration is restrained: soft motes drift while the section
 * is on screen, and the words arrive one at a time.
 */
export function FinalSurprise() {
  const ref = useRef<HTMLElement>(null)
  const onScreen = useInView(ref, { amount: 0.3 })
  const [first, second] = birthday.finale.headlineLines

  return (
    <section
      ref={ref}
      id="tebrik"
      aria-labelledby="tebrik-title"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
    >
      <Sparkles active={onScreen} className="absolute inset-0 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={spring.reveal}
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full bg-white/[0.08] text-xl font-semibold tracking-[-0.03em] text-accent"
      >
        {birthday.honoree.age}
      </motion.div>

      <h2
        id="tebrik-title"
        className="mt-9 text-[clamp(2.75rem,9vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-label"
      >
        <span className="sr-only">{`${first} ${second}`}</span>
        <SplitText text={first} decorative inView className="block" delay={0.15} stagger={0.1} duration={1.2} />
        <SplitText
          text={second}
          decorative
          inView
          className="block"
          wordClassName="gold-text -mx-[0.1em] px-[0.1em]"
          delay={0.6}
          stagger={0.1}
          duration={1.2}
        />
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ ...spring.reveal, delay: 1.3 }}
        className="mt-8 font-serif text-[clamp(1.5rem,3.4vw,2.25rem)] italic leading-tight tracking-[-0.012em] text-accent"
      >
        {birthday.finale.love}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: easeOut, delay: 1.9 }}
        className="mt-12"
      >
        <span aria-hidden="true" className="mx-auto block h-px w-12 bg-white/20" />
        <p className="mt-7 text-[1.0625rem] text-label-2">
          {birthday.finale.closingPrefix}{' '}
          <span className="font-hand text-[2.5rem] leading-none text-label">{letter.signature}</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease: easeOut, delay: 2.4 }}
        className="mt-12"
      >
        <PillLink href="#home">
          <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
          {birthday.finale.backToTop}
        </PillLink>
      </motion.div>
    </section>
  )
}
