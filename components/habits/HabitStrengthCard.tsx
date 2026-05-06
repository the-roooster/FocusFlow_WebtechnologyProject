'use client'

import { motion } from 'framer-motion'
import { useHabitStore } from '@/store/habitStore'

export default function HabitStrengthCard() {
  const { getStrengthScore, habits } = useHabitStore()
  const score = getStrengthScore()

  const getMessage = (score: number): string => {
    if (habits.length === 0) return 'Add your first habit to begin nurturing it.'
    if (score >= 90) return 'Incredible consistency. You are showing up for yourself.'
    if (score >= 70) return "You're building real momentum. Keep nurturing."
    if (score >= 50) return "You're making progress. Every small step counts."
    if (score >= 30) return "It's been a lighter week. That's perfectly okay."
    return "A quiet week — that's fine. You can build back gently."
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-0.5">Habit Strength</h2>
          <p className="text-xs text-slate-400">This week's consistency</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="flex items-baseline gap-1"
        >
          <span className="text-3xl font-bold gradient-text">{score}</span>
          <span className="text-sm text-slate-400 font-medium">%</span>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-blue-50 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #1D4ED8, #22D3EE, #5EEAD4)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      <p className="text-xs text-slate-500 italic font-serif leading-relaxed">
        "{getMessage(score)}"
      </p>
    </div>
  )
}
