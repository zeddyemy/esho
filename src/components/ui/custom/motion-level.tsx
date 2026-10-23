import { createContext, use } from 'react'
import { useReducedMotion } from 'motion/react'

import type { MotionLevel } from '@/lib/appearance'

const MotionLevelContext = createContext<MotionLevel>('subtle')

export const MotionLevelProvider = MotionLevelContext.Provider

/**
 * The site's motion level (Appearance settings), lowered to "none" for
 * visitors who ask their system for reduced motion.
 */
export function useMotionLevel(): MotionLevel {
  const level = use(MotionLevelContext)
  const reduce = useReducedMotion()
  return reduce ? 'none' : level
}
