/**
 * Site appearance: the handful of design choices the owner can change from
 * the admin (fonts, heading style, accent colour, amount of motion).
 *
 * Stored as jsonb in `site_settings.appearance`, merged over the defaults
 * below, and applied as CSS custom properties by the public layout. The
 * defaults here must match the fallbacks in styles.css.
 */

export const HEADING_FONTS = {
  archivo: { label: 'Archivo (grotesk)', family: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif", tracking: '-0.035em' },
  newsreader: { label: 'Newsreader (serif)', family: "'Newsreader Variable', 'Iowan Old Style', Georgia, serif", tracking: '-0.022em' },
  geist: { label: 'Geist (clean sans)', family: "'Geist Variable', ui-sans-serif, system-ui, sans-serif", tracking: '-0.04em' },
} as const

export const BODY_FONTS = {
  geist: { label: 'Geist', family: "'Geist Variable', ui-sans-serif, system-ui, sans-serif" },
  archivo: { label: 'Archivo', family: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif" },
  newsreader: { label: 'Newsreader (serif)', family: "'Newsreader Variable', 'Iowan Old Style', Georgia, serif" },
} as const

/** Archivo has a width axis; other fonts ignore this. */
export const HEADING_WIDTHS = {
  normal: { label: 'Normal', stretch: '100%' },
  wide: { label: 'Wide', stretch: '112%' },
  extra: { label: 'Extra wide', stretch: '125%' },
} as const

/** Accent presets. `ink` is the text colour used on the accent. Dark-mode values keep AA contrast. */
export const ACCENTS = {
  cobalt: { label: 'Cobalt', light: '#2b3bd9', lightInk: '#f4f4f2', dark: '#8f99ff', darkInk: '#0f1012' },
  signal: { label: 'Signal orange', light: '#d6451a', lightInk: '#ffffff', dark: '#ff6a33', darkInk: '#0f1012' },
  emerald: { label: 'Emerald', light: '#0f7a55', lightInk: '#f4f4f2', dark: '#4cc794', darkInk: '#0f1012' },
  crimson: { label: 'Crimson', light: '#c42b45', lightInk: '#f4f4f2', dark: '#ff6b81', darkInk: '#0f1012' },
  ink: { label: 'Monochrome', light: '#111214', lightInk: '#f4f4f2', dark: '#ecebe6', darkInk: '#0f1012' },
} as const

export const MOTION_LEVELS = {
  none: { label: 'None', description: 'Nothing moves. Pages appear instantly.' },
  subtle: { label: 'Subtle', description: 'A soft fade as each page loads. Nothing moves while scrolling.' },
  full: { label: 'Full', description: 'Adds scroll reveals, word-by-word headings and smooth scrolling.' },
} as const

export const HEADING_WEIGHTS = [300, 400, 500, 600, 700, 800, 900] as const

export type HeadingFont = keyof typeof HEADING_FONTS
export type BodyFont = keyof typeof BODY_FONTS
export type HeadingWidth = keyof typeof HEADING_WIDTHS
export type Accent = keyof typeof ACCENTS
export type MotionLevel = keyof typeof MOTION_LEVELS

export interface Appearance {
  headingFont: HeadingFont
  headingWeight: number
  headingWidth: HeadingWidth
  headingUppercase: boolean
  bodyFont: BodyFont
  accent: Accent
  motion: MotionLevel
}

export const DEFAULT_APPEARANCE: Appearance = {
  headingFont: 'archivo',
  headingWeight: 700,
  headingWidth: 'wide',
  headingUppercase: false,
  bodyFont: 'geist',
  accent: 'cobalt',
  motion: 'subtle',
}

const pick = <T extends string>(value: unknown, options: Record<T, unknown>, fallback: T): T =>
  typeof value === 'string' && value in options ? (value as T) : fallback

/** Merges stored (possibly partial or stale) values over the defaults. */
export function normalizeAppearance(value: unknown): Appearance {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const weight = Number(v.headingWeight)
  return {
    headingFont: pick(v.headingFont, HEADING_FONTS, DEFAULT_APPEARANCE.headingFont),
    headingWeight: (HEADING_WEIGHTS as ReadonlyArray<number>).includes(weight) ? weight : DEFAULT_APPEARANCE.headingWeight,
    headingWidth: pick(v.headingWidth, HEADING_WIDTHS, DEFAULT_APPEARANCE.headingWidth),
    headingUppercase: typeof v.headingUppercase === 'boolean' ? v.headingUppercase : DEFAULT_APPEARANCE.headingUppercase,
    bodyFont: pick(v.bodyFont, BODY_FONTS, DEFAULT_APPEARANCE.bodyFont),
    accent: pick(v.accent, ACCENTS, DEFAULT_APPEARANCE.accent),
    motion: pick(v.motion, MOTION_LEVELS, DEFAULT_APPEARANCE.motion),
  }
}

/** CSS custom properties for the type choices (theme-independent). */
export function typeVars(a: Appearance): Record<string, string> {
  return {
    '--display-family': HEADING_FONTS[a.headingFont].family,
    '--display-weight': String(a.headingWeight),
    '--display-stretch': HEADING_WIDTHS[a.headingWidth].stretch,
    '--display-case': a.headingUppercase ? 'uppercase' : 'none',
    '--display-tracking': HEADING_FONTS[a.headingFont].tracking,
    '--body-family': BODY_FONTS[a.bodyFont].family,
  }
}

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

const accentVars = (color: string, ink: string) =>
  `--cobalt: ${color}; --cobalt-ink: ${ink}; --cobalt-soft: rgb(${hexToRgb(color)} / 0.09);`

/**
 * Stylesheet text for the public layout. Repeats the dark-mode selectors from
 * styles.css so the accent follows the light/dark switch.
 */
export function appearanceCss(a: Appearance): string {
  const accent = ACCENTS[a.accent]
  const type = Object.entries(typeVars(a))
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')
  const light = accentVars(accent.light, accent.lightInk)
  const dark = accentVars(accent.dark, accent.darkInk)
  return [
    `:root { ${type} ${light} }`,
    `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ${dark} } }`,
    `:root[data-theme='dark'] { ${dark} }`,
  ].join('\n')
}
