'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export type NotificationType = 'habit' | 'task' | 'focus' | 'welcome'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  createdAt: string
  read: boolean
  snoozed: boolean
}

interface NotificationStore {
  notifications: Notification[]
  snoozedUntil: string | null // ISO date — all notifications muted until this time
  lastGeneratedSession: string | null // prevent multi-gen per session

  addNotification: (type: NotificationType, message: string) => void
  markRead: (id: string) => void
  snoozeAll: () => void
  clearAll: () => void
  dismissNotification: (id: string) => void
  getUnreadCount: () => number

  /**
   * Generate contextual notifications based on current app state.
   * Called once per app session (guarded by lastGeneratedSession).
   */
  generateContextual: (opts: {
    pendingTaskCount: number
    habitsLoggedToday: boolean
    focusSessionsToday: number
    isRecovery: boolean
  }) => void
}

function getSessionKey(): string {
  // One session = same date + same hour block (prevents spam)
  const now = new Date()
  return `${now.toDateString()}-${Math.floor(now.getHours() / 4)}`
}

function getTimeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      snoozedUntil: null,
      lastGeneratedSession: null,

      addNotification: (type, message) => {
        const notification: Notification = {
          id: nanoid(),
          type,
          message,
          createdAt: new Date().toISOString(),
          read: false,
          snoozed: false,
        }
        set((s) => ({
          notifications: [notification, ...s.notifications].slice(0, 10), // keep max 10
        }))
      },

      markRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      dismissNotification: (id) => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }))
      },

      snoozeAll: () => {
        // Snooze for 4 hours
        const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        set((s) => ({
          snoozedUntil: until,
          notifications: s.notifications.map((n) => ({ ...n, snoozed: true })),
        }))
      },

      clearAll: () => set({ notifications: [] }),

      getUnreadCount: () => {
        const { notifications, snoozedUntil } = get()
        if (snoozedUntil && new Date(snoozedUntil) > new Date()) return 0
        return notifications.filter((n) => !n.read && !n.snoozed).length
      },

      generateContextual: ({ pendingTaskCount, habitsLoggedToday, focusSessionsToday, isRecovery }) => {
        const sessionKey = getSessionKey()
        if (get().lastGeneratedSession === sessionKey) return // already generated this session
        if (isRecovery) {
          set({ lastGeneratedSession: sessionKey })
          return // don't generate notifications in recovery mode
        }

        // Check if snoozed
        const { snoozedUntil } = get()
        if (snoozedUntil && new Date(snoozedUntil) > new Date()) {
          set({ lastGeneratedSession: sessionKey })
          return
        }

        const greeting = getTimeGreeting()
        const notifications: { type: NotificationType; message: string }[] = []

        // Max 1 notification per session (spec rule)
        if (pendingTaskCount > 0 && focusSessionsToday === 0) {
          notifications.push({
            type: 'task',
            message: `${greeting}! You have ${pendingTaskCount} task${pendingTaskCount > 1 ? 's' : ''} waiting gently. When you're ready, pick just one.`,
          })
        } else if (!habitsLoggedToday) {
          notifications.push({
            type: 'habit',
            message: `${greeting}! No habits logged today yet. Even one small one counts. 🌱`,
          })
        } else if (focusSessionsToday === 0) {
          notifications.push({
            type: 'focus',
            message: `${greeting}! How about a short focus session today? Even 15 minutes makes a difference.`,
          })
        }

        if (notifications.length > 0) {
          // Only add ONE (the most relevant)
          const { type, message } = notifications[0]
          get().addNotification(type, message)
        }

        set({ lastGeneratedSession: sessionKey })
      },
    }),
    {
      name: 'focusflow-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        snoozedUntil: state.snoozedUntil,
        lastGeneratedSession: state.lastGeneratedSession,
      }),
    }
  )
)
