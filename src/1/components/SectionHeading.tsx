import { cn } from '../lib/cn'
import { Reveal } from './Reveal'
import { SplitText } from './SplitText'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  lead?: string
  className?: string
}

export function SectionHeading({ id, eyebrow, title, lead, className }: SectionHeadingProps) {
  return (
    <header className={cn('max-w-2xl', className)}>
      <Reveal y={12}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <SplitText as="h2" id={id} text={title} inView className="heading mt-3" />
      {lead ? (
        <Reveal delay={0.12} className="mt-5">
          <p className="lead max-w-xl">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
