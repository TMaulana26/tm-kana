<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { kanaData, type KanaItem } from '@/constants/kanaData'
import { groupKanaData } from '@/utils/kana'
import { usePreferencesStore } from '@/stores/preferences'
import KanaCard from '@/components/KanaCard.vue'
import KanaDetailDialog from '@/components/KanaDetailDialog.vue'
import { ArrowLeft, Moon, Sun, Sparkles, Info } from 'lucide-vue-next'

useI18n()
const preferences = usePreferencesStore()

type PreviewOption = 'opt1' | 'opt2' | 'opt3'
const activeOption = ref<PreviewOption>('opt1')
const activeScript = ref<'hiragana' | 'katakana'>('hiragana')
const selectedCharacter = ref<KanaItem | null>(null)
const isDialogOpen = ref(false)

const hiraganaGroups = computed(() => groupKanaData(kanaData.hiragana))
const katakanaGroups = computed(() => groupKanaData(kanaData.katakana))

const currentGroups = computed(() => {
  return activeScript.value === 'hiragana' ? hiraganaGroups.value : katakanaGroups.value
})

// Baris referensi vokal Gojuon (A, I, U, E, O) untuk tolak ukur ukuran kotak
const referenceGojuonRow = computed(() => {
  return currentGroups.value.gojuon[0] || null
})

// --- Opsi 1: 3-Kolom Split Grid (4 + 4 + 3 baris) ---
const opt1Col1 = computed(() => {
  const rows = currentGroups.value.yoon
  return rows.slice(0, 4) // K, G/S, ... (4 baris pertama)
})

const opt1Col2 = computed(() => {
  const rows = currentGroups.value.yoon
  return rows.slice(4, 8) // baris ke 5-8
})

const opt1Col3 = computed(() => {
  const rows = currentGroups.value.yoon
  return rows.slice(8) // baris ke 9-11 (3 baris)
})

// --- Opsi 2 & 3: 2-Kolom Split Grid ---
const opt2Left = computed(() => {
  const rows = currentGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(0, mid)
})

const opt2Right = computed(() => {
  const rows = currentGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(mid)
})

function selectCharacter(char: KanaItem) {
  selectedCharacter.value = char
  isDialogOpen.value = true
}

