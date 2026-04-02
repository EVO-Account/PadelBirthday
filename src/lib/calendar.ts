import { EVENT } from './constants'

export function getGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT.title,
    dates: `${EVENT.startISO}/${EVENT.endISO}`,
    location: EVENT.location,
    details: `Wear: ${EVENT.wear}. Food: ${EVENT.food}.`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
