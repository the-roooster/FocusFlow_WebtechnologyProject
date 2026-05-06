'use client'

import { useMemo } from 'react'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import { computeRecoveryMode } from '@/lib/recoveryMode'

export function useRecoveryMode(): boolean {
  const { lastProductiveAt, energyState } = useUserStore()
  const { tasks } = useTaskStore()

  return useMemo(
    () => computeRecoveryMode(lastProductiveAt, energyState, tasks),
    [lastProductiveAt, energyState, tasks]
  )
}
