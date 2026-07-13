<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

defineProps<{
  href: string
  tagText: string
  tagBg?: string
  title: string
  description: string
  learnMoreText: string
}>()
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="group border-[3px] border-slate-950 dark:border-white rounded-none p-5 hover:bg-[#ffbe0b] hover:text-slate-950 dark:hover:text-slate-950 transition-all duration-300 bg-[#f4f3ec] dark:bg-slate-800 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] flex flex-col justify-between h-full"
  >
    <div class="space-y-3">
      <div class="flex items-center justify-between text-slate-900 dark:text-slate-50">
        <span
          :class="[
            'text-xs font-black tracking-wider uppercase text-slate-950 border-[2px] border-slate-950 px-2.5 py-1 rounded-none shadow-[2px_2px_0px_0px_#000]',
            tagBg || 'bg-violet-300'
          ]"
        >
          {{ tagText }}
        </span>
        <ExternalLink class="w-4 h-4 stroke-[3px]" />
      </div>
      <h3 class="font-black text-lg uppercase tracking-wide pt-2">
        {{ title }}
      </h3>
      <p class="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 leading-relaxed">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-950 pt-4 mt-auto">
      <span>{{ learnMoreText }}</span>
      <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
    </div>
  </a>
</template>
