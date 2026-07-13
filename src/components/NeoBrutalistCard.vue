<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

defineProps<{
  title: string
  description?: string
  headerBg?: string
  cardClass?: string
  contentClass?: string
}>()
</script>

<template>
  <Card
    :class="[
      'border-[4px] border-slate-950 dark:border-white bg-white dark:bg-slate-900 rounded-none shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#fff]',
      cardClass
    ]"
  >
    <CardHeader
      :class="[
        'flex flex-row items-center gap-4 py-4 border-b-[3px] border-slate-950 dark:border-white rounded-none',
        headerBg || 'bg-slate-200 dark:bg-slate-800'
      ]"
    >
      <div
        v-if="$slots.icon"
        class="w-12 h-12 border-[3px] border-slate-950 dark:border-white bg-white dark:bg-slate-950 flex items-center justify-center text-slate-950 dark:text-white shrink-0"
      >
        <slot name="icon" />
      </div>
      <div>
        <CardTitle class="text-xl font-black uppercase text-slate-950 dark:text-white">
          {{ title }}
        </CardTitle>
        <CardDescription v-if="description" class="text-slate-700 dark:text-slate-300 font-medium">
          {{ description }}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent :class="['pt-6', contentClass]">
      <slot />
    </CardContent>
  </Card>
</template>
