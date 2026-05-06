'use client'

import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

interface NarrativeInsightProps {
  insights: string[]
}

export default function NarrativeInsight({ insights }: NarrativeInsightProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-brand-cyan/20">
          <Lightbulb size={14} className="text-brand-cyan" strokeWidth={1.7} />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">Gentle Reflections</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 flex-shrink-0" />
            <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
