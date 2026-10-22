import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteInquiry, listInquiries, setInquiryStatus } from '@/server/functions/admin/inquiries'
import type { Inquiry, InquiryStatus } from '@/types'

const key = ['admin', 'inquiries']

export const adminInquiriesQuery = () =>
  queryOptions({ queryKey: key, queryFn: () => listInquiries(), refetchInterval: 60_000 })

export function useInquiryMutations() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    Promise.all([key, ['admin', 'dashboard']].map((queryKey) => queryClient.invalidateQueries({ queryKey })))

  return {
    setStatus: useMutation({
      mutationFn: (v: { id: string; status: InquiryStatus }) => setInquiryStatus({ data: v }),
      // Optimistic: the status pill changes immediately.
      onMutate: async (v) => {
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<Array<Inquiry>>(key)
        queryClient.setQueryData<Array<Inquiry>>(key, (rows) => rows?.map((r) => (r.id === v.id ? { ...r, status: v.status } : r)))
        return { previous }
      },
      onError: (_e, _v, ctx) => ctx?.previous && queryClient.setQueryData(key, ctx.previous),
      onSettled: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => deleteInquiry({ data: { id } }), onSuccess: invalidate }),
  }
}
