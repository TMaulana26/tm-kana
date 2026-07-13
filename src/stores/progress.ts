import { defineStore } from 'pinia'
import { ALL_KANA_DATA } from '@/constants/kanaData'

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

function createEmptyProgress(): Record<string, ProgressItem> {
  const progress: Record<string, ProgressItem> = {};
  for (const item of ALL_KANA_DATA) {
    progress[item.char] = {
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
    toggleLearned(character: string, status?: boolean) {
      if (this.progress[character]) {
        this.progress[character].hasLearned = status !== undefined ? status : !this.progress[character].hasLearned;
        this.saveToLocalStorage();
      }
    },
    recordQuizResult(character: string, success: boolean) {
      if (this.progress[character]) {
        if (success) {
          this.progress[character].quizSuccessCount++;
          this.progress[character].hasLearned = true;
        } else {
          this.progress[character].quizFailCount++;
        }
        this.saveToLocalStorage();
      }
    },
    recordDrawResult(character: string, success: boolean) {
      if (this.progress[character]) {
        if (success) {
          this.progress[character].drawSuccessCount++;
          this.progress[character].hasLearned = true;
        } else {
          this.progress[character].drawFailCount++;
        }
        this.saveToLocalStorage();
      }
    },
    loadProgress(loadedData: { nickname?: string; progress?: Record<string, Partial<ProgressItem>> }) {
      if (loadedData.nickname) {
        this.nickname = loadedData.nickname;
      }
      if (loadedData.progress) {
        for (const char in loadedData.progress) {
          if (this.progress[char]) {
            this.progress[char] = {
              ...this.progress[char],
              ...loadedData.progress[char]
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
