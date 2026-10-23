/**
 * Branded 1200x630 share images (Open Graph / X / LinkedIn / WhatsApp).
 * Server-only: Satori lays out the card, resvg rasterises it to PNG.
 *
 * Fonts are inlined into the server bundle (`?inline`) so rendering never
 * depends on node_modules being present at runtime. Satori reads woff/ttf,
 * not woff2, hence the static @fontsource packages.
 */
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import archivo400 from '@fontsource/archivo/files/archivo-latin-400-normal.woff?inline'
import archivo700 from '@fontsource/archivo/files/archivo-latin-700-normal.woff?inline'
import archivo800 from '@fontsource/archivo/files/archivo-latin-800-normal.woff?inline'
import newsreader400 from '@fontsource/newsreader/files/newsreader-latin-400-normal.woff?inline'
import newsreader700 from '@fontsource/newsreader/files/newsreader-latin-700-normal.woff?inline'
import geist400 from '@fontsource/geist/files/geist-latin-400-normal.woff?inline'
import geist700 from '@fontsource/geist/files/geist-latin-700-normal.woff?inline'

import { ACCENTS } from '@/lib/appearance'
import type { Appearance } from '@/lib/appearance'

type Weight = 400 | 700 | 800

const decode = (dataUri: string) => {
  const buf = Buffer.from(dataUri.slice(dataUri.indexOf(',') + 1), 'base64')
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

const FONTS: Array<{ name: string; data: ArrayBuffer; weight: Weight; style: 'normal' }> = [
  { name: 'Archivo', data: decode(archivo400), weight: 400, style: 'normal' },
  { name: 'Archivo', data: decode(archivo700), weight: 700, style: 'normal' },
  { name: 'Archivo', data: decode(archivo800), weight: 800, style: 'normal' },
  { name: 'Newsreader', data: decode(newsreader400), weight: 400, style: 'normal' },
  { name: 'Newsreader', data: decode(newsreader700), weight: 700, style: 'normal' },
  { name: 'Geist', data: decode(geist400), weight: 400, style: 'normal' },
  { name: 'Geist', data: decode(geist700), weight: 700, style: 'normal' },
]

const FAMILY = { archivo: 'Archivo', newsreader: 'Newsreader', geist: 'Geist' } as const

/** Closest embedded weight for the heading font. */
function headingWeight(a: Appearance): Weight {
  if (a.headingWeight >= 800 && a.headingFont === 'archivo') return 800
  return a.headingWeight >= 600 ? 700 : 400
}

/** Smaller type for longer titles so they fit in three lines. */
function titleSize(title: string) {
  if (title.length <= 28) return 84
  if (title.length <= 50) return 68
  if (title.length <= 80) return 56
  return 46
}

export interface OgCard {
  /** Small label top right, e.g. "Case study". */
  kicker: string
  title: string
  brand: string
  name: string
  role: string
  domain: string
  appearance: Appearance
}

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const a = card.appearance
  const accent = ACCENTS[a.accent].light
  const heading = FAMILY[a.headingFont]
  const weight = headingWeight(a)
  const title = card.title.length > 140 ? `${card.title.slice(0, 137)}...` : card.title

  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#f4f4f2',
        color: '#111214',
        padding: '64px 72px',
        fontFamily: 'Geist',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: accent }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: heading, fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em' }}>{card.brand}</span>
        <span style={{ fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5d6067' }}>{card.kicker}</span>
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: heading,
          fontWeight: weight,
          fontSize: titleSize(title),
          lineHeight: 1.04,
          letterSpacing: a.headingFont === 'newsreader' ? '-0.02em' : '-0.035em',
          textTransform: a.headingUppercase ? 'uppercase' : 'none',
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '2px solid #111214',
          paddingTop: 22,
          fontSize: 26,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700 }}>{card.name}</span>
          <span style={{ color: '#5d6067' }}>{card.role}</span>
        </div>
        <span style={{ color: accent, fontWeight: 700 }}>{card.domain}</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: FONTS },
  )

  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}
