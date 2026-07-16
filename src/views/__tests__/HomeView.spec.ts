import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../HomeView.vue'
import { useProgressStore } from '@/stores/progress'
import * as crypto from '@/utils/progressCrypto'

// Mock toast from vue-sonner
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

import { toast } from 'vue-sonner'

describe('HomeView.vue integration tests', () => {
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
    
    // Mock global download functions
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:http://localhost/mock-url'),
      revokeObjectURL: vi.fn()
    })
    
    // Mock document.createElement anchor click behavior
    document.createElement = (originalCreateElement => {
      return (tagName: string) => {
        const element = originalCreateElement.call(document, tagName)
        if (tagName === 'a') {
          (element as any).click = vi.fn()
        }
        return element
      }
    })(document.createElement)
  })

  const mountHomeView = () => {
    return mount(HomeView, {
      global: {
        plugins: [pinia],
      }
    })
  }

  it('renders correctly with default nickname from Pinia store', () => {
    const wrapper = mountHomeView()
    const input = wrapper.find('input#nickname')
    
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('ユーザー')
  })

  it('updates nickname in Pinia store when edited and submitted', async () => {
    const wrapper = mountHomeView()
    const input = wrapper.find('input#nickname')
    
    await input.setValue('Indra')
    // Click Simpan button
    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find(b => b.text().includes('Save'))
    await saveButton?.trigger('click')
    
    expect(store.nickname).toBe('Indra')
    expect(toast.success).toHaveBeenCalled()
  })

  it('triggers export progress file download on export button click', async () => {
    const wrapper = mountHomeView()
    const buttons = wrapper.findAll('button')
    const exportBtn = buttons.find(b => b.text().includes('Export Progress (.txt)'))
    
    expect(exportBtn?.exists()).toBe(true)
    
    const exportSpy = vi.spyOn(crypto, 'exportProgress')
    await exportBtn?.trigger('click')
    
    expect(exportSpy).toHaveBeenCalledWith('ユーザー', store.progress)
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Progress data successfully exported!')
  })

  it('successfully restores progress from a valid backup file', async () => {
    const wrapper = mountHomeView()
    
    // Create a mock file content containing a matching nickname
    const mockBackupPayload = {
      nickname: 'ユーザー',
      progress: {
        'h-a': { hasLearned: true, quizSuccessCount: 5, quizFailCount: 0, drawSuccessCount: 3, drawFailCount: 0 }
      }
    }
    const mockFileContent = crypto.exportProgress(mockBackupPayload.nickname, mockBackupPayload.progress)
    
    // Stub FileReader to directly resolve our mock file content
    class MockFileReader {
      onload: any = null
      onerror: any = null
      readAsText() {
        if (this.onload) {
          this.onload({ target: { result: mockFileContent } })
        }
      }
    }
    vi.stubGlobal('FileReader', MockFileReader)
    
    const file = new File([mockFileContent], 'backup.txt', { type: 'text/plain' })
    
    // Manually trigger file processing
    await (wrapper.vm as any).processFile(file)
    
    expect(store.progress['h-a'].hasLearned).toBe(true)
    expect(store.progress['h-a'].quizSuccessCount).toBe(5)
    expect(toast.success).toHaveBeenCalledWith('Welcome back, ユーザー! Progress data successfully imported.')
  })

  it('shows error toast when backup file nickname does not match current active nickname', async () => {
    const wrapper = mountHomeView()
    
    // Backup file belongs to Budi
    const mockBackupPayload = {
      nickname: 'Budi',
      progress: {}
    }
    const mockFileContent = crypto.exportProgress(mockBackupPayload.nickname, mockBackupPayload.progress)
    
    // Stub FileReader
    class MockFileReader {
      onload: any = null
      onerror: any = null
      readAsText() {
        if (this.onload) {
          this.onload({ target: { result: mockFileContent } })
        }
      }
    }
    vi.stubGlobal('FileReader', MockFileReader)
    
    const file = new File([mockFileContent], 'backup.txt', { type: 'text/plain' })
    await (wrapper.vm as any).processFile(file)
    
    // Nickname remains 'ユーザー'
    expect(store.nickname).toBe('ユーザー')
    expect(toast.error).toHaveBeenCalledWith('Import failed: Backup nickname (Budi) does not match current active nickname (ユーザー).')
  })
})
