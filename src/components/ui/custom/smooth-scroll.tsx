import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import Lenis from 'lenis'

/**
 * Inertial wheel scrolling on desktop (touch keeps native scrolling).
 * Disabled entirely for users who prefer reduced motion.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 })
    window.__lenis = lenis
    return () => {
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  // Keep Lenis in sync after route changes (router restores/resets scroll).
  useEffect(() => {
    window.__lenis?.resize()
  }, [pathname])

  return null
}

declare global {
  interface Window {
    __lenis?: Lenis
  }
}
