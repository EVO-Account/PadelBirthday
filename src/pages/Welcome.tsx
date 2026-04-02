import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import LanguageSelector from '../components/LanguageSelector'

export default function Welcome() {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="flex flex-col min-h-svh bg-surface-primary relative overflow-hidden">
      {/* Language selector */}
      <div className="flex justify-center pt-4 px-5">
        <LanguageSelector />
      </div>

      {/* R.I.P Header Image */}
      <div className="flex justify-center px-7 pt-4">
        <img
          src="/images/rip-header.png"
          alt={t.welcome.altRip}
          className="w-full max-w-[336px] h-auto"
        />
      </div>

      {/* Welcome text — image */}
      <div className="flex justify-center mt-4">
        <img
          src="/images/welcome-text.png"
          alt={t.welcome.altWelcome}
          className="w-[262px] h-auto"
        />
      </div>

      {/* See details button */}
      <div className="flex justify-center px-16 mt-6 relative z-10">
        <button
          onClick={() => navigate('/details')}
          className="w-[269px] h-12 rounded-full font-bold text-[18px] text-text-invert relative overflow-hidden cursor-pointer border border-pink/50"
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
          <span className="relative z-10">{t.welcome.seeDetails}</span>
        </button>
      </div>

      {/* Bottom padel court illustration */}
      <div className="mt-auto relative w-full">
        <img
          src="/images/padel-scene.png"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}
