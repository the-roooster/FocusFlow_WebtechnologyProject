'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'

interface GentleReminderCardProps {
  icon?: string
  title: string
  description: string
  index?: number
}

export default function GentleReminderCard({
  icon = '✨',
  title,
  description,
  index = 0,
}: GentleReminderCardProps) {
  const [done, setDone] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: done ? 0.4 : 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className={`glass-card p-4 flex items-start gap-3 cursor-pointer group
        ${done ? 'pointer-events-none' : 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200'}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => setDone(true)}
        className="flex-shrink-0 mt-0.5 transition-all duration-300"
        aria-label="Complete reminder"
      >
        {done ? (
          <CheckCircle2 size={20} className="text-brand-cyan" strokeWidth={2} />
        ) : (
          <Circle size={20} className="text-slate-300 group-hover:text-brand-blue transition-colors duration-200" strokeWidth={1.5} />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">{icon}</span>
          <h3 className="text-sm font-semibold text-slate-800 truncate">{title}</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
