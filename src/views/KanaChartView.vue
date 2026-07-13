<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProgressStore } from '@/stores/progress'
import { HIRAGANA_DATA, KATAKANA_DATA, type KanaCharacter } from '@/constants/kanaData'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import KanaCard from '@/components/KanaCard.vue'
import PracticeCanvas from '@/components/PracticeCanvas.vue'
import NeoBrutalistButton from '@/components/NeoBrutalistButton.vue'
import { Info, Check, Trash2 } from 'lucide-vue-next'

useI18n()
const store = useProgressStore()

const activeTab = ref('hiragana')
const selectedCharacter = ref<KanaCharacter | null>(null)
const isDialogOpen = ref(false)
const svgLoadError = ref(false)

// Helper to determine the column index for a given romaji to align Gojuon and Dakuon grids (A, I, U, E, O)
function getVowelIndex(romaji: string): number {
  if (romaji === 'n') return 4
  if (romaji.endsWith('a')) return 0
  if (romaji.endsWith('i') || romaji === 'ji') return 1
  if (romaji.endsWith('u') || romaji === 'tsu') return 2
  if (romaji.endsWith('e')) return 3
  if (romaji.endsWith('o') || romaji === 'wo') return 4
  return 0
}

// Group data by group and row
function groupKanaData(data: KanaCharacter[]) {
  const gojuonMap: Record<string, (KanaCharacter | null)[]> = {}
  const dakuonMap: Record<string, (KanaCharacter | null)[]> = {}
  const yoonMap: Record<string, KanaCharacter[]> = {}

  // Initialize rows to ensure traditional Tofugu order
  const gojuonRows = ['a', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w']
  const dakuonRows = ['g', 'z', 'd', 'b', 'p']
  const yoonRows = ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya']

  gojuonRows.forEach(row => { gojuonMap[row] = Array(5).fill(null) })
  dakuonRows.forEach(row => { dakuonMap[row] = Array(5).fill(null) })
  yoonRows.forEach(row => { yoonMap[row] = [] })

  data.forEach(item => {
    if (item.group === 'gojuon' && gojuonMap[item.row]) {
      const idx = getVowelIndex(item.romaji)
      gojuonMap[item.row][idx] = item
    } else if (item.group === 'dakuon' && dakuonMap[item.row]) {
      const idx = getVowelIndex(item.romaji)
      dakuonMap[item.row][idx] = item
    } else if (item.group === 'yoon' && yoonMap[item.row]) {
      yoonMap[item.row].push(item)
    }
  })

  return {
    gojuon: Object.entries(gojuonMap).map(([rowName, chars]) => ({ rowName, chars })),
    dakuon: Object.entries(dakuonMap).map(([rowName, chars]) => ({ rowName, chars })),
    yoon: Object.entries(yoonMap).map(([rowName, chars]) => ({ rowName, chars }))
  }
}

const hiraganaGroups = computed(() => groupKanaData(HIRAGANA_DATA))
const katakanaGroups = computed(() => groupKanaData(KATAKANA_DATA))

// Selected character properties for stroke order SVG
const unicodeHex = computed(() => {
  if (!selectedCharacter.value || !selectedCharacter.value.char) return ''
  const char = selectedCharacter.value.char
  return char.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0')
})

const strokeOrderUrl = computed(() => {
  if (!unicodeHex.value) return ''
  // Fetch from KanjiVG project officially hosted SVG vector files
  return `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${unicodeHex.value}.svg`
})

const isLearned = computed(() => {
  if (!selectedCharacter.value || !selectedCharacter.value.char) return false
  return store.progress[selectedCharacter.value.char]?.hasLearned || false
})

function selectCharacter(char: KanaCharacter) {
  selectedCharacter.value = char
  svgLoadError.value = false
  isDialogOpen.value = true
}

function toggleCharacterLearned() {
  if (!selectedCharacter.value) return
  store.toggleLearned(selectedCharacter.value.char)
}

function handleSvgError() {
  svgLoadError.value = true
}

// Reset error state on change
watch(selectedCharacter, () => {
  svgLoadError.value = false
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-white bg-[#00f5d4] text-slate-950 p-8 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#fff]"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]"></div>
      <div class="relative z-10 space-y-2">
        <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
          {{ $t('chart.title') }}
        </h1>
        <p class="text-sm md:text-base font-bold text-slate-900 max-w-3xl leading-relaxed">
          {{ $t('chart.desc') }}
        </p>
      </div>
    </div>

    <!-- Tabs Section -->
    <Tabs default-value="hiragana" v-model="activeTab" class="w-full">
      <TabsList
        class="w-full grid grid-cols-2 h-14 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-1 rounded-none shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] mb-8"
      >
        <TabsTrigger
          value="hiragana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-[#ff007f] dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-[#ff007f] dark:data-active:text-white"
        >
          {{ $t('chart.hiragana') }}
        </TabsTrigger>
        <TabsTrigger
          value="katakana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-[#ff007f] dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-[#ff007f] dark:data-active:text-white"
        >
          {{ $t('chart.katakana') }}
        </TabsTrigger>
      </TabsList>

      <!-- Tabs Contents -->
      <template v-for="tabKey in ['hiragana', 'katakana']" :key="tabKey">
        <TabsContent :value="tabKey" class="space-y-12 outline-hidden">
          <!-- Gojuon Section -->
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-violet-300 dark:bg-violet-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.gojuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <!-- Grid Header columns: Vowels (A, I, U, E, O) -->
              <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-white pb-3 mb-2">
                <div class="w-20 shrink-0"></div>
                <div class="grid grid-cols-5 gap-4 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
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
                    {{ row.rowName }}-row
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
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-indigo-300 dark:bg-indigo-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.dakuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.dakuon : katakanaGroups.dakuon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ row.rowName }}-row
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

          <!-- Yoon Section -->
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-amber-300 dark:bg-amber-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.yoon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.yoon : katakanaGroups.yoon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ row.rowName }}-row
                  </div>
                  <div class="grid grid-cols-3 gap-3 flex-1 w-full">
                    <KanaCard
                      v-for="char in row.chars"
                      :key="char.char"
                      :character="char"
                      @click="selectCharacter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </template>
    </Tabs>

    <!-- Details Dialog (Interactive Writing & Stroke Order) -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent
        class="bg-white dark:bg-slate-900 border-[4px] border-slate-950 dark:border-white rounded-none p-6 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] sm:max-w-2xl w-full text-slate-950 dark:text-white"
      >
        <DialogHeader class="border-b-[3px] border-slate-950 dark:border-white pb-4 mb-6">
          <DialogTitle class="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
            <span>Detail Karakter</span>
            <span
              v-if="selectedCharacter"
              class="text-xs font-black uppercase border-[2px] border-slate-950 dark:border-white px-2 py-0.5 rounded-none"
              :class="[
                selectedCharacter.type === 'hiragana'
                  ? 'bg-violet-300 text-slate-950'
                  : 'bg-indigo-300 text-slate-950'
              ]"
            >
              {{ selectedCharacter.type }}
            </span>
          </DialogTitle>
          <DialogDescription class="font-bold text-slate-600 dark:text-slate-400">
            Panduan urutan menulis dan latihan menulis kana.
          </DialogDescription>
        </DialogHeader>

        <!-- Main Modal Content -->
        <div v-if="selectedCharacter" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <!-- Left Column: Big Symbol Details -->
          <div class="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
            <div class="w-36 h-36 bg-[#f4f3ec] dark:bg-slate-800 border-[3px] border-slate-950 dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
              <span class="text-7xl font-black font-sans select-none">{{ selectedCharacter.char }}</span>
            </div>
            
            <div class="space-y-1">
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Romaji</p>
              <p class="text-3xl font-black uppercase text-slate-950 dark:text-white">{{ selectedCharacter.romaji }}</p>
            </div>

            <!-- Learned State Action -->
            <div class="space-y-3 w-full">
              <div
                class="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase"
                :class="isLearned ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'"
              >
                <div
                  class="w-3 h-3 rounded-full border border-slate-950 dark:border-white"
                  :class="isLearned ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'"
                ></div>
                <span>{{ isLearned ? $t('chart.learned') : $t('chart.notLearned') }}</span>
              </div>
              
              <NeoBrutalistButton
                @click="toggleCharacterLearned"
                class="w-full md:w-auto h-11 px-5 flex items-center justify-center gap-2"
                :class="[
                  isLearned
                    ? 'bg-rose-300 hover:bg-rose-400 text-slate-950'
                    : 'bg-[#00f5d4] hover:bg-[#00d4b8] text-slate-950'
                ]"
              >
                <component :is="isLearned ? Trash2 : Check" class="w-4 h-4" />
                <span>{{ isLearned ? $t('chart.removeLearned') : $t('chart.markLearned') }}</span>
              </NeoBrutalistButton>
            </div>
          </div>

          <!-- Right Column: Stroke Order and Practice Canvas -->
          <div class="space-y-6 flex flex-col items-center">
            <!-- Stroke Order Guide SVG -->
            <div class="space-y-2 text-center w-full">
              <span class="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">
                {{ $t('chart.strokeOrder') }}
              </span>
              
              <div
                v-if="!svgLoadError && strokeOrderUrl"
                class="bg-white dark:bg-white border-[3px] border-slate-950 p-3 shadow-[3px_3px_0px_0px_#000] inline-block"
              >
                <img
                  :src="strokeOrderUrl"
                  @error="handleSvgError"
                  class="w-28 h-28 object-contain select-none"
                  alt="Stroke Order Guide"
                />
              </div>
              
              <!-- Offline Fallback Info -->
              <div
                v-else
                class="border-[3px] border-slate-950 bg-amber-150 p-4 shadow-[3px_3px_0px_0px_#000] text-xs font-bold flex gap-2 items-start text-left text-slate-800"
              >
                <Info class="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Gambar stroke order tidak termuat. Anda dapat langsung berlatih menggunakan coretan pemandu di bawah ini!</span>
              </div>
            </div>

            <!-- Practice Canvas Pad -->
            <div class="space-y-2 text-center w-full">
              <span class="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">
                {{ $t('chart.practicePad') }}
              </span>
              <PracticeCanvas v-if="selectedCharacter && selectedCharacter.char" :char="selectedCharacter.char" />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
