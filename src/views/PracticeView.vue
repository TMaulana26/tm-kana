<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useProgressStore } from "@/stores/progress";
import { kanaData, type KanaItem } from "@/constants/kanaData";
import NeoBrutalistButton from "@/components/NeoBrutalistButton.vue";
import KanaCanvas from "@/components/KanaCanvas.vue";
import { recognizeStroke, recognizeStrokeSequence, recognizeSingleStroke, type Point } from "@/utils/strokeRecognizer";
import {
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Settings,
  Award,
  GraduationCap,
} from "lucide-vue-next";

const { t } = useI18n();
const store = useProgressStore();

// Types
interface SelectableGroup {
  id: string;
  type: "hiragana" | "katakana";
  rowGroup: string;
  label: string;
  chars: string[];
  items: KanaItem[];
}

interface PracticeQuestion {
  item: KanaItem;
  index: number;
}

interface QuestionResult {
  item: KanaItem;
  userAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
  completedStrokes?: number;
  totalStrokes?: number;
  strokePaths?: string[];
}

// 1. Configurator State
const selectedCharacters = ref<Record<string, boolean>>({});
const practiceMode = ref<"quiz" | "draw">("quiz");

// 2. Active Session State
const isSessionActive = ref(false);
const isSessionFinished = ref(false);
const questions = ref<PracticeQuestion[]>([]);
const currentQuestionIndex = ref(0);
const results = ref<QuestionResult[]>([]);

// 3. Quiz Mode Form State
const quizInput = ref("");
const quizInputRef = ref<HTMLInputElement | null>(null);

// 4. Draw Mode Component Reference
const canvasRef = ref<InstanceType<typeof KanaCanvas> | null>(null);

// 5. Feedback State
const showFeedback = ref(false);
const feedbackStatus = ref<"correct" | "incorrect" | null>(null);
const feedbackMessage = ref("");

// 6. Draw Mode New State (Hint & Strict SVG stroke guide)
const showDrawHint = ref(false);
const activeTemplateStrokes = ref<Point[][] | null>(null);
const activeTemplatePaths = ref<string[]>([]);
const hasUsedHint = ref(false);
const svgLoadFailed = ref(false);
const completedStrokesCount = ref(0);
const strokeWarning = ref("");

// Compute dynamic selectable groups from kanaData
const selectableGroups = computed<SelectableGroup[]>(() => {
  const list: SelectableGroup[] = [];
  const types = ["hiragana", "katakana"] as const;
  const categories = ["gojuon", "dakuten", "yoon"] as const;

  for (const type of types) {
    const grouped: Record<string, KanaItem[]> = {};
    for (const cat of categories) {
      const items = kanaData[type]?.[cat] || [];
      for (const item of items) {
        if (!grouped[item.rowGroup]) {
          grouped[item.rowGroup] = [];
        }
        grouped[item.rowGroup].push(item);
      }
    }

    for (const [rowGroup, items] of Object.entries(grouped)) {
      list.push({
        id: `${type}-${rowGroup}`,
        type,
        rowGroup,
        label: rowGroup,
        chars: items.map((i) => i.character),
        items,
      });
    }
  }
  return list;
});

const hiraganaGroups = computed(() =>
  selectableGroups.value.filter((g) => g.type === "hiragana"),
);
const katakanaGroups = computed(() =>
  selectableGroups.value.filter((g) => g.type === "katakana"),
);

// Helper to check if a group is fully selected (every character is checked)
function isGroupFullySelected(groupId: string): boolean {
  const group = selectableGroups.value.find((g) => g.id === groupId);
  if (!group) return false;
  return group.items.every((char) => selectedCharacters.value[char.id]);
}

// Helper to check if a group has at least one (but not all) characters checked
function isGroupPartiallySelected(groupId: string): boolean {
  const group = selectableGroups.value.find((g) => g.id === groupId);
  if (!group) return false;
  const checkedCount = group.items.filter(
    (char) => selectedCharacters.value[char.id],
  ).length;
  return checkedCount > 0 && checkedCount < group.items.length;
}

// Compute if there's any active character selected across all groups
const isAnyCharacterSelected = computed(() => {
  return Object.values(selectedCharacters.value).some((val) => val);
});

// Compute active groups with at least one character checked
const activeGroupsWithSelections = computed(() => {
  return selectableGroups.value.filter((group) => {
    return group.items.some((char) => selectedCharacters.value[char.id]);
  });
});

// Current question getter
const currentQuestion = computed<PracticeQuestion | null>(() => {
  if (currentQuestionIndex.value < questions.value.length) {
    return questions.value[currentQuestionIndex.value];
  }
  return null;
});

// Current score getter
const correctCount = computed(() => {
  return results.value.filter((r) => r.isCorrect).length;
});

const accuracyPercentage = computed(() => {
  if (results.value.length === 0) return 0;
  return Math.round((correctCount.value / results.value.length) * 100);
});

const tableFilter = ref<"all" | "correct" | "incorrect">("all");

const filteredResults = computed(() => {
  if (tableFilter.value === "correct") return results.value.filter((r) => r.isCorrect);
  if (tableFilter.value === "incorrect") return results.value.filter((r) => !r.isCorrect);
  return results.value;
});

const strokeOrderUrl = computed(() => {
  if (!currentQuestion.value?.item.character) return "";
  const char = currentQuestion.value.item.character;
  const hex = char.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");
  return `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${hex}.svg`;
});

