import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '../lib/cn'

interface Particle {
  x: number
  y: number
  r: number
  vy: number
  sway: number
  phase: number
  alpha: number
}

interface SparklesProps {
  /** The loop only runs while true (e.g. while the section is on screen). */
  active: boolean
  className?: string
}

/**
 * A few dozen soft champagne motes drifting upward. Deliberately quiet:
 * no confetti, no bursts. Paused off-screen, and not rendered for reduced motion.
 */
export function Sparkles({ active, className }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduce || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frameId = 0

    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 12,
      r: 0.6 + Math.random() * 1.7,
      vy: 10 + Math.random() * 22,
      sway: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.5,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length === 0) {
        const count = Math.round(Math.min(34, Math.max(14, width / 36)))
        particles = Array.from({ length: count }, () => spawn(true))
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y -= p.vy * dt
        p.phase += dt * 0.8
        if (p.y < -12) {
          particles[i] = spawn(false)
          continue
        }

        const x = p.x + Math.sin(p.phase) * p.sway
        const edge = Math.min(p.y / (height * 0.3), (height - p.y) / (height * 0.12), 1)
        const twinkle = 0.65 + 0.35 * Math.sin(p.phase * 2.3)
        const a = p.alpha * Math.max(edge, 0) * twinkle

        ctx.beginPath()
        ctx.arc(x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,192,138,${a * 0.06})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(246,232,196,${a})`
        ctx.fill()
      }

      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [active, reduce])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none size-full transition-opacity duration-[1800ms]',
        active ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
