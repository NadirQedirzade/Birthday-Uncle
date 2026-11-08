import { useSyncExternalStore } from 'react'

/**
 * Light / dark appearance.
 *
 * - The theme is the `data-theme` attribute on <html>. index.html sets it before first paint
 *   (so there is never a flash of the wrong theme); this module keeps it in sync afterwards.
 * - First visit: follow the device (prefers-color-scheme). Once the visitor presses the toggle,
 *   their choice is remembered and wins.
 * - Storage may be unavailable (private windows, blocked cookies): every access is guarded.
 */

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** Keep in step with --canvas in styles/index.css (colours the browser's own chrome). */
const THEME_COLOR: Record<Theme, string> = { light: '#fbf9f5', dark: '#000000' }

const listeners = new Set<() => void>()

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  listeners.forEach((listener) => listener())
}

/** Switch themes. The page cross-fades where View Transitions exist; elsewhere it switches at once. */
export function toggleTheme() {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Not persisted; the choice still applies for this visit.
  }

  const doc = document as Document & { startViewTransition?: (update: () => void) => unknown }
  if (doc.startViewTransition) doc.startViewTransition(() => applyTheme(next))
  else applyTheme(next)
}

/** Call once at startup: while the visitor has not chosen, follow the device when it changes. */
export function followSystemTheme() {
  const query = window.matchMedia('(prefers-color-scheme: light)')
  query.addEventListener('change', () => {
    if (!readStored()) applyTheme(systemTheme())
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The current theme; re-renders when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, () => 'dark')
}
