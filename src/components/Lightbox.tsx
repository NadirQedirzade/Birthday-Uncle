import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Variants,
} from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { GalleryItem } from '../data/gallery'
import { useModalEffects } from '../hooks/useModalEffects'
import { easeOut, project, spring } from '../lib/motion'
import { IconButton } from './Button'

/** Offset (px) of the source thumbnail's centre from the viewport centre. */
export interface Origin {
  x: number
  y: number
}

interface LightboxProps {
  /** Only photos that actually loaded. */
  items: GalleryItem[]
  openId: string | null
  origin: Origin
  direction: 1 | -1
  onClose: () => void
  onNavigate: (id: string, direction: 1 | -1) => void
}

/* The dialog fades; the photo flies from (and returns to) its thumbnail: symmetric path. */
const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: easeOut } },
}

const fly: Variants = {
  hidden: (o: Origin) => ({ opacity: 0, scale: 0.8, x: o.x * 0.6, y: o.y * 0.6 }),
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: { default: spring.sheet, opacity: { duration: 0.2, ease: easeOut } },
  },
  exit: (o: Origin) => ({
    opacity: 0,
    scale: 0.84,
    x: o.x * 0.6,
    y: o.y * 0.6,
    transition: { duration: 0.24, ease: easeOut },
  }),
}

const slide: Variants = {
  enter: (d: number) => ({ x: d * 56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -56, opacity: 0 }),
}

export function Lightbox({ items, openId, origin, direction, onClose, onNavigate }: LightboxProps) {
  const open = openId !== null
  const index = items.findIndex((item) => item.id === openId)
  const item = index >= 0 ? items[index] : undefined

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const scrimOpacity = useTransform(dragY, (v) => 1 - Math.min(Math.abs(v) / 420, 0.65))

  useModalEffects(open)

  const go = useCallback(
    (dir: 1 | -1) => {
      if (items.length < 2 || index < 0) return
      const next = items[(index + dir + items.length) % items.length]
      onNavigate(next.id, dir)
    },
    [items, index, onNavigate],
  )

  // Focus the close control on open, keep Tab inside the dialog, support Esc and arrows.
  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => closeRef.current?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight') {
        go(1)
      } else if (event.key === 'ArrowLeft') {
        go(-1)
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, go, onClose])

  /**
   * Release: continue with the gesture's momentum. Direction is decided by where the flick
   * would land (projection), not just where the finger stopped.
   */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const vertical = Math.abs(info.offset.y) >= Math.abs(info.offset.x)
    if (vertical) {
      const landing = info.offset.y + project(info.velocity.y)
      if (Math.abs(landing) > 150) onClose()
    } else {
      const landing = info.offset.x + project(info.velocity.x)
      if (Math.abs(landing) > 110) go(landing < 0 ? 1 : -1)
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence custom={origin}>
      {item && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          data-theme="dark"
          aria-label="Fotoşəkil görüntüləyicisi"
          className="fixed inset-0 z-50"
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Scrim: dims to focus; dismisses on press. Fades further while dragging. */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: scrimOpacity }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 pb-28 pt-16">
            <motion.div
              variants={fly}
              custom={origin}
              className="pointer-events-auto relative"
            >
              <motion.div
                drag
                dragDirectionLock
                dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                dragElastic={0.35}
                dragTransition={{ bounceStiffness: 320, bounceDamping: 28 }}
                style={{ x: dragX, y: dragY }}
                onDragEnd={handleDragEnd}
                className="relative cursor-grab touch-none active:cursor-grabbing"
              >
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                  <motion.img
                    key={item.id}
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={spring.sheet}
                    className="block max-h-[calc(100svh-12rem)] max-w-[calc(100vw-2rem)] rounded-2xl object-contain shadow-[0_32px_80px_-24px_rgb(0_0_0/0.9)] ring-1 ring-white/10 sm:rounded-3xl"
                  />
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] sm:right-5 sm:top-5">
            <IconButton
              ref={closeRef}
              aria-label="Bağla"
              onClick={onClose}
              className="glass"
            >
              <X size={20} strokeWidth={1.75} />
            </IconButton>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="glass pointer-events-auto flex w-full max-w-md items-center gap-1 rounded-full p-1.5">
              <IconButton
                aria-label="Əvvəlki fotoşəkil"
                onClick={() => go(-1)}
                disabled={items.length < 2}
              >
                <ChevronLeft size={22} strokeWidth={1.75} />
              </IconButton>
              <div className="min-w-0 flex-1 px-2 text-center" aria-live="polite">
                <p className="truncate text-[0.9375rem] font-semibold leading-tight tracking-[-0.011em] text-label">
                  {item.caption}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-label-2">
                  {index + 1} / {items.length}
                  {item.date ? ` · ${item.date}` : ''}
                </p>
              </div>
              <IconButton
                aria-label="Növbəti fotoşəkil"
                onClick={() => go(1)}
                disabled={items.length < 2}
              >
                <ChevronRight size={22} strokeWidth={1.75} />
              </IconButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
