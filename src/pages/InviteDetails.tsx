import { useNavigate } from 'react-router-dom'
import { EVENT } from '../lib/constants'
import Button from '../components/ui/Button'

function DetailRow({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-lighter/50 last:border-0">
      <span className="text-xl mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-light underline underline-offset-2 font-medium"
          >
            {value} ↗
          </a>
        ) : (
          <p className="text-text font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function InviteDetails() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">{EVENT.title}</h1>
        <p className="text-text-muted mt-2">
          An evening of padel, food, and celebration!
        </p>
      </div>

      <div className="bg-surface-light rounded-2xl p-5">
        <DetailRow icon="📍" label="Location" value={EVENT.location} href={EVENT.googleMapsUrl} />
        <DetailRow icon="📅" label="Date" value={EVENT.date} />
        <DetailRow icon="🕕" label="Start Time" value={EVENT.startTime} />
        <DetailRow icon="🕛" label="End Time" value={EVENT.endTime} />
        <DetailRow icon="🍕" label="Food" value={EVENT.food} />
        <DetailRow icon="🥤" label="Drinks" value={EVENT.drinks} />
        <DetailRow icon="👕" label="Wear" value={EVENT.wear} />
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-center">
        <p className="text-accent font-semibold text-sm">
          ⏰ RSVP by {EVENT.rsvpDeadline}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={() => navigate('/accept')}>
          Accept
        </Button>
        <Button variant="danger" onClick={() => navigate('/decline')}>
          Can't Make It
        </Button>
      </div>
    </div>
  )
}
