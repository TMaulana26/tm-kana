<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProgressStore } from '@/stores/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import PracticeCanvas from '@/components/PracticeCanvas.vue'
import NeoBrutalistButton from '@/components/NeoBrutalistButton.vue'
import { Info, Check, Trash2 } from 'lucide-vue-next'
import type { KanaItem } from '@/constants/kanaData'

interface Props {
  open: boolean
  character: KanaItem | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

useI18n()
const store = useProgressStore()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const svgLoadErrors = ref<Record<number, boolean>>({})

const strokeOrderUrls = computed(() => {
  if (!props.character || !props.character.character) return []
  return Array.from(props.character.character).map(c => {
    const hex = c.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0')
    return `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${hex}.svg`
  })
})

const isLearned = computed(() => {
  if (!props.character || !props.character.id) return false
  return store.progress[props.character.id]?.hasLearned || false
})

const hasSvgError = computed(() => {
  if (strokeOrderUrls.value.length === 0) return true
  return strokeOrderUrls.value.some((_, idx) => svgLoadErrors.value[idx])
})

function toggleCharacterLearned() {
  if (!props.character) return
  store.toggleLearned(props.character.id)
}

function handleSvgError(idx: number) {
  svgLoadErrors.value[idx] = true
}

// Reset error state when character changes
watch(() => props.character, () => {
  svgLoadErrors.value = {}
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="bg-white dark:bg-slate-900 border-[4px] border-slate-950 dark:border-white rounded-none p-6 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] sm:max-w-2xl w-full text-slate-950 dark:text-white"
    >
      <DialogHeader class="border-b-[3px] border-slate-950 dark:border-white pb-4 mb-6">
        <DialogTitle class="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
          <span>{{ $t('chart.detailTitle') }}</span>
          <span
            v-if="character"
            class="text-xs font-black uppercase border-[2px] border-slate-950 dark:border-white px-2 py-0.5 rounded-none"
            :class="[
              character.id.startsWith('h-')
                ? 'bg-violet-300 text-slate-950'
                : 'bg-indigo-300 text-slate-950'
            ]"
          >
            {{ character.id.startsWith('h-') ? 'hiragana' : 'katakana' }}
          </span>
        </DialogTitle>
        <DialogDescription class="font-bold text-slate-600 dark:text-slate-400">
          {{ $t('chart.detailDesc') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Main Modal Content -->
      <div v-if="character" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <!-- Left Column: Big Symbol Details -->
        <div class="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
          <div class="w-36 h-36 bg-[#f4f3ec] dark:bg-slate-800 border-[3px] border-slate-950 dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
            <span
              class="font-black font-sans select-none whitespace-nowrap"
              :class="character.character.length > 1 ? 'text-5xl' : 'text-7xl'"
            >{{ character.character }}</span>
          </div>
          
          <div class="space-y-1">
            <p class="text-xs font-black uppercase tracking-widest text-slate-500">{{ $t('common.romaji') }}</p>
            <p class="text-3xl font-black uppercase text-slate-950 dark:text-white">{{ character.romaji }}</p>
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
              v-if="!hasSvgError && strokeOrderUrls.length > 0"
              class="bg-white dark:bg-white border-[3px] border-slate-950 p-3 shadow-[3px_3px_0px_0px_#000] inline-flex gap-4 justify-center items-center"
            >
              <img
                v-for="(url, idx) in strokeOrderUrls"
                :key="idx"
                :src="url"
                @error="handleSvgError(idx)"
                class="w-20 h-20 sm:w-24 sm:h-24 object-contain select-none"
                :alt="$t('chart.strokeOrderAlt')"
              />
            </div>
            
            <!-- Offline Fallback Info -->
            <div
              v-else
              class="border-[3px] border-slate-950 bg-amber-150 p-4 shadow-[3px_3px_0px_0px_#000] text-xs font-bold flex gap-2 items-start text-left text-slate-800"
            >
              <Info class="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{{ $t('chart.offlineStrokeOrder') }}</span>
            </div>
          </div>

          <!-- Practice Canvas Pad -->
          <div class="space-y-2 text-center w-full">
            <span class="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">
              {{ $t('chart.practicePad') }}
            </span>
            <PracticeCanvas v-if="character && character.character" :char="character.character" />
          </div>
        </div>

      </div>
    </DialogContent>
  </Dialog>
</template>
