/**
 * Markdown to safe HTML. Server-only, so neither the parser nor the syntax
 * highlighter ships to the browser.
 *
 * Code blocks are highlighted with Shiki (dual light/dark themes driven by
 * CSS variables, see `.prose-shiki` in styles.css). The output is sanitised
 * because a compromised admin account must not be able to inject scripts.
 */
import { Marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

type Highlighter = Awaited<ReturnType<typeof createHighlighterCore>>

const LANGS = ['ts', 'tsx', 'js', 'jsx', 'json', 'python', 'sql', 'bash', 'php', 'html', 'css', 'yaml', 'dart'] as const

let highlighter: Promise<Highlighter> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
    langs: [
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/jsx.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/python.mjs'),
      import('shiki/langs/sql.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/php.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/dart.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

const ALIASES: Record<string, (typeof LANGS)[number]> = {
  typescript: 'ts',
  javascript: 'js',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function createMarked() {
  const hl = await getHighlighter()
  const loaded = new Set(hl.getLoadedLanguages())
  return new Marked({
    gfm: true,
    renderer: {
      code({ text, lang }) {
        const requested = (lang ?? '').trim().split(/\s+/)[0].toLowerCase()
        const language = ALIASES[requested] ?? requested
        if (!loaded.has(language)) {
          return `<pre class="shiki-plain"><code>${escapeHtml(text)}</code></pre>`
        }
        return hl.codeToHtml(text, {
          lang: language,
          themes: { light: 'github-light', dark: 'github-dark-dimmed' },
          defaultColor: false,
        })
      },
      // Headings get ids so posts can be linked to a section.
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens)
        const id = text
          .replace(/<[^>]+>/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        return `<h${depth} id="${id}">${text}</h${depth}>\n`
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
        return `<a href="${escapeHtml(href)}"${titleAttr}${attrs}>${text}</a>`
      },
    },
  })
}

let markedInstance: Promise<Marked> | undefined

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'del', 'code', 'pre', 'span',
    'hr', 'br', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    pre: ['class', 'style', 'tabindex'],
    code: ['class'],
    span: ['class', 'style'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    th: ['align'],
    td: ['align'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // Shiki emits only colour custom properties.
  allowedStyles: {
    '*': {
      '--shiki-light': [/^#[0-9a-f]{3,8}$/i],
      '--shiki-dark': [/^#[0-9a-f]{3,8}$/i],
      '--shiki-light-bg': [/^#[0-9a-f]{3,8}$/i],
      '--shiki-dark-bg': [/^#[0-9a-f]{3,8}$/i],
    },
  },
  transformTags: {
    // Markdown headings start at h2: the page title is the only h1.
    h1: 'h2',
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
  },
}

// Bodies change rarely, so rendered HTML is memoised per process.
const cache = new Map<string, string>()
const CACHE_LIMIT = 200

export async function renderMarkdown(source: string): Promise<string> {
  const hit = cache.get(source)
  if (hit !== undefined) return hit

  markedInstance ??= createMarked()
  const marked = await markedInstance
  const html = sanitizeHtml(await marked.parse(source), SANITIZE)

  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string)
  cache.set(source, html)
  return html
}

/** ~220 words per minute, minimum one. */
export function readingMinutes(source: string): number {
  const words = source.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
