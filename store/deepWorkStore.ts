'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { useUserStore } from '@/store/userStore'

export type NoiseType = 'none' | 'rain' | 'forest' | 'cafe' | 'white'

export interface DeepWorkSession {
  id: string
  startedAt: string
  duration: number // seconds actually worked
  completed: boolean // true = timer ran to 0, false = manually stopped
}

interface DeepWorkStore {
  sessionActive: boolean
  isPaused: boolean
  timeRemaining: number // seconds
  totalDuration: number // seconds
  selectedNoise: NoiseType
  volume: number // 0-100
  soundEnabled: boolean
  sessionHistory: DeepWorkSession[]
  sessionStartedAt: string | null // ISO timestamp when session began
  showCompletion: boolean // show "Well done" overlay

  setDuration: (seconds: number) => void
  startSession: () => void
  pauseSession: () => void
  resumeSession: () => void
  stopSession: () => void
  tickDown: () => void
  setNoise: (noise: NoiseType) => void
  setVolume: (v: number) => void
  setSoundEnabled: (v: boolean) => void
  recordSession: (session: DeepWorkSession) => void
  dismissCompletion: () => void
}

const DEFAULT_DURATION = 45 * 60 // 45 minutes

export const useDeepWorkStore = create<DeepWorkStore>()(
  persist(
    (set, get) => ({
      sessionActive: false,
      isPaused: false,
      timeRemaining: DEFAULT_DURATION,
      totalDuration: DEFAULT_DURATION,
      selectedNoise: 'none',
      volume: 50,
      soundEnabled: true,
      sessionHistory: [],
      sessionStartedAt: null,
      showCompletion: false,

      setDuration: (seconds) => set({ timeRemaining: seconds, totalDuration: seconds }),

      startSession: () =>
        set({
          sessionActive: true,
          isPaused: false,
          showCompletion: false,
          sessionStartedAt: new Date().toISOString(),
        }),

      pauseSession: () => set({ isPaused: true }),

      resumeSession: () => set({ isPaused: false }),

      stopSession: () => {
        // Always log the elapsed time, even if stopped manually
        const { totalDuration, timeRemaining, sessionStartedAt } = get()
        const elapsed = totalDuration - timeRemaining
        if (elapsed > 0 && sessionStartedAt) {
          const session: DeepWorkSession = {
            id: nanoid(),
            startedAt: sessionStartedAt,
            duration: elapsed,
            completed: false, // manually stopped
          }
          set((s) => ({
            sessionHistory: [session, ...s.sessionHistory],
          }))
          // Mark productive activity for Recovery Mode
          useUserStore.getState().setLastProductiveAt(new Date().toISOString())
          
          // Log to DB for Focus Pattern charts
          import('@/lib/db').then(({ db }) => {
            db.sessions.add({
              type: 'deep-work',
              startedAt: sessionStartedAt,
              duration: elapsed,
              completed: false,
            }).catch(console.error)
          })
        }
        set({
          sessionActive: false,
          isPaused: false,
          timeRemaining: get().totalDuration,
          sessionStartedAt: null,
        })
      },

      tickDown: () => {
        const { timeRemaining } = get()
        if (timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },

      setNoise: (noise) => set({ selectedNoise: noise }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(100, v)) }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),

      recordSession: (session) =>
        set((s) => ({ sessionHistory: [session, ...s.sessionHistory] })),

      dismissCompletion: () => set({ showCompletion: false }),
    }),
    {
      name: 'focusflow-deepwork',
      partialize: (state) => ({
        sessionHistory: state.sessionHistory,
        totalDuration: state.totalDuration,
        selectedNoise: state.selectedNoise,
        volume: state.volume,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
)
