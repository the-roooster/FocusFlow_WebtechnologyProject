'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Trash2, Plus, Minus } from 'lucide-react'
import { useNoteStore, type NoteBlock, type BlockType } from '@/store/noteStore'
import TextBlock from './TextBlock'
import ChecklistBlock from './ChecklistBlock'
import VoiceBlock from './VoiceBlock'
import BlockPicker from './BlockPicker'

interface NoteCanvasProps {
  noteId: string
}

export default function NoteCanvas({ noteId }: NoteCanvasProps) {
  const {
    getActiveNote,
    updateNoteTitle,
    updateNoteSubtitle,
    updateBlockContent,
    addBlock,
    deleteBlock,
    reorderBlocks,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItemText,
    deleteChecklistItem,
  } = useNoteStore()

  const note = getActiveNote()
  const [showPicker, setShowPicker] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  if (!note) return null

  const handleAddBlock = (type: BlockType) => {
    addBlock(noteId, type)
    setShowPicker(false)
  }

  const handleDragStart = (idx: number) => {
    setDragIdx(idx)
  }

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== targetIdx) {
      reorderBlocks(noteId, dragIdx, targetIdx)
      setDragIdx(targetIdx)
    }
  }

  const handleDragEnd = () => {
    setDragIdx(null)
  }

  const renderBlock = (block: NoteBlock, index: number) => {
    const isOnlyBlock = note.blocks.length === 1

    return (
      <motion.div
        key={block.id}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: dragIdx === index ? 0.6 : 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={`group relative rounded-xl border transition-all duration-200
          ${dragIdx === index
            ? 'border-brand-cyan/30 bg-cyan-50/30'
            : 'border-transparent hover:border-blue-100/20 hover:bg-card/50'
          }
          p-3 pl-8`}
      >
        {/* Drag handle */}
        <div className="absolute left-1.5 top-3 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity text-muted hover:text-secondary">
          <GripVertical size={14} strokeWidth={1.5} />
        </div>

        {/* Delete */}
        {!isOnlyBlock && (
          <button
            onClick={() => deleteBlock(noteId, block.id)}
            className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 text-muted hover:text-amber-500 transition-all"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        )}

        {/* Block content */}
        {block.type === 'text' && (
          <TextBlock
            content={block.content}
            onChange={(c) => updateBlockContent(noteId, block.id, c)}
          />
        )}

        {block.type === 'heading' && (
          <TextBlock
            content={block.content}
            onChange={(c) => updateBlockContent(noteId, block.id, c)}
            isHeading
          />
        )}

        {block.type === 'checklist' && (
          <ChecklistBlock
            items={block.items || []}
            onToggle={(itemId) => toggleChecklistItem(noteId, block.id, itemId)}
            onAdd={(text) => addChecklistItem(noteId, block.id, text)}
            onUpdateText={(itemId, text) => updateChecklistItemText(noteId, block.id, itemId, text)}
            onDelete={(itemId) => deleteChecklistItem(noteId, block.id, itemId)}
          />
        )}

        {block.type === 'quote' && (
          <div className="border-l-2 border-brand-cyan/40 pl-3">
            <textarea
              value={block.content}
              onChange={(e) => updateBlockContent(noteId, block.id, e.target.value)}
              placeholder="A quiet thought..."
              rows={1}
              className="w-full bg-transparent resize-none text-sm italic text-secondary font-serif focus:outline-none placeholder:text-muted"
            />
          </div>
        )}

        {block.type === 'divider' && (
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <Minus size={10} className="text-muted" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>
        )}

        {block.type === 'voice' && (
          <VoiceBlock
            content={block.content}
            onChange={(c) => updateBlockContent(noteId, block.id, c)}
          />
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Title */}
      <input
        value={note.title}
        onChange={(e) => updateNoteTitle(noteId, e.target.value)}
        placeholder="Untitled Note"
        className="w-full bg-transparent text-xl font-bold text-primary focus:outline-none placeholder:text-muted"
      />

      {/* Subtitle */}
      <input
        value={note.subtitle || ''}
        onChange={(e) => updateNoteSubtitle(noteId, e.target.value)}
        placeholder="Add a subtitle..."
        className="w-full bg-transparent text-sm text-muted focus:outline-none placeholder:text-muted mb-4"
      />

      {/* Save status */}
      <div className="flex items-center gap-1.5 mb-4">
        <motion.div
          className="w-2 h-2 rounded-full bg-brand-cyan"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        />
        <span className="text-[11px] text-muted">Locally Saved</span>
      </div>

      {/* Blocks */}
      <AnimatePresence mode="popLayout">
        {note.blocks.map((block, i) => renderBlock(block, i))}
      </AnimatePresence>

      {/* Add block */}
      <div className="mt-4">
        {showPicker ? (
          <BlockPicker onSelect={handleAddBlock} />
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-blue transition-colors font-medium py-2"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add a new block
          </button>
        )}
      </div>
    </div>
  )
}
