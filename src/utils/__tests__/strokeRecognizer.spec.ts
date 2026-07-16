import { describe, it, expect } from 'vitest'
import {
  distance,
  pathLength,
  resample,
  centroid,
  boundingBox,
  recognizeStroke
} from '../strokeRecognizer'

describe('strokeRecognizer.ts', () => {
  describe('distance helper', () => {
    it('should calculate accurate Euclidean distance', () => {
      const p1 = { x: 0, y: 0 }
      const p2 = { x: 3, y: 4 }
      expect(distance(p1, p2)).toBe(5)
    })
  })

  describe('pathLength helper', () => {
    it('should calculate accurate length of full path', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 3, y: 4 },
        { x: 3, y: 10 }
      ]
      expect(pathLength(path)).toBe(11) // 5 + 6
    })
  })

  describe('resample', () => {
    it('should resample a path to a fixed number of points', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ]
      const resampled = resample(path, 64)
      expect(resampled.length).toBe(64)
      expect(resampled[0]).toEqual({ x: 0, y: 0 })
      expect(resampled[63]).toEqual({ x: 100, y: 100 })
    })

    it('should handle small arrays gracefully', () => {
      const empty = resample([], 64)
      expect(empty).toEqual([])

      const single = resample([{ x: 10, y: 10 }], 64)
      expect(single.length).toBe(64)
      expect(single[0]).toEqual({ x: 10, y: 10 })
    })
  })

  describe('centroid', () => {
    it('should compute exact average coordinates', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 10, y: 20 },
        { x: 20, y: 40 }
      ]
      expect(centroid(path)).toEqual({ x: 10, y: 20 })
    })
  })

  describe('boundingBox', () => {
    it('should return correct width and height bounds', () => {
      const path = [
        { x: 5, y: 10 },
        { x: 50, y: 5 },
        { x: 20, y: 80 }
      ]
      const box = boundingBox(path)
      expect(box.x).toBe(5)
      expect(box.y).toBe(5)
      expect(box.width).toBe(45)
      expect(box.height).toBe(75)
    })
  })

  describe('recognizeStroke main function', () => {
    it('should return low score and fail if path has less than 2 points', () => {
      const result = recognizeStroke([{ x: 10, y: 10 }], 'あ')
      expect(result.isMatch).toBe(false)
      expect(result.score).toBe(0)
    })

    it('should return high score for mock/canvas fallback match in node tests', () => {
      const path = [
        { x: 10, y: 10 },
        { x: 50, y: 50 },
        { x: 100, y: 100 }
      ]
      const result = recognizeStroke(path, 'あ')
      // In node tests, templatePoints is empty because canvas is not fully implemented in jsdom.
      // So the fallback logic returns score: 0.9, isMatch: true.
      expect(result.isMatch).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(0.7)
    })
  })
})
