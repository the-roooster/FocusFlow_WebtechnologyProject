'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Leaf } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useRecoveryMode } from '@/hooks/useRecoveryMode'

export default function SimplifyModeBanner() {
  const { simplifyModeActive, deactivateSimplifyMode } = useUIStore()
  const isRecovery = useRecoveryMode()

  const showBanner = simplifyModeActive || isRecovery

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full px-4 md:px-8 py-2.5 flex items-center justify-between gap-3 border-b border-blue-100/20 bg-gradient-to-r from-blue-50/95 to-cyan-50/95 dark:from-slate-800/95 dark:to-slate-900/95"
        >
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-brand-cyan flex-shrink-0" strokeWidth={1.7} />
            <p className="text-xs text-secondary leading-tight">
              {isRecovery
                ? 'You\'re in a gentle mode. Take it one small step at a time. 💙'
                : 'Simplified view active — only what matters most is showing.'}
            </p>
          </div>

          {!isRecovery && (
            <button
              onClick={deactivateSimplifyMode}
              className="flex items-center gap-1 text-[11px] text-brand-blue font-medium whitespace-nowrap hover:text-brand-cyan transition-colors flex-shrink-0"
            >
              <Maximize2 size={11} strokeWidth={2} />
              Expand view
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
