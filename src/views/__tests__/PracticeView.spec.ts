import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PracticeView from '../PracticeView.vue'
import { useProgressStore } from '@/stores/progress'

describe('PracticeView.vue component tests', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    vi.clearAllMocks()

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
      }),
      length: 0,
      key: vi.fn()
    }
    vi.stubGlobal('localStorage', localStorageMock)

    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)
    store = useProgressStore()
  })

  const mountPracticeView = () => {
    return mount(PracticeView, {
      global: {
        plugins: [pinia],
        stubs: {
          // Stub canvas component since rendering canvas inside jsdom in vitest can be tricky
          KanaCanvas: true
        }
      }
    })
  }

  it('renders configurator menu by default', () => {
    const wrapper = mountPracticeView()
    expect(wrapper.text()).toContain('Select Character Groups')
    expect(wrapper.text()).toContain('Practice Mode')
  })

  it('allows selecting character groups and starting practice', async () => {
    const wrapper = mountPracticeView()
    
    // Select first Hiragana group (hiragana-vowels)
    const firstGroup = wrapper.findAll('.grid-cols-1 .border-\\[2px\\]').at(0)
    expect(firstGroup?.exists()).toBe(true)
    await firstGroup?.trigger('click')

    // Find and click Mulai Latihan button
    const startBtn = wrapper.find('button.bg-violet-400')
    expect(startBtn.exists()).toBe(true)
    expect(startBtn.attributes('disabled')).toBeUndefined()
    await startBtn.trigger('click')

    // Now session is active, verify question index UI
    expect(wrapper.text()).toContain('Question 1 of')
  })

  it('allows answering questions and shows correct feedback', async () => {
    const wrapper = mountPracticeView()
    
    // Select first Hiragana group (hiragana-vowels)
    const firstGroup = wrapper.findAll('.grid-cols-1 .border-\\[2px\\]').at(0)
    await firstGroup?.trigger('click')

    // Start practice
    await wrapper.find('button.bg-violet-400').trigger('click')

    // Get the current question character
    const targetCharText = wrapper.find('.text-9xl').text()
    expect(targetCharText).toBeDefined()

    // Find current question in pool
    const currentQ = (wrapper.vm as any).currentQuestion
    expect(currentQ).toBeDefined()

    // Set correct input value
    const correctRomaji = currentQ.item.romaji
    const input = wrapper.find('input#quiz-input')
    expect(input.exists()).toBe(true)
    await input.setValue(correctRomaji)

    // Trigger enter to submit
    await input.trigger('keyup.enter')

    // Verify feedback is visible
    expect(wrapper.text()).toContain('Correct!')
    // Verify store hasLearned is updated to true
    expect(store.progress[currentQ.item.id].hasLearned).toBe(true)
    expect(store.progress[currentQ.item.id].quizSuccessCount).toBe(1)
  })

  it('allows skipping question', async () => {
    const wrapper = mountPracticeView()
    
    // Select first Hiragana group (hiragana-vowels)
    const firstGroup = wrapper.findAll('.grid-cols-1 .border-\\[2px\\]').at(0)
    await firstGroup?.trigger('click')

    // Start practice
    await wrapper.find('button.bg-violet-400').trigger('click')

    const currentQ = (wrapper.vm as any).currentQuestion

    // Click Lewati/Skip button
    const buttons = wrapper.findAll('button')
    const skipBtn = buttons.find(b => b.text().includes('Skip'))
    expect(skipBtn?.exists()).toBe(true)
    await skipBtn?.trigger('click')

    // Verify feedback is visible (incorrect feedback since skipped)
    expect(wrapper.text()).toContain('Incorrect!')
    // Verify store hasLearned is false, fail count is incremented
    expect(store.progress[currentQ.item.id].hasLearned).toBe(false)
    expect(store.progress[currentQ.item.id].quizFailCount).toBe(1)
  })
})
