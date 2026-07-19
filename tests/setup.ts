import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import en from '../src/locales/en.json'

// Global localStorage Mock
let localStorageStore: Record<string, string> = {}
global.localStorage = {
  getItem: vi.fn((key: string) => localStorageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value.toString()
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageStore[key]
  }),
  clear: vi.fn(() => {
    localStorageStore = {}
  }),
  length: 0,
  key: vi.fn(() => null)
} as any

const translate = (key: string, values?: Record<string, string>) => {
  const parts = key.split('.')
  let current: any = en
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part]
    } else {
      return key
    }
  }
  if (typeof current === 'string') {
    if (values) {
      let str = current
      for (const [k, v] of Object.entries(values)) {
        str = str.replace(new RegExp(`{${k}}`, 'g'), v)
      }
      return str
    }
    return current
  }
  return key
}

vi.mock('vue-i18n', () => ({
  createI18n: () => ({
    global: {
      t: translate,
      locale: 'id'
    }
  }),
  useI18n: () => ({
    t: translate,
    locale: { value: 'en' }
  })
}))

config.global.mocks = {
  $t: translate
}
