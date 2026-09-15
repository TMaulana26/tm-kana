<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { kanaData, type KanaItem } from '@/constants/kanaData'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import KanaCard from '@/components/KanaCard.vue'
import KanaDetailDialog from '@/components/KanaDetailDialog.vue'
import { groupKanaData } from '@/utils/kana'

useI18n()

type KanaGroupTab = 'gojuon' | 'dakuon' | 'yoon'

const activeTab = ref('hiragana')
const activeGroup = ref<KanaGroupTab>('gojuon')
const selectedCharacter = ref<KanaItem | null>(null)
const isDialogOpen = ref(false)

const hiraganaGroups = computed(() => groupKanaData(kanaData.hiragana))
const katakanaGroups = computed(() => groupKanaData(kanaData.katakana))

const splitHiraganaYoonLeft = computed(() => {
  const rows = hiraganaGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(0, mid)
})

const splitHiraganaYoonRight = computed(() => {
  const rows = hiraganaGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(mid)
})

const splitKatakanaYoonLeft = computed(() => {
  const rows = katakanaGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(0, mid)
})

const splitKatakanaYoonRight = computed(() => {
  const rows = katakanaGroups.value.yoon
  const mid = Math.ceil(rows.length / 2)
  return rows.slice(mid)
})

const watermarkText = computed(() => {
  if (activeTab.value === 'hiragana') {
    if (activeGroup.value === 'dakuon') return 'がざだば'
    if (activeGroup.value === 'yoon') return 'きゃしゃ'
    return 'あいうえお'
  } else {
    if (activeGroup.value === 'dakuon') return 'ガザダバ'
    if (activeGroup.value === 'yoon') return 'キャシャ'
    return 'アイウエオ'
  }
})

