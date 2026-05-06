'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BarChart2,
  StickyNote,
  Repeat2,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/deep-work', icon: Timer, label: 'Deep Work' },
  { href: '/habits', icon: Repeat2, label: 'Habits' },
  { href: '/notes', icon: StickyNote, label: 'Notes' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
]

interface SidebarProps {
  collapsed: boolean
  mobile?: boolean
}

export default function Sidebar({ collapsed, mobile }: SidebarProps) {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (mobile) {
    return (
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200
                ${active
                  ? 'text-brand-blue'
                  : 'text-muted hover:text-brand-cyan'
                }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.5}
                className={active ? 'text-brand-blue' : ''}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className={`flex items-center mb-8 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="FocusFlow Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Nav items - Centered vertically like a dock */}
      <nav className="flex flex-col gap-3 px-2 flex-1 justify-center relative">
        {NAV_ITEMS.map(({ href, icon: Icon, label }, index) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          
          // Dock wave animation logic
          const isHovered = hoveredIndex === index
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1
          const isSecondNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 2

          // Scale values for the wave effect
          const scale = isHovered ? 1.35 : isNeighbor ? 1.15 : isSecondNeighbor ? 1.05 : 1
          
          return (
            <Link key={href} href={href} passHref legacyBehavior>
              <motion.a
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                title={collapsed ? label : undefined}
                className={`relative flex items-center gap-4 px-3 py-3 rounded-2xl transition-colors duration-200 group origin-left z-10
                  ${collapsed ? 'justify-center' : ''}
                  ${active
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-brand-blue font-semibold shadow-sm'
                    : 'text-secondary hover:text-brand-blue hover:bg-muted/50'
                  }`}
                style={{ zIndex: isHovered ? 50 : isNeighbor ? 40 : 10 }}
              >
                <Icon
                  size={collapsed ? 28 : 24}
                  strokeWidth={active ? 2.5 : 1.7}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    active ? 'text-brand-blue' : 'group-hover:text-brand-cyan'
                  }`}
                />
                {!collapsed && (
                  <span className="text-base whitespace-nowrap">{label}</span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                )}
                {/* Active indicator for collapsed mode */}
                {active && collapsed && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-brand-blue rounded-r-full" 
                  />
                )}
              </motion.a>
            </Link>
          )
        })}
      </nav>

      {/* Version tag */}
      {!collapsed && (
        <div className="px-4 mt-4">
          <p className="text-[10px] text-muted font-medium tracking-wide">PHASE 4 · LOCAL</p>
        </div>
      )}
    </div>
  )
}
