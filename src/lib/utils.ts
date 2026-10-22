import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

/** Normalises a Nigerian phone number to international digits (e.g. 2348104817424). */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return `234${digits.slice(1)}`
  return digits
}

export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${toInternationalPhone(phone)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function telLink(phone: string): string {
  return `tel:+${toInternationalPhone(phone)}`
}

/** Formats 08104817424 as 0810 481 7424 for display. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return phone
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** The owner works on Lagos time; server (UTC) and browser must format alike (admin dashboard). */
export const BUSINESS_TIME_ZONE = 'Africa/Lagos'

/** Hour of day (0-23) in Lagos. */
export function lagosHour(date = new Date()): number {
  return Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: BUSINESS_TIME_ZONE }).format(date))
}
