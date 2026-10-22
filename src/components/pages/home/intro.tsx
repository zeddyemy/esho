import { Reveal } from '@/components/ui/custom/reveal'
import type { IntroContent } from '@/types'

/** Full-width editorial statement with a short supporting paragraph set off to the right. */
export default function Intro({ content }: { content: IntroContent }) {
  return (
    <section className="border-t border-line py-20 md:py-32">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-10">
          <p className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.15] tracking-[-0.02em] text-ink">
            {content.statement}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:col-start-7">
          <p className="text-lg leading-relaxed text-mute">{content.body}</p>
        </Reveal>
      </div>
    </section>
  )
}
