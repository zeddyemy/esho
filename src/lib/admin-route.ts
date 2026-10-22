/** Shared head/headers for every admin route: never indexed, never cached. */
export const adminHead = (title: string) => ({
  meta: [{ title: `${title} | Esho admin` }, { name: 'robots', content: 'noindex, nofollow' }],
})

export const adminHeaders = () => ({ 'Cache-Control': 'private, no-store' })
