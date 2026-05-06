'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabitStore } from '@/store/habitStore'
import HabitStrengthCard from '@/components/habits/HabitStrengthCard'
import HydrationRing from '@/components/habits/HydrationRing'
import HabitCard from '@/components/habits/HabitCard'
import HabitHeatmap from '@/components/habits/HabitHeatmap'
import AddHabitModal from '@/components/habits/AddHabitModal'

export default function HabitsContent() {
  const { habits, getStrengthScore } = useHabitStore()
  const [modalOpen, setModalOpen] = useState(false)
  const score = getStrengthScore()

  const getBanner = (score: number): string => {
    if (habits.length === 0) return 'Start nurturing a habit today. Small acts add up.'
    if (score >= 80) return `You've nurtured your habits with ${score}% consistency this week. 🌱`
    if (score >= 50) return `${score}% consistency this week. You're showing up. 💙`
    return `A lighter week at ${score}%. That's okay — you're still here. 🌿`
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-primary">Habits</h1>
        <p className="text-sm text-muted mt-0.5">
          {getBanner(score)}
        </p>
      </div>

      {/* Top grid: Strength + Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HabitStrengthCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <HydrationRing />
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <HabitHeatmap />
      </motion.div>

      {/* Habit cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Your habits ({habits.length})
          </h2>
        </div>

        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <span className="text-4xl mb-3 block">🌱</span>
            <p className="text-sm text-secondary mb-1 font-medium">No habits yet</p>
            <p className="text-xs text-muted mb-4">
              Start with one small thing. That's always enough.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              Add your first habit
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit, i) => (
              <HabitCard key={habit.id} habit={habit} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <motion.button
        onClick={() => setModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-2xl gradient-bg text-white shadow-fab flex items-center justify-center z-[60] hover:shadow-lg transition-shadow duration-200"
        aria-label="Add habit"
      >
        <Plus size={22} strokeWidth={2.5} />
      </motion.button>

      {/* Add Modal */}
      <AddHabitModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
