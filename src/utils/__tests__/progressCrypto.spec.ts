import { describe, it, expect } from 'vitest'
import { exportProgress, importProgress } from '../progressCrypto'

describe('progressCrypto.ts unit tests', () => {
  const mockProgress = {
    'あ': { hasLearned: true, quizSuccessCount: 3, quizFailCount: 1, drawSuccessCount: 2, drawFailCount: 0 },
    'い': { hasLearned: false, quizSuccessCount: 0, quizFailCount: 0, drawSuccessCount: 0, drawFailCount: 0 }
  }

  describe('exportProgress', () => {
    it('should successfully encode progress and nickname into a base64 string', () => {
      const nickname = 'User123'
      const base64 = exportProgress(nickname, mockProgress)
      
      expect(base64).toBeTypeOf('string')
      expect(base64.length).toBeGreaterThan(0)
      
      // Basic check that it's decodeable back to our payload
      const decodedBytes = atob(base64)
      const decodedJson = decodeURIComponent(
        Array.prototype.map.call(decodedBytes, (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
      )
      const decoded = JSON.parse(decodedJson)
      expect(decoded.nickname).toBe('User123')
      expect(decoded.progress).toEqual(mockProgress)
    })

    it('should correctly support unicode/japanese characters in the nickname', () => {
      const jpNickname = 'ユーザー'
      const base64 = exportProgress(jpNickname, mockProgress)
      
      // Decode with unicode-safe method to verify
      const decodedBytes = atob(base64)
      const decodedJson = decodeURIComponent(
        Array.prototype.map.call(decodedBytes, (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
      )
      
      const payload = JSON.parse(decodedJson)
      expect(payload.nickname).toBe('ユーザー')
    })
  })

  describe('importProgress', () => {
    it('should successfully import when nickname matches exactly', () => {
      const base64 = exportProgress('Indra', mockProgress)
      const result = importProgress(base64, 'Indra')
      
      expect(result.success).toBe(true)
      expect(result.progressData?.nickname).toBe('Indra')
      expect(result.progressData?.progress).toEqual(mockProgress)
      expect(result.error).toBeUndefined()
    })

    it('should successfully import when nickname matches case-insensitively', () => {
      const base64 = exportProgress('Indra', mockProgress)
      const result = importProgress(base64, 'indra') // lower case
      
      expect(result.success).toBe(true)
      expect(result.progressData?.nickname).toBe('Indra')
      expect(result.error).toBeUndefined()
    })

    it('should return error when nickname does not match', () => {
      const base64 = exportProgress('Indra', mockProgress)
      const result = importProgress(base64, 'Budi')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('nickname_mismatch')
      expect(result.fileNickname).toBe('Indra')
      expect(result.progressData).toBeUndefined()
    })

    it('should return error for invalid base64 string', () => {
      const result = importProgress('!!invalid_base64!!', 'Indra')
      expect(result.success).toBe(false)
      expect(result.error).toBe('decryption_failed')
    })

    it('should return error for malformed JSON structure', () => {
      // Encode a simple random string
      const badBase64 = btoa('just a plain text, not JSON')
      const result = importProgress(badBase64, 'Indra')
      expect(result.success).toBe(false)
      expect(result.error).toBe('decryption_failed')
    })

    it('should return error for invalid schema (missing nickname or progress)', () => {
      const invalidPayload = { onlyNickname: 'Indra' }
      const badBase64 = btoa(JSON.stringify(invalidPayload))
      const result = importProgress(badBase64, 'Indra')
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid_schema')
    })
  })
})
