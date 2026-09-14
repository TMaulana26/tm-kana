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
          KanaCanvas: {
            template: '<div class="kana-canvas-stub"></div>',
            methods: {
              getCanvasSize: () => ({ width: 320, height: 320 }),
              drawCompleted: vi.fn(),
              clear: vi.fn(),
              getPoints: () => [],
              getStrokes: () => []
            }
          }
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
    expect(wrapper.text()).toContain('Nailed it!')
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
    expect(wrapper.text()).toContain('Try again')
    // Verify store hasLearned is false, fail count is incremented
    expect(store.progress[currentQ.item.id].hasLearned).toBe(false)
    expect(store.progress[currentQ.item.id].quizFailCount).toBe(1)
  })

  it('accepts alternate inputs di and du for dji and dzu dakuon characters', async () => {
    const wrapper = mountPracticeView()

    // Inject mock question pool for ぢ (h-dji) and づ (h-dzu)
    const mockQuestions = [
      {
        index: 0,
        item: { id: 'h-dji', character: 'ぢ', romaji: 'JI', rowGroup: 'd' }
      },
      {
        index: 1,
        item: { id: 'h-dzu', character: 'づ', romaji: 'ZU', rowGroup: 'd' }
      }
    ];
    (wrapper.vm as any).questions = mockQuestions;
    (wrapper.vm as any).isSessionActive = true;
    (wrapper.vm as any).isSessionFinished = false;
    (wrapper.vm as any).currentQuestionIndex = 0;
    (wrapper.vm as any).practiceMode = 'quiz';

    // Wait for Vue to update the DOM
    await wrapper.vm.$nextTick();

    // Set alternate input 'di'
    const input = wrapper.find('input#quiz-input')
    await input.setValue('di')
    await input.trigger('keyup.enter')

    expect(wrapper.text()).toContain('Nailed it!')
    expect(store.progress['h-dji'].hasLearned).toBe(true)
    expect(store.progress['h-dji'].quizSuccessCount).toBe(1)
  })

  it('automatically submits when autoSubmitQuiz is enabled in preferencesStore without pressing enter', async () => {
    const { usePreferencesStore } = await import('@/stores/preferences')
    const preferencesStore = usePreferencesStore()
    preferencesStore.setAutoSubmitQuiz(true)

    const wrapper = mountPracticeView()

    // Inject mock question pool
    const mockQuestions = [
      {
        index: 0,
        item: { id: 'h-ka', character: 'か', romaji: 'KA', rowGroup: 'k' }
      }
    ];
    (wrapper.vm as any).questions = mockQuestions;
    (wrapper.vm as any).isSessionActive = true;
    (wrapper.vm as any).isSessionFinished = false;
    (wrapper.vm as any).currentQuestionIndex = 0;
    (wrapper.vm as any).practiceMode = 'quiz';

    await wrapper.vm.$nextTick();

    // Verify submit button is hidden when autoSubmitQuiz is true
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Submit') || b.text().includes('Periksa') || b.text().includes('practice.submitBtn'))
    expect(submitBtn).toBeUndefined()

    // Type correct romaji 'ka' without pressing Enter
    const input = wrapper.find('input#quiz-input')
    await input.setValue('ka')
    await wrapper.vm.$nextTick()

    // Feedback should automatically trigger
    expect(wrapper.text()).toContain('Nailed it!')
    expect(store.progress['h-ka'].hasLearned).toBe(true)
  })

  it('requires all strokes from both characters before completing compound kana in draw mode', async () => {
    // Mock 6 template strokes (3 for に + 3 for ゃ)
    const mockTemplateStrokes = [
      [{ x: 10, y: 10 }, { x: 10, y: 50 }],
      [{ x: 20, y: 20 }, { x: 40, y: 20 }],
      [{ x: 20, y: 40 }, { x: 40, y: 40 }],
      [{ x: 60, y: 40 }, { x: 80, y: 40 }],
      [{ x: 70, y: 30 }, { x: 70, y: 40 }],
      [{ x: 65, y: 35 }, { x: 75, y: 70 }],
    ];

    const strokeTemplateModule = await import('@/utils/strokeTemplate');
    vi.spyOn(strokeTemplateModule, 'loadKanaTemplate').mockResolvedValue({
      strokes: mockTemplateStrokes,
      paths: mockTemplateStrokes.map(() => 'M0,0'),
      numbers: mockTemplateStrokes.map((_, i) => ({ transform: 'matrix(1 0 0 1 0 0)', num: i + 1 })),
      svgContent: '<svg></svg>'
    });

    const wrapper = mountPracticeView()

    // Inject mock compound kana question (にゃ - 6 total strokes)
    const mockQuestions = [
      {
        index: 0,
        item: { id: 'h-nya', character: 'にゃ', romaji: 'NYA', rowGroup: 'ny' }
      }
    ];
    (wrapper.vm as any).questions = mockQuestions;
    (wrapper.vm as any).isSessionActive = true;
    (wrapper.vm as any).isSessionFinished = false;
    (wrapper.vm as any).currentQuestionIndex = 0;
    (wrapper.vm as any).practiceMode = 'draw';

    // Wait for watcher to call fetchTemplateSVG and load template
    await wrapper.vm.$nextTick();
    await new Promise(r => setTimeout(r, 20));
    await wrapper.vm.$nextTick();

    // Mock recognizeSingleStroke to return match
    const strokeRecognizerModule = await import('@/utils/strokeRecognizer');
    vi.spyOn(strokeRecognizerModule, 'recognizeSingleStroke').mockReturnValue({ isMatch: true });

    // Simulate user drawing the 3 strokes of the first character (に)
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 10, y: 10 }, { x: 10, y: 50 }]]);
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 20, y: 20 }, { x: 40, y: 20 }]]);
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 20, y: 40 }, { x: 40, y: 40 }]]);

    // Expect completedStrokesCount to be 3
    expect((wrapper.vm as any).completedStrokesCount).toBe(3);
    // Crucial bug fix assertion: The exercise must NOT be finished yet!
    expect((wrapper.vm as any).showFeedback).toBe(false);
    expect(store.progress['h-nya']?.hasLearned).toBeFalsy();

    // Simulate user drawing the remaining 3 strokes of the second character (ゃ)
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 60, y: 40 }, { x: 80, y: 40 }]]);
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 70, y: 30 }, { x: 70, y: 40 }]]);
    (wrapper.vm as any).handleStrokeCompleted([[{ x: 65, y: 35 }, { x: 75, y: 70 }]]);

    // Now all 6 strokes are completed!
    expect((wrapper.vm as any).completedStrokesCount).toBe(6);
    expect((wrapper.vm as any).showFeedback).toBe(true);
    expect(store.progress['h-nya'].hasLearned).toBe(true);
    expect(store.progress['h-nya'].drawSuccessCount).toBe(1);
  })
})
