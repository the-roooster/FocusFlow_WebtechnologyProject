'use client'

import { useTaskStore } from '@/store/taskStore'
import CaptureBar from '@/components/tasks/CaptureBar'
import TaskCard from '@/components/tasks/TaskCard'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function TasksContent() {
  const { tasks } = useTaskStore()

  const active = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Your Tasks</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {active.length === 0
            ? 'All clear. A calm space is a gift. 🌊'
            : `${active.length} task${active.length !== 1 ? 's' : ''} waiting · no rush`}
        </p>
      </div>

      {/* Capture Bar */}
      <CaptureBar />

      {/* Active Tasks */}
      <section>
        {active.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 gap-3"
          >
            <span className="text-5xl">🌊</span>
            <p className="text-slate-400 text-sm text-center max-w-xs leading-relaxed">
              No tasks here. Add something above when you're ready, or just breathe.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {active.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-brand-cyan" strokeWidth={2} />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Done today ({completed.length})
            </h2>
          </div>
          <div className="space-y-2 opacity-60">
            {completed.slice(0, 5).map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 border border-blue-50"
              >
                <CheckCircle2 size={16} className="text-brand-cyan flex-shrink-0" strokeWidth={2} />
                <span className="text-sm text-slate-500 line-through truncate">{task.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
