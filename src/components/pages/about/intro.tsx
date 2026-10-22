import { MediaImage } from '@/components/shared/media-image'
import { RevealWords } from '@/components/ui/custom/reveal'
import type { AboutContent } from '@/types'

export default function AboutIntro({ content }: { content: AboutContent }) {
  return (
    <header className="container-site grid gap-10 pt-12 pb-16 md:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-24">
      <div className="lg:col-span-7">
        <h1 className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[1.02] tracking-[-0.035em]">
          <RevealWords text={content.heading} />
        </h1>
        <p className="animate-fade-up mt-8 max-w-2xl text-xl leading-relaxed text-ink-2" style={{ animationDelay: '0.25s' }}>
          {content.lead}
        </p>
        {content.facts.length ? (
          <dl className="animate-fade-up mt-12 grid gap-px border-y border-line bg-line sm:grid-cols-2" style={{ animationDelay: '0.35s' }}>
            {content.facts.map((fact) => (
              <div key={fact.label} className="bg-paper py-4 pr-4">
                <dt className="text-sm text-mute">{fact.label}</dt>
                <dd className="mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {content.image ? (
        <div className="lg:col-span-5">
          <div className="animate-clip-reveal relative aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[32rem]" style={{ animationDelay: '0.15s' }}>
            <MediaImage image={content.image} fill priority sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      ) : null}
    </header>
  )
}
