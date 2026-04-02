import { useNavigate, useLocation } from 'react-router-dom'
import { getGoogleCalendarUrl } from '../lib/calendar'
import { useI18n } from '../i18n'

export default function AcceptSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()

  const playingPadel = (location.state as { playingPadel?: boolean } | null)?.playingPadel ?? true

  return (
    <div className="flex flex-col min-h-svh bg-surface-primary relative pb-32">
      {/* Top bar */}
      <div className="flex items-center justify-center p-4 border-b border-[rgba(247,247,244,0.2)]">
        <p className="text-[14px] text-text-primary text-center w-[190px] leading-[1.5]">
          {t.acceptSuccess.title}
        </p>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-[358px]">
          {/* Celebration illustration */}
          <div className="w-[184px] h-[151px]">
            <img
              src="/images/skeleton-confirmed.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="font-display text-text-primary text-[32px] leading-none tracking-[-0.48px] text-center w-[308px]">
            {t.acceptSuccess.heading}
          </h1>

          {/* Description */}
          <p className="text-[14px] text-white text-center leading-[1.5]">
            {t.acceptSuccess.description}
          </p>
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-[#393939] p-4 flex flex-col gap-2 z-10">
        <div className="max-w-md mx-auto w-full flex flex-col gap-2">
          {/* Add to Google Calendar — pink primary */}
          <button
            onClick={() => window.open(getGoogleCalendarUrl(), '_blank')}
            className="w-full h-12 rounded-full font-bold text-[18px] text-text-invert relative overflow-hidden cursor-pointer border border-pink/50 flex items-center justify-center gap-3"
            style={{
              boxShadow: '0px 2px 4px 0px #342d33, 0px 2px 10px 0px #482946',
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 100%, #ff99f7, #d470cc)',
              }}
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_#f084e8,inset_0px_0px_2px_0px_#f084e8,inset_0px_1px_2px_0px_#ff99f7]" />
            <img src="/images/icons/calendar-dark.svg" alt="" className="relative z-10 size-6" />
            <span className="relative z-10">{t.acceptSuccess.addCalendar}</span>
          </button>

          {/* Go to Non-Stop — secondary (hidden if not playing padel) */}
          {playingPadel && (
            <button
              onClick={() => navigate('/tournament')}
              className="w-full h-12 rounded-full font-bold text-[18px] text-text-primary relative overflow-hidden cursor-pointer border border-border-secondary flex items-center justify-center gap-3"
              style={{ boxShadow: '0px 2px 4px 0px rgba(29,29,29,0.2)' }}
            >
              <div className="absolute inset-0 bg-surface-contrast rounded-full" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_rgba(26,26,26,0.4),inset_0px_-3px_3px_0px_#262626,inset_0px_1px_2px_0px_rgba(26,26,26,0.2)]" />
              <img src="/images/icons/play.svg" alt="" className="relative z-10 size-6" />
              <span className="relative z-10">{t.acceptSuccess.goToNonStop}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
