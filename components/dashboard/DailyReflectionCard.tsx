'use client'

import { useUserStore, type EnergyState } from '@/store/userStore'
import { motion } from 'framer-motion'

const ENERGY_OPTIONS: { value: EnergyState; label: string; emoji: string; desc: string }[] = [
  { value: 'low', label: 'Low Energy', emoji: '🌿', desc: 'Need a gentle day' },
  { value: 'steady', label: 'Steady', emoji: '☁️', desc: 'Getting through it' },
  { value: 'building', label: 'Ready to Build', emoji: '⚡', desc: "Let's go!" },
]

export default function DailyReflectionCard() {
  const { energyState, setEnergyState } = useUserStore()

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold text-primary mb-1">How's your energy today?</h2>
      <p className="text-xs text-muted mb-4">This helps FocusFlow adjust to you.</p>

      <div className="flex gap-2">
        {ENERGY_OPTIONS.map(({ value, label, emoji, desc }) => {
          const active = energyState === value
          return (
            <motion.button
              key={value}
              onClick={() => setEnergyState(value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all duration-200 text-center
                ${active
                  ? 'bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-brand-cyan/40 shadow-card'
                  : 'bg-card/50 border-transparent hover:border-blue-100/20 hover:bg-muted/30'
                }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className={`text-[11px] font-semibold leading-tight ${active ? 'text-brand-blue' : 'text-secondary'}`}>
                {label}
              </span>
              <span className="text-[10px] text-muted leading-tight hidden sm:block">{desc}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
