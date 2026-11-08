import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { birthday } from '../data/birthday'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { cn } from '../lib/cn'
import { easeOut, spring } from '../lib/motion'
import { IconButton } from './Button'

const ids = birthday.nav.map((item) => item.id)

/**
 * A full-width bar that is transparent over the hero and becomes a material (blur + hairline)
 * once content scrolls beneath it. Mobile uses the disclosure pattern: a button toggles a
 * non-modal popover anchored to it. It closes on Escape (focus returns to the button),
 * outside press, link choice, or resize.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(ids)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 16))

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const onChange = () => query.matches && setOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
    >
      <div className="bar" data-scrolled={scrolled || open}>
        {/* Same gutter-then-container structure as every section, so edges line up exactly. */}
        <div className="px-5 sm:px-8">
        <div ref={containerRef} className="relative mx-auto max-w-6xl">
          <nav aria-label={birthday.a11y.mainNav} className="flex h-12 items-center justify-between">
            <a
              href="#home"
              aria-label={birthday.a11y.backHome}
              className="flex min-h-11 items-center gap-2.5 rounded-full pr-3"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/[0.08] text-[0.8125rem] font-semibold tracking-[-0.02em] text-accent">
                50
              </span>
              <span className="hidden text-[0.9375rem] font-semibold tracking-[-0.011em] text-label sm:block">
                {birthday.honoree.address}
              </span>
            </a>

            {/* Negative end margin: the last label (not its pill) lands on the content edge. */}
            <ul className="hidden items-center md:-mr-3.5 md:flex">
              {birthday.nav.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative inline-flex h-11 items-center rounded-full px-3.5 text-[0.9375rem] tracking-[-0.011em] transition-colors duration-200',
                        isActive ? 'text-label' : 'text-label-2 hover:text-label',
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={spring.indicator}
                          className="absolute inset-x-0 inset-y-1.5 rounded-full bg-white/10"
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            <IconButton
              ref={buttonRef}
              className="-mr-2.5 md:hidden"
              aria-label={open ? birthday.a11y.closeMenu : birthday.a11y.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'close' : 'open'}
                  initial={{ opacity: 0, scale: 0.7, rotate: open ? -45 : 45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.16, ease: easeOut }}
                  className="grid place-items-center"
                >
                  {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                </motion.span>
              </AnimatePresence>
            </IconButton>
          </nav>

          {/* Sibling of the bar content: anchored to the trigger, so it grows from the top-right. */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                style={{ transformOrigin: 'top right' }}
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: spring.menu }}
                exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.14, ease: easeOut } }}
                className="glass absolute right-0 top-[calc(100%+0.375rem)] w-[min(18rem,calc(100vw-2.5rem))] rounded-[1.375rem] p-1.5 md:hidden"
              >
                <ul>
                  {birthday.nav.map((item) => {
                    const isActive = active === item.id
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={isActive ? 'location' : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex min-h-12 items-center justify-between rounded-2xl px-4 text-[1.0625rem] font-medium tracking-[-0.011em] transition-colors duration-150 hover:bg-white/10 active:bg-white/15',
                            isActive ? 'text-label' : 'text-label-2',
                          )}
                        >
                          {item.label}
                          {isActive && (
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                          )}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </motion.header>
  )
}
