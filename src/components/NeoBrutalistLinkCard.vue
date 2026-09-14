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
    class="group border-[3px] border-slate-950 dark:border-slate-700 rounded-none p-5 bg-[#f4f3ec] dark:bg-slate-900 text-slate-950 dark:text-white hover:bg-[#ffbe0b] dark:hover:bg-slate-800 dark:hover:border-amber-400 transition-all duration-300 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between h-full"
  >
    <div class="space-y-3">
      <div class="flex items-center justify-between text-slate-900 dark:text-slate-300 dark:group-hover:text-amber-400 transition-colors">
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
      <h3 class="font-black text-lg uppercase tracking-wide pt-2 text-slate-950 dark:text-white dark:group-hover:text-amber-400 transition-colors">
        {{ title }}
      </h3>
      <p class="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-100 leading-relaxed transition-colors">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-950 dark:text-amber-400 group-hover:text-slate-950 dark:group-hover:text-amber-300 pt-4 mt-auto transition-colors">
      <span>{{ learnMoreText }}</span>
      <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
    </div>
  </a>
</template>
