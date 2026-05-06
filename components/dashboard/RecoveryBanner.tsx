'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface RecoveryBannerProps {
  daysSince?: number
}

export default function RecoveryBanner({ daysSince }: RecoveryBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-2xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F7FA 100%)',
        border: '1px solid rgba(34,211,238,0.2)',
        boxShadow: '0 2px 16px rgba(29,78,216,0.06)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Heart size={16} className="text-brand-cyan" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-800 mb-1">
            Welcome back. There's no rush. 💙
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {daysSince && daysSince > 0
              ? `You've been away for a bit. That's okay — everyone needs breaks.`
              : "You have a few things piling up. Let's take it one step at a time."}
            {' '}FocusFlow is here to help you get back gently, not to judge.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
