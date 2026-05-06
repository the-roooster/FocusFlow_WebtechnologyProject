'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { useUserStore } from '@/store/userStore'

export interface Task {
  id: string
  title: string
  note?: string
  dueDate?: string
  tags: string[]
  timerMinutes: number
  completed: boolean
  createdAt: string
  completedAt?: string
  isOverdue: boolean
}

interface TimerState {
  taskId: string
  duration: number // seconds
  remaining: number
}

interface TaskStore {
  tasks: Task[]
  captureBarValue: string
  activeTimer: TimerState | null
  addTask: (title: string, tags?: string[], timerMinutes?: number) => void
  completeTask: (id: string) => void
  deleteTask: (id: string) => void
  updateCaptureBar: (value: string) => void
  setActiveTimer: (timer: TimerState | null) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      captureBarValue: '',
      activeTimer: null,

      addTask: (title, tags = [], timerMinutes = 45) => {
        const task: Task = {
          id: nanoid(),
          title,
          tags,
          timerMinutes,
          completed: false,
          isOverdue: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [task, ...state.tasks], captureBarValue: '' }))
      },

      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
          ),
        }))
        // Mark productive activity for Recovery Mode tracking
        useUserStore.getState().setLastProductiveAt(new Date().toISOString())
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },

      updateCaptureBar: (value) => set({ captureBarValue: value }),

      setActiveTimer: (timer) => set({ activeTimer: timer }),
    }),
    { name: 'focusflow-tasks' }
  )
)
