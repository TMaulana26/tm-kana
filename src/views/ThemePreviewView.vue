<script setup lang="ts">
import { ref } from 'vue'
import {
  Palette,
  Sparkles,
  Check,
  Layers,
  ExternalLink
} from 'lucide-vue-next'

type VibeId = 'arcade' | 'neon' | 'manga' | 'calm'

const currentVibe = ref<VibeId>('arcade')

const vibes = [
  {
    id: 'arcade' as VibeId,
    nameKey: 'themePreview.vibeArcade',
    descKey: 'themePreview.vibeArcadeDesc',
    badgeColor: 'bg-amber-400 text-black',
    tag: 'REKOMENDASI',
    accent: '#fbbf24'
  },
  {
    id: 'neon' as VibeId,
    nameKey: 'themePreview.vibeNeon',
    descKey: 'themePreview.vibeNeonDesc',
    badgeColor: 'bg-violet-400 text-black',
    tag: 'RETRO ARCADE',
    accent: '#a78bfa'
  },
  {
    id: 'manga' as VibeId,
    nameKey: 'themePreview.vibeManga',
    descKey: 'themePreview.vibeMangaDesc',
    badgeColor: 'bg-emerald-400 text-black',
    tag: 'GRAPHIC NOVEL',
    accent: '#34d399'
  },
  {
    id: 'calm' as VibeId,
    nameKey: 'themePreview.vibeCalm',
    descKey: 'themePreview.vibeCalmDesc',
    badgeColor: 'bg-slate-700 text-slate-200',
    tag: 'BASELINE',
    accent: '#64748b'
  }
]

interface DemoKanaCard {
  char: string
  romaji: string
  statusKey: string
  arcadeCardClass: string
  arcadeCharClass: string
  arcadeRomajiClass: string
  arcadeStatusClass: string
  neonCardClass: string
  neonCharClass: string
  neonRomajiClass: string
  neonStatusClass: string
  mangaCardClass: string
  mangaCharClass: string
  mangaRomajiClass: string
  calmCardClass: string
  calmCharClass: string
  calmRomajiClass: string
}