function selectCharacter(char: KanaItem) {
  selectedCharacter.value = char
  isDialogOpen.value = true
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div
      class="animate-hero-stamp relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-slate-700 bg-[#00f5d4] dark:bg-slate-900 text-slate-950 dark:text-slate-100 p-8 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#8b5cf6]"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.04),transparent)]"></div>
      <div class="relative z-10 space-y-2 max-w-3xl">
        <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
          {{ $t('chart.title') }}
        </h1>
        <p class="text-sm md:text-base font-bold text-slate-900 dark:text-slate-300 max-w-3xl leading-relaxed">
          {{ $t('chart.desc') }}
        </p>
      </div>

      <!-- Background Decorative Aksara with subtle ambient drift -->
      <div
        class="animate-watermark-float absolute right-0 bottom-0 translate-x-1/8 translate-y-1/8 text-8xl md:text-9xl font-black text-slate-950/10 dark:text-white/5 select-none pointer-events-none font-sans"
        aria-hidden="true"
      >
        {{ watermarkText }}
      </div>
    </div>

    <!-- Tabs Section -->
    <Tabs default-value="hiragana" v-model="activeTab" class="w-full">
      <TabsList
        class="animate-tabs-bar w-full grid grid-cols-2 h-14 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-1 rounded-none shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6] mb-6"
      >
        <TabsTrigger
          value="hiragana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-violet-600 dark:data-active:text-white"
        >
          {{ $t('chart.hiragana') }}
        </TabsTrigger>
        <TabsTrigger
          value="katakana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-violet-600 dark:data-active:text-white"
        >
          {{ $t('chart.katakana') }}
        </TabsTrigger>
      </TabsList>

      <!-- Secondary Category Sub-Tabs (Gojuon / Dakuon / Yoon) -->
      <div class="animate-tabs-bar grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8" role="tablist">
        <button
          type="button"
          role="tab"
          :aria-selected="activeGroup === 'gojuon'"
          @click="activeGroup = 'gojuon'"
          class="flex items-center justify-between sm:justify-center gap-2.5 px-4 py-3 font-black text-xs md:text-sm uppercase tracking-wider rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          :class="activeGroup === 'gojuon'
            ? 'bg-violet-400 dark:bg-violet-600 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6]'
            : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-violet-200 hover:text-violet-950 dark:hover:bg-violet-950 dark:hover:text-violet-100'"
        >
          <span>{{ $t('chart.gojuon') }}</span>
          <span
            class="px-2 py-0.5 text-[10px] font-mono font-black border-[2px] border-current"
            :class="activeGroup === 'gojuon' ? 'bg-white/30 dark:bg-black/30 text-current' : 'bg-white dark:bg-slate-800 text-black dark:text-white'"
          >
            46
          </span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="activeGroup === 'dakuon'"
          @click="activeGroup = 'dakuon'"
          class="flex items-center justify-between sm:justify-center gap-2.5 px-4 py-3 font-black text-xs md:text-sm uppercase tracking-wider rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          :class="activeGroup === 'dakuon'
            ? 'bg-indigo-400 dark:bg-indigo-600 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#6366f1]'
            : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-indigo-200 hover:text-indigo-950 dark:hover:bg-indigo-950 dark:hover:text-indigo-100'"
        >
          <span>{{ $t('chart.dakuon') }}</span>
          <span
            class="px-2 py-0.5 text-[10px] font-mono font-black border-[2px] border-current"
            :class="activeGroup === 'dakuon' ? 'bg-white/30 dark:bg-black/30 text-current' : 'bg-white dark:bg-slate-800 text-black dark:text-white'"
          >
            25
          </span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="activeGroup === 'yoon'"
          @click="activeGroup = 'yoon'"
          class="flex items-center justify-between sm:justify-center gap-2.5 px-4 py-3 font-black text-xs md:text-sm uppercase tracking-wider rounded-none transition-all duration-150 transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          :class="activeGroup === 'yoon'
            ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 dark:text-amber-950 border-[3px] border-slate-950 dark:border-slate-200 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#f59e0b]'
            : 'bg-[#f4f3ec] dark:bg-slate-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#1e293b] hover:bg-amber-200 hover:text-amber-950 dark:hover:bg-amber-950 dark:hover:text-amber-100'"
        >
          <span>{{ $t('chart.yoon') }}</span>
          <span
            class="px-2 py-0.5 text-[10px] font-mono font-black border-[2px] border-current"
            :class="activeGroup === 'yoon' ? 'bg-white/30 dark:bg-black/30 text-current' : 'bg-white dark:bg-slate-800 text-black dark:text-white'"
          >
            33
          </span>
        </button>
      </div>

      <!-- Tabs Contents -->
      <template v-for="tabKey in ['hiragana', 'katakana']" :key="tabKey">
        <TabsContent :value="tabKey" class="space-y-8 outline-hidden">
          <!-- Gojuon Section -->
          <section v-if="activeGroup === 'gojuon'" class="space-y-6 animate-section-content">
            <h2
              class="animate-badge-pop text-xl md:text-2xl font-black uppercase tracking-wider bg-violet-300 dark:bg-violet-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#8b5cf6]"
            >
              {{ $t('chart.gojuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#8b5cf6]">
              <!-- Grid Header columns: Vowels (A, I, U, E, O) -->
              <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
                <div class="w-20 shrink-0"></div>
                <div class="grid grid-cols-5 gap-3 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
                  <span>A</span>
                  <span>I</span>
                  <span>U</span>
                  <span>E</span>
                  <span>O</span>
                </div>
              </div>

              <!-- Rows -->
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.gojuon : katakanaGroups.gojuon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ $t('rows.' + row.rowName) }}
                  </div>
                  <div class="grid grid-cols-5 gap-3 flex-1 w-full">
                    <template v-for="(char, idx) in row.chars" :key="idx">
                      <KanaCard v-if="char" :character="char" @click="selectCharacter" />
                      <div v-else class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-slate-200 dark:border-slate-800 rounded-none opacity-20"></div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Dakuon Section -->
          <section v-else-if="activeGroup === 'dakuon'" class="space-y-6 animate-section-content">
            <h2
              class="animate-badge-pop text-xl md:text-2xl font-black uppercase tracking-wider bg-indigo-300 dark:bg-indigo-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#6366f1]"
            >
              {{ $t('chart.dakuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#6366f1]">
              <!-- Grid Header columns: Vowels (A, I, U, E, O) -->
              <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
                <div class="w-20 shrink-0"></div>
                <div class="grid grid-cols-5 gap-3 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
                  <span>A</span>
                  <span>I</span>
                  <span>U</span>
                  <span>E</span>
                  <span>O</span>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.dakuon : katakanaGroups.dakuon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ $t('rows.' + row.rowName) }}
                  </div>
                  <div class="grid grid-cols-5 gap-3 flex-1 w-full">
                    <template v-for="(char, idx) in row.chars" :key="idx">
                      <KanaCard v-if="char" :character="char" @click="selectCharacter" />
                      <div v-else class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-slate-200 dark:border-slate-800 rounded-none opacity-20"></div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Yoon Section: Split 2-Column Grid -->
          <section v-else-if="activeGroup === 'yoon'" class="space-y-6 animate-section-content">
            <h2
              class="animate-badge-pop text-xl md:text-2xl font-black uppercase tracking-wider bg-amber-300 dark:bg-amber-900 text-black dark:text-white border-[3px] border-slate-950 dark:border-slate-700 px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b]"
            >
              {{ $t('chart.yoon') }}
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <!-- Left Column of Yoon Groups -->
              <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b] space-y-4">
                <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
                  <div class="w-16 sm:w-20 shrink-0"></div>
                  <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
                    <span>YA</span>
                    <span>YU</span>
                    <span>YO</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="row in (tabKey === 'hiragana' ? splitHiraganaYoonLeft : splitKatakanaYoonLeft)"
                    :key="row.rowName"
                    class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                  >
                    <div class="w-16 sm:w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                      {{ $t('rows.' + row.rowName) }}
                    </div>
                    <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 w-full">
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

              <!-- Right Column of Yoon Groups -->
              <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f59e0b] space-y-4">
                <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-slate-800 pb-3 mb-2">
                  <div class="w-16 sm:w-20 shrink-0"></div>
                  <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 text-center font-black text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
                    <span>YA</span>
                    <span>YU</span>
                    <span>YO</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="row in (tabKey === 'hiragana' ? splitHiraganaYoonRight : splitKatakanaYoonRight)"
                    :key="row.rowName"
                    class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                  >
                    <div class="w-16 sm:w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                      {{ $t('rows.' + row.rowName) }}
                    </div>
                    <div class="grid grid-cols-3 gap-2.5 sm:gap-3 flex-1 w-full">
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
        </TabsContent>
      </template>
    </Tabs>

    <!-- Details Dialog (Interactive Writing & Stroke Order) -->
    <KanaDetailDialog v-model:open="isDialogOpen" :character="selectedCharacter" />
  </div>
</template>

<style scoped>
/* Hero stamp entrance */
.animate-hero-stamp {
  animation: heroStamp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroStamp {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Subtle ambient watermark drift */
.animate-watermark-float {
  animation: watermarkDrift 8s ease-in-out infinite alternate;
}

@keyframes watermarkDrift {
  0% {
    transform: translate(12.5%, 12.5%) rotate(0deg);
  }
  50% {
    transform: translate(10%, 15%) rotate(-1deg);
  }
  100% {
    transform: translate(15%, 10%) rotate(1deg);
  }
}

/* Tabs list arrival */
.animate-tabs-bar {
  animation: sectionCascade 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}

/* Section content entrance */
.animate-section-content {
  animation: sectionCascade 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes sectionCascade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section title badge pop */
.animate-badge-pop {
  animation: badgePop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Prefers-reduced-motion: preserve opacity/clarity, remove motion */
@media (prefers-reduced-motion: reduce) {
  .animate-hero-stamp,
  .animate-watermark-float,
  .animate-tabs-bar,
  .animate-section-content,
  .animate-badge-pop {
    animation: none !important;
    transform: none !important;
    transition: opacity 0.15s ease !important;
  }
}
</style>
