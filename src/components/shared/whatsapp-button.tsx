import { useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { MessageCircle } from 'lucide-react'

import { whatsappLink } from '@/lib/utils'

/** Floating WhatsApp shortcut, shown once the visitor scrolls past the hero. */
export function WhatsAppButton({ phone, name }: { phone: string; name: string }) {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 480
    if (next !== visible) setVisible(next)
  })

  if (!phone) return null
  const href = whatsappLink(phone, `Hello ${name.split(' ')[0]}, I found you through your website.`)

  return (
    <AnimatePresence>
      {visible ? (
        <m.a
          href={href}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper/90 py-2.5 pr-4 pl-3 text-sm text-ink shadow-[0_12px_40px_rgb(17_18_20/0.12)] backdrop-blur-md transition-colors hover:border-ink active:scale-[0.98] md:right-6 md:bottom-6"
        >
          <MessageCircle className="size-4 text-cobalt" strokeWidth={1.75} />
          WhatsApp
        </m.a>
      ) : null}
    </AnimatePresence>
  )
}
