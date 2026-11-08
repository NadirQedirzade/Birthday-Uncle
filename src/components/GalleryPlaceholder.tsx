import { Image as ImageGlyph } from 'lucide-react'
import { birthday } from '../data/birthday'

interface GalleryPlaceholderProps {
  caption: string
  index: number
}

/**
 * Shown while a photo is loading and whenever its file is missing.
 * Fills its (relatively positioned) parent, so the tile keeps its aspect ratio.
 * Deliberately quiet: a surface lit softly from above, one glyph in a small disc, the caption.
 */
export function GalleryPlaceholder({ caption, index }: GalleryPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${caption}. ${birthday.gallery.placeholderHint} üçün yer`}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden bg-raised p-2.5 text-center sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_0%,rgb(255_255_255/0.075),transparent_62%)]"
      />

      {/* Compact on phones: a landscape tile is only ~110px tall there, and nothing may be clipped. */}
      <span className="relative mb-1 grid size-8 shrink-0 place-items-center rounded-full bg-white/[0.06] shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.1)] sm:mb-3 sm:size-12">
        <ImageGlyph
          size={22}
          strokeWidth={1.25}
          className="size-4 text-label-2 sm:size-[22px]"
          aria-hidden="true"
        />
      </span>
      <p className="relative text-[0.9375rem] font-medium leading-tight tracking-[-0.011em] text-label sm:text-[1.0625rem] sm:leading-snug">
        {caption}
      </p>
      <p className="relative hidden text-xs tabular-nums tracking-[0.01em] text-label-2 sm:block sm:text-[0.8125rem]">
        {birthday.gallery.placeholderHint} · {String(index + 1).padStart(2, '0')}
      </p>
    </div>
  )
}
