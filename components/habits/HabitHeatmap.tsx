'use client'

import { useHabitStore } from '@/store/habitStore'

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

function getLastFourWeeks(): string[][] {
  const weeks: string[][] = []
  for (let w = 3; w >= 0; w--) {
    const weekDates: string[] = []
    const today = new Date()
    const day = today.getDay()
    const startOfThisWeek = today.getDate() - day
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(startOfThisWeek - w * 7 + d)
      weekDates.push(date.toISOString().split('T')[0])
    }
    weeks.push(weekDates)
  }
  return weeks
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function HabitHeatmap() {
  const { habits, logs } = useHabitStore()
  const weeks = getLastFourWeeks()
  const today = new Date().toISOString().split('T')[0]

  if (habits.length === 0) return null

  const getOpacity = (date: string): number => {
    const dayLogs = logs.filter((l) => l.date === date && l.completed)
    if (habits.length === 0) return 0
    return Math.min(dayLogs.length / habits.length, 1)
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Last 4 weeks
      </h3>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="w-5 h-5 flex items-center justify-center text-[9px] text-slate-400 font-medium">
              {label}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((date) => {
              const opacity = getOpacity(date)
              const isToday = date === today
              const isFuture = date > today
              return (
                <div
                  key={date}
                  className={`w-5 h-5 rounded-sm transition-all duration-200 cursor-default ${isFuture ? 'bg-slate-50' : ''}`}
                  style={!isFuture ? {
                    backgroundColor: opacity > 0 ? `rgba(34, 211, 238, ${0.15 + opacity * 0.75})` : '#F1F5F9',
                    border: isToday ? '1.5px solid #22D3EE' : 'none',
                  } : undefined}
                  title={isFuture ? 'Upcoming' : opacity > 0 ? `${date} · ${Math.round(opacity * 100)}% done` : `${date} · Resting`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-300 mt-3 italic">
        The goal is not to be perfect, but to be present.
      </p>
    </div>
  )
}
