import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      {/* Hero image placeholder */}
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-7xl shadow-2xl shadow-primary/30">
        🎾
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold text-text">
          You're Invited!
        </h1>
        <p className="text-text-muted text-lg">
          Join us for an epic birthday celebration with padel, pizza, and good vibes.
        </p>
      </div>

      <Button onClick={() => navigate('/details')}>
        See Details
      </Button>
    </div>
  )
}
