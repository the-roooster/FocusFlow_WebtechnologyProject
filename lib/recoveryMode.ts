import type { EnergyState } from '@/store/userStore'
import type { Task } from '@/store/taskStore'

export function getDaysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime()
  const now = Date.now()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

export function computeRecoveryMode(
  lastProductiveAt: string,
  energyState: EnergyState,
  tasks: Task[]
): boolean {
  const daysSinceProductive = getDaysSince(lastProductiveAt)
  const overdueCount = tasks.filter((t) => !t.completed && t.isOverdue).length

  // Recovery if: not productive for 2+ days, OR 3+ overdue tasks, OR self-reported low energy
  return daysSinceProductive > 2 || overdueCount >= 3 || energyState === 'low'
}
