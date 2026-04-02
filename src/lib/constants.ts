export const EVENT = {
  title: 'Birthday Padel Party',
  date: 'April 11th',
  startTime: '6:00 PM',
  endTime: '12:00 AM',
  location: '88 Padel House Leça da Palmeira',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=88+Padel+House+Le%C3%A7a+da+Palmeira',
  food: 'Pizza',
  drinks: 'Not specified',
  wear: 'Black',
  rsvpDeadline: 'April 8th',
  // ISO dates for Google Calendar (UTC — 6pm WEST = 5pm UTC in April)
  startISO: '20260411T170000Z',
  endISO: '20260411T230000Z',
} as const

export const TOURNAMENT = {
  pointsPerMatch: 20,
  courts: 4,
  adminSecret: 'padel-master-2026',
} as const
