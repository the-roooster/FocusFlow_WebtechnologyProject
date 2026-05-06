import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import HabitsContent from './HabitsContent'

export const metadata: Metadata = {
  title: 'Habits — FocusFlow',
  description: 'Build habits gently. No streaks, no pressure.',
}

export default function HabitsPage() {
  return (
    <AppShell>
      <HabitsContent />
    </AppShell>
  )
}
