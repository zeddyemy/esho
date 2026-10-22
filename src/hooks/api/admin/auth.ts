import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import {
  changePassword,
  getAdminSession,
  requestPasswordReset,
  setNewPassword,
  signIn,
  signOut,
} from '@/server/functions/auth'
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
} from '@/lib/schemas/auth'

export const adminSessionQuery = () =>
  queryOptions({
    queryKey: ['admin', 'session'],
    queryFn: () => getAdminSession(),
    staleTime: 60 * 1000,
  })

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SignInInput) => signIn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['admin'] })
      await router.navigate({ to: '/admin/login' })
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: (data: ForgotPasswordInput) => requestPasswordReset({ data }) })
}

export function useSetNewPassword() {
  return useMutation({ mutationFn: (data: ResetPasswordInput) => setNewPassword({ data }) })
}

export function useChangePassword() {
  return useMutation({ mutationFn: (data: ChangePasswordInput) => changePassword({ data }) })
}
