'use client'

import { motion } from 'framer-motion'
import { useHabitStore } from '@/store/habitStore'
import { Droplets } from 'lucide-react'

export default function HydrationRing() {
  const { hydration, hydrationGoal, logSip } = useHabitStore()

  const SIZE = 100
  const STROKE = 6
  const radius = (SIZE - STROKE) / 2
  const circumference = 2 * Math.PI * radius
  const progress = hydration / hydrationGoal
  const offset = circumference * (1 - progress)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              fill="none"
              stroke="#EEF2FF"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              fill="none"
              stroke="url(#hydGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            />
            <defs>
              <linearGradient id="hydGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets size={16} className="text-brand-cyan mb-0.5" strokeWidth={1.7} />
            <span className="text-sm font-bold text-slate-700">{hydration}/{hydrationGoal}</span>
          </div>
        </div>

        {/* Info + Button */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-700">Hydration</h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">
            {hydration >= hydrationGoal
              ? 'Goal reached! Great job staying hydrated. 💧'
              : `${hydrationGoal - hydration} more glass${hydrationGoal - hydration !== 1 ? 'es' : ''} to go.`}
          </p>
          <motion.button
            onClick={logSip}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={hydration >= hydrationGoal}
            className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-medium shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            💧 Log Sip
          </motion.button>
        </div>
      </div>
    </div>
  )
}
