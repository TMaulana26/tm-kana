<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useCanvas, type Point } from '@/composables/useCanvas'
import NeoBrutalistButton from './NeoBrutalistButton.vue'

interface Props {
  char: string
  showOutline?: boolean
  templatePaths?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  showOutline: true,
  templatePaths: () => []
})

const {
  canvasRef,
  points,
  strokes,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas
} = useCanvas()

const svgError = ref(false)

const svgUrl = computed(() => {
  if (!props.char || props.char.length > 1) return ''
  const hex = props.char.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0')
  return `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${hex}.svg`
})

// Watch character change to clear canvas and reset error automatically
if (canvasRef) {
  // Prevent TS6133
}
watch(() => props.char, () => {
  clearCanvas()
  svgError.value = false
})

const emit = defineEmits<{
  (e: 'stroke-completed', strokes: Point[][]): void
  (e: 'clear'): void
}>()

function handleStopDrawing() {
  stopDrawing()
  if (strokes.value.length > 0) {
    emit('stroke-completed', strokes.value)
  }
}

function handleClear() {
  emit('clear')
}

function drawTemplateStroke(templateStroke: Point[], color = '#10b981', lineWidth = 6) {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || templateStroke.length < 2) return

  const rect = canvas.getBoundingClientRect()
  const canvasWidth = rect.width || 320
  const canvasHeight = rect.height || 320

  const scaleX = canvasWidth / 109
  const scaleY = canvasHeight / 109

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.moveTo(templateStroke[0].x * scaleX, templateStroke[0].y * scaleY)
  for (let i = 1; i < templateStroke.length; i++) {
    ctx.lineTo(templateStroke[i].x * scaleX, templateStroke[i].y * scaleY)
  }
  ctx.stroke()
}

function drawCompleted(completedStrokesList: Point[][]) {
  clearCanvas()
  
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const strokeColor = isDark ? '#34d399' : '#059669' // Emerald green
  
  completedStrokesList.forEach(stroke => {
    drawTemplateStroke(stroke, strokeColor, 6)
  })
}

defineExpose({
  clear: clearCanvas,
  getPoints: () => points.value,
  getStrokes: () => strokes.value,
  getCanvasSize: () => {
    const canvas = canvasRef.value
    if (!canvas) return { width: 320, height: 320 }
    const rect = canvas.getBoundingClientRect()
    return { width: rect.width || 320, height: rect.height || 320 }
  },
  drawCompleted
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
      <div v-if="showOutline" class="absolute inset-0 flex items-center justify-center pointer-events-none p-4 select-none">
        <svg
          v-if="templatePaths && templatePaths.length > 0"
          viewBox="0 0 109 109"
          class="w-full h-full object-contain opacity-25 dark:opacity-20 select-none pointer-events-none"
        >
          <g fill="none" class="stroke-slate-950 dark:stroke-white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="(d, idx) in templatePaths" :key="idx" :d="d" />
          </g>
        </svg>
        <img
          v-else-if="!svgError && svgUrl"
          :src="svgUrl"
          @error="svgError = true"
          class="w-full h-full object-contain opacity-25 dark:opacity-20 select-none pointer-events-none filter dark:invert"
          :alt="$t('practice.strokeGuideAlt')"
        />
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center font-black text-slate-300/45 dark:text-slate-800/40 select-none pointer-events-none font-sans whitespace-nowrap px-2"
          :class="[
            char.length > 2
              ? 'text-4xl sm:text-5xl tracking-tight'
              : char.length > 1
                ? 'text-5xl sm:text-6xl tracking-tight'
                : 'text-[9rem] sm:text-[10rem]'
          ]"
        >
          {{ char }}
        </div>
      </div>
      
      <!-- User Drawing Layer -->
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="handleStopDrawing"
        @mouseleave="handleStopDrawing"
        @touchstart="startDrawing"
        @touchmove="draw"
        @touchend="handleStopDrawing"
        class="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
      ></canvas>
    </div>
    
    <div class="flex gap-4">
      <NeoBrutalistButton
        @click="handleClear"
        class="h-9 px-4 text-xs bg-amber-300 hover:bg-amber-400 text-black font-extrabold"
      >
        {{ $t('practice.clearBtn') }}
      </NeoBrutalistButton>
    </div>
  </div>
</template>
