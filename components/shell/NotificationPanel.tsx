'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Repeat2, CheckSquare, Timer, BellOff, Trash2 } from 'lucide-react'
import { useNotificationStore, type NotificationType } from '@/store/notificationStore'
import { useRecoveryMode } from '@/hooks/useRecoveryMode'

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  habit: Repeat2,
  task: CheckSquare,
  focus: Timer,
  welcome: Bell,
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, snoozeAll, clearAll, markRead, dismissNotification, snoozedUntil } =
    useNotificationStore()
  const isRecovery = useRecoveryMode()

  const isSnoozed = snoozedUntil && new Date(snoozedUntil) > new Date()

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute right-0 top-full mt-2 w-[340px] max-h-[420px] overflow-hidden rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg border border-blue-100/20 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50/20">
          <h3 className="text-sm font-semibold text-primary">Notifications</h3>
          <div className="flex items-center gap-1.5">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-muted hover:text-amber-500 transition-colors p-1"
                title="Clear all"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-muted hover:text-secondary transition-colors p-1"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[320px]">
          {/* Recovery / Snoozed state */}
          {(isRecovery || isSnoozed) && (
            <div className="px-4 py-6 text-center">
              <BellOff size={24} className="text-muted mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-secondary font-medium">
                {isRecovery ? 'Notifications paused' : 'Snoozed'}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {isRecovery
                  ? "You're in gentle mode. No nudges right now."
                  : 'Notifications will resume in a few hours.'}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isRecovery && !isSnoozed && notifications.length === 0 && (
            <div className="px-4 py-8 text-center">
              <Bell size={20} className="text-muted mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs text-muted">All quiet. Nothing to see here.</p>
            </div>
          )}

          {/* Notification items */}
          {!isRecovery && !isSnoozed && (
            <AnimatePresence>
              {notifications.slice(0, 5).map((notif) => {
                const Icon = ICON_MAP[notif.type]
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-blue-50/20 last:border-0 ${
                      !notif.read ? 'bg-muted/20' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        !notif.read
                          ? 'gradient-bg text-white'
                          : 'bg-muted text-muted'
                      }`}
                    >
                      <Icon size={13} strokeWidth={1.7} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!notif.read ? 'text-primary' : 'text-secondary'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(notif.id)
                      }}
                      className="text-muted hover:text-secondary transition-colors flex-shrink-0 mt-1"
                    >
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer: Snooze */}
        {!isRecovery && !isSnoozed && notifications.length > 0 && (
          <div className="border-t border-blue-50/20 px-4 py-2.5">
            <button
              onClick={snoozeAll}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-blue transition-colors font-medium w-full justify-center py-1"
            >
              <BellOff size={12} strokeWidth={1.7} />
              Snooze all for 4 hours
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
