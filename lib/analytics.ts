import type { Task } from '@/store/taskStore'
import type { DeepWorkSession } from '@/store/deepWorkStore'
import type { Habit, HabitLog } from '@/store/habitStore'
import type { EnergyState } from '@/store/userStore'

// ── Focus Pattern: minutes focused per day of week ──
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface FocusPattern {
  day: string
  dayShort: string
  minutes: number
}

export function computeFocusPatterns(sessions: DeepWorkSession[]): FocusPattern[] {
  const minutesByDay: number[] = [0, 0, 0, 0, 0, 0, 0]

  sessions.forEach((s) => {
    const dayIdx = new Date(s.startedAt).getDay()
    minutesByDay[dayIdx] += Math.round(s.duration / 60)
  })

  return DAY_NAMES.map((day, i) => ({
    day,
    dayShort: DAY_SHORT[i],
    minutes: minutesByDay[i],
  }))
}

export function getBestFocusDay(patterns: FocusPattern[]): string | null {
  const max = Math.max(...patterns.map((p) => p.minutes))
  if (max === 0) return null
  const best = patterns.find((p) => p.minutes === max)
  return best?.day || null
}

// ── Habit Radar: strength per habit (0-1) ──
export interface HabitRadarPoint {
  name: string
  icon: string
  strength: number // 0-1
}

function getWeekDates(): string[] {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(diff + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export function computeHabitRadar(habits: Habit[], logs: HabitLog[]): HabitRadarPoint[] {
  const weekDates = getWeekDates()
  return habits.map((habit) => {
    const completed = logs.filter(
      (l) => l.habitId === habit.id && l.completed && weekDates.includes(l.date)
    ).length
    return {
      name: habit.name,
      icon: habit.icon,
      strength: habit.targetPerWeek > 0 ? Math.min(completed / habit.targetPerWeek, 1) : 0,
    }
  })
}

// ── Narrative Insights ──
export function generateNarrativeInsights(
  sessions: DeepWorkSession[],
  tasks: Task[],
  habits: Habit[],
  logs: HabitLog[],
  energyState: EnergyState
): string[] {
  const insights: string[] = []

  // Focus insights
  const totalMinutes = sessions
    .reduce((sum, s) => sum + Math.round(s.duration / 60), 0)

  if (totalMinutes > 0) {
    insights.push(
      `You've logged ${totalMinutes} minutes of focused work. Every minute counts.`
    )
  }

  const bestDay = getBestFocusDay(computeFocusPatterns(sessions))
  if (bestDay) {
    insights.push(`You tend to focus best on ${bestDay}s. That's your superpower day.`)
  }

  // Task insights
  const completedTasks = tasks.filter((t) => t.completed)
  if (completedTasks.length > 0) {
    insights.push(
      `You've completed ${completedTasks.length} task${completedTasks.length !== 1 ? 's' : ''}. Each one is progress.`
    )
  }

  // Habit insights
  const weekDates = getWeekDates()
  const weekLogs = logs.filter((l) => l.completed && weekDates.includes(l.date))
  if (weekLogs.length > 0) {
    insights.push(
      `You showed up for your habits ${weekLogs.length} time${weekLogs.length !== 1 ? 's' : ''} this week. Consistency over perfection.`
    )
  }

  // Energy insights
  if (energyState === 'low') {
    insights.push("You're in a low-energy phase. That's okay — rest is productive too.")
  } else if (energyState === 'building') {
    insights.push("You're feeling ready to build. Channel that energy gently.")
  }

  if (insights.length === 0) {
    insights.push("A quiet week. Sometimes stillness is exactly what's needed.")
  }

  return insights
}

// ── Mood Summary ──
export function computeMoodSummary(
  energyState: EnergyState,
  taskCompletionRate: number,
  habitStrengthScore: number
): { mood: string; emoji: string; description: string } {
  // Weighted composite
  const score =
    (taskCompletionRate * 0.3 + habitStrengthScore * 0.4) / 100 +
    (energyState === 'building' ? 0.3 : energyState === 'steady' ? 0.2 : 0.05)

  if (score >= 0.7) return { mood: 'Thriving', emoji: '🌟', description: "You're in a great place. Keep nurturing." }
  if (score >= 0.5) return { mood: 'Steady', emoji: '☁️', description: "Consistent and grounded. That's strength." }
  if (score >= 0.3) return { mood: 'Building', emoji: '🌱', description: "You're growing. Slowly, but surely." }
  return { mood: 'Resting', emoji: '🌿', description: "A quiet season. Rest is part of growth." }
}

// ── Weekly Affirmations ──
const AFFIRMATIONS = [
  "Growth is often quiet and slow. Every small action you took this week matters.",
  "You don't have to be productive every day to be worthy. You already are.",
  "The fact that you opened this app means you're trying. That's enough.",
  "Progress isn't always visible. Trust the process.",
  "Small steps daily lead to monumental shifts over time.",
  "You showed up today. That counts for more than you think.",
  "There is no perfect week. There is only this one.",
  "Rest is not failure. It is preparation.",
]

export function getWeeklyAffirmation(): string {
  // Rotate based on week number for consistency within a week
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
  return AFFIRMATIONS[weekNum % AFFIRMATIONS.length]
}