// Fetch Template SVG paths for stroke sequence validation and hint outline background
async function fetchTemplateSVG(char: string) {
  activeTemplateStrokes.value = null;
  activeTemplatePaths.value = [];
  svgLoadFailed.value = false;
  
  try {
    const hex = char.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
    const url = `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${hex}.svg`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch SVG");
    const svgText = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    
    let pathElements = doc.querySelectorAll("g[id^='kvg:StrokePaths'] path");
    if (pathElements.length === 0) {
      pathElements = doc.querySelectorAll("path[id*='-s']");
    }
    if (pathElements.length === 0) {
      pathElements = doc.querySelectorAll("path");
    }
    
    const strokesData: Point[][] = [];
    const pathsData: string[] = [];
    pathElements.forEach(path => {
      const d = path.getAttribute("d");
      if (d) {
        pathsData.push(d);
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', d);
        const length = pathEl.getTotalLength();
        const pts: Point[] = [];
        const numSamples = 32;
        for (let i = 0; i < numSamples; i++) {
          const dist = (i / (numSamples - 1)) * length;
          const pt = pathEl.getPointAtLength(dist);
          pts.push({ x: pt.x, y: pt.y });
        }
        strokesData.push(pts);
      }
    });
    
    if (strokesData.length > 0) {
      activeTemplateStrokes.value = strokesData;
      activeTemplatePaths.value = pathsData;
    } else {
      svgLoadFailed.value = true;
    }
  } catch (e) {
    console.warn("Failed to load or parse template SVG", e);
    svgLoadFailed.value = true;
  }
}

// Watch question changes to fetch stroke template XML
watch(
  [() => currentQuestion.value, () => practiceMode.value],
  ([newQ, mode]) => {
    showDrawHint.value = false;
    hasUsedHint.value = false;
    completedStrokesCount.value = 0;
    strokeWarning.value = "";
    if (newQ && mode === "draw") {
      fetchTemplateSVG(newQ.item.character);
    }
  },
  { immediate: true }
);

// Treat hint click as automatic incorrect answer submission
function toggleHint() {
  if (showFeedback.value || !currentQuestion.value) return;

  showDrawHint.value = true;
  hasUsedHint.value = true;
}

// 6. Action Functions
function toggleGroup(groupId: string) {
  const group = selectableGroups.value.find((g) => g.id === groupId);
  if (!group) return;
  const targetState = !isGroupFullySelected(groupId);
  for (const char of group.items) {
    selectedCharacters.value[char.id] = targetState;
  }
}

function toggleCharacter(charId: string) {
  selectedCharacters.value[charId] = !selectedCharacters.value[charId];
}

function selectAll(type: "hiragana" | "katakana") {
  const groups =
    type === "hiragana" ? hiraganaGroups.value : katakanaGroups.value;
  for (const g of groups) {
    for (const char of g.items) {
      selectedCharacters.value[char.id] = true;
    }
  }
}

function deselectAll(type: "hiragana" | "katakana") {
  const groups =
    type === "hiragana" ? hiraganaGroups.value : katakanaGroups.value;
  for (const g of groups) {
    for (const char of g.items) {
      selectedCharacters.value[char.id] = false;
    }
  }
}

// Shuffle helper (Fisher-Yates)
function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Start exercise
function startPractice() {
  if (!isAnyCharacterSelected.value) return;

  // 1. Gather all selected characters
  let pool: KanaItem[] = [];
  for (const group of selectableGroups.value) {
    for (const item of group.items) {
      if (selectedCharacters.value[item.id]) {
        pool.push(item);
      }
    }
  }

  // 2. Shuffle characters
  pool = shuffleArray(pool);

  // 3. Map questions (use all selected characters)
  questions.value = pool.map((item, index) => ({ item, index }));

  // 5. Reset states
  currentQuestionIndex.value = 0;
  results.value = [];
  isSessionActive.value = true;
  isSessionFinished.value = false;
  quizInput.value = "";
  showFeedback.value = false;
  showDrawHint.value = false;

  // Focus input if quiz mode
  if (practiceMode.value === "quiz") {
    nextTick(() => {
      quizInputRef.value?.focus();
    });
  }
}

// Submit Quiz Answer
function submitQuizAnswer() {
  if (showFeedback.value || !currentQuestion.value) return;

  const inputCleaned = quizInput.value.trim().toLowerCase();
  const correctRomaji = currentQuestion.value.item.romaji.toLowerCase();

  let isCorrect = inputCleaned === correctRomaji;

  // Allow alternate romaji answers for special Dakuon characters (ぢ/ヂ -> di, づ/ヅ -> du)
  const charId = currentQuestion.value.item.id;
  if (!isCorrect) {
    if ((charId === "h-dji" || charId === "k-dji") && inputCleaned === "di") {
      isCorrect = true;
    } else if ((charId === "h-dzu" || charId === "k-dzu") && inputCleaned === "du") {
      isCorrect = true;
    }
  }

  // Record inside Store Action
  store.recordQuizResult(currentQuestion.value.item.id, isCorrect);

  results.value.push({
    item: currentQuestion.value.item,
    userAnswer: quizInput.value.trim() || "-",
    isCorrect,
    isSkipped: false,
  });

  triggerFeedback(isCorrect, correctRomaji);
}

