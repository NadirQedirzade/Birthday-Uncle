import { MotionConfig } from 'motion/react'
import { FinalSurprise } from './components/FinalSurprise'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Milestone } from './components/Milestone'
import { Navbar } from './components/Navbar'
import { PersonalMessage } from './components/PersonalMessage'
import { PhotoGallery } from './components/PhotoGallery'
import { birthday } from './data/birthday'

export default function App() {
  return (
    // "user": honour prefers-reduced-motion by dropping movement and keeping gentle fades.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-full bg-label px-5 py-3 text-sm font-medium text-canvas transition-transform focus-visible:translate-y-0"
      >
        {birthday.a11y.skipToContent}
      </a>

      <Navbar />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <PhotoGallery />
        <Milestone />
        <PersonalMessage />
        <FinalSurprise />
      </main>

      <Footer />
    </MotionConfig>
  )
}
