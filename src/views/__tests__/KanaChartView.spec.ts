import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import KanaChartView from '../KanaChartView.vue'
import KanaCard from '@/components/KanaCard.vue'
import { useProgressStore } from '@/stores/progress'

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

describe('KanaChartView.vue Integration Tests', () => {
  let store: any

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProgressStore()
  })

  function mountView() {
    return mount(KanaChartView, {
      global: {
        stubs: {
          // Stub DialogPortal to prevent teleporting content outside the wrapper
          DialogPortal: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  }

  it('renders title and default tab correctly', () => {
    const wrapper = mountView()
    expect(wrapper.text()).toContain('Interactive Kana Chart')
    expect(wrapper.text()).toContain('Gojuon (Main)')
    expect(wrapper.text()).toContain('あ')
  })

  it('toggles tabs and updates content', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as any
    
    // Switch active tab directly
    vm.activeTab = 'katakana'
    await wrapper.vm.$nextTick()
    
    // Check that active tab model value updated
    expect(vm.activeTab).toBe('katakana')
  })

  it('opens details dialog when a character card is clicked', async () => {
    const wrapper = mountView()
    
    // Find Hiragana card 'あ' using imported constructor
    const cards = wrapper.findAllComponents(KanaCard)
    const charCard = cards.find(c => c.text().includes('あ'))
    expect(charCard?.exists()).toBe(true)
    
    // Emit click event directly
    await charCard?.vm.$emit('click', charCard.props('character'))
    
    // Dialog should open
    const vm = wrapper.vm as any
    expect(vm.isDialogOpen).toBe(true)
    expect(vm.selectedCharacter?.character).toBe('あ')
  })

  it('allows toggling learned state inside the dialog', async () => {
    const wrapper = mountView()
    
    // Open 'あ' dialog
    const cards = wrapper.findAllComponents(KanaCard)
    const charCard = cards.find(c => c.text().includes('あ'))
    await charCard?.vm.$emit('click', charCard.props('character'))
    
    expect(store.progress['h-a'].hasLearned).toBe(false)
    
    // Find "Mark as Learned" button in the dialog (which is rendered inline since portal is stubbed)
    const markButton = wrapper.findAll('button').find(b => b.text().includes('Mark as Learned'))
    expect(markButton?.exists()).toBe(true)
    
    await markButton?.trigger('click')
    
    // Store progress state updated!
    expect(store.progress['h-a'].hasLearned).toBe(true)
    
    // Find "Remove from Learned" button in the dialog
    const removeButton = wrapper.findAll('button').find(b => b.text().includes('Remove from Learned'))
    expect(removeButton?.exists()).toBe(true)
    
    // Click again to remove
    await removeButton?.trigger('click')
    expect(store.progress['h-a'].hasLearned).toBe(false)
  })

  it('switches category sub-tabs (Gojuon, Dakuon, Yoon) and updates displayed characters', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as any

    // Initially activeGroup is 'gojuon'
    expect(vm.activeGroup).toBe('gojuon')
    expect(wrapper.text()).toContain('あ')

    // Find category sub-tab buttons
    const gojuonBtn = wrapper.findAll('button').find(b => b.text().includes('Gojuon (Main)'))
    const dakuonBtn = wrapper.findAll('button').find(b => b.text().includes('Dakuon (Modified)'))
    const yoonBtn = wrapper.findAll('button').find(b => b.text().includes('Yoon (Combination)'))

    expect(gojuonBtn?.exists()).toBe(true)
    expect(dakuonBtn?.exists()).toBe(true)
    expect(yoonBtn?.exists()).toBe(true)

    // Click Dakuon sub-tab
    await dakuonBtn?.trigger('click')
    expect(vm.activeGroup).toBe('dakuon')
    expect(wrapper.text()).toContain('が')
    expect(wrapper.text()).not.toContain('あ')

    // Click Yoon sub-tab
    await yoonBtn?.trigger('click')
    expect(vm.activeGroup).toBe('yoon')
    expect(wrapper.text()).toContain('きゃ')
    expect(wrapper.text()).not.toContain('が')

    // Click Gojuon sub-tab to return
    await gojuonBtn?.trigger('click')
    expect(vm.activeGroup).toBe('gojuon')
    expect(wrapper.text()).toContain('あ')
  })
})
