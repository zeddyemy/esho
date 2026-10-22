import { Construction } from 'lucide-react'

/** Placeholder for admin screens that are not built yet. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[50dvh] flex-col items-start justify-center border border-dashed border-line-strong p-8 md:p-12">
      <Construction className="size-6 text-mute" strokeWidth={1.5} />
      <h1 className="mt-6 font-display text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-mute">{description}</p>
    </div>
  )
}
