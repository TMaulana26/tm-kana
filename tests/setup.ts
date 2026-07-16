import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import en from '../src/locales/en.json'

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
  useI18n: () => ({
    t: translate,
    locale: { value: 'en' }
  })
}))

config.global.mocks = {
  $t: translate
}
