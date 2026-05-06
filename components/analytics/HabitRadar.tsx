'use client'

import { motion } from 'framer-motion'
import type { HabitRadarPoint } from '@/lib/analytics'

interface HabitRadarProps {
  points: HabitRadarPoint[]
}

export default function HabitRadar({ points }: HabitRadarProps) {
  if (points.length === 0) {
    return (
      <div className="glass-card p-5 text-center">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Habit Strength</h3>
        <p className="text-xs text-slate-400">Add habits to see your radar chart grow.</p>
      </div>
    )
  }

  const SIZE = 200
  const CENTER = SIZE / 2
  const RADIUS = 70
  const levels = [0.25, 0.5, 0.75, 1.0]
  const count = points.length
  const angleStep = (2 * Math.PI) / count

  // Calculate polygon points for the data shape
  const dataPoints = points.map((p, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = RADIUS * p.strength
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    }
  })
  const polygonStr = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  // Label positions (slightly outside the radar)
  const labelPoints = points.map((p, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = RADIUS + 24
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    }
  })

  const avgStrength = Math.round(
    (points.reduce((sum, p) => sum + p.strength, 0) / points.length) * 100
  )

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Habit Strength</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {avgStrength >= 70
              ? 'Your habit strength is growing 🌱'
              : avgStrength >= 40
              ? "You're building consistency"
              : 'Every small effort counts'}
          </p>
        </div>
        <span className="text-sm font-bold gradient-text">{avgStrength}%</span>
      </div>

      <div className="flex justify-center">
        <svg width={SIZE} height={SIZE} className="overflow-visible">
          {/* Grid circles */}
          {levels.map((level) => (
            <circle
              key={level}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * level}
              fill="none"
              stroke="#EEF2FF"
              strokeWidth={1}
            />
          ))}

          {/* Axis lines */}
          {points.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + RADIUS * Math.cos(angle)}
                y2={CENTER + RADIUS * Math.sin(angle)}
                stroke="#EEF2FF"
                strokeWidth={1}
              />
            )
          })}

          {/* Data polygon */}
          <motion.polygon
            points={polygonStr}
            fill="url(#radarFill)"
            stroke="url(#radarStroke)"
            strokeWidth={2}
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="#22D3EE"
              stroke="white"
              strokeWidth={1.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}

          {/* Labels */}
          {labelPoints.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] fill-slate-500 font-medium"
            >
              {points[i].icon}
            </text>
          ))}

          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(29,78,216,0.12)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0.18)" />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