function toggleTheme() {
  preferences.setTheme(preferences.theme === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
    <!-- Header Hero Banner -->
    <div
      class="relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-slate-700 bg-amber-400 dark:bg-slate-900 text-slate-950 dark:text-slate-100 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#f59e0b]"
    >
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-xs font-mono font-black uppercase bg-white dark:bg-slate-800 border-[2px] border-slate-950 dark:border-slate-400">
              {{ $t('yoonPreview.laboratoryBadge') }}
            </span>
            <span class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-400">
              {{ $t('yoonPreview.previewSubtitle') }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            {{ $t('yoonPreview.title') }}
          </h1>
          <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-300 leading-relaxed">
            {{ $t('yoonPreview.desc') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            @click="activeScript = activeScript === 'hiragana' ? 'katakana' : 'hiragana'"
            class="px-3.5 py-2 font-black text-xs uppercase tracking-wider bg-white dark:bg-slate-800 text-slate-950 dark:text-white border-[3px] border-slate-950 dark:border-slate-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-amber-100 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            {{ $t('yoonPreview.switchScript') }}: {{ activeScript === 'hiragana' ? 'Hiragana' : 'Katakana' }}
          </button>

          <button
            type="button"
            @click="toggleTheme"
            class="p-2 bg-white dark:bg-slate-800 text-slate-950 dark:text-white border-[3px] border-slate-950 dark:border-slate-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-amber-100 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            :title="$t('yoonPreview.themeToggle')"
          >
            <Sun v-if="preferences.theme === 'dark'" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-slate-900" />
          </button>

          <RouterLink
            to="/chart"
            class="flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-wider bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-[3px] border-slate-950 dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-slate-800 dark:hover:bg-slate-200 active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>{{ $t('yoonPreview.backToChart') }}</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Benchmark: Gojuon Reference Row -->
    <div class="bg-violet-50 dark:bg-slate-900/90 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6] space-y-3">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h2 class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
          {{ $t('yoonPreview.referenceTitle') }}
        </h2>
        <span class="text-[10px] font-bold text-slate-500 hidden sm:inline">
          — {{ $t('yoonPreview.referenceSubtitle') }}
        </span>
      </div>

      <!-- Reference Row Rendering (Same scale as Gojuon Split Grid) -->
      <div class="max-w-xl">
        <div class="hidden sm:flex gap-2 sm:gap-3 items-center border-b-[2px] border-slate-950 dark:border-slate-800 pb-2 mb-2">
          <div class="w-14 sm:w-16 shrink-0 font-mono text-[10px] font-black text-slate-400 uppercase">
            {{ $t('yoonPreview.vowelHeader') }}
          </div>
          <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 text-center font-black text-xs text-slate-500 uppercase">
            <span>A</span>
            <span>I</span>
            <span>U</span>
            <span>E</span>
            <span>O</span>
          </div>
        </div>
        <div v-if="referenceGojuonRow" class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
          <div class="w-14 sm:w-16 shrink-0 font-black uppercase text-[11px] sm:text-xs tracking-wider text-slate-500 text-left">
            {{ $t('rows.' + referenceGojuonRow.rowName) }}
          </div>
          <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 w-full">
            <KanaCard
              v-for="char in referenceGojuonRow.chars"
              :key="char?.id"
              :character="char!"
              @click="selectCharacter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Option Selector Tabs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4" role="tablist">
      <!-- Opsi 1 Button -->
      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'opt1'"
        @click="activeOption = 'opt1'"
        class="text-left p-4 rounded-none border-[3px] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer space-y-1.5"
        :class="activeOption === 'opt1'
          ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 border-slate-950 dark:border-slate-200 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b]'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#1e293b] hover:bg-amber-50 dark:hover:bg-slate-800'"
      >
        <div class="flex items-center justify-between">
          <span class="font-black text-xs sm:text-sm uppercase tracking-wider">
            {{ $t('yoonPreview.opt1Title') }}
          </span>
          <span class="px-1.5 py-0.5 text-[9px] font-mono font-black uppercase bg-emerald-300 text-emerald-950 border border-slate-950">
            {{ $t('yoonPreview.opt1Badge') }}
          </span>
        </div>
        <p class="text-[11px] font-bold opacity-80 leading-relaxed">
          {{ $t('yoonPreview.opt1Desc') }}
        </p>
      </button>

      <!-- Opsi 2 Button -->
      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'opt2'"
        @click="activeOption = 'opt2'"
        class="text-left p-4 rounded-none border-[3px] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer space-y-1.5"
        :class="activeOption === 'opt2'
          ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 border-slate-950 dark:border-slate-200 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b]'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#1e293b] hover:bg-amber-50 dark:hover:bg-slate-800'"
      >
        <div class="flex items-center justify-between">
          <span class="font-black text-xs sm:text-sm uppercase tracking-wider">
            {{ $t('yoonPreview.opt2Title') }}
          </span>
          <span class="px-1.5 py-0.5 text-[9px] font-mono font-black uppercase bg-sky-300 text-sky-950 border border-slate-950">
            {{ $t('yoonPreview.opt2Badge') }}
          </span>
        </div>
        <p class="text-[11px] font-bold opacity-80 leading-relaxed">
          {{ $t('yoonPreview.opt2Desc') }}
        </p>
      </button>

      <!-- Opsi 3 Button -->
      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'opt3'"
        @click="activeOption = 'opt3'"
        class="text-left p-4 rounded-none border-[3px] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer space-y-1.5"
        :class="activeOption === 'opt3'
          ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 border-slate-950 dark:border-slate-200 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b]'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#1e293b] hover:bg-amber-50 dark:hover:bg-slate-800'"
      >
        <div class="flex items-center justify-between">
          <span class="font-black text-xs sm:text-sm uppercase tracking-wider">
            {{ $t('yoonPreview.opt3Title') }}
          </span>
          <span class="px-1.5 py-0.5 text-[9px] font-mono font-black uppercase bg-slate-200 text-slate-950 border border-slate-950">
            {{ $t('yoonPreview.opt3Badge') }}
          </span>
        </div>
        <p class="text-[11px] font-bold opacity-80 leading-relaxed">
          {{ $t('yoonPreview.opt3Desc') }}
        </p>
      </button>
    </div>

    <!-- Active Option Arena Content -->
    <div>
      <!-- ============================================== -->
      <!-- OPSI 1: 3-KOLOM SPLIT GRID (RECOMMENDED)       -->
      <!-- ============================================== -->
      <div v-if="activeOption === 'opt1'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          <!-- Kolom 1 (4 baris: K, S, T, N) -->
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-2 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-2 mb-2">
              <div class="w-14 shrink-0"></div>
              <div class="grid grid-cols-3 gap-2 flex-1 text-center font-black text-xs text-slate-500 uppercase">
                <span>YA</span>
                <span>YU</span>
                <span>YO</span>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="row in opt1Col1" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div class="w-14 shrink-0 font-black uppercase text-[11px] tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-3 gap-2 flex-1 w-full">
                  <KanaCard v-for="char in row.chars" :key="char.id" :character="char" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom 2 (4 baris: H, M, R, G) -->
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-2 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-2 mb-2">
              <div class="w-14 shrink-0"></div>
              <div class="grid grid-cols-3 gap-2 flex-1 text-center font-black text-xs text-slate-500 uppercase">
                <span>YA</span>
                <span>YU</span>
                <span>YO</span>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="row in opt1Col2" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div class="w-14 shrink-0 font-black uppercase text-[11px] tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-3 gap-2 flex-1 w-full">
                  <KanaCard v-for="char in row.chars" :key="char.id" :character="char" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom 3 (3 baris: Z, B, P + Info Box) -->
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-2 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-2 mb-2">
              <div class="w-14 shrink-0"></div>
              <div class="grid grid-cols-3 gap-2 flex-1 text-center font-black text-xs text-slate-500 uppercase">
                <span>YA</span>
                <span>YU</span>
                <span>YO</span>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="row in opt1Col3" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div class="w-14 shrink-0 font-black uppercase text-[11px] tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-3 gap-2 flex-1 w-full">
                  <KanaCard v-for="char in row.chars" :key="char.id" :character="char" @click="selectCharacter" />
                </div>
              </div>
            </div>

            <!-- Balanced 1 Mora Tip Box -->
            <div class="border-[2px] border-slate-950 dark:border-slate-700 bg-amber-50 dark:bg-slate-800/80 p-3 rounded-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#f59e0b] mt-2">
              <div class="flex items-center gap-1.5 mb-1">
                <Info class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {{ $t('yoonPreview.yoonTipTitle') }}
                </span>
              </div>
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ $t('yoonPreview.yoonTipDesc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- OPSI 2: 5-KOLOM ALIGNED GRID (MATHEMATICAL)   -->
      <!-- ============================================== -->
      <div v-else-if="activeOption === 'opt2'" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <!-- Kolom Kiri 5-Slot -->
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-2 sm:gap-3 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-2">
              <div class="w-14 sm:w-16 shrink-0"></div>
              <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
                <span>YA</span>
                <span>—</span>
                <span>YU</span>
                <span>—</span>
                <span>YO</span>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div v-for="row in opt2Left" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                <div class="w-14 sm:w-16 shrink-0 font-black uppercase text-[11px] sm:text-xs tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 w-full">
                  <KanaCard v-if="row.chars[0]" :character="row.chars[0]" @click="selectCharacter" />
                  <div class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-dashed border-slate-300 dark:border-slate-700 rounded-none flex items-center justify-center opacity-30 text-xs font-black text-slate-400">
                    —
                  </div>
                  <KanaCard v-if="row.chars[1]" :character="row.chars[1]" @click="selectCharacter" />
                  <div class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-dashed border-slate-300 dark:border-slate-700 rounded-none flex items-center justify-center opacity-30 text-xs font-black text-slate-400">
                    —
                  </div>
                  <KanaCard v-if="row.chars[2]" :character="row.chars[2]" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom Kanan 5-Slot -->
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-2 sm:gap-3 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-2">
              <div class="w-14 sm:w-16 shrink-0"></div>
              <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
                <span>YA</span>
                <span>—</span>
                <span>YU</span>
                <span>—</span>
                <span>YO</span>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div v-for="row in opt2Right" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                <div class="w-14 sm:w-16 shrink-0 font-black uppercase text-[11px] sm:text-xs tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-5 gap-1.5 sm:gap-2.5 flex-1 w-full">
                  <KanaCard v-if="row.chars[0]" :character="row.chars[0]" @click="selectCharacter" />
                  <div class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-dashed border-slate-300 dark:border-slate-700 rounded-none flex items-center justify-center opacity-30 text-xs font-black text-slate-400">
                    —
                  </div>
                  <KanaCard v-if="row.chars[1]" :character="row.chars[1]" @click="selectCharacter" />
                  <div class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-dashed border-slate-300 dark:border-slate-700 rounded-none flex items-center justify-center opacity-30 text-xs font-black text-slate-400">
                    —
                  </div>
                  <KanaCard v-if="row.chars[2]" :character="row.chars[2]" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- OPSI 3: 2-KOLOM BASELINE (UKURAN SAAT INI)     -->
      <!-- ============================================== -->
      <div v-else-if="activeOption === 'opt3'" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
              <div class="w-16 sm:w-20 shrink-0"></div>
              <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase">
                <span>YA</span>
                <span>YU</span>
                <span>YO</span>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="row in opt2Left" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <div class="w-16 sm:w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 w-full">
                  <KanaCard v-for="char in row.chars" :key="char.id" :character="char" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b] space-y-4">
            <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
              <div class="w-16 sm:w-20 shrink-0"></div>
              <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase">
                <span>YA</span>
                <span>YU</span>
                <span>YO</span>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="row in opt2Right" :key="row.rowName" class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <div class="w-16 sm:w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                  {{ $t('rows.' + row.rowName) }}
                </div>
                <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 w-full">
                  <KanaCard v-for="char in row.chars" :key="char.id" :character="char" @click="selectCharacter" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Kana Stroke Detail Dialog -->
    <KanaDetailDialog v-model:open="isDialogOpen" :character="selectedCharacter" />
  </div>
</template>
