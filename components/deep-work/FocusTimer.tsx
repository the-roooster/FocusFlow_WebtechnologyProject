'use client'

import { useTimer } from '@/hooks/useTimer'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, RotateCcw, Coffee } from 'lucide-react'
import Link from 'next/link'

const QUOTES = [
  'Small steps daily lead to monumental shifts over time.',
  'You are capable of more than you know.',
  'The present moment is where progress lives.',
  'Every minute of focus is a gift to your future self.',
  'Calm is your superpower.',
]

function getQuote() {
  return QUOTES[Math.floor(Date.now() / 1000) % QUOTES.length]
}

const DURATION_OPTIONS = [
  { label: '15m', value: 15 * 60 },
  { label: '25m', value: 25 * 60 },
  { label: '45m', value: 45 * 60 },
  { label: '60m', value: 60 * 60 },
]

export default function FocusTimer() {
  const {
    sessionActive,
    isPaused,
    timeRemaining,
    totalDuration,
    showCompletion,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    setDuration,
    dismissCompletion,
  } = useDeepWorkStore()

  const { formattedTime, progressPercent } = useTimer()

  const SIZE = 240
  const STROKE = 12
  const radius = (SIZE - STROKE) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progressPercent / 100)
  const isLastFive = sessionActive && timeRemaining <= 5 * 60

  // Calculate elapsed time for display when active
  const elapsedSeconds = totalDuration - timeRemaining
  const elapsedMinutes = Math.floor(elapsedSeconds / 60)

  // Completion overlay
  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-6xl"
        >
          🎉
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-1">Session complete. Well done. 💙</h2>
          <p className="text-sm text-muted">
            You focused for {Math.round(totalDuration / 60)} minutes. That's real progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={dismissCompletion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-muted text-secondary text-sm font-medium hover:bg-blue-100 dark:hover:bg-slate-700 transition-all"
          >
            <Coffee size={16} strokeWidth={1.7} />
            Take a Break
          </Link>
          <motion.button
            onClick={() => {
              dismissCompletion()
              setDuration(totalDuration)
              startSession()
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl gradient-bg text-white text-sm font-semibold shadow-sm"
          >
            <RotateCcw size={16} strokeWidth={2} />
            Go Again
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Timer SVG */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-sidebar)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={radius}
            fill="none"
            stroke={isLastFive ? 'url(#warmGrad)' : 'url(#timerGrad)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#5EEAD4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-[11px] text-muted font-medium tracking-widest uppercase">
            {sessionActive ? (isPaused ? 'PAUSED' : 'REMAINING') : 'DURATION'}
          </span>
          <motion.span
            key={formattedTime}
            className="text-5xl font-bold gradient-text font-mono"
            animate={sessionActive && !isPaused ? { opacity: [1, 0.8, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {formattedTime}
          </motion.span>
          {sessionActive && (
            <span className="text-[11px] text-muted">
              {elapsedMinutes > 0 ? `${elapsedMinutes}m worked` : `${Math.ceil(timeRemaining / 60)}m left`}
            </span>
          )}
        </div>
      </div>

      {/* Duration selector — only when idle */}
      {!sessionActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2"
        >
          {DURATION_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDuration(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${totalDuration === value
                  ? 'gradient-bg text-white shadow-sm'
                  : 'bg-muted text-secondary hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-brand-blue'
                }`}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!sessionActive ? (
          <motion.button
            onClick={startSession}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-bg text-white font-semibold shadow-fab hover:shadow-lg transition-all duration-200"
          >
            <Play size={18} strokeWidth={2.5} />
            Start Focusing
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={isPaused ? resumeSession : pauseSession}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl gradient-bg text-white font-medium shadow-sm"
            >
              {isPaused ? <Play size={16} strokeWidth={2.5} /> : <Pause size={16} strokeWidth={2.5} />}
              {isPaused ? 'Resume' : 'Pause'}
            </motion.button>
            <motion.button
              onClick={stopSession}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted text-secondary font-medium hover:bg-slate-700 transition-all duration-200"
            >
              <Square size={16} strokeWidth={2} />
              Stop
            </motion.button>
          </>
        )}
      </div>

      {/* Elapsed time note when active */}
      <AnimatePresence>
        {sessionActive && elapsedMinutes > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-muted"
          >
            ✓ {elapsedMinutes}m will be logged even if you stop early
          </motion.p>
        )}
      </AnimatePresence>

      {/* Motivational quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted italic font-serif text-center max-w-xs leading-relaxed"
      >
        "{getQuote()}"
      </motion.p>
    </div>
  )
}
