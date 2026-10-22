import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

export const THEME_STORAGE_KEY = 'esho-theme'

/**
 * Runs before paint (inlined in <head>) so the page never flashes the wrong
 * theme: stored choice first, then the system preference.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`

/** Light/dark switch. Both icons render; CSS shows the one for the current theme. */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className={cn(
        'inline-flex size-9 items-center justify-center text-mute transition-colors hover:text-ink active:scale-95',
        className,
      )}
    >
      <Moon className="size-4 dark:hidden" strokeWidth={1.75} />
      <Sun className="hidden size-4 dark:block" strokeWidth={1.75} />
    </button>
  )
}
