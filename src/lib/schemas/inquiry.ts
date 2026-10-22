import { z } from 'zod'

/** Shared by the contact form (TanStack Form) and the submit server function. */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.email('That email address looks incomplete').max(120),
  company: z.string().trim().max(120),
  projectType: z.string().max(80),
  budget: z.string().max(80),
  timeline: z.string().trim().max(80),
  message: z
    .string()
    .trim()
    .min(20, 'A couple of sentences about the project helps a lot')
    .max(4000),
  /** Honeypot: real visitors never see or fill this. */
  website: z.string().max(0),
  /** Milliseconds the form was open before submit; bots submit instantly. */
  elapsedMs: z.number(),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export const emptyInquiry: InquiryInput = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  website: '',
  elapsedMs: 0,
}
