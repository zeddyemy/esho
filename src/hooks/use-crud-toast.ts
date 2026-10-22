import { toast } from 'sonner'

/** Runs a mutation, toasting success or the server's error message. */
export async function withToast<T>(action: Promise<T>, success: string): Promise<T | undefined> {
  try {
    const result = await action
    toast.success(success)
    return result
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
    return undefined
  }
}
