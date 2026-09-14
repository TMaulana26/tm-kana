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
    return 'bg-[#f4f3ec] dark:bg-slate-900 text-slate-950 dark:text-slate-100 border-slate-950 dark:border-slate-700 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#1e293b] dark:hover:border-violet-400 dark:hover:shadow-[5px_5px_0px_0px_#8b5cf6]';
  }
  if (isUltimateMastery.value) {
    return 'bg-[#ff007f] dark:bg-rose-950 dark:text-rose-100 text-white border-slate-950 dark:border-rose-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#ef4444] dark:hover:border-rose-300 dark:hover:shadow-[5px_5px_0px_0px_#f87171]';
  }
  if (isQuizMastered.value) {
    return 'bg-[#c084fc] dark:bg-violet-950 dark:text-violet-100 text-black border-slate-950 dark:border-violet-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#8b5cf6] dark:hover:border-violet-300 dark:hover:shadow-[5px_5px_0px_0px_#a78bfa]';
  }
  if (isDrawMastered.value) {
    return 'bg-[#ff9f1c] dark:bg-amber-950 dark:text-amber-100 text-black border-slate-950 dark:border-amber-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] dark:hover:border-amber-300 dark:hover:shadow-[5px_5px_0px_0px_#fbbf24]';
  }
  return 'bg-[#00f5d4] dark:bg-emerald-950 dark:text-emerald-100 text-black border-slate-950 dark:border-emerald-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#10b981] dark:hover:border-emerald-300 dark:hover:shadow-[5px_5px_0px_0px_#34d399]';
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
      'group relative w-full aspect-square flex flex-col items-center justify-center rounded-none border-[3px] transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000]',
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