const demoCards: DemoKanaCard[] = [
  {
    char: 'あ',
    romaji: 'A',
    statusKey: 'themePreview.unlearned',
    arcadeCardClass: 'bg-slate-900 border-[3px] border-slate-400 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
    arcadeCharClass: 'text-white',
    arcadeRomajiClass: 'text-slate-400',
    arcadeStatusClass: 'text-slate-500',
    neonCardClass: 'bg-slate-900 border-[3px] border-slate-700 shadow-[4px_4px_0px_0px_#334155] hover:shadow-[6px_6px_0px_0px_#8b5cf6]',
    neonCharClass: 'text-white',
    neonRomajiClass: 'text-slate-400',
    neonStatusClass: 'text-slate-500',
    mangaCardClass: 'bg-slate-950 border-[3px] border-slate-200 shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#fff]',
    mangaCharClass: 'text-white',
    mangaRomajiClass: 'text-slate-300',
    calmCardClass: 'bg-slate-900 border-[3px] border-slate-700 shadow-[3px_3px_0px_0px_#000]',
    calmCharClass: 'text-white',
    calmRomajiClass: 'text-slate-400'
  },
  {
    char: 'か',
    romaji: 'KA',
    statusKey: 'themePreview.learned',
    arcadeCardClass: 'bg-[#00f5d4] text-black border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
    arcadeCharClass: 'text-black',
    arcadeRomajiClass: 'text-black',
    arcadeStatusClass: 'text-black',
    neonCardClass: 'bg-slate-900 border-[3px] border-emerald-400 shadow-[4px_4px_0px_0px_#10b981] hover:shadow-[6px_6px_0px_0px_#34d399]',
    neonCharClass: 'text-emerald-300',
    neonRomajiClass: 'text-emerald-400',
    neonStatusClass: 'text-emerald-400',
    mangaCardClass: 'bg-white text-black border-[3px] border-slate-200 shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#fff]',
    mangaCharClass: 'text-black',
    mangaRomajiClass: 'text-black',
    calmCardClass: 'bg-emerald-900 border-[3px] border-slate-700 shadow-[3px_3px_0px_0px_#000]',
    calmCharClass: 'text-emerald-100',
    calmRomajiClass: 'text-emerald-300'
  },
  {
    char: 'さ',
    romaji: 'SA',
    statusKey: 'themePreview.quizMastered',
    arcadeCardClass: 'bg-[#c084fc] text-black border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
    arcadeCharClass: 'text-black',
    arcadeRomajiClass: 'text-black',
    arcadeStatusClass: 'text-black',
    neonCardClass: 'bg-slate-900 border-[3px] border-violet-400 shadow-[4px_4px_0px_0px_#8b5cf6] hover:shadow-[6px_6px_0px_0px_#a78bfa]',
    neonCharClass: 'text-violet-300',
    neonRomajiClass: 'text-violet-400',
    neonStatusClass: 'text-violet-400',
    mangaCardClass: 'bg-yellow-300 text-black border-[3px] border-slate-200 shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#fff]',
    mangaCharClass: 'text-black',
    mangaRomajiClass: 'text-black',
    calmCardClass: 'bg-violet-900 border-[3px] border-slate-700 shadow-[3px_3px_0px_0px_#000]',
    calmCharClass: 'text-violet-100',
    calmRomajiClass: 'text-violet-300'
  },
  {
    char: 'た',
    romaji: 'TA',
    statusKey: 'themePreview.drawMastered',
    arcadeCardClass: 'bg-[#ff9f1c] text-black border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
    arcadeCharClass: 'text-black',
    arcadeRomajiClass: 'text-black',
    arcadeStatusClass: 'text-black',
    neonCardClass: 'bg-slate-900 border-[3px] border-amber-400 shadow-[4px_4px_0px_0px_#f59e0b] hover:shadow-[6px_6px_0px_0px_#fbbf24]',
    neonCharClass: 'text-amber-300',
    neonRomajiClass: 'text-amber-400',
    neonStatusClass: 'text-amber-400',
    mangaCardClass: 'bg-rose-400 text-black border-[3px] border-slate-200 shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#fff]',
    mangaCharClass: 'text-black',
    mangaRomajiClass: 'text-black',
    calmCardClass: 'bg-amber-900 border-[3px] border-slate-700 shadow-[3px_3px_0px_0px_#000]',
    calmCharClass: 'text-amber-100',
    calmRomajiClass: 'text-amber-300'
  },
  {
    char: 'な',
    romaji: 'NA',
    statusKey: 'themePreview.ultimate',
    arcadeCardClass: 'bg-[#ff007f] text-white border-[3px] border-slate-950 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
    arcadeCharClass: 'text-white',
    arcadeRomajiClass: 'text-rose-100',
    arcadeStatusClass: 'text-white',
    neonCardClass: 'bg-slate-900 border-[3px] border-rose-400 shadow-[4px_4px_0px_0px_#ef4444] hover:shadow-[6px_6px_0px_0px_#f87171]',
    neonCharClass: 'text-rose-300',
    neonRomajiClass: 'text-rose-400',
    neonStatusClass: 'text-rose-400',
    mangaCardClass: 'bg-cyan-300 text-black border-[3px] border-slate-200 shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#fff]',
    mangaCharClass: 'text-black',
    mangaRomajiClass: 'text-black',
    calmCardClass: 'bg-slate-800 border-[3px] border-slate-700 shadow-[3px_3px_0px_0px_#000]',
    calmCharClass: 'text-white',
    calmRomajiClass: 'text-slate-400'
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 min-h-[85vh]">
    <!-- Header Banner -->
    <header class="p-6 sm:p-8 border-[4px] border-slate-950 dark:border-slate-700 bg-amber-300 dark:bg-slate-900 shadow-[6px_6px_0px_0px_#000] space-y-3">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-slate-950 text-amber-300 border-[2px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000]">
          <Palette class="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            {{ $t('themePreview.title') }}
          </h1>
          <p class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-300">
            {{ $t('themePreview.desc') }}
          </p>
        </div>
      </div>
    </header>

    <!-- Vibe Selector Bar -->
    <section class="space-y-3">
      <h2 class="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-amber-500" />
        {{ $t('themePreview.selectVibe') }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="vibe in vibes"
          :key="vibe.id"
          type="button"
          @click="currentVibe = vibe.id"
          class="p-4 text-left border-[3px] transition-all relative flex flex-col justify-between select-none"
          :class="[
            currentVibe === vibe.id
              ? 'border-slate-950 dark:border-amber-400 bg-white dark:bg-slate-900 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fbbf24] -translate-y-1'
              : 'border-slate-950/40 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 opacity-70 hover:opacity-100 hover:border-slate-950 dark:hover:border-slate-600 shadow-[2px_2px_0px_0px_#000]'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[9px] font-black uppercase px-2 py-0.5 border border-slate-950 shadow-[1px_1px_0px_0px_#000]" :class="vibe.badgeColor">
                {{ vibe.tag }}
              </span>
              <Check v-if="currentVibe === vibe.id" class="w-4 h-4 text-emerald-500 stroke-[3]" />
            </div>
            <h3 class="font-black text-sm uppercase text-slate-950 dark:text-white">
              {{ $t(vibe.nameKey) }}
            </h3>
            <p class="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug">
              {{ $t(vibe.descKey) }}
            </p>
          </div>
        </button>
      </div>
    </section>

    <!-- Interactive Vibe Arena (Live Simulation Container) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {{ $t('themePreview.interactiveShowcase') }}
        </h2>
        <span class="text-xs font-semibold text-slate-500 italic">
          {{ $t('themePreview.hoverHint') }}
        </span>
      </div>

      <!-- VIBE 1: Cyber / Arcade Pop Neo-Brutalism -->
      <div
        v-if="currentVibe === 'arcade'"
        class="p-6 sm:p-8 bg-[#161822] text-slate-100 border-[4px] border-slate-400 shadow-[8px_8px_0px_0px_#000] space-y-8 rounded-none transition-all duration-300"
      >
        <!-- Vibe Banner Badge -->
        <div class="flex items-center justify-between border-b-[3px] border-slate-400 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase tracking-wider border-[2px] border-slate-950 shadow-[3px_3px_0px_0px_#000]">
              {{ $t('themePreview.vibeArcadeBadge') }}
            </span>
            <span class="text-xs font-bold text-slate-300">
              {{ $t('themePreview.vibeArcadeSpec') }}
            </span>
          </div>
        </div>

        <!-- 1. Kana Card Grid -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Layers class="w-4 h-4" />
            {{ $t('themePreview.cardsTitle') }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div
              v-for="card in demoCards"
              :key="'arcade-' + card.char"
              class="p-4 aspect-square flex flex-col items-center justify-center hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
              :class="card.arcadeCardClass"
            >
              <span class="text-4xl font-black" :class="card.arcadeCharClass">{{ card.char }}</span>
              <span class="text-xs font-bold font-mono mt-1" :class="card.arcadeRomajiClass">{{ card.romaji }}</span>
              <span class="text-[9px] font-black uppercase mt-1" :class="card.arcadeStatusClass">{{ $t(card.statusKey) }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Action Buttons -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400">
            {{ $t('themePreview.buttonsTitle') }}
          </h3>
          <div class="flex flex-wrap gap-3">
            <button class="px-5 py-2.5 bg-amber-400 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnPrimary') }}
            </button>
            <button class="px-5 py-2.5 bg-violet-400 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnSecondary') }}
            </button>
            <button class="px-5 py-2.5 bg-emerald-400 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnSuccess') }}
            </button>
            <button class="px-5 py-2.5 bg-rose-500 text-white border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnDanger') }}
            </button>
          </div>
        </div>

        <!-- 3. Resource Link Card Demo -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400">
            {{ $t('themePreview.linkCardTitle') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="group border-[3px] border-slate-400 bg-slate-900 p-5 shadow-[5px_5px_0px_0px_#000] hover:bg-slate-800 hover:border-amber-400 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000] transition-all cursor-pointer flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="px-2.5 py-0.5 bg-violet-400 text-black font-black text-[10px] uppercase border-[2px] border-slate-950 shadow-[2px_2px_0px_0px_#000]">
                    {{ $t('themePreview.resourceTag') }}
                  </span>
                  <ExternalLink class="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <h4 class="text-lg font-black text-white group-hover:text-amber-400 transition-colors pt-1">
                  {{ $t('themePreview.resourceTitle') }}
                </h4>
                <p class="text-xs text-slate-300 group-hover:text-slate-100 leading-relaxed transition-colors">
                  {{ $t('themePreview.resourceDesc') }}
                </p>
              </div>
              <div class="pt-4 text-xs font-black uppercase tracking-wider text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                <span>{{ $t('themePreview.resourceCta') }}</span>
                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            <!-- Progress Card -->
            <div class="border-[3px] border-slate-400 bg-slate-900 p-5 shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black uppercase tracking-wider text-slate-400">
                  {{ $t('themePreview.progressLabel') }}
                </span>
                <span class="text-sm font-black text-emerald-400">82%</span>
              </div>
              <div class="w-full bg-slate-950 border-[3px] border-slate-400 h-7 overflow-hidden flex shadow-[2px_2px_0px_0px_#000]">
                <div class="bg-emerald-400 border-r-[3px] border-slate-950 w-[82%]"></div>
              </div>
              <p class="text-[10px] font-black uppercase text-slate-400">
                {{ $t('themePreview.progressSummary') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- VIBE 2: Colored Neon Offset Shadows -->
      <div
        v-else-if="currentVibe === 'neon'"
        class="p-6 sm:p-8 bg-[#0c0e14] text-slate-100 border-[4px] border-slate-600 shadow-[8px_8px_0px_0px_#f59e0b] space-y-8 rounded-none transition-all duration-300"
      >
        <div class="flex items-center justify-between border-b-[3px] border-slate-700 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-violet-400 text-black font-black text-xs uppercase tracking-wider border-[2px] border-slate-950 shadow-[3px_3px_0px_0px_#8b5cf6]">
              {{ $t('themePreview.vibeNeonBadge') }}
            </span>
            <span class="text-xs font-bold text-slate-400">
              {{ $t('themePreview.vibeNeonSpec') }}
            </span>
          </div>
        </div>

        <!-- 1. Kana Card Grid -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Layers class="w-4 h-4" />
            {{ $t('themePreview.cardsTitle') }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div
              v-for="card in demoCards"
              :key="'neon-' + card.char"
              class="p-4 aspect-square flex flex-col items-center justify-center hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
              :class="card.neonCardClass"
            >
              <span class="text-4xl font-black" :class="card.neonCharClass">{{ card.char }}</span>
              <span class="text-xs font-bold font-mono mt-1" :class="card.neonRomajiClass">{{ card.romaji }}</span>
              <span class="text-[9px] font-black uppercase mt-1" :class="card.neonStatusClass">{{ $t(card.statusKey) }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Buttons -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400">
            {{ $t('themePreview.buttonsTitle') }}
          </h3>
          <div class="flex flex-wrap gap-3">
            <button class="px-5 py-2.5 bg-amber-300 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#f59e0b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#f59e0b] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnPrimary') }}
            </button>
            <button class="px-5 py-2.5 bg-violet-400 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#8b5cf6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#8b5cf6] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnSecondary') }}
            </button>
            <button class="px-5 py-2.5 bg-emerald-400 text-black border-[3px] border-slate-950 font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#10b981] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#10b981] hover:-translate-y-0.5 transition-all">
              {{ $t('themePreview.btnSuccess') }}
            </button>
          </div>
        </div>

        <!-- 3. Link Card -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-amber-400">
            {{ $t('themePreview.linkCardTitle') }}
          </h3>
          <div class="border-[3px] border-slate-700 bg-slate-900 p-5 shadow-[5px_5px_0px_0px_#8b5cf6] hover:shadow-[7px_7px_0px_0px_#a78bfa] hover:border-violet-400 transition-all cursor-pointer">
            <div class="flex justify-between items-center">
              <span class="px-2.5 py-0.5 bg-violet-400 text-black font-black text-[10px] uppercase border-[2px] border-slate-950 shadow-[2px_2px_0px_0px_#8b5cf6]">
                {{ $t('themePreview.resourceTag') }}
              </span>
              <ExternalLink class="w-4 h-4 text-violet-400" />
            </div>
            <h4 class="text-lg font-black text-white pt-2">
              {{ $t('themePreview.resourceTitle') }}
            </h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              {{ $t('themePreview.resourceDesc') }}
            </p>
            <div class="pt-4 text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <span>{{ $t('themePreview.resourceCta') }}</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VIBE 3: High-Contrast Manga Lineart -->
      <div
        v-else-if="currentVibe === 'manga'"
        class="p-6 sm:p-8 bg-[#090a0f] text-slate-100 border-[4px] border-slate-200 shadow-[8px_8px_0px_0px_#fff] space-y-8 rounded-none transition-all duration-300"
      >
        <div class="flex items-center justify-between border-b-[3px] border-slate-200 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-white text-slate-950 font-black text-xs uppercase tracking-wider border-[2px] border-slate-950 shadow-[3px_3px_0px_0px_#000]">
              {{ $t('themePreview.vibeMangaBadge') }}
            </span>
            <span class="text-xs font-bold text-slate-300">
              {{ $t('themePreview.vibeMangaSpec') }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div
            v-for="card in demoCards"
            :key="'manga-' + card.char"
            class="p-4 aspect-square flex flex-col items-center justify-center hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-pointer"
            :class="card.mangaCardClass"
          >
            <span class="text-4xl font-black" :class="card.mangaCharClass">{{ card.char }}</span>
            <span class="text-xs font-bold font-mono mt-1" :class="card.mangaRomajiClass">{{ card.romaji }}</span>
          </div>
        </div>
      </div>

      <!-- VIBE 4: Current Soft Dark (Baseline) -->
      <div
        v-else-if="currentVibe === 'calm'"
        class="p-6 sm:p-8 bg-[#0c0e14] text-slate-100 border-[3px] border-slate-700 shadow-[6px_6px_0px_0px_#000] space-y-8 rounded-none transition-all duration-300"
      >
        <div class="flex items-center justify-between border-b-[3px] border-slate-700 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-slate-800 text-slate-200 font-black text-xs uppercase tracking-wider border-[2px] border-slate-700 shadow-[2px_2px_0px_0px_#000]">
              {{ $t('themePreview.vibeCalmBadge') }}
            </span>
            <span class="text-xs font-bold text-slate-400">
              {{ $t('themePreview.vibeCalmSpec') }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div
            v-for="card in demoCards"
            :key="'calm-' + card.char"
            class="p-4 aspect-square flex flex-col items-center justify-center"
            :class="card.calmCardClass"
          >
            <span class="text-4xl font-black" :class="card.calmCharClass">{{ card.char }}</span>
            <span class="text-xs font-bold font-mono mt-1" :class="card.calmRomajiClass">{{ card.romaji }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
