'use client'

import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useHabitStore, type Habit } from '@/store/habitStore'
import DayDots from './DayDots'
import { useState } from 'react'

interface HabitCardProps {
  habit: Habit
  index?: number
}

const FREQ_LABELS: Record<string, string> = {
  'daily': 'Daily',
  '3x-week': '3x Weekly',
  '5x-week': '5x Weekly',
  'custom': 'Custom',
}

export default function HabitCard({ habit, index = 0 }: HabitCardProps) {
  const { logHabit, isTodayLogged, getCompletedThisWeek, deleteHabit } = useHabitStore()
  const logged = isTodayLogged(habit.id)
  const completed = getCompletedThisWeek(habit.id)
  const progress = Math.min(completed / habit.targetPerWeek, 1) * 100
  const [showDelete, setShowDelete] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, type: 'spring', stiffness: 200 }}
      onHoverStart={() => setShowDelete(true)}
      onHoverEnd={() => setShowDelete(false)}
      className="glass-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Icon pill */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ backgroundColor: habit.color + '20', color: habit.color }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-primary truncate">{habit.name}</h3>
            <span className="text-[10px] text-brand-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              {FREQ_LABELS[habit.frequency]}
            </span>
          </div>

          {habit.description && (
            <p className="text-xs text-muted mb-2">{habit.description}</p>
          )}

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #1D4ED8, #22D3EE)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <span className="text-[11px] text-secondary font-medium whitespace-nowrap">
              {completed} of {habit.targetPerWeek}
            </span>
          </div>

          {/* Day dots */}
          <DayDots habitId={habit.id} />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={() => logHabit(habit.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={logged}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200
              ${logged
                ? 'bg-brand-cyan/10 text-brand-cyan cursor-default'
                : 'gradient-bg text-white shadow-sm hover:shadow-md'
              }`}
            aria-label="Log habit"
          >
            {logged ? (
              <span className="text-xs font-bold">✓</span>
            ) : (
              <Plus size={16} strokeWidth={2.5} />
            )}
          </motion.button>

          {showDelete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => deleteHabit(habit.id)}
              className="p-1 rounded-lg text-muted hover:text-amber-500 transition-colors"
              aria-label="Delete habit"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
