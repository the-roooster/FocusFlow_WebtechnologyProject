'use client'

import { motion } from 'framer-motion'

interface MoodSummaryProps {
  mood: string
  emoji: string
  description: string
}

export default function MoodSummary({ mood, emoji, description }: MoodSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card p-5 text-center"
    >
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Your Mood</p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
        className="text-4xl mb-2"
      >
        {emoji}
      </motion.div>
      <h3 className="text-lg font-bold gradient-text mb-1">{mood}</h3>
      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{description}</p>
    </motion.div>
  )
}
