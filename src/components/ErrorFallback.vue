<script setup lang="ts">
import { AlertOctagon, RotateCw } from 'lucide-vue-next'

interface Props {
  error: Error | null
}

const props = defineProps<Props>()

function handleReload() {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f3ec] dark:bg-[#121318] text-slate-950 dark:text-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
    <div class="max-w-2xl w-full bg-white dark:bg-slate-900 border-[4px] border-slate-950 dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] space-y-6">
      <!-- Error Header -->
      <div class="flex items-center gap-4 bg-rose-300 dark:bg-rose-950/40 border-[3px] border-slate-950 dark:border-white p-4">
        <AlertOctagon class="w-10 h-10 text-rose-600 shrink-0" />
        <div>
          <h1 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight">
            {{ $t('errorPage.title') }}
          </h1>
          <p class="text-xs font-bold text-slate-800 dark:text-slate-300 mt-1">
            {{ $t('errorPage.desc') }}
          </p>
        </div>
      </div>

      <!-- Error Stack / Details -->
      <div class="space-y-2">
        <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ $t('errorPage.messageLabel') }}
        </h2>
        <div class="bg-[#1f2028] text-rose-300 border-[3px] border-slate-950 dark:border-white p-4 font-mono text-xs overflow-auto max-h-60 rounded-none leading-relaxed">
          <p class="font-bold text-sm text-white mb-2">
            {{ props.error?.name }}: {{ props.error?.message }}
          </p>
          <pre class="whitespace-pre">{{ props.error?.stack || 'No trace available' }}</pre>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          @click="handleReload"
          class="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#00f5d4] hover:bg-[#00e1c2] text-slate-950 border-[3px] border-slate-950 font-black uppercase text-sm tracking-wide shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <RotateCw class="w-4 h-4" />
          {{ $t('errorPage.reloadBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>
