'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, CheckCircle2, Timer, Trash2, Tag } from 'lucide-react'
import type { Task } from '@/store/taskStore'
import { useTaskStore } from '@/store/taskStore'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  index?: number
}

export default function TaskCard({ task, index = 0 }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskStore()
  const [completing, setCompleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleComplete = () => {
    setCompleting(true)
    setTimeout(() => completeTask(task.id), 400)
  }

  return (
    <AnimatePresence>
      {!completing && (
        <motion.div
          layout
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.3, y: 8, scale: 0.98 }}
          transition={{
            delay: index * 0.06,
            duration: 0.35,
            layout: { duration: 0.3 },
          }}
          onHoverStart={() => setShowDelete(true)}
          onHoverEnd={() => setShowDelete(false)}
          className="glass-card p-4 flex items-start gap-3 group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Checkbox */}
          <motion.button
            onClick={handleComplete}
            whileTap={{ scale: 0.85 }}
            className="flex-shrink-0 mt-0.5"
            aria-label="Complete task"
          >
            <motion.div
              animate={completing ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {completing ? (
                <CheckCircle2 size={20} className="text-brand-cyan" strokeWidth={2} />
              ) : (
                <Circle
                  size={20}
                  className="text-muted group-hover:text-brand-blue transition-colors duration-200"
                  strokeWidth={1.5}
                />
              )}
            </motion.div>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${completing ? 'line-through text-muted' : 'text-primary'}`}>
              {task.title}
            </p>

            {task.note && (
              <p className="text-xs text-muted mt-1 leading-relaxed">{task.note}</p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-brand-blue text-[10px] font-medium"
                  >
                    <Tag size={9} strokeWidth={2} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Due date hint */}
            {task.dueDate && (
              <p className="text-[11px] text-[#C9A96E] mt-1">Due today · No rush</p>
            )}
          </div>

          {/* Right: Timer pill + delete */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Link
              href="/deep-work"
              onClick={() => {}}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-brand-blue text-[11px] font-medium hover:bg-brand-blue hover:text-white transition-all duration-200"
            >
              <Timer size={12} strokeWidth={2} />
              {task.timerMinutes}m
            </Link>

            <AnimatePresence>
              {showDelete && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded-lg text-muted hover:text-rose-400 transition-colors duration-200"
                  aria-label="Delete task"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
