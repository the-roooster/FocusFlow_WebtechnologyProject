'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react'

interface VoiceBlockProps {
  content: string // base64 audio data
  onChange: (content: string) => void
}

type VoiceState = 'idle' | 'recording' | 'recorded'

export default function VoiceBlock({ content, onChange }: VoiceBlockProps) {
  const [state, setState] = useState<VoiceState>(content ? 'recorded' : 'idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordTime, setRecordTime] = useState(0)
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(24).fill(4))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate static waveform bars from stored content
  useEffect(() => {
    if (content) {
      setState('recorded')
      // Generate pseudo-random bars based on content hash
      const bars: number[] = []
      for (let i = 0; i < 24; i++) {
        bars.push(Math.floor(((content.charCodeAt(i * 37 % content.length) || 50) / 255) * 28) + 4)
      }
      setWaveformBars(bars)
    }
  }, [content])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      setRecordTime(0)

      // Set up analyser for live waveform
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyserRef.current = analyser

      // Animate waveform
      const updateBars = () => {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const bars: number[] = []
        for (let i = 0; i < 24; i++) {
          const idx = Math.floor(i * data.length / 24)
          bars.push(Math.max(4, (data[idx] / 255) * 32))
        }
        setWaveformBars(bars)
        animFrameRef.current = requestAnimationFrame(updateBars)
      }
      animFrameRef.current = requestAnimationFrame(updateBars)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        audioCtx.close()

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          onChange(base64)
          setState('recorded')

          // Get duration
          const audio = new Audio(base64)
          audio.onloadedmetadata = () => setDuration(Math.round(audio.duration))
        }
        reader.readAsDataURL(blob)
      }

      mediaRecorder.start()
      setState('recording')

      // Timer
      timerRef.current = setInterval(() => {
        setRecordTime((t) => t + 1)
      }, 1000)
    } catch {
      // Mic permission denied or not available
      setState('idle')
    }
  }, [onChange])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const togglePlayback = useCallback(() => {
    if (!content) return

    if (!audioRef.current) {
      audioRef.current = new Audio(content)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onloadedmetadata = () => setDuration(Math.round(audioRef.current!.duration))
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [content, isPlaying])

  const deleteRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    onChange('')
    setState('idle')
    setIsPlaying(false)
    setDuration(0)
    setWaveformBars(Array(24).fill(4))
  }, [onChange])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="record-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={startRecording}
            className="flex items-center gap-2 text-xs text-muted hover:text-brand-blue transition-colors py-2"
          >
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
              <Mic size={14} className="text-brand-blue" strokeWidth={1.7} />
            </div>
            <span>Tap to record a voice memo</span>
          </motion.button>
        )}

        {state === 'recording' && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            {/* Recording indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"
            />

            {/* Live waveform */}
            <div className="flex items-center gap-[2px] h-8 flex-1">
              {waveformBars.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-brand-cyan"
                  animate={{ height: h }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>

            <span className="text-xs text-muted font-mono w-10">{formatTime(recordTime)}</span>

            <button
              onClick={stopRecording}
              className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-secondary hover:bg-slate-700 transition-colors"
            >
              <Square size={12} strokeWidth={2} />
            </button>
          </motion.div>
        )}

        {state === 'recorded' && (
          <motion.div
            key="recorded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            {/* Play/Pause */}
            <button
              onClick={togglePlayback}
              className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white shadow-sm flex-shrink-0"
            >
              {isPlaying ? (
                <Pause size={12} strokeWidth={2.5} />
              ) : (
                <Play size={12} strokeWidth={2.5} className="ml-[1px]" />
              )}
            </button>

            {/* Static waveform */}
            <div className="flex items-center gap-[2px] h-8 flex-1">
              {waveformBars.map((h, i) => (
                <div
                  key={i}
                  className={`w-[3px] rounded-full transition-colors duration-200 ${
                    isPlaying ? 'bg-brand-cyan' : 'bg-muted'
                  }`}
                  style={{ height: h }}
                />
              ))}
            </div>

            <span className="text-xs text-muted font-mono w-10">
              {duration > 0 ? formatTime(duration) : '0:00'}
            </span>

            {/* Delete */}
            <button
              onClick={deleteRecording}
              className="text-muted hover:text-amber-500 transition-colors"
            >
              <Trash2 size={12} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
