import { useStore } from '@tanstack/react-form'
import { useBlocker } from '@tanstack/react-router'

import { useFormContext } from './context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Warns before leaving the page (in-app navigation or tab close) with unsaved edits. */
export function UnsavedChangesGuard() {
  const form = useFormContext()
  const isDirty = useStore(form.store, (s) => s.isDirty && !s.isSubmitted)
  const blocker = useBlocker({
    shouldBlockFn: () => isDirty,
    enableBeforeUnload: () => isDirty,
    withResolver: true,
  })

  return (
    <AlertDialog open={blocker.status === 'blocked'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
          <AlertDialogDescription>Your changes on this page have not been saved yet.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset?.()}>Keep editing</AlertDialogCancel>
          <AlertDialogAction onClick={() => blocker.proceed?.()} className="bg-destructive text-ink hover:bg-destructive/90">
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** Sticky bottom bar that appears once the form has unsaved changes. */
export function SaveBar({ label = 'Save changes' }: { label?: string }) {
  const form = useFormContext()
  const isDirty = useStore(form.store, (s) => s.isDirty)
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)
  const canSubmit = useStore(form.store, (s) => s.canSubmit)

  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-paper/90 px-4 py-3 backdrop-blur-xl transition-[opacity,transform] duration-300 lg:-mx-8 lg:px-8',
        isDirty ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
      )}
      aria-hidden={!isDirty}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-mute">You have unsaved changes.</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => form.reset()} disabled={isSubmitting}>
            Discard
          </Button>
          <Button type="submit" disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? 'Saving…' : label}
          </Button>
        </div>
      </div>
    </div>
  )
}
