import { createFileRoute } from '@tanstack/react-router'

import AuthLayout from '@/components/layout/auth'
import ForgotPassword from '@/components/pages/admin/auth/forgot-password'
import { adminHead, adminHeaders } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/forgot-password')({
  head: () => adminHead('Reset password'),
  headers: adminHeaders,
  component: () => (
    <AuthLayout>
      <ForgotPassword />
    </AuthLayout>
  ),
})
