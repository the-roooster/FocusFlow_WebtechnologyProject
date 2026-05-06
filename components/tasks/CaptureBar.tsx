'use client'

import { useRef, useState, KeyboardEvent } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useUIStore } from '@/store/uiStore'
import { Hash, Timer, Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CaptureBar() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const { addTask } = useTaskStore()
  const { addToast } = useUIStore()

  const handleCapture = () => {
    const trimmed = value.trim()
    if (!trimmed) return

    // Parse #tags inline
    const tags = trimmed.match(/#\w+/g)?.map((t) => t.slice(1)) ?? []
    const title = trimmed.replace(/#\w+/g, '').trim()

    addTask(title || trimmed, tags)
    addToast('New task added to your sanctuary.')
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCapture()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 sticky top-0 z-10 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        {/* Inline icons */}
        <div className="flex items-center gap-2 text-muted">
          <Hash size={15} strokeWidth={1.5} />
          <Timer size={15} strokeWidth={1.5} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="I need to focus on..."
          autoFocus
          className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
          aria-label="Capture new task"
        />

        {/* Capture button */}
        <motion.button
          onClick={handleCapture}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!value.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-bg text-white text-xs font-medium shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Send size={13} strokeWidth={2} />
          <span className="hidden sm:inline">Capture</span>
        </motion.button>
      </div>

      {value.trim() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-muted mt-2 ml-9"
        >
          Press Enter to capture instantly · Use #tag to label
        </motion.p>
      )}
    </motion.div>
  )
}
