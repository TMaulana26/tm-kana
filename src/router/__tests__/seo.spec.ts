import { describe, it, expect, beforeEach } from 'vitest'
import router from '../index'

describe('SEO Router Navigation Guards', () => {
  beforeEach(() => {
    // Reset document properties before each test
    document.title = 'TM-KANA'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.remove()
    }
  })

  it('updates document title and meta description when navigating to home page', async () => {
    await router.push('/')
    expect(document.title).toContain('Home')
    expect(document.title).toContain('TM-KANA')

    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription).not.toBeNull()
    expect(metaDescription?.getAttribute('content')).toContain('interactively')
  })

  it('updates document title and meta description when navigating to chart page', async () => {
    await router.push('/chart')
    expect(document.title).toContain('Kana Chart')
    expect(document.title).toContain('TM-KANA')

    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription?.getAttribute('content')).toContain('Hiragana')
  })

  it('updates document title and meta description when navigating to practice page', async () => {
    await router.push('/practice')
    expect(document.title).toContain('Practice')

    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription?.getAttribute('content')).toContain('Drawing')
  })

  it('updates document title and meta description when navigating to progress page', async () => {
    await router.push('/progress')
    expect(document.title).toContain('Progress')

    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription?.getAttribute('content')).toContain('writing')
  })
})
