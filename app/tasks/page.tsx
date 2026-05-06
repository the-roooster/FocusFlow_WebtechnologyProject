import type { Metadata } from 'next'
import AppShell from '@/components/shell/AppShell'
import TasksContent from './TasksContent'

export const metadata: Metadata = {
  title: 'Tasks — FocusFlow',
  description: 'Capture and manage your tasks with zero friction.',
}

export default function TasksPage() {
  return (
    <AppShell>
      <TasksContent />
    </AppShell>
  )
}
