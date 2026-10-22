import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './context'
import { SubmitButton, SwitchField, TextField, TextareaField } from './fields'
import { ImageField, ImageListField } from './image-fields'
import { SaveBar, UnsavedChangesGuard } from './form-chrome'

/**
 * App-wide TanStack Form hook. Usage:
 *   const form = useAppForm({ defaultValues, validators: { onSubmit: schema }, onSubmit })
 *   <form.AppField name="email">{(f) => <f.TextField label="Email" />}</form.AppField>
 *   <form.AppForm><form.SubmitButton>Save</form.SubmitButton></form.AppForm>
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SwitchField, ImageField, ImageListField },
  formComponents: { SubmitButton, SaveBar, UnsavedChangesGuard },
})

export { FieldShell } from './fields'
