<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import type { KanaCharacter } from '@/constants/kanaData'

const props = defineProps<{
  character: KanaCharacter
}>()

defineEmits<{
  (e: 'click', character: KanaCharacter): void
}>()

const store = useProgressStore()

const hasLearned = computed(() => {
  return store.progress[props.character.char]?.hasLearned || false
})
</script>

<template>
  <button
    @click="$emit('click', character)"
    :class="[
      'group relative w-full aspect-square flex flex-col items-center justify-center rounded-none border-[3px] border-slate-950 dark:border-white transition-all duration-200 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000]',
      hasLearned
        ? 'bg-[#00f5d4] dark:bg-[#00c9ae] text-slate-950'
        : 'bg-[#f4f3ec] dark:bg-slate-800 text-slate-950 dark:text-slate-50'
    ]"
  >
    <!-- Learning Checkmark Indicator -->
    <span
      v-if="hasLearned"
      class="absolute top-1 right-1 w-2.5 h-2.5 bg-slate-950 border border-white rounded-full"
      title="Learned"
    ></span>
    
    <span class="text-2xl md:text-3xl font-black uppercase tracking-tight block">
      {{ character.char }}
    </span>
    <span
      :class="[
        'text-xs font-black uppercase tracking-wide mt-1',
        hasLearned
          ? 'text-slate-800'
          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
      ]"
    >
      {{ character.romaji }}
    </span>
  </button>
</template>
