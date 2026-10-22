/** Turns Postgres errors into messages the site owner can act on. */
export function friendlyDbError(error: { code?: string; message: string }, what = 'item'): Error {
  if (error.code === '23505') return new Error(`Another ${what} already uses that web address. Choose a different one.`)
  if (error.code === '23503') return new Error(`This ${what} is still in use elsewhere.`)
  return new Error(error.message)
}

/** Writes sort_order = position for each id, in parallel. */
export async function applyOrder(
  update: (id: string, sortOrder: number) => PromiseLike<{ error: { message: string } | null }>,
  ids: Array<string>,
) {
  const results = await Promise.all(ids.map((id, i) => update(id, i + 1)))
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
}