// Handle dynamic stroke completion from KanaCanvas
function handleStrokeCompleted(userStrokes: Point[][]) {
  if (showFeedback.value || !currentQuestion.value || !canvasRef.value) return;
  if (!activeTemplateStrokes.value || activeTemplateStrokes.value.length === 0) return;

  const K = completedStrokesCount.value;
  if (K >= activeTemplateStrokes.value.length) return;

  const latestStroke = userStrokes[userStrokes.length - 1];
  const targetTemplateStroke = activeTemplateStrokes.value[K];

  const canvasSize = canvasRef.value.getCanvasSize ? canvasRef.value.getCanvasSize() : { width: 320, height: 320 };

  const result = recognizeSingleStroke(
    latestStroke,
    targetTemplateStroke,
    canvasSize.width,
    canvasSize.height
  );

  if (result.isMatch) {
    // Success! Update stroke count
    completedStrokesCount.value++;
    strokeWarning.value = "";

    // Clear user hand drawing, redraw only completed template strokes
    const completed = activeTemplateStrokes.value.slice(0, completedStrokesCount.value);
    canvasRef.value.drawCompleted(completed);

    // If character is fully completed
    if (completedStrokesCount.value === activeTemplateStrokes.value.length) {
      const isCorrect = !hasUsedHint.value;

      // Save to store
      store.recordDrawResult(
        currentQuestion.value.item.id,
        isCorrect
      );

      results.value.push({
        item: currentQuestion.value.item,
        userAnswer: "[coretan]",
        isCorrect,
        isSkipped: false,
        completedStrokes: completedStrokesCount.value,
        totalStrokes: activeTemplateStrokes.value ? activeTemplateStrokes.value.length : 0,
        strokePaths: activeTemplatePaths.value ? [...activeTemplatePaths.value] : []
      });

      triggerFeedback(isCorrect, currentQuestion.value.item.romaji);
    }
  } else {
    // Incorrect stroke - show warning message
    let warning = result.message || "";
    if (warning === "Posisi kurang tepat.") {
      warning = t("practice.strokeWarningPosition", { num: K + 1 });
    } else if (warning === "Arah terbalik.") {
      warning = t("practice.strokeWarningDirection", { num: K + 1 });
    } else if (warning === "Kurang melengkung.") {
      warning = t("practice.strokeWarningCurvatureLess", { num: K + 1 });
    } else if (warning === "Terlalu melengkung.") {
      warning = t("practice.strokeWarningCurvatureMore", { num: K + 1 });
    } else if (warning === "Bentuk kurang sesuai.") {
      warning = t("practice.strokeWarningShape", { num: K + 1 });
    } else {
      warning = t("practice.strokeWarningGeneral", { num: K + 1 });
    }
    strokeWarning.value = warning;
  }
}

// Clear active drawing mistakes and restore completed strokes
function handleCanvasClear() {
  strokeWarning.value = "";
  if (canvasRef.value) {
    const completed = activeTemplateStrokes.value
      ? activeTemplateStrokes.value.slice(0, completedStrokesCount.value)
      : [];
    canvasRef.value.drawCompleted(completed);
  }
}

// Submit Draw Answer
function submitDrawAnswer() {
  if (showFeedback.value || !currentQuestion.value || !canvasRef.value) return;

  const targetChar = currentQuestion.value.item.character;
  let isCorrect: boolean;
  let feedbackText: string;

  // If template SVG stroke path data is available, do strict sequential stroke order check
  if (hasUsedHint.value) {
    isCorrect = false;
    feedbackText = t("practice.incorrectFeedback", { romaji: currentQuestion.value.item.romaji.toUpperCase() });
  } else if (activeTemplateStrokes.value && activeTemplateStrokes.value.length > 0) {
    const userStrokes = canvasRef.value.getStrokes();
    const canvasSize = canvasRef.value.getCanvasSize ? canvasRef.value.getCanvasSize() : { width: 320, height: 320 };
    const matchResult = recognizeStrokeSequence(
      userStrokes,
      activeTemplateStrokes.value,
      targetChar,
      canvasSize.width,
      canvasSize.height
    );
    isCorrect = matchResult.isMatch;
    
    if (isCorrect) {
      feedbackText = t("practice.correctFeedback");
    } else {
      feedbackText = matchResult.message || t("practice.incorrectFeedback", { romaji: currentQuestion.value.item.romaji.toUpperCase() });
    }
  } else {
    // Fallback to standard $1 recognizer if SVG didn't load (offline)
    const drawnPoints = canvasRef.value.getPoints();
    const matchResult = recognizeStroke(drawnPoints, targetChar);
    isCorrect = matchResult.isMatch;
    feedbackText = isCorrect
      ? t("practice.correctFeedback")
      : t("practice.incorrectFeedback", { romaji: currentQuestion.value.item.romaji.toUpperCase() });
  }

  // Record inside Store Action
  store.recordDrawResult(currentQuestion.value.item.id, isCorrect);

  results.value.push({
    item: currentQuestion.value.item,
    userAnswer: hasUsedHint.value ? "HINT" : (isCorrect ? "OK" : "FAIL"),
    isCorrect,
    isSkipped: false,
    completedStrokes: completedStrokesCount.value,
    totalStrokes: activeTemplateStrokes.value ? activeTemplateStrokes.value.length : 0,
    strokePaths: activeTemplatePaths.value ? [...activeTemplatePaths.value] : []
  });

  triggerFeedback(isCorrect, feedbackText, true);
}

// Skip Question
function skipQuestion() {
  if (showFeedback.value || !currentQuestion.value) return;

  // Record failure inside Store Action
  if (practiceMode.value === "quiz") {
    store.recordQuizResult(currentQuestion.value.item.id, false);
  } else {
    store.recordDrawResult(currentQuestion.value.item.id, false);
  }

  results.value.push({
    item: currentQuestion.value.item,
    userAnswer: "-",
    isCorrect: false,
    isSkipped: true,
    completedStrokes: practiceMode.value === "draw" ? completedStrokesCount.value : undefined,
    totalStrokes: practiceMode.value === "draw" && activeTemplateStrokes.value ? activeTemplateStrokes.value.length : undefined,
    strokePaths: practiceMode.value === "draw" && activeTemplatePaths.value ? [...activeTemplatePaths.value] : undefined
  });

  triggerFeedback(false, currentQuestion.value.item.romaji);
}

