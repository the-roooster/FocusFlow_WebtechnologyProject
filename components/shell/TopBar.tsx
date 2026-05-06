'use client'

import { useState, useEffect } from 'react'
import { Bell, PanelLeft, Minimize2, Maximize2 } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useRecoveryMode } from '@/hooks/useRecoveryMode'
import NotificationPanel from './NotificationPanel'
import ThemeToggle from './ThemeToggle'

function getGreeting(name: string, isRecovery: boolean): { title: string; sub: string } {
  if (isRecovery) {
    return {
      title: `Welcome back, ${name}.`,
      sub: "No rush. Let's start small today. 💙",
    }
  }

  const hour = new Date().getHours()
  if (hour < 12) return { title: `Good morning, ${name}. ☀️`, sub: 'Take a deep breath.' }
  if (hour < 17) return { title: `Good afternoon, ${name}.`, sub: "You're doing great." }
  return { title: `Good evening, ${name}. 🌙`, sub: 'Wind down gently.' }
}

export default function TopBar() {
  const { sidebarCollapsed, simplifyModeActive, toggleSidebar, activateSimplifyMode, deactivateSimplifyMode } =
    useUIStore()
  const { name } = useUserStore()
  const isRecovery = useRecoveryMode()
  const { title, sub } = getGreeting(name, isRecovery)

  const [panelOpen, setPanelOpen] = useState(false)

  // Notification badge
  const unreadCount = useNotificationStore((s) => s.getUnreadCount())
  const generateContextual = useNotificationStore((s) => s.generateContextual)
  const snoozedUntil = useNotificationStore((s) => s.snoozedUntil)

  // Data for contextual notification generation
  const pendingTaskCount = useTaskStore((s) => s.tasks.filter((t) => !t.completed).length)
  const logs = useHabitStore((s) => s.logs)
  const today = new Date().toISOString().split('T')[0]
  const habitsLoggedToday = logs.some((l) => l.date === today)
  const focusSessionsToday = useDeepWorkStore((s) =>
    s.sessionHistory.filter((sess) => new Date(sess.startedAt).toDateString() === new Date().toDateString()).length
  )

  // Auto-generate contextual notifications on mount
  useEffect(() => {
    generateContextual({
      pendingTaskCount,
      habitsLoggedToday,
      focusSessionsToday,
      isRecovery,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isSnoozed = snoozedUntil && new Date(snoozedUntil) > new Date()

  return (
    <header className="flex items-center justify-between px-4 md:px-8 h-16 bg-card/60 backdrop-blur-sm border-b border-blue-50/50 flex-shrink-0 sticky top-0 z-10">
      {/* Left: sidebar toggle + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} strokeWidth={1.7} />
        </button>
        <div>
          <h1 className="text-[15px] font-semibold text-primary leading-tight">{title}</h1>
          <p className="text-[12px] text-muted leading-tight">{sub}</p>
        </div>
      </div>

      {/* Right: Simplify + Bell + Avatar */}
      <div className="flex items-center gap-2">
        {/* Simplify My Day */}
        <button
          onClick={simplifyModeActive ? deactivateSimplifyMode : activateSimplifyMode}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200
            ${simplifyModeActive
              ? 'bg-brand-cyan/10 text-brand-blue border border-brand-cyan/30'
              : 'bg-blue-50 text-slate-500 hover:bg-cyan-50 hover:text-brand-blue'
            }`}
        >
          {simplifyModeActive ? (
            <><Maximize2 size={13} strokeWidth={1.7} /> Expand view</>
          ) : (
            <><Minimize2 size={13} strokeWidth={1.7} /> Simplify</>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Bell with notification badge */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all duration-200 relative"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.7} />
            {/* Badge */}
            {(unreadCount > 0 || isSnoozed || isRecovery) && (
              <span
                className={`absolute top-1 right-1 min-w-[8px] h-[8px] rounded-full ${
                  isSnoozed || isRecovery
                    ? 'bg-amber-400'
                    : 'bg-brand-cyan'
                }`}
              />
            )}
          </button>

          {/* Panel dropdown */}
          <AnimatePresence>
            {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm"
          title={name}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
