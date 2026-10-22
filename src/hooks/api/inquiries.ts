import { useMutation } from '@tanstack/react-query'

import { submitInquiry } from '@/server/functions/inquiries'
import type { InquiryInput } from '@/lib/schemas/inquiry'

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (data: InquiryInput) => submitInquiry({ data }),
  })
}
