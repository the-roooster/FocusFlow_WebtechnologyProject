'use client'

import { useEffect } from 'react'
import { useDeepWorkStore, type NoiseType } from '@/store/deepWorkStore'
import { audioEngine } from '@/lib/audioEngine'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

const NOISE_OPTIONS: { value: NoiseType; label: string; emoji: string }[] = [
  { value: 'none', label: 'Silence', emoji: '🔇' },
  { value: 'white', label: 'White Noise', emoji: '🌫️' },
  { value: 'rain', label: 'Rain', emoji: '🌧️' },
  { value: 'forest', label: 'Forest', emoji: '🌲' },
  { value: 'cafe', label: 'Café', emoji: '☕' },
]

function AnimatedBars() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-white"
          animate={{ height: ['4px', '12px', '6px', '10px', '4px'] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function NoiseSelector() {
  const { selectedNoise, setNoise, volume, setVolume, sessionActive } = useDeepWorkStore()

  // Sync audio engine when noise type changes
  useEffect(() => {
    if (sessionActive && selectedNoise !== 'none') {
      audioEngine.setVolume(volume / 100)
      audioEngine.play(selectedNoise)
    } else {
      audioEngine.stop()
    }
  }, [selectedNoise, sessionActive])

  // Sync volume changes
  useEffect(() => {
    audioEngine.setVolume(volume / 100)
  }, [volume])

  // Stop audio when session ends
  useEffect(() => {
    if (!sessionActive) {
      audioEngine.stop()
    }
  }, [sessionActive])

  const handleNoiseSelect = (type: NoiseType) => {
    setNoise(type)
    if (sessionActive && type !== 'none') {
      audioEngine.setVolume(volume / 100)
      audioEngine.play(type)
    } else if (type === 'none') {
      audioEngine.stop()
    }
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Ambience</p>
        {selectedNoise !== 'none' && sessionActive ? (
          <div className="flex items-center gap-1.5">
            <AnimatedBars />
            <span className="text-[10px] text-brand-cyan font-medium">Playing</span>
          </div>
        ) : (
          <Volume2 size={14} className="text-muted" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {NOISE_OPTIONS.map(({ value, label, emoji }) => {
          const active = selectedNoise === value
          return (
            <button
              key={value}
              onClick={() => handleNoiseSelect(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                ${active
                  ? 'gradient-bg text-white shadow-sm scale-105'
                  : 'bg-muted/50 text-secondary hover:bg-muted hover:text-brand-blue'
                }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {active && value !== 'none' && sessionActive && <AnimatedBars />}
            </button>
          )
        })}
      </div>

      {/* Volume slider */}
      {selectedNoise !== 'none' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex items-center gap-3"
        >
          <VolumeX size={13} className="text-muted flex-shrink-0" strokeWidth={1.5} />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1D4ED8 0%, #22D3EE ${volume}%, var(--bg-muted) ${volume}%, var(--bg-muted) 100%)`,
            }}
          />
          <Volume2 size={13} className="text-muted flex-shrink-0" strokeWidth={1.5} />
          <span className="text-[10px] text-muted w-8 text-right">{volume}%</span>
        </motion.div>
      )}
    </div>
  )
}
