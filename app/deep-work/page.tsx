import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import DeepWorkContent from './DeepWorkContent'

export const metadata: Metadata = {
  title: 'Deep Work — FocusFlow',
  description: 'Immersive focus timer. 1 tap to start.',
}

export default function DeepWorkPage() {
  return (
    <AppShell>
      <DeepWorkContent />
    </AppShell>
  )
}
