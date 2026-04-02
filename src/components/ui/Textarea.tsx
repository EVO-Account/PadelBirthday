import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export default function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-text-muted font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className="bg-surface-light border border-surface-lighter rounded-xl px-4 py-3 text-text
          placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50
          focus:border-primary transition-all resize-none"
        {...props}
      />
    </div>
  )
}
