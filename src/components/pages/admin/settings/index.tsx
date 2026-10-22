import GeneralSettings from './general'
import SecuritySettings from './security'
import { AdminPageHeader } from '@/components/shared/admin/page-header'

export default function Settings({ email }: { email: string }) {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader title="Settings" description="Your identity, contact details, links, résumé and what shows on the website." />
      <GeneralSettings />
      <div className="mt-12 border-t border-line pt-10">
        <SecuritySettings email={email} />
      </div>
    </div>
  )
}
