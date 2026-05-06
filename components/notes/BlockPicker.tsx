'use client'

import { motion } from 'framer-motion'
import { Type, Heading2, CheckSquare, Quote, Minus, Mic } from 'lucide-react'
import type { BlockType } from '@/store/noteStore'

const BLOCK_OPTIONS: { type: BlockType; icon: React.ElementType; label: string }[] = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'heading', icon: Heading2, label: 'Heading' },
  { type: 'checklist', icon: CheckSquare, label: 'Checklist' },
  { type: 'quote', icon: Quote, label: 'Quote' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'voice', icon: Mic, label: 'Voice Memo' },
]

interface BlockPickerProps {
  onSelect: (type: BlockType) => void
}

export default function BlockPicker({ onSelect }: BlockPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-wrap gap-1.5"
    >
      {BLOCK_OPTIONS.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50/50 text-slate-500 text-xs font-medium hover:bg-blue-50 hover:text-brand-blue transition-all duration-200"
        >
          <Icon size={13} strokeWidth={1.7} />
          {label}
        </button>
      ))}
    </motion.div>
  )
}
