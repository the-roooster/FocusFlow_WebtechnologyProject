'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeOff } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useTaskStore } from '@/store/taskStore'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { useHabitStore } from '@/store/habitStore'
import { useUserStore } from '@/store/userStore'
import { useRecoveryMode } from '@/hooks/useRecoveryMode'
import {
  computeFocusPatterns,
  getBestFocusDay,
  computeHabitRadar,
  generateNarrativeInsights,
  computeMoodSummary,
  getWeeklyAffirmation,
} from '@/lib/analytics'

import RevealGate from '@/components/analytics/RevealGate'
import FocusPatternBar from '@/components/analytics/FocusPatternBar'
import HabitRadar from '@/components/analytics/HabitRadar'
import NarrativeInsight from '@/components/analytics/NarrativeInsight'
import MoodSummary from '@/components/analytics/MoodSummary'
import WeeklyAffirmation from '@/components/analytics/WeeklyAffirmation'

export default function AnalyticsContent() {
  const { analyticsRevealed, setAnalyticsRevealed } = useUIStore()
  const { tasks } = useTaskStore()
  const { sessionHistory } = useDeepWorkStore()
  const { habits, logs, getStrengthScore } = useHabitStore()
  const { energyState } = useUserStore()
  const isRecovery = useRecoveryMode()

  const focusPatterns = useMemo(() => computeFocusPatterns(sessionHistory), [sessionHistory])
  const bestDay = useMemo(() => getBestFocusDay(focusPatterns), [focusPatterns])
  const habitRadar = useMemo(() => computeHabitRadar(habits, logs), [habits, logs])
  const habitStrength = getStrengthScore()

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const narrativeInsights = useMemo(
    () => generateNarrativeInsights(sessionHistory, tasks, habits, logs, energyState),
    [sessionHistory, tasks, habits, logs, energyState]
  )

  const moodData = useMemo(
    () => computeMoodSummary(energyState, taskCompletionRate, habitStrength),
    [energyState, taskCompletionRate, habitStrength]
  )

  const affirmation = useMemo(() => getWeeklyAffirmation(), [])

  // Recovery Mode hides analytics entirely
  if (isRecovery) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="text-5xl mb-4 block">🌿</span>
          <h2 className="text-lg font-bold text-slate-700 mb-2">
            Analytics are tucked away for now
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
            You're in a gentle mode. Numbers can wait — focus on feeling
            grounded first. They'll be here when you're ready.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quiet Insights</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Your progress isn't a race. Here is a reflection…
          </p>
        </div>
        {analyticsRevealed && (
          <button
            onClick={() => setAnalyticsRevealed(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-slate-500 text-xs font-medium hover:text-brand-blue transition-colors"
          >
            <EyeOff size={13} strokeWidth={1.7} />
            Hide
          </button>
        )}
      </div>

      {/* Reveal gate or full content */}
      <AnimatePresence mode="wait">
        {!analyticsRevealed ? (
          <RevealGate key="gate" />
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Row 1: Focus + Mood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FocusPatternBar patterns={focusPatterns} bestDay={bestDay} />
              <MoodSummary {...moodData} />
            </div>

            {/* Row 2: Habit Radar + Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <HabitRadar points={habitRadar} />
              <NarrativeInsight insights={narrativeInsights} />
            </div>

            {/* Weekly Affirmation */}
            <WeeklyAffirmation affirmation={affirmation} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
