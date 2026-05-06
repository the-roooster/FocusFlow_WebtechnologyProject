import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import DashboardContent from './DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard — FocusFlow',
  description: 'Your calm, adaptive productivity dashboard.',
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  )
}
