interface ToggleProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-text-muted font-medium">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-3 rounded-xl font-semibold text-base transition-all cursor-pointer border-2 ${
            value
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-surface-light border-surface-lighter text-text-muted hover:border-surface-lighter'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 rounded-xl font-semibold text-base transition-all cursor-pointer border-2 ${
            !value
              ? 'bg-danger/20 border-danger text-danger'
              : 'bg-surface-light border-surface-lighter text-text-muted hover:border-surface-lighter'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}
