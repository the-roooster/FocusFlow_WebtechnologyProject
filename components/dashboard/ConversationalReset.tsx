'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { useUserStore } from '@/store/userStore'

// ── Keyword sentiment detection ──
function detectSentiment(input: string): 'low' | 'neutral' | 'high' {
  const lower = input.toLowerCase()
  const lowKeywords = ['overwhelmed', 'tired', 'stressed', 'anxious', 'exhausted', 'burnt', 'burnout', 'sad', 'lost', 'stuck', 'hard', 'bad', 'rough', 'low']
  const highKeywords = ['ready', 'excited', 'great', 'good', 'motivated', 'energized', 'pumped', 'amazing', 'inspired', 'focused']

  if (lowKeywords.some((k) => lower.includes(k))) return 'low'
  if (highKeywords.some((k) => lower.includes(k))) return 'high'
  return 'neutral'
}

interface Suggestion {
  message: string
  action: string // label for CTA
  href: string   // where "Start Here" navigates to
}

function generateContextSuggestion(
  input: string,
  pendingTasks: number,
  smallestTask: string | null,
  habitStrength: number,
  sessionsToday: number,
  energyState: string
): Suggestion {
  const sentiment = detectSentiment(input)

  // ── Low energy / overwhelmed path ──
  if (sentiment === 'low' || energyState === 'low') {
    if (pendingTasks > 0 && smallestTask) {
      return {
        message: `That's okay. You don't have to do everything. How about just one thing — "${smallestTask}"? That's more than enough. 💙`,
        action: 'View Tasks',
        href: '/tasks',
      }
    }
    return {
      message: "It's okay to have days like this. Maybe just take a breath, or write down one thought in your notes. No pressure.",
      action: 'Open Notes',
      href: '/notes',
    }
  }

  // ── High energy path ──
  if (sentiment === 'high') {
    if (sessionsToday === 0) {
      return {
        message: "Love that energy! How about channeling it into a deep work session? One focused block can move mountains. ⚡",
        action: 'Start Deep Work',
        href: '/deep-work',
      }
    }
    if (pendingTasks > 3) {
      return {
        message: `You've got ${pendingTasks} tasks waiting. With this energy, you could tackle a few — start with "${smallestTask}". Let's go! 🚀`,
        action: 'View Tasks',
        href: '/tasks',
      }
    }
    return {
      message: "You're in a great flow! Keep building on this momentum. Every small step counts. 🌟",
      action: 'View Dashboard',
      href: '/dashboard',
    }
  }

  // ── Neutral — context-aware suggestions ──
  if (sessionsToday === 0 && pendingTasks > 0) {
    return {
      message: `No focus sessions yet today. How about starting with a 15-minute deep work block? Even short sessions build momentum.`,
      action: 'Start Deep Work',
      href: '/deep-work',
    }
  }

  if (habitStrength < 50) {
    return {
      message: `Your habits have been a bit quiet this week (${habitStrength}% consistency). Want to log one small habit to get the momentum going?`,
      action: 'View Habits',
      href: '/habits',
    }
  }

  if (pendingTasks > 0 && smallestTask) {
    return {
      message: `You have ${pendingTasks} task${pendingTasks > 1 ? 's' : ''} waiting gently. How about starting with "${smallestTask}"? Just one. 💙`,
      action: 'View Tasks',
      href: '/tasks',
    }
  }

  return {
    message: "You're doing well. Take a moment to reflect — maybe capture a quick thought in your notes, or just breathe.",
    action: 'Open Notes',
    href: '/notes',
  }
}

export default function ConversationalReset() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [notYet, setNotYet] = useState(false)

  const { tasks } = useTaskStore()
  const { getStrengthScore } = useHabitStore()
  const { sessionHistory } = useDeepWorkStore()
  const { energyState } = useUserStore()

  const pendingTasks = tasks.filter((t) => !t.completed)
  const smallestTask = pendingTasks.length > 0
    ? pendingTasks.reduce((a, b) => (a.timerMinutes <= b.timerMinutes ? a : b)).title
    : null

  const sessionsToday = sessionHistory.filter((s) => {
    return new Date(s.startedAt).toDateString() === new Date().toDateString()
  }).length

  const habitStrength = getStrengthScore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const result = generateContextSuggestion(
      input,
      pendingTasks.length,
      smallestTask,
      habitStrength,
      sessionsToday,
      energyState
    )
    setSuggestion(result)
    setSubmitted(true)
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
          <Sparkles size={14} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-sm font-semibold text-primary">How are you feeling?</h2>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I'm feeling a bit overwhelmed..."
                className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted border border-blue-50/20 dark:border-slate-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 transition-all duration-200"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl gradient-bg text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
            <p className="text-[11px] text-muted mt-2 ml-1">Share anything. No judgment here.</p>
          </motion.form>
        ) : notYet ? (
          <motion.div
            key="notyet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-secondary italic py-2"
          >
            That's completely okay. I'll be here when you're ready. 💙
          </motion.div>
        ) : suggestion ? (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* AI bubble */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl px-4 py-3 mb-3 border border-blue-100/20">
              <p className="text-sm text-primary leading-relaxed">{suggestion.message}</p>
            </div>
            {/* CTAs */}
            <div className="flex gap-2">
              <Link
                href={suggestion.href}
                className="flex-1 py-2 rounded-xl gradient-bg text-white text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 text-center flex items-center justify-center gap-1.5"
              >
                {suggestion.action}
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
              <button
                onClick={() => setNotYet(true)}
                className="flex-1 py-2 rounded-xl bg-muted text-secondary text-xs font-medium hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Not Yet
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
