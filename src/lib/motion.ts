import type { Transition } from 'motion/react'

/**
 * Motion tokens.
 *
 * Springs are described by stiffness (k), damping (c) and mass (m).
 *   damping ratio ζ = c / (2·√(k·m))      ζ = 1 → critically damped (no overshoot)
 *   response    T = 2π·√(m / k)           roughly how long one "beat" takes
 *
 * House rule (Apple): start from ζ ≈ 1. Only go below ~0.85 when the gesture carried momentum
 * (a flick, a drag release). Everything here is ζ = 1 unless stated.
 */
export const spring = {
  /** Press / release feedback. k=520 m=0.7 c=38 → ζ≈1.0, T≈0.23s. */
  press: { type: 'spring', stiffness: 520, damping: 38, mass: 0.7 },

  /** Popovers and menus anchored to a trigger. k=420 m=0.8 c=37 → ζ≈1.0, T≈0.27s. */
  menu: { type: 'spring', stiffness: 420, damping: 37, mass: 0.8 },

  /** Shared indicator that slides between nav items. k=420 m=1 c=41 → ζ≈1.0, T≈0.31s. */
  indicator: { type: 'spring', stiffness: 420, damping: 41, mass: 1 },

  /** Lightbox and drag release (momentum). k=260 m=1 c=29 → ζ≈0.9, T≈0.39s. */
  sheet: { type: 'spring', stiffness: 260, damping: 29, mass: 1 },

  /** Section entrances: calm but never sluggish. k=170 m=1 c=26 → ζ≈1.0, T≈0.48s. */
  reveal: { type: 'spring', stiffness: 170, damping: 26, mass: 1 },
} as const satisfies Record<string, Transition>

/** Strong ease-out for entrances and exits (never ease-in on UI). */
export const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1]

/**
 * Where a flick would come to rest (Apple's exponential-decay projection).
 * `velocity` in px/s; a lower rate gives a snappier, shorter throw.
 */
export function project(velocity: number, decelerationRate = 0.99): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}
