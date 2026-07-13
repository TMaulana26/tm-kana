import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import KanaCard from '../KanaCard.vue'
import { useProgressStore } from '@/stores/progress'
import type { KanaCharacter } from '@/constants/kanaData'

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

const testChar: KanaCharacter = {
  char: 'あ',
  romaji: 'a',
  type: 'hiragana',
  group: 'gojuon',
  row: 'a'
}

describe('KanaCard.vue Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders character and romaji correctly', () => {
    const wrapper = mount(KanaCard, {
      props: {
        character: testChar
      }
    })

    expect(wrapper.text()).toContain('あ')
    expect(wrapper.text()).toContain('a')
  })

  it('displays default style when character is not learned', () => {
    const wrapper = mount(KanaCard, {
      props: {
        character: testChar
      }
    })

    expect(wrapper.find('button').classes()).toContain('bg-[#f4f3ec]')
    expect(wrapper.find('span.absolute').exists()).toBe(false)
  })

  it('displays active highlight style and checkmark when character is learned', () => {
    const store = useProgressStore()
    store.progress['あ'].hasLearned = true

    const wrapper = mount(KanaCard, {
      props: {
        character: testChar
      }
    })

    expect(wrapper.find('button').classes()).toContain('bg-[#00f5d4]')
    expect(wrapper.find('span.absolute').exists()).toBe(true)
  })

  it('emits click event with character object when clicked', async () => {
    const wrapper = mount(KanaCard, {
      props: {
        character: testChar
      }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]?.[0]).toEqual(testChar)
  })
})
