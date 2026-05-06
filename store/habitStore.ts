'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { useUserStore } from '@/store/userStore'

export type HabitFrequency = 'daily' | '3x-week' | '5x-week' | 'custom'

export interface Habit {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  frequency: HabitFrequency
  targetPerWeek: number
  createdAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  completed: boolean
  loggedAt: string
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getWeekDates(): string[] {
  const today = new Date()
  const day = today.getDay() // 0=Sun
  const diff = today.getDate() - day
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(diff + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function computeStrengthScore(
  habits: Habit[],
  logs: HabitLog[]
): number {
  if (habits.length === 0) return 100

  const weekDates = getWeekDates()
  let totalTarget = 0
  let totalCompleted = 0

  habits.forEach((habit) => {
    totalTarget += habit.targetPerWeek
    const completedThisWeek = logs.filter(
      (l) =>
        l.habitId === habit.id &&
        l.completed &&
        weekDates.includes(l.date)
    ).length
    totalCompleted += Math.min(completedThisWeek, habit.targetPerWeek)
  })

  return totalTarget > 0
    ? Math.round((totalCompleted / totalTarget) * 100)
    : 100
}

const FREQUENCY_TARGETS: Record<HabitFrequency, number> = {
  'daily': 7,
  '5x-week': 5,
  '3x-week': 3,
  'custom': 4,
}

interface HabitStore {
  habits: Habit[]
  logs: HabitLog[]
  hydration: number // glasses today (0-8)
  hydrationGoal: number

  addHabit: (data: {
    name: string
    description?: string
    icon: string
    color: string
    frequency: HabitFrequency
  }) => void
  deleteHabit: (id: string) => void
  logHabit: (habitId: string) => void
  unlogHabit: (habitId: string, date: string) => void
  logSip: () => void
  resetHydration: () => void

  // Computed helpers
  getStrengthScore: () => number
  getWeekLogsForHabit: (habitId: string) => HabitLog[]
  getCompletedThisWeek: (habitId: string) => number
  isTodayLogged: (habitId: string) => boolean
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      hydration: 0,
      hydrationGoal: 8,

      addHabit: (data) => {
        const habit: Habit = {
          id: nanoid(),
          ...data,
          targetPerWeek: FREQUENCY_TARGETS[data.frequency],
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ habits: [...s.habits, habit] }))
      },

      deleteHabit: (id) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          logs: s.logs.filter((l) => l.habitId !== id),
        }))
      },

      logHabit: (habitId) => {
        const today = getToday()
        const existing = get().logs.find(
          (l) => l.habitId === habitId && l.date === today
        )
        if (existing) return // Already logged today

        const log: HabitLog = {
          id: nanoid(),
          habitId,
          date: today,
          completed: true,
          loggedAt: new Date().toISOString(),
        }
        set((s) => ({ logs: [...s.logs, log] }))
        // Mark productive activity for Recovery Mode tracking
        useUserStore.getState().setLastProductiveAt(new Date().toISOString())
      },

      unlogHabit: (habitId, date) => {
        set((s) => ({
          logs: s.logs.filter(
            (l) => !(l.habitId === habitId && l.date === date)
          ),
        }))
      },

      logSip: () => {
        set((s) => ({
          hydration: Math.min(s.hydration + 1, s.hydrationGoal),
        }))
      },

      resetHydration: () => set({ hydration: 0 }),

      getStrengthScore: () => {
        const { habits, logs } = get()
        return computeStrengthScore(habits, logs)
      },

      getWeekLogsForHabit: (habitId) => {
        const weekDates = getWeekDates()
        return get().logs.filter(
          (l) => l.habitId === habitId && weekDates.includes(l.date)
        )
      },

      getCompletedThisWeek: (habitId) => {
        const weekDates = getWeekDates()
        return get().logs.filter(
          (l) =>
            l.habitId === habitId &&
            l.completed &&
            weekDates.includes(l.date)
        ).length
      },

      isTodayLogged: (habitId) => {
        const today = getToday()
        return get().logs.some(
          (l) => l.habitId === habitId && l.date === today && l.completed
        )
      },
    }),
    { name: 'focusflow-habits' }
  )
)