// Trigger screen feedback
function triggerFeedback(isCorrect: boolean, msgOrRomaji: string, isCustomMsg = false) {
  feedbackStatus.value = isCorrect ? "correct" : "incorrect";
  if (isCustomMsg) {
    feedbackMessage.value = msgOrRomaji;
  } else {
    feedbackMessage.value = isCorrect
      ? t("practice.correctFeedback")
      : t("practice.incorrectFeedback", { romaji: msgOrRomaji.toUpperCase() });
  }

  showFeedback.value = true;

  // Delay transition: in drawing mode, give user a few seconds to compare drawing side-by-side
  const delay = practiceMode.value === "draw"
    ? (isCorrect ? 2500 : 3500)
    : (isCorrect ? 800 : 1800);
  setTimeout(() => {
    goToNextQuestion();
  }, delay);
}

// Navigate to next question or score page
function goToNextQuestion() {
  showFeedback.value = false;
  feedbackStatus.value = null;
  feedbackMessage.value = "";
  showDrawHint.value = false;

  if (currentQuestionIndex.value + 1 < questions.value.length) {
    currentQuestionIndex.value++;
    quizInput.value = "";

    if (practiceMode.value === "quiz") {
      nextTick(() => {
        quizInputRef.value?.focus();
      });
    }
  } else {
    // Session complete
    isSessionActive.value = false;
    isSessionFinished.value = true;
  }
}

// Restart session with same configurations
function restartPractice() {
  showDrawHint.value = false;
  startPractice();
}

// Go back to main configurations panel
function stopSession() {
  isSessionActive.value = false;
  isSessionFinished.value = false;
  showDrawHint.value = false;
}
</script>

