'use client'

import FocusTimer from '@/components/deep-work/FocusTimer'
import NoiseSelector from '@/components/deep-work/NoiseSelector'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

export default function DeepWorkContent() {
  const { sessionActive, sessionHistory } = useDeepWorkStore()
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const sessionsToday = sessionHistory.filter((s) => {
    const today = new Date().toDateString()
    return new Date(s.startedAt).toDateString() === today
  })

  return (
    <div className="max-w-xl mx-auto pb-24 md:pb-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Deep Work</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {sessionActive ? 'Stay with it. You got this. 💙' : 'One tap. Full focus. No distractions.'}
        </p>
      </div>

      {/* DND Banner */}
      <AnimatePresence>
        {sessionActive && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-brand-cyan/20"
          >
            <ShieldCheck size={16} className="text-brand-cyan flex-shrink-0" strokeWidth={1.7} />
            <p className="text-xs text-slate-600 flex-1">
              Focus mode active. Distractions minimized.
            </p>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer — center stage */}
      <div className="glass-card p-8 flex flex-col items-center">
        <FocusTimer />
      </div>

      {/* Noise Selector */}
      <NoiseSelector />

      {/* Session History */}
      {sessionsToday.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Today's sessions ({sessionsToday.length})
          </h2>
          <div className="space-y-2">
            {sessionsToday.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                <span>Session {i + 1}</span>
                <span className="text-slate-300">·</span>
                <span>{Math.round(s.duration / 60)}m</span>
                <span className="text-slate-300">·</span>
                <span className="text-[#22D3EE] font-medium">Complete</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            "{sessionsToday.length === 1 ? "One session down. Great start." : `${sessionsToday.length} sessions today. You're building momentum.`}"
          </p>
        </div>
      )}
    </div>
  )
}
