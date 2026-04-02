import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-text-muted font-medium">
        {label}
      </label>
      <input
        id={id}
        className="bg-surface-light border border-surface-lighter rounded-xl px-4 py-3 text-text
          placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50
          focus:border-primary transition-all"
        {...props}
      />
    </div>
  )
}
