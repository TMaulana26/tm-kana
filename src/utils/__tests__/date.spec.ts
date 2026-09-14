import { describe, it, expect } from 'vitest'
import { formatIndonesianDateTime } from '../date'

describe('formatIndonesianDateTime utility', () => {
  it('formats a specific UTC date into Indonesian date and time with WIB', () => {
    const testDate = new Date('2026-09-14T07:41:00Z')
    const formatted = formatIndonesianDateTime(testDate)

    expect(formatted).toContain('14 September 2026')
    expect(formatted).toContain('14')
    expect(formatted).toContain('41')
    expect(formatted).toContain('WIB')
  })

  it('formats current date when called with no arguments', () => {
    const formatted = formatIndonesianDateTime()
    expect(formatted).toContain('WIB')
    expect(typeof formatted).toBe('string')
  })
})
