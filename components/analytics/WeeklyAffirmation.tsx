'use client'

import { motion } from 'framer-motion'

interface WeeklyAffirmationProps {
  affirmation: string
}

export default function WeeklyAffirmation({ affirmation }: WeeklyAffirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full rounded-2xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F7FA 50%, #F0F4FF 100%)',
        border: '1px solid rgba(34,211,238,0.15)',
      }}
    >
      <p className="text-sm text-slate-600 font-serif italic leading-relaxed max-w-md mx-auto">
        "{affirmation}"
      </p>
      <p className="text-[10px] text-slate-400 mt-3 font-medium tracking-wide">
        — YOUR WEEKLY AFFIRMATION
      </p>
    </motion.div>
  )
}
