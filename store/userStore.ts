'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EnergyState = 'low' | 'steady' | 'building'

interface UserStore {
  name: string
  avatar: string | null
  energyState: EnergyState
  lastActiveAt: string       // ISO — updated on every app open (used for greeting)
  lastProductiveAt: string   // ISO — updated only when user completes a task/habit (used for recovery detection)
  setName: (name: string) => void
  setEnergyState: (state: EnergyState) => void
  setLastActiveAt: (date: string) => void
  setLastProductiveAt: (date: string) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: 'Friend',
      avatar: null,
      energyState: 'steady',
      lastActiveAt: new Date().toISOString(),
      lastProductiveAt: new Date().toISOString(),
      setName: (name) => set({ name }),
      setEnergyState: (energyState) => set({ energyState }),
      setLastActiveAt: (lastActiveAt) => set({ lastActiveAt }),
      setLastProductiveAt: (lastProductiveAt) => set({ lastProductiveAt }),
    }),
    { name: 'focusflow-user' }
  )
)
