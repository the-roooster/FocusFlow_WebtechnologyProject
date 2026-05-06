'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { useUserStore } from '@/store/userStore'
import { audioEngine } from '@/lib/audioEngine'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export function useTimer() {
  const {
    sessionActive,
    isPaused,
    timeRemaining,
    totalDuration,
    soundEnabled,
    sessionStartedAt,
    tickDown,
    stopSession,
    recordSession,
  } = useDeepWorkStore()

  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number | null>(null)
  const chimePlayedRef = useRef(false)

  const tick = useCallback(
    (now: number) => {
      if (!lastTickRef.current) {
        lastTickRef.current = now
      }
      const elapsed = now - lastTickRef.current
      if (elapsed >= 1000) {
        lastTickRef.current = now
        tickDown()
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [tickDown]
  )

  useEffect(() => {
    if (sessionActive && !isPaused && timeRemaining > 0) {
      chimePlayedRef.current = false
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        lastTickRef.current = null
      }
    }

    // Session completed naturally (timer hit 0)
    if (sessionActive && timeRemaining === 0 && !chimePlayedRef.current) {
      chimePlayedRef.current = true

      const session = {
        type: 'deep-work' as const,
        startedAt: sessionStartedAt || new Date().toISOString(),
        duration: totalDuration,
        completed: true,
      }
      db.sessions.add(session)
      recordSession({ id: nanoid(), ...session })

      // Mark productive for Recovery Mode
      useUserStore.getState().setLastProductiveAt(new Date().toISOString())

      // Play completion chime
      if (soundEnabled) {
        try {
          audioEngine.playChime()
        } catch {
          // Audio context might not be available
        }
      }

      // Stop any ambient noise
      audioEngine.stop()

      // Show completion overlay instead of immediately resetting
      useDeepWorkStore.setState({
        sessionActive: false,
        isPaused: false,
        showCompletion: true,
        sessionStartedAt: null,
      })
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [sessionActive, isPaused, timeRemaining, tick, stopSession, recordSession, totalDuration, soundEnabled, sessionStartedAt])

  // Handle tab close / unexpected exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = useDeepWorkStore.getState()
      if (state.sessionActive && state.sessionStartedAt) {
        const elapsed = state.totalDuration - state.timeRemaining
        if (elapsed > 0) {
          const session = {
            id: nanoid(),
            startedAt: state.sessionStartedAt,
            duration: elapsed,
            completed: false,
          }
          
          // Save to localStorage immediately
          useDeepWorkStore.setState({
            sessionHistory: [session, ...state.sessionHistory],
            sessionActive: false,
            sessionStartedAt: null,
            timeRemaining: state.totalDuration,
          })
          
          // Attempt to save to IndexedDB (fire & forget)
          db.sessions.add({
            type: 'deep-work',
            startedAt: state.sessionStartedAt,
            duration: elapsed,
            completed: false,
          }).catch(() => {})
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }, [])

  const progressPercent = totalDuration > 0 ? (timeRemaining / totalDuration) * 100 : 100

  return { formattedTime: formatTime(timeRemaining), progressPercent }
}
