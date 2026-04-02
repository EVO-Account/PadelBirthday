import { useI18n } from '../i18n'
import type { Locale } from '../i18n'

const flags: Record<Locale, string> = {
  en: '🇬🇧',
  pt: '🇵🇹',
  ru: '🇷🇺',
}

export default function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="flex gap-1.5">
      {(Object.keys(flags) as Locale[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
            locale === lang
              ? 'bg-pink/20 border-pink text-pink'
              : 'bg-surface-contrast border-border-secondary text-text-primary/60 hover:text-text-primary'
          }`}
        >
          {flags[lang]} {t.lang[lang]}
        </button>
      ))}
    </div>
  )
}
