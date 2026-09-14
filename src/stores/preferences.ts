import { defineStore } from 'pinia'
import i18n from '@/i18n'

export type AppTheme = 'light' | 'dark'
export type AppLocale = 'id' | 'en' | 'ja'

export interface PreferencesState {
  theme: AppTheme
  autoSubmitQuiz: boolean
  locale: AppLocale
}

const STORAGE_KEY = 'tm_kana_preferences'

function applyThemeToDocument(theme: AppTheme) {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): PreferencesState => {
    // Default initial values
    let initialTheme: AppTheme = 'light'
    let initialAutoSubmit = false
    let initialLocale: AppLocale = (typeof window !== 'undefined' && localStorage.getItem('locale') as AppLocale) || 'id'

    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.theme === 'light' || parsed.theme === 'dark') {
            initialTheme = parsed.theme
          }
          if (typeof parsed.autoSubmitQuiz === 'boolean') {
            initialAutoSubmit = parsed.autoSubmitQuiz
          }
          if (parsed.locale === 'id' || parsed.locale === 'en' || parsed.locale === 'ja') {
            initialLocale = parsed.locale
          }
        } catch (e) {
          console.error('Failed to parse preferences from localStorage', e)
        }
      } else {
        // Check system preference if no stored theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          initialTheme = 'dark'
        }
      }
    }

    // Apply theme on load
    applyThemeToDocument(initialTheme)

    return {
      theme: initialTheme,
      autoSubmitQuiz: initialAutoSubmit,
      locale: initialLocale
    }
  },
  actions: {
    setTheme(theme: AppTheme) {
      this.theme = theme
      applyThemeToDocument(theme)
      this.saveToLocalStorage()
    },
    toggleTheme() {
      const nextTheme: AppTheme = this.theme === 'dark' ? 'light' : 'dark'
      this.setTheme(nextTheme)
    },
    setAutoSubmitQuiz(enabled: boolean) {
      this.autoSubmitQuiz = enabled
      this.saveToLocalStorage()
    },
    toggleAutoSubmitQuiz() {
      this.autoSubmitQuiz = !this.autoSubmitQuiz
      this.saveToLocalStorage()
    },
    setLocale(locale: AppLocale) {
      this.locale = locale
      if (i18n && i18n.global) {
        if (typeof i18n.global.locale === 'object' && i18n.global.locale !== null && 'value' in i18n.global.locale) {
          (i18n.global.locale as any).value = locale
        } else {
          (i18n.global as any).locale = locale
        }
      }
      localStorage.setItem('locale', locale)
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            theme: this.theme,
            autoSubmitQuiz: this.autoSubmitQuiz,
            locale: this.locale
          })
        )
      }
    }
  }
})
