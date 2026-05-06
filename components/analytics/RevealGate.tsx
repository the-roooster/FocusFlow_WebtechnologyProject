'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

export default function RevealGate() {
  const { setAnalyticsRevealed } = useUIStore()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 text-center flex flex-col items-center gap-5"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-brand-cyan/20"
      >
        <Eye size={28} className="text-brand-blue" strokeWidth={1.5} />
      </motion.div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Ready to reflect?</h2>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          Your progress isn't a race. Click below to reveal your gentle progress for this week.
        </p>
      </div>

      <motion.button
        onClick={() => setAnalyticsRevealed(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl gradient-bg text-white font-semibold shadow-fab hover:shadow-lg transition-all duration-200"
      >
        <Eye size={16} strokeWidth={2} />
        Review My Week
      </motion.button>

      <p className="text-[11px] text-slate-300 mt-1">
        Click to reveal your gentle progress
      </p>
    </motion.div>
  )
}
