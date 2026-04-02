import { useNavigate } from 'react-router-dom'
import { getGoogleCalendarUrl } from '../lib/calendar'
import Button from '../components/ui/Button'

export default function AcceptSuccess() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center text-6xl shadow-2xl shadow-success/30">
        🎉
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-text">You're In!</h1>
        <p className="text-text-muted text-lg">
          We can't wait to see you there. Get ready for an amazing night of padel and celebration!
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          onClick={() => window.open(getGoogleCalendarUrl(), '_blank')}
        >
          📅 Add to Google Calendar
        </Button>
        <Button variant="outline" onClick={() => navigate('/tournament')}>
          🎾 Go to Non-Stop
        </Button>
      </div>
    </div>
  )
}
