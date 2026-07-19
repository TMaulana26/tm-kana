import { describe, it, expect } from 'vitest'
import { importProgress, exportProgress } from '../progressCrypto'

describe('Backup Security & XSS Input Sanitization', () => {
  it('escapes and sanitizes special HTML tags in nickname to prevent XSS injections during import', () => {
    // Malicious nickname payload containing XSS script tags and image event handlers
    const maliciousNickname = '<script>alert("xss")</script><img src=x onerror=alert(1)>'
    const mockProgress = {
      'h-a': { successCount: 5, failCount: 0, hasLearned: true }
    }

    // Export progress data with malicious nickname
    const exportedBase64 = exportProgress(maliciousNickname, mockProgress)

    // Attempt import using the matching nickname (validation is performed on the sanitized string)
    // The sanitized nickname will be:
    // &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;&lt;img src=x onerror=alert(1)&gt;
    const expectedSanitized = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;&lt;img src=x onerror=alert(1)&gt;'
    const result = importProgress(exportedBase64, expectedSanitized)

    expect(result.success).toBe(true)
    expect(result.progressData?.nickname).toBe(expectedSanitized)
    expect(result.progressData?.nickname).not.toContain('<script>')
    expect(result.progressData?.nickname).not.toContain('</script>')
    expect(result.progressData?.nickname).not.toContain('<img')
  })

  it('keeps normal alphanumeric nicknames intact during import', () => {
    const normalNickname = 'TMaulana26'
    const mockProgress = {
      'h-a': { successCount: 1, failCount: 0, hasLearned: false }
    }

    const exportedBase64 = exportProgress(normalNickname, mockProgress)
    const result = importProgress(exportedBase64, normalNickname)

    expect(result.success).toBe(true)
    expect(result.progressData?.nickname).toBe(normalNickname)
  })
})
