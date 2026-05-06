'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Toast {
  id: string
  message: string
  type?: 'info' | 'success'
}

interface UIStore {
  sidebarCollapsed: boolean
  simplifyModeActive: boolean
  analyticsRevealed: boolean
  activeToasts: Toast[]
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  activateSimplifyMode: () => void
  deactivateSimplifyMode: () => void
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
  setAnalyticsRevealed: (v: boolean) => void
}

let toastIdCounter = 0

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      simplifyModeActive: false,
      analyticsRevealed: false,
      activeToasts: [],

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      activateSimplifyMode: () => set({ simplifyModeActive: true, sidebarCollapsed: true }),
      deactivateSimplifyMode: () => set({ simplifyModeActive: false, sidebarCollapsed: false }),

      addToast: (message, type = 'info') => {
        const id = `toast-${++toastIdCounter}`
        set((s) => ({ activeToasts: [...s.activeToasts, { id, message, type }] }))
        // Auto-dismiss after 3.5s
        setTimeout(() => {
          set((s) => ({ activeToasts: s.activeToasts.filter((t) => t.id !== id) }))
        }, 3500)
      },

      removeToast: (id) => set((s) => ({ activeToasts: s.activeToasts.filter((t) => t.id !== id) })),

      setAnalyticsRevealed: (v) => set({ analyticsRevealed: v }),
    }),
    {
      name: 'focusflow-ui',
      // Don't persist transient toast state
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        simplifyModeActive: state.simplifyModeActive,
        analyticsRevealed: state.analyticsRevealed,
      }),
    }
  )
)
