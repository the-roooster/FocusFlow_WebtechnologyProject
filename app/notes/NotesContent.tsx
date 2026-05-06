'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Trash2, Sparkles, BookOpen, Brain } from 'lucide-react'
import { useNoteStore } from '@/store/noteStore'
import NoteCanvas from '@/components/notes/NoteCanvas'

const TEMPLATES = [
  { id: 'morning-reflection', label: 'Morning Reflection', icon: Sparkles, emoji: '☀️' },
  { id: 'project-note', label: 'Project Note', icon: BookOpen, emoji: '📋' },
  { id: 'brain-dump', label: 'Brain Dump', icon: Brain, emoji: '🧠' },
]

export default function NotesContent() {
  const { notes, activeNoteId, createNote, deleteNote, setActiveNote } = useNoteStore()
  const [showTemplates, setShowTemplates] = useState(false)

  const handleNewNote = (template?: string) => {
    createNote(template)
    setShowTemplates(false)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return 'Today'
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const activeNote = notes.find((n) => n.id === activeNoteId)

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-6">
      <div className="flex gap-6 min-h-[60vh]">
        {/* Sidebar — note list */}
        <div className="w-56 flex-shrink-0 hidden md:flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-800">Notes</h1>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-1.5 rounded-lg gradient-bg text-white shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Template picker */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 space-y-1 overflow-hidden"
              >
                <button
                  onClick={() => handleNewNote()}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-blue-50 hover:text-brand-blue transition-all"
                >
                  📝 Blank note
                </button>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleNewNote(t.id)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-blue-50 hover:text-brand-blue transition-all"
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Note list */}
          <div className="space-y-1 flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-xs text-slate-300 px-2 py-4">
                No notes yet. Create one to get started.
              </p>
            ) : (
              notes.map((note) => (
                <motion.button
                  key={note.id}
                  layout
                  onClick={() => setActiveNote(note.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${activeNoteId === note.id
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-brand-cyan/20 shadow-card'
                      : 'hover:bg-blue-50/50'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText size={13} className="text-slate-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${activeNoteId === note.id ? 'text-brand-blue' : 'text-slate-700'}`}>
                        {note.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(note.updatedAt)} · {note.blocks.length} block{note.blocks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-500 transition-all p-0.5"
                    >
                      <Trash2 size={11} strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-800">Notes</h1>
            <button
              onClick={() => handleNewNote()}
              className="p-2 rounded-xl gradient-bg text-white shadow-sm"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile note list (when no active note) */}
          {!activeNote && (
            <div className="md:hidden space-y-2 mb-6">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className="w-full glass-card p-4 text-left"
                >
                  <p className="text-sm font-semibold text-slate-800">{note.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(note.updatedAt)}</p>
                </button>
              ))}
            </div>
          )}

          {activeNote ? (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6 min-h-[50vh]"
            >
              <NoteCanvas noteId={activeNote.id} />
            </motion.div>
          ) : (
            <div className="glass-card p-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
              <span className="text-5xl mb-4">📝</span>
              <p className="text-sm text-slate-500 font-medium mb-1">No note selected</p>
              <p className="text-xs text-slate-400 mb-5 max-w-xs">
                Select a note from the sidebar or create a new one. Start with a template or a blank canvas.
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handleNewNote()}
                  className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-medium shadow-sm"
                >
                  Blank note
                </button>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleNewNote(t.id)}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-slate-500 text-xs font-medium hover:text-brand-blue transition-colors"
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
