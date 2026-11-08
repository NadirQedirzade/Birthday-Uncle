import { motion } from 'motion/react'
import { birthday } from '../data/birthday'
import { letter } from '../data/message'
import { spring } from '../lib/motion'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

/** A paper letter on the dark page. The text lives in src/data/message.ts. */
export function PersonalMessage() {
  return (
    <section
      id="mektub"
      aria-labelledby="mektub-title"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="mektub-title"
          eyebrow={birthday.letter.eyebrow}
          title={birthday.letter.title}
        />

        <motion.article
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={spring.reveal}
          className="paper mt-10 px-6 py-10 sm:mt-14 sm:px-14 sm:py-14"
        >
          <p className="text-right text-[0.9375rem] text-[#7a7163]">{birthday.letter.dateLabel}</p>

          <p className="mt-7 font-hand text-[2rem] leading-none text-[#1f1c17] sm:text-[2.375rem]">
            {letter.salutation}
          </p>

          <div className="mt-7 space-y-5 font-serif text-[1.125rem] leading-[1.58] tracking-[-0.005em] text-[#1f1c17] sm:text-[1.3125rem] sm:leading-[1.65]">
            {letter.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.05} y={12}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10" y={10}>
            <p className="font-serif text-[1.1875rem] italic text-[#6b6355] sm:text-[1.3125rem]">
              {letter.closing}
            </p>
            <p className="mt-1 font-hand text-[2.75rem] leading-none text-[#1f1c17] sm:text-[3.25rem]">
              {letter.signature}
            </p>
          </Reveal>
        </motion.article>
      </div>
    </section>
  )
}
