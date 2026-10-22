import HeaderContent from './content'
import HeaderShell from './sticky'
import type { SiteSettings } from '@/types'

export default function Header({ settings }: { settings: SiteSettings }) {
  return (
    <HeaderShell>
      <HeaderContent settings={settings} />
    </HeaderShell>
  )
}
