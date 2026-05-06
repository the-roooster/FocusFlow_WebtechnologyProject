'use client'

import { useRecoveryMode } from '@/hooks/useRecoveryMode'
import { useTaskStore } from '@/store/taskStore'
import { useUIStore } from '@/store/uiStore'
import { useUserStore } from '@/store/userStore'
import { getDaysSince } from '@/lib/recoveryMode'
import ConversationalReset from '@/components/dashboard/ConversationalReset'
import GentleReminderCard from '@/components/dashboard/GentleReminderCard'
import ProgressRing from '@/components/dashboard/ProgressRing'
import DailyReflectionCard from '@/components/dashboard/DailyReflectionCard'
import RecoveryBanner from '@/components/dashboard/RecoveryBanner'
import { motion } from 'framer-motion'
import { ArrowRight, Timer } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_REMINDERS = [
  { icon: '🌊', title: 'Take a deep breath', description: 'Just one slow breath can reset your entire energy.' },
  { icon: '💧', title: 'Have some water', description: 'Small acts of care compound over time.' },
  { icon: '📝', title: 'Capture one thought', description: "What's the one thing on your mind right now?" },
]

export default function DashboardContent() {
  const isRecovery = useRecoveryMode()
  const { tasks } = useTaskStore()
  const { simplifyModeActive } = useUIStore()
  const { lastProductiveAt } = useUserStore()

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedToday = tasks.filter(
    (t) =>
      t.completed &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === new Date().toDateString()
  )
  const daysSince = getDaysSince(lastProductiveAt)

  // In simplify/recovery mode, show max 3 tasks
  const displayedTasks = isRecovery || simplifyModeActive ? activeTasks.slice(0, 3) : activeTasks

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Recovery Banner */}
      {isRecovery && <RecoveryBanner daysSince={daysSince} />}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Conversational Reset */}
          <ConversationalReset />

          {/* Task Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  {isRecovery ? 'Start with one small thing' : "Today's focus"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeTasks.length === 0
                    ? 'All clear — enjoy the space.'
                    : isRecovery
                    ? "Pick just one. That's more than enough."
                    : `${activeTasks.length} task${activeTasks.length !== 1 ? 's' : ''} waiting for you`}
                </p>
              </div>
              <Link
                href="/tasks"
                className="flex items-center gap-1 text-xs text-brand-blue font-medium hover:text-brand-cyan transition-colors duration-200"
              >
                All tasks <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>

            <div className="space-y-2">
              {activeTasks.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-3xl">🌊</span>
                  <p className="text-sm text-slate-400 mt-2">Nothing pressing. Breathe.</p>
                </div>
              ) : (
                displayedTasks.slice(0, 3).map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-blue-50 hover:border-brand-cyan/20 hover:shadow-card transition-all duration-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-brand-cyan flex-shrink-0" />
                    <span className="text-sm text-slate-700 flex-1 truncate">{task.title}</span>
                    <Link
                      href="/deep-work"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-blue transition-colors"
                    >
                      <Timer size={12} strokeWidth={1.5} />
                      <span>{task.timerMinutes}m</span>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            {activeTasks.length > 3 && !isRecovery && !simplifyModeActive && (
              <Link
                href="/tasks"
                className="block text-center text-xs text-slate-400 hover:text-brand-blue mt-3 transition-colors"
              >
                +{activeTasks.length - 3} more tasks →
              </Link>
            )}
          </motion.div>

          {/* Energy Reflection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <DailyReflectionCard />
          </motion.div>
        </div>

        {/* Right column — sidebar widgets */}
        {!simplifyModeActive && (
          <div className="space-y-5">
            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="glass-card p-5 flex flex-col items-center"
            >
              <ProgressRing
                current={completedToday.length}
                total={Math.max(completedToday.length + activeTasks.length, 1)}
                label="Gentle Steps"
              />
              <p className="text-xs text-slate-400 mt-3 text-center leading-relaxed">
                {completedToday.length === 0
                  ? 'Every journey starts with one step.'
                  : `You've done ${completedToday.length} thing${completedToday.length !== 1 ? 's' : ''} today. 🎉`}
              </p>
            </motion.div>

            {/* Gentle Reminders */}
            {!isRecovery && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Gentle reminders
                </h3>
                {DEFAULT_REMINDERS.map((r, i) => (
                  <GentleReminderCard key={r.title} {...r} index={i} />
                ))}
              </div>
            )}

            {/* Quick Deep Work CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/deep-work"
                className="block glass-card p-4 text-center group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="text-2xl mb-2">⏱</div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-blue transition-colors">
                  Start Deep Work
                </p>
                <p className="text-xs text-slate-400 mt-0.5">1 tap to focus</p>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
