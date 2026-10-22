import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Enter the email you sign in with'),
  password: z.string().min(1, 'Enter your password'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Enter the email you sign in with'),
})

const strongPassword = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(72, 'Use 72 characters or fewer')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number')

export const resetPasswordSchema = z
  .object({ password: strongPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'Passwords do not match', path: ['confirm'] })

export const changePasswordSchema = z
  .object({ current: z.string().min(1, 'Enter your current password'), password: strongPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'Passwords do not match', path: ['confirm'] })
  .refine((v) => v.password !== v.current, { message: 'Choose a different password', path: ['password'] })

export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
