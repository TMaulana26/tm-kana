import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePreferencesStore } from '../preferences'

describe('usePreferencesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should initialize with default state', () => {
    const store = usePreferencesStore()
    expect(store.theme).toBe('light')
    expect(store.autoSubmitQuiz).toBe(false)
    expect(store.locale).toBe('id')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should set theme to dark and toggle dark class on document element', () => {
    const store = usePreferencesStore()
    store.setTheme('dark')
    expect(store.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    const stored = JSON.parse(localStorage.getItem('tm_kana_preferences') || '{}')
    expect(stored.theme).toBe('dark')
  })

  it('should toggle theme back and forth', () => {
    const store = usePreferencesStore()
    expect(store.theme).toBe('light')

    store.toggleTheme()
    expect(store.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    store.toggleTheme()
    expect(store.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should toggle autoSubmitQuiz and save to localStorage', () => {
    const store = usePreferencesStore()
    expect(store.autoSubmitQuiz).toBe(false)

    store.setAutoSubmitQuiz(true)
    expect(store.autoSubmitQuiz).toBe(true)

    let stored = JSON.parse(localStorage.getItem('tm_kana_preferences') || '{}')
    expect(stored.autoSubmitQuiz).toBe(true)

    store.toggleAutoSubmitQuiz()
    expect(store.autoSubmitQuiz).toBe(false)

    stored = JSON.parse(localStorage.getItem('tm_kana_preferences') || '{}')
    expect(stored.autoSubmitQuiz).toBe(false)
  })

  it('should set locale and persist to localStorage', () => {
    const store = usePreferencesStore()
    store.setLocale('ja')
    expect(store.locale).toBe('ja')
    expect(localStorage.getItem('locale')).toBe('ja')

    const stored = JSON.parse(localStorage.getItem('tm_kana_preferences') || '{}')
    expect(stored.locale).toBe('ja')
  })
})
