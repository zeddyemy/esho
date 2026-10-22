/**
 * Tiny search-param validators for route `validateSearch`.
 *
 * Route definitions are part of the main bundle, so these deliberately avoid
 * zod (~35 KB gz). Invalid values fall back to undefined/defaults instead of
 * throwing, so a bad link never breaks the page.
 */

export function optionalString(value: unknown, max = 200): string | undefined {
  return typeof value === 'string' && value.length > 0 && value.length <= max ? value : undefined
}

export function optionalIndex(value: unknown): number | undefined {
  const n = typeof value === 'string' ? Number(value) : value
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < 10_000 ? n : undefined
}

export function oneOf<const T extends string>(value: unknown, allowed: ReadonlyArray<T>, fallback: T): T {
  return typeof value === 'string' && (allowed as ReadonlyArray<string>).includes(value) ? (value as T) : fallback
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID.test(value)
}
