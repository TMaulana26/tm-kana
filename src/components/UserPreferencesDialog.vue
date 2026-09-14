<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore, type AppLocale, type AppTheme } from '@/stores/preferences'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import NeoBrutalistButton from '@/components/NeoBrutalistButton.vue'
import { Sun, Moon, Languages, Zap, Check, X, Settings } from 'lucide-vue-next'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { locale: i18nLocale } = useI18n()
const preferencesStore = usePreferencesStore()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const languages: { id: AppLocale; label: string; subLabel: string }[] = [
  { id: 'id', label: 'Indonesia', subLabel: 'Bahasa Indonesia' },
  { id: 'en', label: 'English', subLabel: 'English' },
  { id: 'ja', label: '日本語', subLabel: 'Japanese' }
]

function selectLanguage(lang: AppLocale) {
  preferencesStore.setLocale(lang)
  i18nLocale.value = lang
}

function selectTheme(theme: AppTheme) {
  preferencesStore.setTheme(theme)
}

function toggleAutoSubmit() {
  preferencesStore.toggleAutoSubmitQuiz()
}

function closeDialog() {
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :show-close-button="false"
      class="max-w-md w-[92vw] bg-[#f4f3ec] dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 rounded-none p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#8b5cf6]"
    >
      <DialogHeader class="border-b-[3px] border-slate-950 dark:border-slate-700 pb-4 mb-5 relative">
        <div class="flex items-start gap-3.5 pr-10">
          <div
            class="w-10 h-10 bg-violet-300 dark:bg-violet-950/70 border-[2px] border-slate-950 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#8b5cf6] mt-0.5"
          >
            <Settings class="w-5 h-5 text-slate-950 dark:text-violet-300" />
          </div>
          <div class="space-y-1 min-w-0">
            <DialogTitle class="text-lg sm:text-xl font-black uppercase text-slate-950 dark:text-white tracking-wide leading-tight">
              {{ $t('preferences.title') }}
            </DialogTitle>
            <DialogDescription class="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal">
              {{ $t('preferences.desc') }}
            </DialogDescription>
          </div>
        </div>

        <!-- Single intentional Neo-Brutalist close button -->
        <button
          type="button"
          @click="closeDialog"
          class="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-rose-400 hover:bg-rose-500 text-black border-[2px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#ef4444] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          :aria-label="$t('preferences.closeBtn')"
        >
          <X class="w-4 h-4" />
        </button>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Section: Bahasa Aplikasi (Language) -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Languages class="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {{ $t('preferences.language') }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="lang in languages"
              :key="lang.id"
              type="button"
              @click="selectLanguage(lang.id)"
              class="p-2 border-[2px] border-slate-950 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-all text-slate-950 dark:text-white"
              :class="[
                preferencesStore.locale === lang.id
                  ? 'bg-amber-300 dark:bg-amber-400 text-black font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-80'
              ]"
            >
              <div class="flex items-center gap-1">
                <span class="text-xs font-black">{{ lang.label }}</span>
                <Check v-if="preferencesStore.locale === lang.id" class="w-3.5 h-3.5 text-black" />
              </div>
              <span
                class="text-[10px] font-semibold"
                :class="preferencesStore.locale === lang.id ? 'text-black' : 'text-slate-600 dark:text-slate-400'"
              >
                {{ lang.subLabel }}
              </span>
            </button>
          </div>
        </div>

        <!-- Section: Tema Antarmuka (Theme) -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Sun v-if="preferencesStore.theme === 'light'" class="w-4 h-4 text-amber-500" />
            <Moon v-else class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {{ $t('preferences.theme') }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="selectTheme('light')"
              class="flex items-center justify-center gap-2 p-3 border-[2px] border-slate-950 dark:border-slate-700 transition-all text-slate-950 dark:text-white"
              :class="[
                preferencesStore.theme === 'light'
                  ? 'bg-amber-300 font-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-80'
              ]"
            >
              <Sun class="w-4 h-4 text-amber-600" />
              <span class="text-xs font-extrabold uppercase">{{ $t('preferences.themeLight') }}</span>
              <Check v-if="preferencesStore.theme === 'light'" class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="selectTheme('dark')"
              class="flex items-center justify-center gap-2 p-3 border-[2px] border-slate-950 dark:border-slate-700 transition-all text-slate-950 dark:text-white"
              :class="[
                preferencesStore.theme === 'dark'
                  ? 'bg-violet-400 dark:bg-violet-600 text-white font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#8b5cf6] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-80'
              ]"
            >
              <Moon class="w-4 h-4 text-indigo-300" />
              <span class="text-xs font-extrabold uppercase">{{ $t('preferences.themeDark') }}</span>
              <Check v-if="preferencesStore.theme === 'dark'" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Section: Mode Auto-Submit Kuis -->
        <div class="p-3 bg-white dark:bg-slate-800 border-[2px] border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#10b981]">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5">
                <Zap class="w-4 h-4 text-amber-500 fill-amber-400" />
                <span class="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
                  {{ $t('preferences.autoSubmit') }}
                </span>
              </div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 leading-snug">
                {{ $t('preferences.autoSubmitDesc') }}
              </p>
            </div>

            <!-- Custom Neo-Brutalist Toggle Button -->
            <button
              type="button"
              @click="toggleAutoSubmit"
              class="shrink-0 px-3 py-1.5 border-[2px] border-slate-950 dark:border-slate-700 font-black text-xs uppercase tracking-wider transition-all"
              :class="[
                preferencesStore.autoSubmitQuiz
                  ? 'bg-emerald-400 dark:bg-emerald-500 text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#10b981]'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              ]"
            >
              {{ preferencesStore.autoSubmitQuiz ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <NeoBrutalistButton
          @click="closeDialog"
          class="w-full h-10 bg-amber-300 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider"
        >
          {{ $t('preferences.closeBtn') }}
        </NeoBrutalistButton>
      </div>
    </DialogContent>
  </Dialog>
</template>
