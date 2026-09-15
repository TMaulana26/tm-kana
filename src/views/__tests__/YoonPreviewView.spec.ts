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

  it('renders title and default bento option correctly', () => {
    const wrapper = mountView()
    expect(wrapper.text()).toContain('Yoon Layout Preview Arena')
    expect(wrapper.text()).toContain('Option 1: Educational Bento')
    expect(wrapper.text()).toContain('きゃ')
  })

  it('switches between the 4 layout options', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as any

    // Initially bento
    expect(vm.activeOption).toBe('bento')

    // Find tabs
    const optionButtons = wrapper.findAll('button[role="tab"]')
    expect(optionButtons.length).toBe(4)

    // Switch to split grid (option 2)
    await optionButtons[1].trigger('click')
    expect(vm.activeOption).toBe('split')

    // Switch to pattern placeholder (option 3)
    await optionButtons[2].trigger('click')
    expect(vm.activeOption).toBe('pattern')

    // Switch to compact centered (option 4)
    await optionButtons[3].trigger('click')
    expect(vm.activeOption).toBe('compact')
  })

  it('allows clicking a kana card to open character detail dialog', async () => {
    const wrapper = mountView()
    const cards = wrapper.findAllComponents(KanaCard)
    expect(cards.length).toBeGreaterThan(0)

    await cards[0].vm.$emit('click', cards[0].props('character'))
    const vm = wrapper.vm as any
    expect(vm.isDialogOpen).toBe(true)
    expect(vm.selectedCharacter).toBeTruthy()
  })
})
