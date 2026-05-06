'use client'

import { useRef, useEffect } from 'react'

interface TextBlockProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  isHeading?: boolean
}

export default function TextBlock({ content, onChange, placeholder, isHeading }: TextBlockProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-resize
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [content])

  return (
    <textarea
      ref={ref}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || (isHeading ? 'Heading...' : "What's on your mind?")}
      rows={1}
      className={`w-full bg-transparent resize-none focus:outline-none leading-relaxed placeholder:text-muted
        ${isHeading
          ? 'text-base font-semibold text-primary'
          : 'text-sm text-secondary'
        }`}
    />
  )
}
