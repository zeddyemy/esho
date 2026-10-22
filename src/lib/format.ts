/** Display formatters. Fixed locale and UTC so server and browser render identically. */

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function parse(date?: string | null): Date | null {
  if (!date) return null
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatMonthYear(date?: string | null): string {
  const d = parse(date)
  return d ? monthYear.format(d) : ''
}

export function formatDate(date?: string | null): string {
  const d = parse(date)
  return d ? fullDate.format(d) : ''
}

export function yearOf(date?: string | null): string {
  const d = parse(date)
  return d ? String(d.getUTCFullYear()) : ''
}

/** "2021 - 2023" or "2023 - Now". */
export function formatYearRange(start: string, end: string | null): string {
  const from = yearOf(start)
  const to = end ? yearOf(end) : 'Now'
  return from === to ? from : `${from} - ${to}`
}

/** Two-digit index for numbered lists: 1 -> "01". */
export function indexLabel(i: number): string {
  return String(i + 1).padStart(2, '0')
}
