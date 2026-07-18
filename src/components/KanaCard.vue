<script setup lang="ts">
import { computed } from "vue";
import { useProgressStore } from "@/stores/progress";
import type { KanaItem } from "@/constants/kanaData";

const props = defineProps<{
  character: KanaItem;
}>();

defineEmits<{
  (e: "click", character: KanaItem): void;
}>();

const store = useProgressStore();

const progress = computed(() => {
  return store.progress[props.character.id] || {
    hasLearned: false,
    quizSuccessCount: 0,
    quizFailCount: 0,
    drawSuccessCount: 0,
    drawFailCount: 0
  };
});

const hasLearned = computed(() => progress.value.hasLearned);

const isQuizMastered = computed(() => {
  const p = progress.value;
  return p.hasLearned && p.quizSuccessCount > p.quizFailCount;
});

const isDrawMastered = computed(() => {
  const p = progress.value;
  return p.hasLearned && p.drawSuccessCount > p.drawFailCount;
});

const isUltimateMastery = computed(() => {
  return isQuizMastered.value && isDrawMastered.value;
});

const cardClass = computed(() => {
  if (!hasLearned.value) {
    return 'bg-[#f4f3ec] dark:bg-slate-800 text-slate-950 dark:text-slate-50';
  }
  if (isUltimateMastery.value) {
    return 'bg-[#ff007f] dark:bg-[#e0006c] text-white';
  }
  if (isQuizMastered.value) {
    return 'bg-[#c084fc] dark:bg-[#a855f7] text-slate-950 dark:text-white';
  }
  if (isDrawMastered.value) {
    return 'bg-[#ff9f1c] dark:bg-[#e58a00] text-slate-950';
  }
  return 'bg-[#00f5d4] dark:bg-[#00c9ae] text-slate-950';
});

const dotClass = computed(() => {
  if (isUltimateMastery.value) return 'bg-white border-slate-950';
  if (isQuizMastered.value) return 'bg-[#ff007f] border-white';
  if (isDrawMastered.value) return 'bg-[#bd93f9] border-white';
  return 'bg-slate-950 border-white';
});

const masteryTooltip = computed(() => {
  if (!hasLearned.value) return '';
  if (isUltimateMastery.value) return 'Ultimate Mastered (Quiz & Draw)';
  if (isQuizMastered.value) return 'Quiz Mastered';
  if (isDrawMastered.value) return 'Drawing Mastered';
  return 'Learned';
});
</script>

<template>
  <button
    @click="$emit('click', character)"
    :class="[
      'group relative w-full aspect-square flex flex-col items-center justify-center rounded-none border-[3px] border-slate-950 dark:border-white transition-all duration-200 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000]',
      cardClass,
    ]"
  >
    <!-- Learning Checkmark Indicator -->
    <span
      v-if="hasLearned"
      class="absolute top-1 right-1 w-2.5 h-2.5 border rounded-full"
      :class="dotClass"
      :title="masteryTooltip"
    ></span>

    <span class="font-black uppercase tracking-tight block leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
      {{ character.character }}
    </span>
    <span
      :class="[
        'text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wide mt-0.5 sm:mt-1',
        hasLearned && isUltimateMastery
          ? 'text-slate-100'
          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200',
      ]"
    >
      {{ character.romaji }}
    </span>
  </button>
</template>