<template>
  <div
    class="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 min-h-[80vh] flex flex-col"
  >
    <!-- Headers -->
    <header
      class="space-y-2 border-b-[3px] border-slate-950 dark:border-white pb-6"
    >
      <h1
        class="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3"
      >
        <Award class="w-10 h-10 text-violet-500" />
        {{ $t("practice.title") }}
      </h1>
      <p class="text-slate-600 dark:text-slate-400 font-semibold">
        {{ $t("practice.desc") }}
      </p>
    </header>

    <!-- Phase 1: Configuration Menu -->
    <div v-if="!isSessionActive && !isSessionFinished" class="space-y-8">
      <!-- Select Rows Section -->
      <section class="space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h2
            class="text-2xl font-black uppercase tracking-wider bg-yellow-300 dark:bg-yellow-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
          >
            {{ $t("practice.selectRows") }}
          </h2>

          <div v-if="isAnyCharacterSelected" class="flex items-center gap-3">
            <NeoBrutalistButton
              @click="startPractice"
              class="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-violet-400 text-slate-950 hover:bg-violet-500"
            >
              {{ $t("practice.startBtn") }}
            </NeoBrutalistButton>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          <!-- Left side: Group List (xl:col-span-5) -->
          <div
            class="xl:col-span-5 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] flex flex-col space-y-6 h-full"
          >
            <!-- Hiragana Selection -->
            <div class="space-y-4">
              <div
                class="flex justify-between items-center border-b-[2px] border-slate-200 dark:border-slate-800 pb-2"
              >
                <h3
                  class="font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-sm"
                >
                  {{ $t("practice.hiraganaRows") }}
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="selectAll('hiragana')"
                    class="text-xs font-black uppercase text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all"
                  >
                    {{ $t("practice.selectAll") }}
                  </button>
                  <span class="text-xs text-slate-300">|</span>
                  <button
                    @click="deselectAll('hiragana')"
                    class="text-xs font-black uppercase text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all"
                  >
                    {{ $t("practice.deselectAll") }}
                  </button>
                </div>
              </div>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto overflow-x-hidden no-scrollbar pr-1"
              >
                <div
                  v-for="group in hiraganaGroups"
                  :key="group.id"
                  @click="toggleGroup(group.id)"
                  :class="[
                    'p-3 border-[2px] cursor-pointer flex items-center justify-between transition-all select-none',
                    isGroupFullySelected(group.id)
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-[2px_2px_0px_0px_#10b981]'
                      : isGroupPartiallySelected(group.id)
                        ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-[2px_2px_0px_0px_#34d399]'
                        : 'border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-400',
                  ]"
                >
                  <div class="space-y-0.5 pr-2">
                    <div
                      class="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      {{ $t("rows." + group.label) }}
                    </div>
                    <div
                      class="text-[10px] text-slate-400 font-mono truncate max-w-[120px]"
                    >
                      {{ group.chars.join(", ") }}
                    </div>
                  </div>
                  <!-- Custom Checkbox Box -->
                  <div
                    class="w-[18px] h-[18px] border-[2px] border-slate-950 dark:border-white flex items-center justify-center transition-all bg-white shrink-0"
                    :class="[
                      isGroupFullySelected(group.id)
                        ? 'bg-emerald-400 dark:bg-emerald-500'
                        : isGroupPartiallySelected(group.id)
                          ? 'bg-amber-300 dark:bg-amber-400'
                          : '',
                    ]"
                  >
                    <Check
                      v-if="isGroupFullySelected(group.id)"
                      class="w-3 h-3 text-slate-950 stroke-[4]"
                    />
                    <div
                      v-else-if="isGroupPartiallySelected(group.id)"
                      class="w-2 h-0.5 bg-slate-950"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Katakana Selection -->
            <div class="space-y-4">
              <div
                class="flex justify-between items-center border-b-[2px] border-slate-200 dark:border-slate-800 pb-2"
              >
                <h3
                  class="font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 text-sm"
                >
                  {{ $t("practice.katakanaRows") }}
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="selectAll('katakana')"
                    class="text-xs font-black uppercase text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all"
                  >
                    {{ $t("practice.selectAll") }}
                  </button>
                  <span class="text-xs text-slate-300">|</span>
                  <button
                    @click="deselectAll('katakana')"
                    class="text-xs font-black uppercase text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all"
                  >
                    {{ $t("practice.deselectAll") }}
                  </button>
                </div>
              </div>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto overflow-x-hidden no-scrollbar pr-1"
              >
                <div
                  v-for="group in katakanaGroups"
                  :key="group.id"
                  @click="toggleGroup(group.id)"
                  :class="[
                    'p-3 border-[2px] cursor-pointer flex items-center justify-between transition-all select-none',
                    isGroupFullySelected(group.id)
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-[2px_2px_0px_0px_#f59e0b]'
                      : isGroupPartiallySelected(group.id)
                        ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/10 shadow-[2px_2px_0px_0px_#fbbf24]'
                        : 'border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-400',
                  ]"
                >
                  <div class="space-y-0.5 pr-2">
                    <div
                      class="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      {{ $t("rows." + group.label) }}
                    </div>
                    <div
                      class="text-[10px] text-slate-400 font-mono truncate max-w-[120px]"
                    >
                      {{ group.chars.join(", ") }}
                    </div>
                  </div>
                  <!-- Custom Checkbox Box -->
                  <div
                    class="w-[18px] h-[18px] border-[2px] border-slate-950 dark:border-white flex items-center justify-center transition-all bg-white shrink-0"
                    :class="[
                      isGroupFullySelected(group.id)
                        ? 'bg-amber-400 dark:bg-amber-500'
                        : isGroupPartiallySelected(group.id)
                          ? 'bg-amber-300 dark:bg-amber-400'
                          : '',
                    ]"
                  >
                    <Check
                      v-if="isGroupFullySelected(group.id)"
                      class="w-3 h-3 text-slate-950 stroke-[4]"
                    />
                    <div
                      v-else-if="isGroupPartiallySelected(group.id)"
                      class="w-2 h-0.5 bg-slate-950"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side: Character Details & Mode Configurations (xl:col-span-7) -->
          <div class="xl:col-span-7 flex flex-col space-y-6 h-full">
            <!-- Specific Character Selector Card -->
            <div
              class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] min-h-[350px] flex flex-col flex-1"
            >
              <div
                class="border-b-[2px] border-slate-200 dark:border-slate-800 pb-3 mb-4"
              >
                <h3
                  class="font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 text-sm"
                >
                  {{ $t("practice.selectChars") }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {{ $t("practice.selectCharsDesc") }}
                </p>
              </div>

              <!-- Scrollable active groups detail selector -->
              <div
                v-if="activeGroupsWithSelections.length > 0"
                class="space-y-6 overflow-y-auto max-h-[420px] pr-2 no-scrollbar"
              >
                <div
                  v-for="group in activeGroupsWithSelections"
                  :key="group.id"
                  class="space-y-3"
                >
                  <div
                    class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-1"
                  >
                    <span
                      class="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400"
                    >
                      {{ group.type === "hiragana" ? "Hiragana" : "Katakana" }}
                      — {{ $t("rows." + group.label) }}
                    </span>
                    <div class="flex gap-2">
                      <button
                        @click="toggleGroup(group.id)"
                        class="text-[10px] font-black uppercase text-violet-500 hover:text-violet-600 transition-all"
                      >
                        {{
                          isGroupFullySelected(group.id)
                            ? $t("practice.deselectAll")
                            : $t("practice.selectAll")
                        }}
                      </button>
                    </div>
                  </div>

                  <!-- Grid of individual characters -->
                  <div class="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    <div
                      v-for="item in group.items"
                      :key="item.id"
                      @click="toggleCharacter(item.id)"
                      :class="[
                        'p-2 border-[2px] border-slate-950 dark:border-white cursor-pointer flex flex-col items-center justify-center transition-all select-none h-14',
                        selectedCharacters[item.id]
                          ? 'bg-violet-300 dark:bg-violet-800 text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]'
                          : 'bg-transparent text-slate-400 dark:text-slate-600 hover:border-slate-400 hover:text-slate-600 dark:hover:text-slate-400 border-dashed',
                      ]"
                    >
                      <span class="text-lg font-black">{{
                        item.character
                      }}</span>
                      <span
                        class="text-[9px] font-mono uppercase tracking-wider mt-0.5"
                        :class="
                          selectedCharacters[item.id]
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-700'
                        "
                        >{{ item.romaji }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex-1 flex flex-col items-center justify-center text-center p-8 border-[2px] border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600"
              >
                <GraduationCap class="w-12 h-12 stroke-[1.5] mb-2" />
                <p class="text-sm font-bold uppercase tracking-wider">
                  {{ $t("practice.noGroupsSelectedForChars") }}
                </p>
              </div>
            </div>

            <!-- Mode Selection Card -->
            <div
              class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]"
            >
              <div class="space-y-3">
                <h3
                  class="font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 text-xs"
                >
                  {{ $t("practice.mode") }}
                </h3>
                <div class="flex gap-2">
                  <button
                    @click="practiceMode = 'quiz'"
                    :class="[
                      'flex-1 px-4 py-3 font-black uppercase text-xs border-[2px] border-slate-950 dark:border-white transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]',
                      practiceMode === 'quiz'
                        ? 'bg-violet-300 dark:bg-violet-800 text-slate-950 dark:text-white font-black'
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
                    ]"
                  >
                    {{ $t("practice.modeQuiz") }}
                  </button>
                  <button
                    @click="practiceMode = 'draw'"
                    :class="[
                      'flex-1 px-4 py-3 font-black uppercase text-xs border-[2px] border-slate-950 dark:border-white transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]',
                      practiceMode === 'draw'
                        ? 'bg-violet-300 dark:bg-violet-800 text-slate-950 dark:text-white font-black'
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
                    ]"
                  >
                    {{ $t("practice.modeDraw") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Phase 2: Active Practice Arena -->
    <div
      v-else-if="isSessionActive"
      class="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 w-full"
    >
      <div class="w-full max-w-3xl space-y-8 flex flex-col">
        <!-- Arena header: count and score tracker -->
        <div
          class="flex justify-between items-center bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
        >
          <div class="space-y-1">
            <div
              class="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider"
            >
              {{
                $t("practice.questionNumber", {
                  current: currentQuestionIndex + 1,
                  total: questions.length,
                })
              }}
            </div>
            <div
              class="h-2 w-48 sm:w-64 bg-slate-100 dark:bg-slate-850 border-[2px] border-slate-950 dark:border-white rounded-none overflow-hidden"
            >
              <div
                class="h-full bg-violet-400 transition-all duration-300"
                :style="{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }"
              ></div>
            </div>
          </div>

          <div class="text-right">
            <div
              class="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider"
            >
              {{ $t("practice.scoreLabel") }}
            </div>
            <div class="font-black text-xl text-slate-950 dark:text-white">
              {{ correctCount }} / {{ results.length }}
            </div>
          </div>
        </div>

        <!-- Question Card & Interactive Pad -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          <!-- Target Character Box -->
          <div
            class="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white px-6 mx-auto w-full h-[340px] shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]"
            :class="[
              (currentQuestion?.item.character.length ?? 1) > 1
                ? 'max-w-[420px]'
                : 'max-w-[340px]'
            ]"
          >
            <template v-if="practiceMode === 'quiz'">
              <span
                class="font-black text-slate-950 dark:text-white font-sans select-none leading-none text-center"
                :class="[
                  (currentQuestion?.item.character.length ?? 1) > 2
                    ? 'text-6xl md:text-7xl'
                    : (currentQuestion?.item.character.length ?? 1) > 1
                      ? 'text-8xl md:text-9xl'
                      : 'text-9xl md:text-[10rem]'
                ]"
              >
                {{ currentQuestion?.item.character }}
              </span>
            </template>
            <template v-else>
              <!-- Drawing mode: show Romaji prompt by default -->
              <div v-show="!showDrawHint && !showFeedback" class="flex flex-col items-center justify-center space-y-3">
                <span class="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                  {{ $t("practice.drawPrompt") }}
                </span>
                <span class="text-7xl md:text-8xl font-black text-slate-950 dark:text-white uppercase tracking-tight select-none">
                  {{ currentQuestion?.item.romaji }}
                </span>
              </div>
              
              <!-- Draw mode hint/mistake: show stroke order SVG -->
              <div v-show="showDrawHint || showFeedback" class="w-full h-full flex flex-col items-center justify-center space-y-2">
                <span class="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                  {{ showDrawHint ? $t("practice.hintLabel") : (feedbackStatus === 'correct' ? $t("practice.correctFeedback") : $t("practice.incorrectLabel")) }}
                </span>
                <div class="relative w-44 h-44 bg-white border-2 border-slate-950 p-2 flex items-center justify-center">
                  <img
                    v-if="!svgLoadFailed && strokeOrderUrl"
                    :src="strokeOrderUrl"
                    @error="svgLoadFailed = true"
                    class="w-full h-full object-contain select-none"
                    :alt="$t('practice.strokeGuideAlt')"
                  />
                  <span
                    v-else
                    class="text-8xl font-black text-slate-950 select-none leading-none"
                  >
                    {{ currentQuestion?.item.character }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- Input arena (Quiz vs Canvas) -->
          <div class="flex flex-col items-center space-y-6 w-full">
            <!-- Quiz Mode Input Form -->
            <div
              v-if="practiceMode === 'quiz'"
              class="w-full max-w-sm space-y-4"
            >
              <div class="space-y-1">
                <label
                  for="quiz-input"
                  class="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider"
                >
                  {{ $t("practice.typeHelp") }}
                </label>
                <input
                  id="quiz-input"
                  ref="quizInputRef"
                  type="text"
                  v-model="quizInput"
                  @keyup.enter="submitQuizAnswer"
                  :disabled="showFeedback"
                  class="w-full text-center py-4 px-6 text-3xl font-black uppercase rounded-none border-[3px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-950 text-slate-950 dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] focus:outline-none focus:bg-white dark:focus:bg-slate-900 disabled:opacity-75 disabled:pointer-events-none placeholder:text-slate-350"
                  placeholder="..."
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                />
              </div>

              <div class="flex gap-4">
                <NeoBrutalistButton
                  @click="submitQuizAnswer"
                  :disabled="showFeedback || !quizInput.trim()"
                  class="flex-1 py-3 bg-emerald-400 text-slate-950 hover:bg-emerald-500 disabled:opacity-40"
                >
                  {{ $t("practice.submitBtn") }}
                </NeoBrutalistButton>
                <NeoBrutalistButton
                  @click="skipQuestion"
                  :disabled="showFeedback"
                  class="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40"
                >
                  {{ $t("practice.skipBtn") }}
                </NeoBrutalistButton>
              </div>
            </div>

            <!-- Drawing Mode Pad -->
            <div v-else class="w-full flex flex-col items-center space-y-4">
              <div class="text-center">
                <span
                  class="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider"
                >
                  {{ $t("practice.drawHelp") }}
                </span>
              </div>

              <KanaCanvas
                ref="canvasRef"
                :char="currentQuestion?.item.character || ''"
                :show-outline="showDrawHint || showFeedback"
                @stroke-completed="handleStrokeCompleted"
                @clear="handleCanvasClear"
              />

              <p v-if="strokeWarning" class="text-rose-500 dark:text-rose-400 font-black text-xs uppercase tracking-wider text-center max-w-[280px] sm:max-w-[320px] leading-tight transition-all duration-200">
                {{ strokeWarning }}
              </p>

              <div class="flex gap-2 w-full max-w-[280px] sm:max-w-[320px]">
                <NeoBrutalistButton
                  @click="submitDrawAnswer"
                  :disabled="showFeedback"
                  class="flex-1 py-3 bg-emerald-400 text-slate-950 hover:bg-emerald-500 disabled:opacity-40 text-xs sm:text-sm font-black"
                >
                  {{ $t("practice.submitBtn") }}
                </NeoBrutalistButton>
                <NeoBrutalistButton
                  @click="toggleHint"
                  :disabled="showFeedback"
                  class="px-3 py-3 bg-amber-300 text-slate-950 hover:bg-amber-400 disabled:opacity-40 text-xs sm:text-sm font-black"
                >
                  {{ $t("practice.hintBtn") }}
                </NeoBrutalistButton>
                <NeoBrutalistButton
                  @click="skipQuestion"
                  :disabled="showFeedback"
                  class="px-3 py-3 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 text-xs sm:text-sm font-black"
                >
                  {{ $t("practice.skipBtn") }}
                </NeoBrutalistButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom controls: abort session -->
        <div class="flex justify-center pt-2">
          <button
            @click="stopSession"
            class="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all"
          >
            <Settings class="w-4 h-4" />
            {{ $t("practice.configBtn") }}
          </button>
        </div>
      </div>

      <!-- Feedback Banner Overlay -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-4"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 -translate-y-4"
      >
        <div
          v-if="showFeedback"
          class="fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:mx-0 z-50 w-auto sm:w-full sm:max-w-xl flex items-center justify-center gap-3 border-[3px] border-slate-950 p-4 shadow-[4px_4px_0px_0px_#000]"
          :class="[
            feedbackStatus === 'correct'
              ? 'bg-emerald-400 text-slate-950'
              : 'bg-rose-400 text-slate-950',
          ]"
        >
          <Check
            v-if="feedbackStatus === 'correct'"
            class="w-6 h-6 stroke-[3]"
          />
          <X v-else class="w-6 h-6 stroke-[3]" />
          <span
            class="font-black uppercase tracking-wider text-sm sm:text-base"
          >
            {{ feedbackMessage }}
          </span>
        </div>
      </Transition>
    </div>

    <!-- Phase 3: Score Results Screen -->
    <div v-else-if="isSessionFinished" class="space-y-8">
      <section
        class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] space-y-6"
      >
        <div class="flex flex-col items-center text-center space-y-3">
          <Award class="w-16 h-16 text-yellow-400 stroke-[2]" />
          <h2
            class="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white"
          >
            {{ $t("practice.finishTitle") }}
          </h2>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {{ $t("practice.finishDesc") }}
          </p>
        </div>

        <!-- Scores breakdown -->
        <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div
            class="border-[2px] border-slate-950 dark:border-white p-4 text-center bg-[#f4f3ec] dark:bg-slate-950 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
          >
            <div
              class="text-xs font-black uppercase text-slate-400 tracking-wider"
            >
              {{ $t("practice.accuracy") }}
            </div>
            <div
              class="text-3xl font-black text-slate-950 dark:text-white mt-1"
            >
              {{ accuracyPercentage }}%
            </div>
          </div>

          <div
            class="border-[2px] border-slate-950 dark:border-white p-4 text-center bg-[#f4f3ec] dark:bg-slate-950 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
          >
            <div
              class="text-xs font-black uppercase text-slate-400 tracking-wider"
            >
              {{ $t("practice.score") }}
            </div>
            <div
              class="text-3xl font-black text-slate-950 dark:text-white mt-1"
            >
              {{ correctCount }} / {{ results.length }}
            </div>
          </div>
        </div>
      </section>

      <!-- Details Summary Table -->
      <section class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 class="font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 text-sm">
            {{ $t("practice.questionSummary") }}
          </h3>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-1 border-[2px] border-slate-950 dark:border-white p-0.5 w-fit shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
            <button
              @click="tableFilter = 'all'"
              class="px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors"
              :class="tableFilter === 'all'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'"
            >
              {{ $t("practice.filterAll") }} ({{ results.length }})
            </button>
            <button
              @click="tableFilter = 'correct'"
              class="px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors"
              :class="tableFilter === 'correct'
                ? 'bg-emerald-500 text-white'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'"
            >
              <span class="inline-flex items-center gap-1">
                <Check class="w-3 h-3 stroke-[3]" />
                {{ $t("practice.filterCorrect") }} ({{ correctCount }})
              </span>
            </button>
            <button
              @click="tableFilter = 'incorrect'"
              class="px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors"
              :class="tableFilter === 'incorrect'
                ? 'bg-rose-500 text-white'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'"
            >
              <span class="inline-flex items-center gap-1">
                <X class="w-3 h-3 stroke-[3]" />
                {{ $t("practice.filterIncorrect") }} ({{ results.length - correctCount }})
              </span>
            </button>
          </div>
        </div>

        <div class="border-[3px] border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] overflow-hidden">
          <!-- Sticky Header -->
          <div class="overflow-x-auto">
            <table class="w-full text-left bg-white dark:bg-slate-900 border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase text-xs tracking-wider">
                  <th class="py-3 px-4 whitespace-nowrap">#</th>
                  <th class="py-3 px-4 whitespace-nowrap">{{ $t("practice.tableChar") }}</th>
                  <th class="py-3 px-4 whitespace-nowrap">{{ $t("practice.tableRomaji") }}</th>
                  <th class="py-3 px-4 whitespace-nowrap">{{ $t("practice.tableYourAnswer") }}</th>
                  <th class="py-3 px-4 text-center whitespace-nowrap">{{ $t("practice.tableResult") }}</th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-auto max-h-[520px] overflow-x-auto">
            <table class="w-full text-left bg-white dark:bg-slate-900 border-collapse">
              <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                <!-- Empty state -->
                <tr v-if="filteredResults.length === 0">
                  <td colspan="5" class="py-10 text-center text-slate-400 dark:text-slate-600 font-black uppercase tracking-wider text-xs">
                    {{ $t("practice.filterEmpty") }}
                  </td>
                </tr>

                <tr
                  v-for="(res, idx) in filteredResults"
                  :key="idx"
                  class="transition-colors"
                  :class="[
                    res.isCorrect
                      ? idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-emerald-50/40 dark:bg-emerald-950/10'
                      : idx % 2 === 0 ? 'bg-rose-50/60 dark:bg-rose-950/15' : 'bg-rose-50/30 dark:bg-rose-950/10'
                  ]"
                >
                  <!-- Row number -->
                  <td class="py-2.5 px-4 text-xs font-black text-slate-400 dark:text-slate-600 w-10 whitespace-nowrap">
                    {{ idx + 1 }}
                  </td>
                  <!-- Character -->
                  <td class="py-2.5 px-4 font-black text-2xl text-slate-950 dark:text-white whitespace-nowrap">
                    {{ res.item.character }}
                  </td>
                  <!-- Romaji -->
                  <td class="py-2.5 px-4 font-mono font-bold uppercase text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {{ res.item.romaji }}
                  </td>
                  <!-- Answer / Stroke Preview -->
                  <td class="py-2.5 px-4 font-mono">
                    <template v-if="res.strokePaths && res.strokePaths.length > 0">
                      <div class="flex items-center gap-2">
                        <svg
                          viewBox="0 0 109 109"
                          class="w-9 h-9 border-2 border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-950 p-0.5 flex-shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                        >
                          <g class="stroke-slate-950/12 dark:stroke-white/10 stroke-[4] fill-none">
                            <path v-for="(d, pidx) in res.strokePaths" :key="'bg-'+pidx" :d="d" />
                          </g>
                          <g class="stroke-emerald-600 dark:stroke-emerald-400 stroke-[8] stroke-linecap-round stroke-linejoin-round fill-none">
                            <path
                              v-for="(d, pidx) in res.strokePaths.slice(0, res.completedStrokes)"
                              :key="'fg-'+pidx"
                              :d="d"
                            />
                          </g>
                        </svg>
                        <span class="text-[11px] font-black whitespace-nowrap"
                          :class="res.completedStrokes === res.totalStrokes ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'"
                        >
                          {{ res.completedStrokes }} / {{ res.totalStrokes }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-slate-600 dark:text-slate-400">{{ res.userAnswer }}</span>
                    </template>
                  </td>
                  <!-- Result Badge -->
                  <td class="py-2.5 px-4">
                    <div class="flex justify-center">
                      <span
                        v-if="res.isCorrect"
                        class="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap"
                      >
                        <Check class="w-3 h-3 stroke-[3]" />
                        {{ $t("practice.resultCorrect") }}
                      </span>
                      <span
                        v-else-if="res.isSkipped"
                        class="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase px-2 py-0.5 border border-slate-300 dark:border-slate-700 whitespace-nowrap"
                      >
                        <ArrowRight class="w-3 h-3 stroke-[3]" />
                        {{ $t("practice.resultSkipped") }}
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center gap-1 bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase px-2 py-0.5 border border-rose-300 dark:border-rose-700 whitespace-nowrap"
                      >
                        <X class="w-3 h-3 stroke-[3]" />
                        {{ $t("practice.resultIncorrect") }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Action Panel Buttons -->
      <section class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <NeoBrutalistButton
          @click="restartPractice"
          class="py-3 px-6 bg-violet-400 text-slate-950 hover:bg-violet-500 flex items-center justify-center gap-2"
        >
          <RotateCcw class="w-4 h-4" />
          {{ $t("practice.restartBtn") }}
        </NeoBrutalistButton>
        <NeoBrutalistButton
          @click="stopSession"
          class="py-3 px-6 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
        >
          <Settings class="w-4 h-4" />
          {{ $t("practice.configBtn") }}
        </NeoBrutalistButton>
      </section>
    </div>
  </div>
</template>
