import { describe, it, expect } from 'vitest'
import { getVowelIndex, groupKanaData } from '../kana'
import type { KanaGroup } from '@/constants/kanaData'

describe('kana.ts utilities', () => {
  describe('getVowelIndex', () => {
    it('should map Romaji vowel endings to correct index positions case-insensitively', () => {
      expect(getVowelIndex('KA')).toBe(0) // ends with a -> 0
      expect(getVowelIndex('ki')).toBe(1) // ends with i -> 1
      expect(getVowelIndex('JI')).toBe(1) // special case 'ji' -> 1
      expect(getVowelIndex('ku')).toBe(2) // ends with u -> 2
      expect(getVowelIndex('TSU')).toBe(2) // special case 'tsu' -> 2
      expect(getVowelIndex('ke')).toBe(3) // ends with e -> 3
      expect(getVowelIndex('KO')).toBe(4) // ends with o -> 4
      expect(getVowelIndex('wo')).toBe(4) // special case 'wo' -> 4
      expect(getVowelIndex('N')).toBe(4)  // special case 'n' -> 4
    })
  })

  describe('groupKanaData', () => {
    it('should group kana characters into gojuon, dakuon, and yoon structures', () => {
      const mockGroup: KanaGroup = {
        gojuon: [
          { id: 'h-a', character: 'あ', romaji: 'A', rowGroup: 'vowels' }
        ],
        dakuten: [
          { id: 'h-ga', character: 'が', romaji: 'GA', rowGroup: 'g' }
        ],
        yoon: [
          { id: 'h-kya', character: 'きゃ', romaji: 'KYA', rowGroup: 'k' }
        ]
      }

      const grouped = groupKanaData(mockGroup)

      expect(grouped.gojuon).toBeDefined()
      expect(grouped.dakuon).toBeDefined()
      expect(grouped.yoon).toBeDefined()

      // The 'vowels' row in gojuon should have 'あ' at index 0
      const aRow = grouped.gojuon.find(r => r.rowName === 'vowels')
      expect(aRow).toBeDefined()
      expect(aRow?.chars[0]).toEqual(mockGroup.gojuon[0])

      // The 'g' row in dakuon should have 'が' at index 0
      const gRow = grouped.dakuon.find(r => r.rowName === 'g')
      expect(gRow).toBeDefined()
      expect(gRow?.chars[0]).toEqual(mockGroup.dakuten[0])

      // The 'k' row in yoon should have 'きゃ' in its list
      const kyaRow = grouped.yoon.find(r => r.rowName === 'k')
      expect(kyaRow).toBeDefined()
      expect(kyaRow?.chars).toContainEqual(mockGroup.yoon[0])
    })
  })
})
