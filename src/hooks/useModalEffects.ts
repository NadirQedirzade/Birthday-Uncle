import { useEffect } from 'react'

/**
 * While a modal is open: lock page scroll (without layout shift) and make the rest of the
 * app inert so focus and assistive tech stay inside the dialog. The dialog itself must be
 * rendered outside `#root` (we portal it to `document.body`).
 */
export function useModalEffects(open: boolean): void {
  useEffect(() => {
    if (!open) return

    const root = document.getElementById('root')
    const html = document.documentElement
    const body = document.body

    const scrollbar = window.innerWidth - html.clientWidth
    const prevOverflow = html.style.overflow
    const prevPadding = body.style.paddingRight

    html.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    root?.setAttribute('inert', '')

    return () => {
      html.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      root?.removeAttribute('inert')
    }
  }, [open])
}
