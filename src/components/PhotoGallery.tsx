import { motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import existingFiles from 'virtual:gallery-files'
import { birthday } from '../data/birthday'
import { gallery, type GalleryItem, type Orientation } from '../data/gallery'
import { cn } from '../lib/cn'
import { easeOut, spring } from '../lib/motion'
import { GalleryPlaceholder } from './GalleryPlaceholder'
import { Lightbox, type Origin } from './Lightbox'
import { SectionHeading } from './SectionHeading'

type Status = 'loading' | 'loaded' | 'error'

/** Files known to exist at build time. Anything else starts (and stays) as a placeholder. */
const existing = new Set(existingFiles)
const initialStatus = (item: GalleryItem): Status => (existing.has(item.src) ? 'loading' : 'error')

const ratio: Record<Orientation, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-square',
}

interface LightboxState {
  id: string | null
  origin: Origin
  direction: 1 | -1
}

/** Centre of a thumbnail relative to the viewport centre, clamped so the flight stays on screen. */
function originFor(id: string): Origin {
  const el = document.querySelector<HTMLElement>(`[data-photo-id="${id}"]`)
  if (!el) return { x: 0, y: 0 }
  const rect = el.getBoundingClientRect()
  const halfW = window.innerWidth / 2
  const halfH = window.innerHeight / 2
  const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v))
  return {
    x: clamp(rect.left + rect.width / 2 - halfW, halfW),
    y: clamp(rect.top + rect.height / 2 - halfH, halfH),
  }
}

export function PhotoGallery() {
  const [status, setStatus] = useState<Record<string, Status>>({})
  const [lightbox, setLightbox] = useState<LightboxState>({
    id: null,
    origin: { x: 0, y: 0 },
    direction: 1,
  })
  const lastOpenId = useRef<string | null>(null)

  const onStatus = useCallback((id: string, next: Status) => {
    setStatus((prev) => (prev[id] === next ? prev : { ...prev, [id]: next }))
  }, [])

  // The lightbox only cycles through photos that really exist.
  const viewable = useMemo(
    () => gallery.filter((item) => status[item.id] === 'loaded'),
    [status],
  )

  const open = useCallback((id: string) => {
    lastOpenId.current = id
    setLightbox({ id, origin: originFor(id), direction: 1 })
  }, [])

  const navigate = useCallback((id: string, direction: 1 | -1) => {
    lastOpenId.current = id
    setLightbox({ id, origin: originFor(id), direction })
  }, [])

  const close = useCallback(() => {
    const id = lastOpenId.current
    setLightbox((prev) => ({ ...prev, id: null }))
    // Return focus to the thumbnail the viewer ended on (after inert is lifted).
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!id) return
        document.querySelector<HTMLElement>(`[data-photo-id="${id}"]`)?.focus()
      }),
    )
  }, [])

  return (
    <section
      id="anlar"
      aria-labelledby="anlar-title"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="anlar-title"
          eyebrow={birthday.gallery.eyebrow}
          title={birthday.gallery.title}
          lead={birthday.gallery.lead}
        />

        <ul className="mt-12 columns-2 gap-3 sm:mt-16 sm:gap-4 lg:columns-3">
          {gallery.map((item, index) => (
            <GalleryTile
              key={item.id}
              item={item}
              index={index}
              status={status[item.id] ?? initialStatus(item)}
              onStatus={onStatus}
              onOpen={open}
            />
          ))}
        </ul>
      </div>

      <Lightbox
        items={viewable}
        openId={lightbox.id}
        origin={lightbox.origin}
        direction={lightbox.direction}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  )
}

interface GalleryTileProps {
  item: GalleryItem
  index: number
  status: Status
  onStatus: (id: string, status: Status) => void
  onOpen: (id: string) => void
}

function GalleryTile({ item, index, status, onStatus, onOpen }: GalleryTileProps) {
  const reduce = useReducedMotion()
  const loaded = status === 'loaded'

  // Images served from cache can finish before React attaches onLoad.
  const imageRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete) onStatus(item.id, img.naturalWidth > 0 ? 'loaded' : 'error')
    },
    [item.id, onStatus],
  )

  // Observe the <li>, never the clipped frame: a fully clip-path'd element reports as not intersecting.
  const itemRef = useRef<HTMLLIElement>(null)
  const inView = useInView(itemRef, { once: true, amount: 0.15 })

  // Entrance: a gentle rise and settle (transform + opacity only). Reduced motion: a plain fade.
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }

  const frame = (
    <motion.div
      initial={hidden}
      animate={inView ? shown : undefined}
      transition={
        reduce
          ? { duration: 0.4, ease: easeOut }
          : { ...spring.reveal, delay: (index % 2) * 0.06 }
      }
      className={cn(
        'relative overflow-hidden rounded-2xl bg-raised sm:rounded-3xl',
        ratio[item.orientation],
      )}
    >
      {/* Stays mounted so it crossfades out as the photo fades in; hidden from assistive tech once loaded. */}
      <div
        aria-hidden={loaded || undefined}
        className={cn(
          'absolute inset-0 transition-opacity duration-500 ease-out-strong',
          loaded && 'pointer-events-none opacity-0',
        )}
      >
        <GalleryPlaceholder caption={item.caption} index={index} />
      </div>

      {status !== 'error' && (
        <img
          ref={imageRef}
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => onStatus(item.id, 'loaded')}
          onError={() => onStatus(item.id, 'error')}
          className={cn(
            'absolute inset-0 size-full object-cover transition-[opacity,transform] duration-500 ease-out-strong',
            loaded ? 'opacity-100 group-hover:scale-[1.03]' : 'opacity-0',
          )}
        />
      )}

      {loaded && (
        <div className="tile-caption pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/25 to-transparent p-3.5 pt-14 text-left sm:p-5 sm:pt-16">
          <p className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.011em] text-white sm:text-base">
            {item.caption}
          </p>
          {item.date ? <p className="mt-0.5 text-[0.8125rem] text-white/70">{item.date}</p> : null}
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
      />
    </motion.div>
  )

  return (
    <li ref={itemRef} className="mb-3 break-inside-avoid sm:mb-4">
      {loaded ? (
        <motion.button
          type="button"
          data-photo-id={item.id}
          aria-label={`${birthday.gallery.openPhoto}: ${item.caption}`}
          onClick={() => onOpen(item.id)}
          whileTap={{ scale: 0.985 }}
          transition={spring.press}
          className="group block w-full rounded-2xl text-left sm:rounded-3xl"
        >
          {frame}
        </motion.button>
      ) : (
        <div data-photo-id={item.id}>{frame}</div>
      )}
    </li>
  )
}
