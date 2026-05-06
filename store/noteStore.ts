'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export type BlockType = 'text' | 'heading' | 'checklist' | 'quote' | 'divider' | 'image' | 'voice'

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface NoteBlock {
  id: string
  type: BlockType
  content: string // text content for text/heading/quote, JSON for checklist
  items?: ChecklistItem[] // for checklist blocks
}

export interface Note {
  id: string
  title: string
  subtitle?: string
  blocks: NoteBlock[]
  createdAt: string
  updatedAt: string
  template?: string
}

function createDefaultBlock(): NoteBlock {
  return {
    id: nanoid(),
    type: 'text',
    content: '',
  }
}

interface NoteStore {
  notes: Note[]
  activeNoteId: string | null

  // Note CRUD
  createNote: (template?: string) => string // returns note ID
  deleteNote: (id: string) => void
  updateNoteTitle: (id: string, title: string) => void
  updateNoteSubtitle: (id: string, subtitle: string) => void

  // Block CRUD
  addBlock: (noteId: string, type: BlockType, afterBlockId?: string) => void
  updateBlockContent: (noteId: string, blockId: string, content: string) => void
  deleteBlock: (noteId: string, blockId: string) => void
  reorderBlocks: (noteId: string, fromIndex: number, toIndex: number) => void

  // Checklist specific
  addChecklistItem: (noteId: string, blockId: string, text: string) => void
  toggleChecklistItem: (noteId: string, blockId: string, itemId: string) => void
  updateChecklistItemText: (noteId: string, blockId: string, itemId: string, text: string) => void
  deleteChecklistItem: (noteId: string, blockId: string, itemId: string) => void

  // Navigation
  setActiveNote: (id: string | null) => void
  getActiveNote: () => Note | undefined
}

const TEMPLATES: Record<string, { title: string; subtitle: string; blocks: Omit<NoteBlock, 'id'>[] }> = {
  'morning-reflection': {
    title: 'Morning Reflection',
    subtitle: 'Starting the day with intention.',
    blocks: [
      { type: 'heading', content: 'How am I feeling?' },
      { type: 'text', content: '' },
      { type: 'heading', content: 'Today, I want to focus on...' },
      { type: 'text', content: '' },
      { type: 'quote', content: 'Every morning is a fresh beginning.' },
    ],
  },
  'project-note': {
    title: 'Project Note',
    subtitle: 'Capturing ideas and next steps.',
    blocks: [
      { type: 'heading', content: 'Overview' },
      { type: 'text', content: '' },
      { type: 'heading', content: 'Next Steps' },
      { type: 'checklist', content: '', items: [] },
    ],
  },
  'brain-dump': {
    title: 'Brain Dump',
    subtitle: "Getting it all out. No filter needed.",
    blocks: [
      { type: 'text', content: '' },
    ],
  },
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,

      createNote: (template) => {
        const id = nanoid()
        const tmpl = template ? TEMPLATES[template] : null
        const note: Note = {
          id,
          title: tmpl?.title || 'Untitled Note',
          subtitle: tmpl?.subtitle || 'Capturing the quiet moments.',
          blocks: tmpl
            ? tmpl.blocks.map((b) => ({
                ...b,
                id: nanoid(),
                items: b.items?.map((item) => ({ ...item, id: nanoid() })),
              }))
            : [createDefaultBlock()],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template: template || undefined,
        }
        set((s) => ({
          notes: [note, ...s.notes],
          activeNoteId: id,
        }))
        return id
      },

      deleteNote: (id) => {
        set((s) => ({
          notes: s.notes.filter((n) => n.id !== id),
          activeNoteId: s.activeNoteId === id ? null : s.activeNoteId,
        }))
      },

      updateNoteTitle: (id, title) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, title, updatedAt: new Date().toISOString() } : n
          ),
        }))
      },

      updateNoteSubtitle: (id, subtitle) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, subtitle, updatedAt: new Date().toISOString() } : n
          ),
        }))
      },

      addBlock: (noteId, type, afterBlockId) => {
        const block: NoteBlock = {
          id: nanoid(),
          type,
          content: '',
          items: type === 'checklist' ? [] : undefined,
        }
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            const blocks = [...n.blocks]
            if (afterBlockId) {
              const idx = blocks.findIndex((b) => b.id === afterBlockId)
              blocks.splice(idx + 1, 0, block)
            } else {
              blocks.push(block)
            }
            return { ...n, blocks, updatedAt: new Date().toISOString() }
          }),
        }))
      },

      updateBlockContent: (noteId, blockId, content) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            return {
              ...n,
              blocks: n.blocks.map((b) =>
                b.id === blockId ? { ...b, content } : b
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteBlock: (noteId, blockId) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            const blocks = n.blocks.filter((b) => b.id !== blockId)
            // Never leave a note with zero blocks
            if (blocks.length === 0) blocks.push(createDefaultBlock())
            return { ...n, blocks, updatedAt: new Date().toISOString() }
          }),
        }))
      },

      reorderBlocks: (noteId, fromIndex, toIndex) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            const blocks = [...n.blocks]
            const [moved] = blocks.splice(fromIndex, 1)
            blocks.splice(toIndex, 0, moved)
            return { ...n, blocks, updatedAt: new Date().toISOString() }
          }),
        }))
      },

      addChecklistItem: (noteId, blockId, text) => {
        const item: ChecklistItem = { id: nanoid(), text, checked: false }
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            return {
              ...n,
              blocks: n.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, items: [...(b.items || []), item] }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      toggleChecklistItem: (noteId, blockId, itemId) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            return {
              ...n,
              blocks: n.blocks.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      items: b.items?.map((i) =>
                        i.id === itemId ? { ...i, checked: !i.checked } : i
                      ),
                    }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      updateChecklistItemText: (noteId, blockId, itemId, text) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            return {
              ...n,
              blocks: n.blocks.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      items: b.items?.map((i) =>
                        i.id === itemId ? { ...i, text } : i
                      ),
                    }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteChecklistItem: (noteId, blockId, itemId) => {
        set((s) => ({
          notes: s.notes.map((n) => {
            if (n.id !== noteId) return n
            return {
              ...n,
              blocks: n.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, items: b.items?.filter((i) => i.id !== itemId) }
                  : b
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      setActiveNote: (id) => set({ activeNoteId: id }),

      getActiveNote: () => {
        const { notes, activeNoteId } = get()
        return notes.find((n) => n.id === activeNoteId)
      },
    }),
    { name: 'focusflow-notes' }
  )
)
