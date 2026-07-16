import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface Point {
  x: number;
  y: number;
}

export function useCanvas() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const isDrawing = ref(false);
  const points = ref<Point[]>([]);
  const lastX = ref(0);
  const lastY = ref(0);

  function getCoordinates(e: MouseEvent | TouchEvent): Point | null {
    const canvas = canvasRef.value;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if (typeof window !== 'undefined' && window.TouchEvent && e instanceof TouchEvent) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return null;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrawing(e: MouseEvent | TouchEvent) {
    // Prevent default touch gestures (scrolling)
    if (e.cancelable) {
      e.preventDefault();
    }
    const coords = getCoordinates(e);
    if (!coords) return;

    isDrawing.value = true;
    lastX.value = coords.x;
    lastY.value = coords.y;
    points.value.push(coords);
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing.value) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    ctx.beginPath();
    ctx.moveTo(lastX.value, lastY.value);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastX.value = coords.x;
    lastY.value = coords.y;
    points.value.push(coords);
  }

  function stopDrawing() {
    isDrawing.value = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.value = [];
  }

  function resizeCanvas() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Preserve current content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5;
      // High-contrast neon pink/magenta pen color for Neobrutalism theme
      ctx.strokeStyle = '#d946ef';

      // Restore scale image
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }
  }

  onMounted(() => {
    nextTick(() => {
      resizeCanvas();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', resizeCanvas);
      }
    });
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', resizeCanvas);
    }
  });

  return {
    canvasRef,
    isDrawing,
    points,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    resizeCanvas
  };
}
