import { useNavigate, useLocation } from 'react-router-dom'
import { EVENT } from '../lib/constants'
import { useI18n } from '../i18n'

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 size-10 rounded-[10px] border border-pink/50 flex items-center justify-center shadow-[0px_1.7px_10.3px_-1.7px_rgba(188,234,4,0.24)]">
      {children}
    </div>
  )
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-contrast rounded-[20px] overflow-hidden">
      {children}
    </div>
  )
}

export default function InviteDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()
  const prefillName = (location.state as { prefillName?: string } | null)?.prefillName || ''

  return (
    <div className="flex flex-col min-h-svh bg-surface-primary relative pb-24">
      {/* Header */}
      <div className="relative px-5 pt-4 pb-2">
        <div className="flex items-start justify-between">
          {/* R.I.P logo */}
          <img
            src="/images/rip-logo.png"
            alt={t.welcome.altRip}
            className="w-[119px] h-[58px] object-contain"
          />

          {/* RSVP + cocktail */}
          <div className="flex items-start gap-2">
            <div className="text-right mt-1">
              <p className="font-display text-[#ebeae2] text-[13px] leading-tight">{t.details.rsvpBy}</p>
              <p className="font-display text-[#ebeae2] text-[13px] leading-tight">{EVENT.rsvpDeadline}</p>
            </div>
            <img src="/images/cocktail.svg" alt="" className="w-12 h-16 -rotate-12" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 px-5 pt-4">
        {/* Title */}
        <h1 className="font-display text-text-primary text-[32px] leading-none tracking-[-0.48px]">
          {t.details.title}
        </h1>

        {/* Event Info Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-text-primary text-[20px] leading-none tracking-[-0.3px]">
            {t.details.eventInfo}
          </h2>

          {/* Date + Time card */}
          <InfoCard>
            <div className="flex items-center p-4 gap-4">
              <div className="flex-1 flex items-center gap-2">
                <IconBox>
                  <img src="/images/icons/calendar.svg" alt="" className="size-5" />
                </IconBox>
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] text-text-secondary leading-[1.5]">{t.details.date}</p>
                  <p className="text-[14px] font-semibold text-text-primary leading-[1.5]">{EVENT.date}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <IconBox>
                  <img src="/images/icons/clock.svg" alt="" className="size-5" />
                </IconBox>
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] text-text-secondary leading-[1.5]">{t.details.time}</p>
                  <p className="text-[16px] font-semibold text-text-primary leading-[1.5]">
                    {EVENT.startTime} - {EVENT.endTime}
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Location card */}
          <InfoCard>
            <a
              href={EVENT.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 gap-2 no-underline"
            >
              <IconBox>
                <img src="/images/icons/location.svg" alt="" className="size-5" />
              </IconBox>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-[14px] font-semibold text-text-primary leading-[1.5]">{t.details.locationName}</p>
                <p className="text-[12px] text-text-secondary leading-[1.5] underline underline-offset-2">
                  {t.details.locationAddress}
                </p>
              </div>
            </a>
          </InfoCard>

          {/* Clothes card */}
          <InfoCard>
            <div className="flex items-center px-4 gap-4 h-[87px]">
              <img src="/images/food-drinks.svg" alt={t.details.allBlack} className="w-[90px] h-[87px] shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-[12px] text-text-secondary leading-[1.5]">{t.details.clothes}</p>
                <p className="text-[16px] font-semibold text-text-primary leading-[1.5]">{t.details.allBlack}</p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* What's going to happen Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-text-primary text-[20px] leading-none tracking-[-0.3px]">
            {t.details.whatsHappening}
          </h2>

          {/* Food & Drinks card */}
          <InfoCard>
            <div className="flex items-center px-4 gap-4 h-[87px]">
              <img src="/images/clothes-skull.svg" alt="" className="w-[90px] h-[87px] shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-[12px] text-text-secondary leading-[1.5]">{t.details.foodDrinks}</p>
                <p className="text-[16px] font-semibold text-text-primary leading-[1.5]">
                  {t.details.foodDesc}
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Padel card */}
          <InfoCard>
            <div className="flex items-center px-4 gap-4 h-[139px]">
              <img src="/images/padel.svg" alt="" className="w-[89px] h-[87px] shrink-0" />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] text-text-secondary leading-[1.5]">{t.details.padel}</p>
                  <p className="text-[16px] font-semibold text-text-primary leading-[1.5]">
                    {t.details.padelType}
                  </p>
                </div>
                <p className="text-[12px] text-text-secondary leading-[1.5]">
                  {t.details.padelDesc}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-[#393939] p-4 flex gap-2 z-10">
        <div className="flex-1 max-w-md mx-auto flex gap-2">
          <button
            onClick={() => navigate('/decline')}
            className="flex-1 h-12 rounded-full font-bold text-[18px] text-text-primary relative overflow-hidden cursor-pointer border border-border-secondary"
          >
            <div className="absolute inset-0 bg-surface-contrast rounded-full" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0px_-3px_2px_0px_rgba(26,26,26,0.4),inset_0px_-3px_3px_0px_#262626,inset_0px_1px_2px_0px_rgba(26,26,26,0.2)]" />
            <span className="relative z-10">{t.details.cantGo}</span>
          </button>

          <button
            onClick={() => navigate('/accept', prefillName ? { state: { prefillName } } : undefined)}
            className="flex-1 h-12 rounded-full font-bold text-[18px] text-text-invert relative overflow-hidden cursor-pointer border border-pink/50"
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
            <span className="relative z-10">{t.details.illBeThere}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
