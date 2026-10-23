import { useState } from 'react'
import { m, useMotionValueEvent, useScroll } from 'motion/react'

import { useMotionLevel } from '@/components/ui/custom/motion-level'
import { cn } from '@/lib/utils'

/**
 * Header shell. Sits on the page colour, gains a hairline once scrolled, and
 * tucks away while scrolling down (comes back on scroll up).
 */
export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  // With motion off the header simply stays put.
  const still = useMotionLevel() === 'none'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const nextScrolled = y > 8
    const nextHidden = !still && y > 320 && y > prev + 2
    const nextShown = y < prev - 2
    if (nextScrolled !== scrolled) setScrolled(nextScrolled)
    if (nextHidden && !hidden) setHidden(true)
    else if (nextShown && hidden) setHidden(false)
  })

  return (
    <m.header
      initial={false}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b bg-paper/85 backdrop-blur-md transition-colors',
        scrolled ? 'border-line' : 'border-transparent',
      )}
    >
      {children}
    </m.header>
  )
}
