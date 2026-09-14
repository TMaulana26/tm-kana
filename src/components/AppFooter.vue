<script setup lang="ts">
import { APP_VERSION, GITHUB_REPO_URL } from '@/constants/appInfo'
import { Github, ExternalLink, Heart, MessageSquarePlus } from 'lucide-vue-next'

interface Emits {
  (e: 'openFeedback'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <footer
    class="mt-auto border-t-[3px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-900 py-4 px-4 sm:px-8 text-slate-950 dark:text-white"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
    >
      <!-- Left: App Identity & Tagline -->
      <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
            {{ $t('common.appName') }}
          </span>
          <span
            class="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-300 dark:bg-amber-400 text-black border-[2px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000]"
          >
            {{ APP_VERSION }}
          </span>
        </div>
        <span class="hidden sm:inline-block text-slate-400 dark:text-slate-600 font-bold">・</span>
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
          <span>{{ $t('footer.tagline') }}</span>
        </span>
      </div>

      <!-- Right: Feedback Modal Trigger & GitHub Repository Link -->
      <div class="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
        <button
          type="button"
          @click="emit('openFeedback')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-500 text-black border-[2px] border-slate-950 dark:border-slate-700 font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] transition-all transform active:translate-x-0.5 active:translate-y-0.5"
          :aria-label="$t('feedback.triggerBtn')"
        >
          <MessageSquarePlus class="w-4 h-4" />
          <span>{{ $t('feedback.triggerBtn') }}</span>
        </button>

        <a
          :href="GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4f3ec] dark:bg-slate-800 hover:bg-violet-200 dark:hover:bg-violet-950/60 text-black dark:text-white border-[2px] border-slate-950 dark:border-slate-700 font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] transition-all transform active:translate-x-0.5 active:translate-y-0.5"
          :aria-label="$t('footer.github')"
        >
          <Github class="w-4 h-4" />
          <span>{{ $t('footer.github') }}</span>
          <ExternalLink class="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  </footer>
</template>
