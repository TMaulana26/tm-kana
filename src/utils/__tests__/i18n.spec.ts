import { describe, it, expect } from 'vitest'
import en from '@/locales/en.json'
import id from '@/locales/id.json'
import ja from '@/locales/ja.json'

function getDeepKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getDeepKeys(obj[key], path))
      } else {
        keys.push(path)
      }
    }
  }
  return keys
}

describe('i18n translations validation', () => {
  it('should have matching keys in english, indonesian, and japanese locale files', () => {
    const enKeys = getDeepKeys(en)
    const idKeys = getDeepKeys(id)
    const jaKeys = getDeepKeys(ja)

    const missingInId = enKeys.filter(k => !idKeys.includes(k))
    const missingInEn = idKeys.filter(k => !enKeys.includes(k))
    
    const missingInJa = enKeys.filter(k => !jaKeys.includes(k))
    const extraInJa = jaKeys.filter(k => !enKeys.includes(k))

    expect(missingInId, 'Keys in en.json that are missing in id.json').toEqual([])
    expect(missingInEn, 'Keys in id.json that are missing in en.json').toEqual([])
    expect(missingInJa, 'Keys in en.json that are missing in ja.json').toEqual([])
    expect(extraInJa, 'Keys in ja.json that are missing in en.json').toEqual([])
  })
})
