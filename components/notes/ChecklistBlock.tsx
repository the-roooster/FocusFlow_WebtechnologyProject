'use client'

import { useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Square, Plus, X } from 'lucide-react'
import type { ChecklistItem } from '@/store/noteStore'

interface ChecklistBlockProps {
  items: ChecklistItem[]
  onToggle: (itemId: string) => void
  onAdd: (text: string) => void
  onUpdateText: (itemId: string, text: string) => void
  onDelete: (itemId: string) => void
}

export default function ChecklistBlock({ items, onToggle, onAdd, onUpdateText, onDelete }: ChecklistBlockProps) {
  const [newItem, setNewItem] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem('')
    }
  }

  return (
    <div className="space-y-1.5">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => onToggle(item.id)}
              className="flex-shrink-0 text-slate-300 hover:text-brand-cyan transition-colors"
            >
              {item.checked ? (
                <CheckSquare size={16} className="text-brand-cyan" strokeWidth={1.7} />
              ) : (
                <Square size={16} strokeWidth={1.5} />
              )}
            </button>
            <input
              value={item.text}
              onChange={(e) => onUpdateText(item.id, e.target.value)}
              className={`flex-1 bg-transparent text-sm focus:outline-none ${
                item.checked ? 'line-through text-slate-400' : 'text-slate-600'
              }`}
            />
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-500 transition-all"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* New item input */}
      <div className="flex items-center gap-2 mt-1">
        <Plus size={14} className="text-slate-300 flex-shrink-0" strokeWidth={1.5} />
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add item..."
          className="flex-1 bg-transparent text-sm text-slate-500 placeholder:text-slate-300 focus:outline-none"
        />
      </div>
    </div>
  )
}
