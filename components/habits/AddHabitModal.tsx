'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useHabitStore, type HabitFrequency } from '@/store/habitStore'
import { useUIStore } from '@/store/uiStore'

const ICONS = ['🧘', '📚', '🏃', '💧', '✍️', '🎵', '🌱', '💤', '🍎', '🧠', '🎯', '⏱']
const COLORS = ['#1D4ED8', '#22D3EE', '#7A9E7E', '#C9A96E', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: '5x-week', label: '5x Week' },
  { value: '3x-week', label: '3x Week' },
  { value: 'custom', label: 'Custom' },
]

interface AddHabitModalProps {
  open: boolean
  onClose: () => void
}

export default function AddHabitModal({ open, onClose }: AddHabitModalProps) {
  const { addHabit } = useHabitStore()
  const { addToast } = useUIStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🧘')
  const [color, setColor] = useState('#1D4ED8')
  const [frequency, setFrequency] = useState<HabitFrequency>('daily')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = () => {
    if (!name.trim()) return
    addHabit({ name: name.trim(), description: description.trim() || undefined, icon, color, frequency })
    addToast(`"${name.trim()}" added to your habits.`)
    setName('')
    setDescription('')
    setIcon('🧘')
    setColor('#1D4ED8')
    setFrequency('daily')
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 perspective-1000">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
          />
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -20, y: 50 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
            className="relative w-full max-w-md glass-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
              <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-primary">Add a habit</h2>
              <button onClick={onClose} className="text-muted hover:text-secondary transition-colors">
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                autoFocus
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted border border-blue-50/20 dark:border-slate-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10"
              />

              {/* Description */}
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted border border-blue-50/20 dark:border-slate-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10"
              />

              {/* Icon picker */}
              <div>
                <p className="text-[11px] text-muted font-medium mb-2">Icon</p>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200
                        ${icon === ic ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-brand-cyan/40 scale-110' : 'hover:bg-muted'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <p className="text-[11px] text-muted font-medium mb-2">Color</p>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all duration-200
                        ${color === c ? 'ring-2 ring-offset-2 ring-brand-cyan scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <p className="text-[11px] text-muted font-medium mb-2">Frequency</p>
                <div className="flex gap-2">
                  {FREQUENCIES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFrequency(value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200
                        ${frequency === value
                          ? 'gradient-bg text-white shadow-sm'
                          : 'bg-muted text-secondary hover:text-brand-blue'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No "streak goal" field — intentionally omitted per design spec */}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full mt-5 py-3 rounded-2xl gradient-bg text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              Add Habit
            </button>
            </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
