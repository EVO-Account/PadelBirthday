import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { en } from './en'
import { pt } from './pt'
import { ru } from './ru'

export type Locale = 'en' | 'pt' | 'ru'
type DeepString<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepString<T[K]> : string }
export type Translations = DeepString<typeof en>

const translations: Record<Locale, Translations> = { en, pt, ru }

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: en,
})

function getInitialLocale(): Locale {
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved && translations[saved]) return saved

  const browserLang = navigator.language.slice(0, 2)
  if (browserLang === 'pt') return 'pt'
  if (browserLang === 'ru') return 'ru'
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
