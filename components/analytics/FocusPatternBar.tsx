'use client'

import { motion } from 'framer-motion'
import type { FocusPattern } from '@/lib/analytics'

interface FocusPatternBarProps {
  patterns: FocusPattern[]
  bestDay: string | null
}

export default function FocusPatternBar({ patterns, bestDay }: FocusPatternBarProps) {
  const maxMinutes = Math.max(...patterns.map((p) => p.minutes), 1)

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Focus Pattern</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {bestDay
              ? `You focus best on ${bestDay}s`
              : 'Start a deep work session to see patterns'}
          </p>
        </div>
        <span className="text-lg">📊</span>
      </div>

      <div className="flex items-end gap-2 h-28">
        {patterns.map((p, i) => {
          const height = p.minutes > 0 ? Math.max((p.minutes / maxMinutes) * 100, 8) : 4
          const isBest = p.day === bestDay

          return (
            <div key={p.day} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                className={`w-full rounded-t-lg transition-colors duration-300
                  ${p.minutes === 0
                    ? 'bg-slate-100'
                    : isBest
                    ? 'bg-gradient-to-t from-brand-blue to-brand-cyan shadow-sm'
                    : 'bg-gradient-to-t from-blue-200 to-cyan-200'
                  }`}
                title={`${p.day}: ${p.minutes}m focused`}
              />
              <span className={`text-[10px] font-medium ${isBest ? 'text-brand-blue' : 'text-slate-400'}`}>
                {p.dayShort}
              </span>
            </div>
          )
        })}
      </div>

      {patterns.every((p) => p.minutes === 0) && (
        <p className="text-xs text-slate-300 text-center mt-3 italic">
          Complete a focus session to see your pattern emerge.
        </p>
      )}
    </div>
  )
}
