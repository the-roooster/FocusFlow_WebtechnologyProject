import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import AnalyticsContent from './AnalyticsContent'

export const metadata: Metadata = {
  title: 'Quiet Insights — FocusFlow',
  description: 'Insight without pressure. Reflect on your gentle progress.',
}

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsContent />
    </AppShell>
  )
}
