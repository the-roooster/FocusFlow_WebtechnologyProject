'use client'

import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import SimplifyModeBanner from './SimplifyModeBanner'
import { useUIStore } from '@/store/uiStore'
import { useUserStore } from '@/store/userStore'
import { useRecoveryMode } from '@/hooks/useRecoveryMode'
import ToastContainer from '@/components/ui/ToastContainer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()
  const { setLastActiveAt } = useUserStore()
  const isRecovery = useRecoveryMode()

  // ── Recovery Mode Intelligence ──
  // Auto-update lastActiveAt on every app load (marks user as active)
  useEffect(() => {
    setLastActiveAt(new Date().toISOString())
  }, [setLastActiveAt])

  // Auto-collapse sidebar when recovery mode activates
  useEffect(() => {
    if (isRecovery) {
      setSidebarCollapsed(true)
    }
  }, [isRecovery, setSidebarCollapsed])

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${isRecovery ? 'recovery-mode-bg' : ''}`}>
      {/* Sidebar — desktop */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-out
          ${sidebarCollapsed || isRecovery ? 'w-16' : 'w-52'}
          ${isRecovery ? 'bg-muted' : 'bg-sidebar'}
          border-r border-blue-100/20`}
        style={{ boxShadow: '2px 0 16px rgba(29,78,216,0.06)' }}
      >
        <Sidebar collapsed={sidebarCollapsed || isRecovery} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <SimplifyModeBanner />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-blue-100/20 z-50">
        <Sidebar collapsed={true} mobile={true} />
      </nav>

      <ToastContainer />
    </div>
  )
}
