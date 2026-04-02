import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  // Full-bleed pages that manage their own layout
  const fullBleedPaths = ['/', '/details', '/accept', '/decline', '/tournament', '/success/accept', '/success/decline']
  const isFullBleed = fullBleedPaths.includes(location.pathname)

  if (isFullBleed) {
    return <>{children}</>
  }

  return (
    <div className="min-h-svh bg-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
