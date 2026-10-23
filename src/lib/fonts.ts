/**
 * Latin woff2 files for each selectable font, so the public layout can
 * preload exactly the fonts the Appearance settings use.
 */
import archivo from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url'
import geist from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import newsreader from '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2?url'

import type { BodyFont, HeadingFont } from '@/lib/appearance'

export const FONT_FILES: Record<HeadingFont | BodyFont, string> = { archivo, geist, newsreader }
