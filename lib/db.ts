import Dexie, { type Table } from 'dexie'

export interface DBTask {
  id?: number
  taskId: string
  title: string
  dueDate?: string
  status: 'active' | 'completed'
  updatedAt: string
}

export interface DBSession {
  id?: number
  type: 'deep-work'
  startedAt: string
  duration: number
  completed: boolean
}

export interface DBPendingSync {
  id?: number
  entity: string
  entityId: string
  action: 'create' | 'update' | 'delete'
  payload: string // JSON string
  createdAt: string
}

export interface DBHabit {
  id?: number
  habitId: string
  name: string
  description?: string
  icon: string
  color: string
  frequency: 'daily' | '3x-week' | '5x-week' | 'custom'
  targetPerWeek: number
  createdAt: string
}

export interface DBHabitLog {
  id?: number
  habitId: string
  date: string // YYYY-MM-DD
  completed: boolean
  loggedAt: string
}

export interface DBNote {
  id?: number
  noteId: string
  title: string
  subtitle?: string
  blocks: string // JSON-serialized Block[]
  createdAt: string
  updatedAt: string
  syncedAt?: string
}

class FocusFlowDB extends Dexie {
  tasks!: Table<DBTask>
  sessions!: Table<DBSession>
  pendingSyncs!: Table<DBPendingSync>
  habits!: Table<DBHabit>
  habitLogs!: Table<DBHabitLog>
  notes!: Table<DBNote>

  constructor() {
    super('focusflow-db')
    this.version(1).stores({
      tasks: '++id, taskId, title, dueDate, status, updatedAt',
      sessions: '++id, type, startedAt, duration',
      pendingSyncs: '++id, entity, entityId, action, createdAt',
    })
    this.version(2).stores({
      tasks: '++id, taskId, title, dueDate, status, updatedAt',
      sessions: '++id, type, startedAt, duration',
      pendingSyncs: '++id, entity, entityId, action, createdAt',
      habits: '++id, habitId, name, frequency, createdAt',
      habitLogs: '++id, habitId, date, completed',
      notes: '++id, noteId, title, updatedAt, syncedAt',
    })
  }
}

export const db = new FocusFlowDB()
