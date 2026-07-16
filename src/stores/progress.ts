import { defineStore } from 'pinia'
import { kanaData } from '@/constants/kanaData'

export interface ProgressItem {
  hasLearned: boolean;
  quizSuccessCount: number;
  quizFailCount: number;
  drawSuccessCount: number;
  drawFailCount: number;
}

export interface ProgressState {
  nickname: string;
  progress: Record<string, ProgressItem>;
}

function getAllKanaItems() {
  const items: any[] = []
  const types = ['hiragana', 'katakana'] as const
  const groups = ['gojuon', 'dakuten', 'yoon'] as const
  for (const type of types) {
    for (const group of groups) {
      if (kanaData[type] && kanaData[type][group]) {
        items.push(...kanaData[type][group])
      }
    }
  }
  return items
}

function createEmptyProgress(): Record<string, ProgressItem> {
  const progress: Record<string, ProgressItem> = {};
  for (const item of getAllKanaItems()) {
    progress[item.id] = {
      hasLearned: false,
      quizSuccessCount: 0,
      quizFailCount: 0,
      drawSuccessCount: 0,
      drawFailCount: 0
    };
  }
  return progress;
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => {
    // Try to load from LocalStorage wrapper
    const stored = localStorage.getItem('tm_kana_progress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const mergedProgress = createEmptyProgress();
          if (parsed.progress && typeof parsed.progress === 'object') {
            for (const char in parsed.progress) {
              if (mergedProgress[char]) {
                mergedProgress[char] = {
                  ...mergedProgress[char],
                  ...parsed.progress[char]
                };
              }
            }
          }
          return {
            nickname: parsed.nickname || 'ユーザー',
            progress: mergedProgress
          };
        }
      } catch (e) {
        console.error('Failed to parse stored progress, initializing empty state', e);
      }
    }
    return {
      nickname: 'ユーザー',
      progress: createEmptyProgress()
    };
  },
  actions: {
    setNickname(name: string) {
      this.nickname = name.trim() || 'ユーザー';
      this.saveToLocalStorage();
    },
    toggleLearned(characterId: string, status?: boolean) {
      if (this.progress[characterId]) {
        this.progress[characterId].hasLearned = status !== undefined ? status : !this.progress[characterId].hasLearned;
        this.saveToLocalStorage();
      }
    },
    recordQuizResult(characterId: string, success: boolean) {
      if (this.progress[characterId]) {
        if (success) {
          this.progress[characterId].quizSuccessCount++;
          this.progress[characterId].hasLearned = true;
        } else {
          this.progress[characterId].quizFailCount++;
        }
        this.saveToLocalStorage();
      }
    },
    recordDrawResult(characterId: string, success: boolean) {
      if (this.progress[characterId]) {
        if (success) {
          this.progress[characterId].drawSuccessCount++;
          this.progress[characterId].hasLearned = true;
        } else {
          this.progress[characterId].drawFailCount++;
        }
        this.saveToLocalStorage();
      }
    },
    loadProgress(loadedData: { nickname?: string; progress?: Record<string, Partial<ProgressItem>> }) {
      if (loadedData.nickname) {
        this.nickname = loadedData.nickname;
      }
      if (loadedData.progress) {
        for (const charId in loadedData.progress) {
          if (this.progress[charId]) {
            this.progress[charId] = {
              ...this.progress[charId],
              ...loadedData.progress[charId]
            };
          }
        }
      }
      this.saveToLocalStorage();
    },
    resetProgress() {
      this.nickname = 'ユーザー';
      this.progress = createEmptyProgress();
      localStorage.removeItem('tm_kana_progress');
    },
    saveToLocalStorage() {
      localStorage.setItem('tm_kana_progress', JSON.stringify({
        nickname: this.nickname,
        progress: this.progress
      }));
    }
  }
})
