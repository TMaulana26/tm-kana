import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import YoonPreviewView from '../YoonPreviewView.vue'
import KanaCard from '@/components/KanaCard.vue'

// Mock LocalStorage
let localStorageStore: Record<string, string> = {}
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value.toString()
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageStore[key]
  }),
  clear: vi.fn(() => {
    localStorageStore = {}
  })
}
vi.stubGlobal('localStorage', localStorageMock)

// Stub Canvas getContext API
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  scale: vi.fn(),
  drawImage: vi.fn()
})

describe('YoonPreviewView.vue Integration Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountView() {
    return mount(YoonPreviewView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          },
          DialogPortal: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  }

  it('renders laboratory title and reference row correctly', () => {
    const wrapper = mountView()
    expect(wrapper.text()).toContain('Yoon Box Uniformity Laboratory')
    expect(wrapper.text()).toContain('Reference Box Size')
  })

  it('defaults to Option 1 and allows switching to Option 2 and Option 3', async () => {
    const wrapper = mountView()
    const optionTabs = wrapper.findAll('button[role="tab"]')
    expect(optionTabs.length).toBe(3)

    // Default is opt1
    expect(optionTabs[0].attributes('aria-selected')).toBe('true')

    // Switch to Option 2
    await optionTabs[1].trigger('click')
    expect(optionTabs[1].attributes('aria-selected')).toBe('true')
    expect(optionTabs[0].attributes('aria-selected')).toBe('false')

    // Switch to Option 3
    await optionTabs[2].trigger('click')
    expect(optionTabs[2].attributes('aria-selected')).toBe('true')
  })

  it('allows switching script between Hiragana and Katakana', async () => {
    const wrapper = mountView()
    const switchBtn = wrapper.findAll('button').find(b => b.text().includes('Hiragana') || b.text().includes('Katakana'))
    expect(switchBtn?.exists()).toBe(true)

    expect(switchBtn?.text()).toContain('Hiragana')
    await switchBtn?.trigger('click')
    expect(switchBtn?.text()).toContain('Katakana')
  })

  it('opens details dialog when a kana card is clicked', async () => {
    const wrapper = mountView()
    const firstCard = wrapper.findComponent(KanaCard)
    expect(firstCard.exists()).toBe(true)

    await firstCard.trigger('click')
    // Check that dialog is triggered
    expect((wrapper.vm as any).isDialogOpen).toBe(true)
  })
})
