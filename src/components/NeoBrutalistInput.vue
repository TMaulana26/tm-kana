<script setup lang="ts">
import { Input } from '@/components/ui/input'

const model = defineModel<string>()

defineProps<{
  id?: string
  placeholder?: string
  type?: string
}>()
</script>

<template>
  <Input
    :id="id"
    v-model="model"
    :type="type || 'text'"
    :placeholder="placeholder"
    class="rounded-none border-[3px] border-slate-950 dark:border-slate-700 dark:bg-slate-950 focus-visible:ring-0 focus-visible:border-slate-950 dark:focus-visible:border-amber-400 font-bold text-slate-950 dark:text-white"
  />
</template>
