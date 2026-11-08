import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { birthday } from '../data/birthday'
import { easeOut } from '../lib/motion'
import { toggleTheme, useTheme } from '../lib/theme'
import { IconButton } from './Button'

/**
 * One button that switches appearance. It shows the mode a press will lead to (sun while dark,
 * moon while light) and says so in its label. Press feedback comes from IconButton (spring,
 * on pointer-down); the glyph turns and fades into the next one.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme()
  const toLight = theme === 'dark'

  return (
    <IconButton
      className={className}
      aria-label={toLight ? birthday.a11y.switchToLight : birthday.a11y.switchToDark}
      onClick={toggleTheme}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, scale: 0.7, rotate: toLight ? -50 : 50 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.16, ease: easeOut }}
          className="grid place-items-center"
        >
          {toLight ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  )
}
