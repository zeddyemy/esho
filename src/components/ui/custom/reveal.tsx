import { cn } from '@/lib/utils'

interface RevealProps extends React.ComponentProps<'div'> {
  /** Seconds-like stagger; shifts where in the scroll range the reveal starts. */
  delay?: number
  /** Rise distance in px. */
  y?: number
}

/**
 * Fades content up as it scrolls into view using a CSS scroll-driven
 * animation (`.reveal` in styles.css). No JavaScript: content is fully
 * visible in the server HTML, in browsers without scroll timelines, and for
 * visitors who prefer reduced motion.
 */
export function Reveal({ delay = 0, y = 28, className, style, children, ...props }: RevealProps) {
  return (
    <div
      className={cn('reveal', className)}
      style={{ '--reveal-y': `${y}px`, '--reveal-start': `${Math.min(delay * 100, 30)}%`, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Splits a line of display text into words that can rise in sequence. The
 * animation only runs at the "full" motion level (see `.word-rise` in
 * styles.css); otherwise the words are plain text. Pure CSS, so headlines
 * render from first paint without waiting for JavaScript.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span className="word-rise inline-block" style={{ '--word-delay': `${delay + i * stagger}s` } as React.CSSProperties}>
            {word}
            {i < words.length - 1 ? '\u00a0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
