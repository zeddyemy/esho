/**
 * Server-side environment access. Reads runtime `process.env` first (hosting
 * platform settings) and falls back to Vite-inlined values for VITE_ vars.
 * Never import this from client code.
 */
const viteEnv = import.meta.env as Record<string, string | undefined>

export function serverEnv(name: string): string | undefined {
  const value = process.env[name] ?? viteEnv[name]
  return value && value.length > 0 ? value : undefined
}

export function requireServerEnv(name: string): string {
  const value = serverEnv(name)
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}
