/**
 * The photo gallery is driven entirely by this list.
 *
 * To add a real photo:
 *   1. Copy the image into  public/images/gallery/  (e.g. memory-01.jpg)
 *   2. Make sure `src` below points to it, e.g. '/images/gallery/memory-01.jpg'
 *   3. Update `alt`, `caption`, `orientation` (and optionally `date`).
 *
 * If a file is missing, the tile shows an elegant placeholder instead of a broken image.
 * You can add, remove or reorder items freely, and mix recent photos, old photos,
 * family photos and photos of the two of you. Nothing assumes who is in the picture.
 */

export type Orientation = 'portrait' | 'landscape' | 'square'

export interface GalleryItem {
  /** Unique, stable id. */
  id: string
  /** Local path under /public. Never an external URL. */
  src: string
  /** Describe what is in the photo for screen readers. */
  alt: string
  /** Short caption shown on the tile and in the lightbox. */
  caption: string
  /** Controls the tile's aspect ratio: portrait 4:5, landscape 3:2, square 1:1. */
  orientation: Orientation
  /** Optional, free-form, e.g. '1998' or 'Yay 2015'. */
  date?: string
}

export const gallery: GalleryItem[] = [
  {
    id: 'memory-01',
    src: '/images/gallery/memory-01.jpg',
    alt: 'Rövşən Qədirovun həyatından bir xatirə fotosu',
    caption: 'Birlikdə çəkilmiş xatirə',
    orientation: 'portrait',
  },
  {
    id: 'memory-02',
    src: '/images/gallery/memory-02.jpg',
    alt: 'Ailə yığıncağından bir kadr',
    caption: 'Ailə anları',
    orientation: 'landscape',
  },
  {
    id: 'memory-03',
    src: '/images/gallery/memory-03.jpg',
    alt: 'Yadda qalan günlərdən bir fotoşəkil',
    caption: 'Unudulmaz günlər',
    orientation: 'square',
  },
  {
    id: 'memory-04',
    src: '/images/gallery/memory-04.jpg',
    alt: 'Xüsusi bir andan çəkilmiş fotoşəkil',
    caption: 'Xüsusi bir an',
    orientation: 'portrait',
  },
  {
    id: 'memory-05',
    src: '/images/gallery/memory-05.jpg',
    alt: 'Doğma insanlarla çəkilmiş fotoşəkil',
    caption: 'Doğma üzlər',
    orientation: 'landscape',
  },
  {
    id: 'memory-06',
    src: '/images/gallery/memory-06.jpg',
    alt: 'Köhnə illərdən qalan bir fotoşəkil',
    caption: 'Zamanın izi',
    orientation: 'portrait',
  },
  {
    id: 'memory-07',
    src: '/images/gallery/memory-07.jpg',
    alt: 'Gündəlik həyatdan bir kadr',
    caption: 'Sadə, amma qiymətli anlar',
    orientation: 'landscape',
  },
  {
    id: 'memory-08',
    src: '/images/gallery/memory-08.jpg',
    alt: 'Yadda qalan bir gündən fotoşəkil',
    caption: 'Yadda qalan gün',
    orientation: 'square',
  },
]
