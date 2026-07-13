<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import NeoBrutalistButton from './NeoBrutalistButton.vue'

const props = defineProps<{
  char: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

function getCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } | null {
  const canvas = canvasRef.value
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  
  let clientX: number
  let clientY: number
  
  if (window.TouchEvent && e instanceof TouchEvent) {
    if (e.touches.length === 0) return null
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else {
    return null
  }
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

function startDrawing(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  const coords = getCoordinates(e)
  if (!coords) return
  isDrawing.value = true
  lastX.value = coords.x
  lastY.value = coords.y
}

function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return
  e.preventDefault()
  
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  
  const coords = getCoordinates(e)
  if (!coords) return
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(coords.x, coords.y)
  ctx.stroke()
  
  lastX.value = coords.x
  lastY.value = coords.y
}

function stopDrawing() {
  isDrawing.value = false
}

function clearCanvas() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  
  // Save current drawing content
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const tempCtx = tempCanvas.getContext('2d')
  if (tempCtx) {
    tempCtx.drawImage(canvas, 0, 0)
  }
  
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 5
    // Bright magenta stroke for neo-brutalist pen
    ctx.strokeStyle = '#ff007f'
    
    // Restore saved drawing content scaled
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / window.devicePixelRatio, tempCanvas.height / window.devicePixelRatio)
  }
}

onMounted(() => {
  nextTick(() => {
    resizeCanvas()
    // Handle screen resize/orientation change
    window.addEventListener('resize', resizeCanvas)
  })
})

watch(() => props.char, () => {
  clearCanvas()
})
</script>

<template>
  <div class="space-y-3 flex flex-col items-center">
    <div
      class="relative border-[3px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-900 w-64 h-64 select-none overflow-hidden shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
    >
      <!-- Background Guide Lines -->
      <div class="absolute inset-x-0 top-1/2 border-t-[2px] border-dashed border-slate-400/50 dark:border-slate-600/50 pointer-events-none"></div>
      <div class="absolute inset-y-0 left-1/2 border-l-[2px] border-dashed border-slate-400/50 dark:border-slate-600/50 pointer-events-none"></div>
      
      <!-- Faint Character Outline Template -->
      <div
        class="absolute inset-0 flex items-center justify-center text-[10rem] font-black text-slate-350/45 dark:text-slate-800/40 select-none pointer-events-none font-sans"
      >
        {{ char }}
      </div>
      
      <!-- Drawing Canvas -->
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
    
    <NeoBrutalistButton
      @click="clearCanvas"
      class="h-9 px-4 text-xs bg-amber-300 hover:bg-amber-400 text-slate-950"
    >
      {{ $t('chart.clearPad') }}
    </NeoBrutalistButton>
  </div>
</template>
