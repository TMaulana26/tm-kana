<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowLeft, BookOpen, Columns, Grid3x3, AlignCenter, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-vue-next'
import { kanaData, type KanaItem } from '@/constants/kanaData'
import { groupKanaData } from '@/utils/kana'
import KanaCard from '@/components/KanaCard.vue'
import KanaDetailDialog from '@/components/KanaDetailDialog.vue'
import { usePreferencesStore } from '@/stores/preferences'

useI18n()
const preferencesStore = usePreferencesStore()

type LayoutOption = 'bento' | 'split' | 'pattern' | 'compact'
const activeOption = ref<LayoutOption>('bento')
const activeTab = ref<'hiragana' | 'katakana'>('hiragana')

const selectedCharacter = ref<KanaItem | null>(null)
const isDialogOpen = ref(false)

const hiraganaGroups = computed(() => groupKanaData(kanaData.hiragana))
const katakanaGroups = computed(() => groupKanaData(kanaData.katakana))

const currentYoonRows = computed(() => {
  return activeTab.value === 'hiragana' ? hiraganaGroups.value.yoon : katakanaGroups.value.yoon
})

// For split grid: split rows into left and right columns
const splitYoonLeft = computed(() => {
  const rows = currentYoonRows.value
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(0, mid)
})

const splitYoonRight = computed(() => {
  const rows = currentYoonRows.value
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(mid)
})

function selectCharacter(char: KanaItem) {
  selectedCharacter.value = char
  isDialogOpen.value = true
}

