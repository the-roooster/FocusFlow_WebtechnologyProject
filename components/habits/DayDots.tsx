'use client'

import { useHabitStore } from '@/store/habitStore'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

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

interface DayDotsProps {
  habitId: string
}

export default function DayDots({ habitId }: DayDotsProps) {
  const { logs } = useHabitStore()
  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex gap-1.5">
      {weekDates.map((date, i) => {
        const completed = logs.some(
          (l) => l.habitId === habitId && l.date === date && l.completed
        )
        const isToday = date === today
        const isFuture = date > today

        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-muted font-medium">
              {DAY_LABELS[i]}
            </span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                ${completed
                  ? 'bg-brand-cyan shadow-sm'
                  : isToday
                  ? 'border-2 border-brand-cyan/40 bg-blue-50 dark:bg-blue-900/30'
                  : isFuture
                  ? 'bg-card border border-slate-100 dark:border-slate-700'
                  : 'bg-muted'  // past, not completed = "resting", muted gray
                }`}
              title={
                completed
                  ? `${DAY_LABELS[i]} · Completed`
                  : isFuture
                  ? `${DAY_LABELS[i]} · Upcoming`
                  : isToday
                  ? `${DAY_LABELS[i]} · Today`
                  : `${DAY_LABELS[i]} · Resting`  // NEVER "missed"
              }
            >
              {completed && (
                <span className="text-[8px] text-white font-bold">✓</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
