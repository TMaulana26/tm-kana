<script setup lang="ts">
import { watch } from 'vue'
import { useCanvas } from '@/composables/useCanvas'
import NeoBrutalistButton from './NeoBrutalistButton.vue'

const props = defineProps<{
  char: string
}>()

const {
  canvasRef,
  points,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas
} = useCanvas()

// Reference canvasRef to prevent TS6133 unused error
canvasRef

// Watch character change to clear canvas automatically
watch(() => props.char, () => {
  clearCanvas()
})

defineExpose({
  clear: clearCanvas,
  getPoints: () => points.value
})
</script>

<template>
  <div class="space-y-4 flex flex-col items-center w-full">
    <div
      class="relative border-[3px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-900 w-full aspect-square max-w-[280px] sm:max-w-[320px] select-none overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
    >
      <!-- Centered Grid Guide Lines -->
      <div class="absolute inset-x-0 top-1/2 border-t-[2px] border-dashed border-slate-400/40 dark:border-slate-650/40 pointer-events-none"></div>
      <div class="absolute inset-y-0 left-1/2 border-l-[2px] border-dashed border-slate-400/40 dark:border-slate-650/40 pointer-events-none"></div>
      
      <!-- Faint Outline of the Target Character as Visual Guide -->
      <div
        class="absolute inset-0 flex items-center justify-center font-black text-slate-300/45 dark:text-slate-800/40 select-none pointer-events-none font-sans whitespace-nowrap"
        :class="char.length > 1 ? 'text-[6rem] sm:text-[7rem]' : 'text-[11rem] sm:text-[12rem]'"
      >
        {{ char }}
      </div>
      
      <!-- User Drawing Layer -->
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="startDrawing"
        @touchmove="draw"
        @touchend="stopDrawing"
        class="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
      ></canvas>
    </div>
    
    <div class="flex gap-4">
      <NeoBrutalistButton
        @click="clearCanvas"
        class="h-9 px-4 text-xs bg-amber-300 hover:bg-amber-400 text-slate-950"
      >
        {{ $t('practice.clearBtn') }}
      </NeoBrutalistButton>
    </div>
  </div>
</template>
