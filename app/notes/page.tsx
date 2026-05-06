import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import NotesContent from './NotesContent'

export const metadata: Metadata = {
  title: 'Notes — FocusFlow',
  description: 'Block-based notes. Capture thoughts, checklists, and reflections.',
}

export default function NotesPage() {
  return (
    <AppShell>
      <NotesContent />
    </AppShell>
  )
}