const watermarkAksara = computed(() => {
  return activeTab.value === 'hiragana' ? 'きゃしゃ' : 'キャシャ'
})
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
    <!-- Navigation & Quick Controls Header -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <RouterLink
        to="/chart"
        class="inline-flex items-center gap-2 px-4 py-2 font-black text-xs md:text-sm uppercase tracking-wider bg-white dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#8b5cf6] hover:bg-violet-100 dark:hover:bg-violet-950/40 transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>{{ $t('yoonPreview.backToChart') }}</span>
      </RouterLink>

      <div class="flex items-center gap-3">
        <!-- Script Toggle (Hiragana / Katakana) -->
        <div class="flex border-[3px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#8b5cf6]">
          <button
            type="button"
            @click="activeTab = 'hiragana'"
            class="px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-colors"
            :class="activeTab === 'hiragana' ? 'bg-[#ff007f] text-white' : 'text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            {{ $t('chart.hiragana') }}
          </button>
          <button
            type="button"
            @click="activeTab = 'katakana'"
            class="px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-colors"
            :class="activeTab === 'katakana' ? 'bg-[#ff007f] text-white' : 'text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            {{ $t('chart.katakana') }}
          </button>
        </div>

        <!-- Quick Theme Toggle -->
        <button
          type="button"
          @click="preferencesStore.toggleTheme"
          class="p-2 border-[3px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#8b5cf6] hover:bg-amber-100 dark:hover:bg-slate-800 transition-all active:translate-x-0.5 active:translate-y-0.5"
          :title="preferencesStore.theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
        >
          <Sun v-if="preferencesStore.theme === 'dark'" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-violet-600" />
        </button>
      </div>
    </div>

    <!-- Hero Title Banner -->
    <div
      class="relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-slate-700 bg-[#ffbe0b] dark:bg-slate-900 text-slate-950 dark:text-slate-100 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b]"
    >
      <div class="relative z-10 space-y-2 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-amber-400 dark:text-amber-950 font-black text-xs uppercase tracking-wider border-[2px] border-current">
          <Sparkles class="w-3.5 h-3.5" />
          <span>{{ $t('yoonPreview.badgeLab') }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
          {{ $t('yoonPreview.title') }}
        </h1>
        <p class="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-300 max-w-2xl leading-relaxed">
          {{ $t('yoonPreview.desc') }}
        </p>
      </div>

      <div
        class="absolute right-0 bottom-0 translate-x-1/8 translate-y-1/8 text-8xl md:text-9xl font-black text-slate-950/10 dark:text-white/5 select-none pointer-events-none font-sans"
        aria-hidden="true"
      >
        {{ watermarkAksara }}
      </div>
    </div>

    <!-- Layout Option Switcher (Tactile 4-Option Bar) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'bento'"
        @click="activeOption = 'bento'"
        class="flex flex-col items-start gap-1 p-3.5 sm:p-4 font-black text-left rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        :class="activeOption === 'bento'
          ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#f59e0b]'
          : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-amber-200 hover:text-amber-950 dark:hover:bg-amber-950 dark:hover:text-amber-100'"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider">
            <BookOpen class="w-4 h-4 shrink-0" />
            <span>{{ $t('yoonPreview.option1Tab') }}</span>
          </div>
          <span class="px-1.5 py-0.2 text-[9px] font-mono border-[2px] border-current">{{ $t('yoonPreview.recommendedBadge') }}</span>
        </div>
        <p class="text-[11px] font-medium opacity-80 line-clamp-2">
          {{ $t('yoonPreview.option1Sub') }}
        </p>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'split'"
        @click="activeOption = 'split'"
        class="flex flex-col items-start gap-1 p-3.5 sm:p-4 font-black text-left rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        :class="activeOption === 'split'
          ? 'bg-violet-400 dark:bg-violet-600 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6]'
          : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-violet-200 hover:text-violet-950 dark:hover:bg-violet-950 dark:hover:text-violet-100'"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider">
            <Columns class="w-4 h-4 shrink-0" />
            <span>{{ $t('yoonPreview.option2Tab') }}</span>
          </div>
        </div>
        <p class="text-[11px] font-medium opacity-80 line-clamp-2">
          {{ $t('yoonPreview.option2Sub') }}
        </p>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'pattern'"
        @click="activeOption = 'pattern'"
        class="flex flex-col items-start gap-1 p-3.5 sm:p-4 font-black text-left rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        :class="activeOption === 'pattern'
          ? 'bg-indigo-400 dark:bg-indigo-600 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#6366f1]'
          : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-indigo-200 hover:text-indigo-950 dark:hover:bg-indigo-950 dark:hover:text-indigo-100'"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider">
            <Grid3x3 class="w-4 h-4 shrink-0" />
            <span>{{ $t('yoonPreview.option3Tab') }}</span>
          </div>
        </div>
        <p class="text-[11px] font-medium opacity-80 line-clamp-2">
          {{ $t('yoonPreview.option3Sub') }}
        </p>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="activeOption === 'compact'"
        @click="activeOption = 'compact'"
        class="flex flex-col items-start gap-1 p-3.5 sm:p-4 font-black text-left rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        :class="activeOption === 'compact'
          ? 'bg-emerald-400 dark:bg-emerald-600 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#10b981]'
          : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-emerald-200 hover:text-emerald-950 dark:hover:bg-emerald-950 dark:hover:text-emerald-100'"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider">
            <AlignCenter class="w-4 h-4 shrink-0" />
            <span>{{ $t('yoonPreview.option4Tab') }}</span>
          </div>
        </div>
        <p class="text-[11px] font-medium opacity-80 line-clamp-2">
          {{ $t('yoonPreview.option4Sub') }}
        </p>
      </button>
    </div>

    <!-- Active Option Description Card -->
    <div class="p-4 sm:p-5 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
          <CheckCircle2 class="w-5 h-5 text-emerald-500" />
          <span>{{ $t(`yoonPreview.option${activeOption === 'bento' ? '1' : activeOption === 'split' ? '2' : activeOption === 'pattern' ? '3' : '4'}Title`) }}</span>
        </h2>
        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
          {{ $t(`yoonPreview.option${activeOption === 'bento' ? '1' : activeOption === 'split' ? '2' : activeOption === 'pattern' ? '3' : '4'}Desc`) }}
        </p>
      </div>
      <div class="shrink-0 flex items-center gap-2">
        <span class="px-3 py-1 text-xs font-mono font-black uppercase tracking-wider border-[2px] border-slate-950 dark:border-slate-700 bg-amber-200 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
          {{ $t('yoonPreview.liveRenderBadge') }}
        </span>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PREVIEW AREA: OPTION 1 - BENTO BOX SIDE PANEL (RECOMMENDED)              -->
    <!-- ========================================================================= -->
    <section v-if="activeOption === 'bento'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Side: Yoon Cards (Exact Same Scale as Gojuon/Dakuon) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b] space-y-4">
          <!-- Header YA, YU, YO -->
          <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
            <div class="w-20 shrink-0"></div>
            <div class="grid grid-cols-3 gap-3 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
              <span>YA</span>
              <span>YU</span>
              <span>YO</span>
            </div>
          </div>

          <!-- Rows -->
          <div class="space-y-4">
            <div
              v-for="row in currentYoonRows"
              :key="row.rowName"
              class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
            >
              <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                {{ $t('rows.' + row.rowName) }}
              </div>
              <div class="grid grid-cols-3 gap-3 flex-1 w-full">
                <KanaCard
                  v-for="char in row.chars"
                  :key="char.id"
                  :character="char"
                  @click="selectCharacter"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Educational Bento Box Panel (Fills the 40% Space) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Bento Card 1: Formula -->
          <div class="p-5 bg-[#ffbe0b] text-black border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000]">
            <div class="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider">
              <Sparkles class="w-4 h-4" />
              <span>{{ $t('yoonPreview.bentoFormulaTitle') }}</span>
            </div>
            <div class="p-3 bg-white border-[2px] border-slate-950 font-mono text-center text-sm font-black mb-2 shadow-[2px_2px_0px_0px_#000]">
              {{ $t('yoonPreview.formulaVisual') }}
            </div>
            <p class="text-xs font-bold leading-relaxed">
              {{ $t('yoonPreview.bentoFormulaDesc') }}
            </p>
          </div>

          <!-- Bento Card 2: 1-Mora Rule -->
          <div class="p-5 bg-white dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6]">
            <h3 class="font-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2 text-black dark:text-white">
              <BookOpen class="w-4 h-4 text-indigo-500" />
              <span>{{ $t('yoonPreview.bentoRuleTitle') }}</span>
            </h3>
            <p class="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">
              {{ $t('yoonPreview.bentoRuleDesc') }}
            </p>
          </div>

          <!-- Bento Card 3: Size & Proportion -->
          <div class="p-5 bg-white dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#10b981]">
            <h3 class="font-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2 text-black dark:text-white">
              <Grid3x3 class="w-4 h-4 text-emerald-500" />
              <span>{{ $t('yoonPreview.bentoSizeTitle') }}</span>
            </h3>
            <p class="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">
              {{ $t('yoonPreview.bentoSizeDesc') }}
            </p>
          </div>

          <!-- Bento Card 4: Total Stats Badge -->
          <div class="p-4 bg-[#00f5d4] text-black border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
            <div>
              <span class="block font-black text-xs uppercase tracking-wider">{{ $t('yoonPreview.bentoStatTitle') }}</span>
              <span class="text-[11px] font-bold">{{ $t('yoonPreview.bentoStatDesc') }}</span>
            </div>
            <span class="text-3xl font-mono font-black">33</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- PREVIEW AREA: OPTION 2 - SPLIT 2-COLUMN GRID (SIDE BY SIDE)              -->
    <!-- ========================================================================= -->
    <section v-else-if="activeOption === 'split'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Left Column -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#8b5cf6] space-y-4">
          <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
            <div class="w-16 shrink-0"></div>
            <div class="grid grid-cols-3 gap-2.5 flex-1 text-center font-black text-xs text-slate-500 uppercase tracking-wider">
              <span>YA</span>
              <span>YU</span>
              <span>YO</span>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="row in splitYoonLeft"
              :key="row.rowName"
              class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center"
            >
              <div class="w-16 shrink-0 font-black uppercase text-[11px] tracking-wider text-slate-500 text-left">
                {{ $t('rows.' + row.rowName) }}
              </div>
              <div class="grid grid-cols-3 gap-2.5 flex-1 w-full">
                <KanaCard
                  v-for="char in row.chars"
                  :key="char.id"
                  :character="char"
                  @click="selectCharacter"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#8b5cf6] space-y-4">
          <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
            <div class="w-16 shrink-0"></div>
            <div class="grid grid-cols-3 gap-2.5 flex-1 text-center font-black text-xs text-slate-500 uppercase tracking-wider">
              <span>YA</span>
              <span>YU</span>
              <span>YO</span>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="row in splitYoonRight"
              :key="row.rowName"
              class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center"
            >
              <div class="w-16 shrink-0 font-black uppercase text-[11px] tracking-wider text-slate-500 text-left">
                {{ $t('rows.' + row.rowName) }}
              </div>
              <div class="grid grid-cols-3 gap-2.5 flex-1 w-full">
                <KanaCard
                  v-for="char in row.chars"
                  :key="char.id"
                  :character="char"
                  @click="selectCharacter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- PREVIEW AREA: OPTION 3 - 5-COLUMN SYMMETRIC WITH PATTERN PLACEHOLDERS    -->
    <!-- ========================================================================= -->
    <section v-else-if="activeOption === 'pattern'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#6366f1] space-y-4">
        <!-- 5-Column Header -->
        <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
          <div class="w-20 shrink-0"></div>
          <div class="grid grid-cols-5 gap-3 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
            <span>YA</span>
            <span>YU</span>
            <span>YO</span>
            <span class="opacity-40">-</span>
            <span class="opacity-40">-</span>
          </div>
        </div>

        <!-- Rows -->
        <div class="space-y-4">
          <div
            v-for="row in currentYoonRows"
            :key="row.rowName"
            class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
          >
            <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
              {{ $t('rows.' + row.rowName) }}
            </div>
            <div class="grid grid-cols-5 gap-3 flex-1 w-full">
              <!-- 3 Yoon Cards -->
              <KanaCard
                v-for="char in row.chars"
                :key="char.id"
                :character="char"
                @click="selectCharacter"
              />

              <!-- 2 Tactile Patterned Placeholders -->
              <div
                class="aspect-square flex flex-col items-center justify-center border-[3px] border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 select-none opacity-50 transition-opacity hover:opacity-80"
              >
                <span class="font-mono text-sm font-black text-slate-400 dark:text-slate-500">—</span>
                <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                  {{ $t('yoonPreview.placeholderEmpty') }}
                </span>
              </div>

              <div
                class="aspect-square flex flex-col items-center justify-center border-[3px] border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 select-none opacity-50 transition-opacity hover:opacity-80"
              >
                <span class="font-mono text-sm font-black text-slate-400 dark:text-slate-500">—</span>
                <span class="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                  {{ $t('yoonPreview.placeholderEmpty') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- PREVIEW AREA: OPTION 4 - CENTERED COMPACT CONTAINER                      -->
    <!-- ========================================================================= -->
    <section v-else-if="activeOption === 'compact'" class="space-y-6">
      <div class="max-w-3xl mx-auto bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#10b981] space-y-4">
        <!-- 3-Column Header in Centered Box -->
        <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
          <div class="w-20 shrink-0"></div>
          <div class="grid grid-cols-3 gap-3 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
            <span>YA</span>
            <span>YU</span>
            <span>YO</span>
          </div>
        </div>

        <!-- Rows -->
        <div class="space-y-4">
          <div
            v-for="row in currentYoonRows"
            :key="row.rowName"
            class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
          >
            <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
              {{ $t('rows.' + row.rowName) }}
            </div>
            <div class="grid grid-cols-3 gap-3 flex-1 w-full">
              <KanaCard
                v-for="char in row.chars"
                :key="char.id"
                :character="char"
                @click="selectCharacter"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Details Dialog (Interactive Writing & Stroke Order) -->
    <KanaDetailDialog v-model:open="isDialogOpen" :character="selectedCharacter" />
  </div>
</template>
