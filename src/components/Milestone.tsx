import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { birthday } from '../data/birthday'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const TICKS = birthday.honoree.age

/** One tick per year. It lights up as the counter passes it. Every fifth tick is longer. */
function Tick({ index, count }: { index: number; count: MotionValue<number> }) {
  const stroke = useTransform(count, (v) =>
    v >= index + 1 ? 'rgb(220 192 138)' : 'rgb(245 241 234 / 0.14)',
  )
  const major = index % 5 === 4

  return (
    <g transform={`rotate(${(index / TICKS) * 360} 200 200)`}>
      <motion.line
        x1="200"
        y1="14"
        x2="200"
        y2={major ? 42 : 30}
        strokeWidth={major ? 2.5 : 1.5}
        strokeLinecap="round"
        style={{ stroke }}
        className="transition-[stroke] duration-300"
      />
    </g>
  )
}

export function Milestone() {
  const reduce = useReducedMotion()
  const ringRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ringRef, { once: true, amount: 0.5 })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toString())

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(TICKS)
      return
    }
    const controls = animate(count, TICKS, { duration: 2.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 })
    return () => controls.stop()
  }, [inView, reduce, count])

  return (
    <section
      id="elli-il"
      aria-labelledby="elli-il-title"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
        {/* The number */}
        <div className="lg:sticky lg:top-28">
          <div
            ref={ringRef}
            className="relative mx-auto grid aspect-square w-full max-w-[26rem] place-items-center"
          >
            <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 size-full">
              {Array.from({ length: TICKS }, (_, i) => (
                <Tick key={i} index={i} count={count} />
              ))}
            </svg>

            <span className="sr-only">{TICKS}</span>
            <motion.span
              aria-hidden="true"
              className="gold-text relative px-[0.05em] pb-[0.07em] text-[clamp(5.5rem,22vw,9rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums"
            >
              {rounded}
            </motion.span>
          </div>
        </div>

        {/* The words */}
        <div>
          <SectionHeading
            id="elli-il-title"
            eyebrow={birthday.milestone.eyebrow}
            title={birthday.milestone.title}
            lead={birthday.milestone.lead}
          />

          {/* Inset-grouped list: one raised surface, rows divided by hairlines. */}
          <ol className="mt-10 overflow-hidden rounded-[1.75rem] bg-raised sm:mt-12">
            {birthday.milestone.items.map((item, index) => (
              <li key={item.title} className="border-t border-hairline first:border-t-0">
                <Reveal delay={index * 0.04} y={16} className="px-6 py-6 sm:px-8 sm:py-7">
                  <h3 className="text-[1.3125rem] font-semibold leading-tight tracking-[-0.02em] text-label">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-[1.0625rem] leading-[1.47] text-label-2">
                    {item.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
