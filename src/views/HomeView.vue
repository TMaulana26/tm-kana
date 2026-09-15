<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { useProgressStore } from "@/stores/progress";
import { exportProgress, importProgress } from "@/utils/progressCrypto";
import NeoBrutalistCard from "@/components/NeoBrutalistCard.vue";
import NeoBrutalistInput from "@/components/NeoBrutalistInput.vue";
import NeoBrutalistButton from "@/components/NeoBrutalistButton.vue";
import NeoBrutalistLinkCard from "@/components/NeoBrutalistLinkCard.vue";
import {
  User,
  Download,
  Upload,
  BookOpen,
  Info,
  CheckCircle2,
  XCircle,
  Check,
} from "lucide-vue-next";

const { t } = useI18n();
const store = useProgressStore();

const localNickname = ref(store.nickname);
const isNicknameSaved = ref(false);

const heroKanaChips = [
  { char: "あ", romaji: "a" },
  { char: "カ", romaji: "ka" },
  { char: "さ", romaji: "sa" },
  { char: "タ", romaji: "ta" },
  { char: "な", romaji: "na" },
];

function updateNickname() {
  store.setNickname(localNickname.value);
  isNicknameSaved.value = true;
  toast.success(t("toast.nicknameUpdated"));
  setTimeout(() => {
    isNicknameSaved.value = false;
  }, 1800);
}

function handleExport() {
  try {
    const base64 = exportProgress(store.nickname, store.progress);
    const blob = new Blob([base64], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `tm_kana_backup_${store.nickname}.txt`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success(t("toast.exportSuccess"));
  } catch {
    toast.error(t("toast.importErrorInvalid"));
  }
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const importStatus = ref<"idle" | "success" | "error">("idle");
const importMessage = ref("");

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const result = importProgress(text, store.nickname);

    if (result.success && result.progressData) {
      store.loadProgress(result.progressData);
      localNickname.value = store.nickname;

      importStatus.value = "success";
      importMessage.value = t("toast.importSuccess", {
        name: result.progressData.nickname,
      });
      toast.success(importMessage.value);
    } else {
      importStatus.value = "error";
      if (result.error === "nickname_mismatch") {
        importMessage.value = t("toast.importErrorMismatch");
      } else {
        importMessage.value = t("toast.importErrorInvalid");
      }
      toast.error(importMessage.value);
    }
  };
  reader.onerror = () => {
    importStatus.value = "error";
    importMessage.value = t("toast.importErrorInvalid");
    toast.error(importMessage.value);
  };
  reader.readAsText(file);
}
</script>

<template>
  <div class="space-y-8 py-4">
    <!-- Welcome Header Banner (Neo-brutalist Style) -->
    <div
      class="animate-hero-stamp relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-slate-700 bg-[#00f5d4] dark:bg-slate-900 text-slate-950 dark:text-slate-100 p-8 md:p-12 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#f59e0b]"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.04),transparent)]"
      ></div>
      <div class="relative z-10 max-w-3xl space-y-5">
        <h1
          class="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white"
        >
          {{ $t("common.welcome") }}
        </h1>
        <p
          class="text-lg md:text-xl font-bold leading-relaxed text-slate-900 dark:text-slate-300 max-w-2xl"
        >
          {{ $t("home.homeDesc") }}
        </p>

        <!-- Interactive Tactile Kana Chips -->
        <div
          class="flex flex-wrap items-center gap-2.5 pt-2"
          aria-label="Kana preview"
        >
          <div
            v-for="chip in heroKanaChips"
            :key="chip.char"
            class="kana-chip inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-slate-950/80 border-[2px] border-slate-950 dark:border-slate-400 font-mono font-black text-sm text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_#08060d] dark:shadow-[2px_2px_0px_0px_#f59e0b] cursor-default select-none transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#08060d] active:translate-y-0"
          >
            <span class="text-base font-black">{{ chip.char }}</span>
            <span
              class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
              >{{ chip.romaji }}</span
            >
          </div>
        </div>
      </div>
      <!-- Background Decorative Aksara with subtle ambient drift -->
      <div
        class="animate-watermark-float absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 text-[10rem] font-black text-slate-950/10 dark:text-white/5 select-none pointer-events-none font-sans"
        aria-hidden="true"
      >
        {{ "たまかな" }}
      </div>
    </div>

    <!-- Main Grid Configuration -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Profile and Backup Management -->
      <div class="space-y-8 animate-cascade-left">
        <!-- Profile Card (Neo-brutalist) -->
        <NeoBrutalistCard
          :title="$t('home.profileTitle')"
          :description="$t('home.profileDesc')"
          header-bg="bg-violet-200 dark:bg-violet-950/40"
          content-class="space-y-4"
        >
          <template #icon>
            <User class="w-6 h-6" />
          </template>

          <div class="space-y-2">
            <label
              for="nickname"
              class="text-sm font-black uppercase tracking-wide text-slate-800 dark:text-slate-200"
            >
              {{ $t("home.nicknameLabel") }}
            </label>
            <div class="flex gap-3">
              <NeoBrutalistInput
                id="nickname"
                v-model="localNickname"
                :placeholder="$t('home.nicknamePlaceholder')"
                class="flex-1 h-12"
              />
              <NeoBrutalistButton
                variant="danger"
                @click="updateNickname"
                class="h-12 px-6 bg-[#ff007f] hover:bg-[#e60072] text-white transition-all duration-150"
                :class="{
                  'bg-emerald-600 hover:bg-emerald-500 text-white': isNicknameSaved,
                }"
              >
                <template v-if="isNicknameSaved">
                  <Check class="w-4 h-4 mr-1.5 stroke-[3px] animate-check-pop" />
                  {{ $t("common.saved") }}
                </template>
                <template v-else>
                  {{ $t("common.save") }}
                </template>
              </NeoBrutalistButton>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-400 font-bold flex gap-1.5 items-start pt-1"
            >
              <Info
                class="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5"
              />
              <span>{{ $t("home.nicknameHelp") }}</span>
            </p>
          </div>
        </NeoBrutalistCard>

        <!-- Backup & Restore Card (Neo-brutalist) -->
        <NeoBrutalistCard
          :title="$t('home.backupTitle')"
          :description="$t('home.backupDesc')"
          header-bg="bg-indigo-200 dark:bg-indigo-950/40"
          content-class="space-y-6"
        >
          <template #icon>
            <Download class="w-6 h-6" />
          </template>

          <!-- Export option -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#f4f3ec] dark:bg-slate-950/50 border-[3px] border-slate-950 dark:border-slate-700 rounded-none gap-4"
          >
            <div>
              <p class="font-black text-sm uppercase">
                {{ $t("home.exportTitle") }}
              </p>
              <p class="text-xs font-bold text-slate-600 dark:text-slate-400">
                {{ $t("home.exportDesc") }}
              </p>
            </div>
            <NeoBrutalistButton
              variant="success"
              @click="handleExport"
              class="w-full sm:w-auto h-11 px-5 bg-[#00f5d4] hover:bg-[#00d4b8] text-slate-950"
            >
              <Download class="w-4 h-4 mr-2 stroke-[3px]" />
              {{ $t("home.exportBtn") }}
            </NeoBrutalistButton>
          </div>

          <!-- Import Dropzone -->
          <div class="space-y-2">
            <span
              class="text-sm font-black uppercase tracking-wide text-slate-800 dark:text-slate-200"
              >{{ $t("home.importTitle") }}</span
            >
            <!-- Idle State -->
            <div
              v-if="importStatus === 'idle'"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
              @click="triggerFileInput"
              class="border-[3px] border-dashed rounded-none p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 text-center border-slate-950 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-[#f4f3ec] dark:bg-slate-900 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#8b5cf6]"
              :class="{
                'border-violet-500 bg-violet-100 dark:bg-violet-950/40 animate-dropzone-active':
                  isDragging,
              }"
            >
              <div
                class="w-12 h-12 rounded-none border-[3px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-950 dark:text-white transition-transform duration-200"
                :class="{ 'animate-icon-float': isDragging }"
              >
                <Upload class="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div>
                <p
                  class="text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white"
                >
                  {{ $t("home.importDragDrop") }}
                </p>
                <p
                  class="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1"
                >
                  {{ $t("home.importDesc") }}
                </p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept=".txt"
                class="hidden"
                @change="handleFileChange"
              />
            </div>

            <!-- Success State -->
            <div
              v-else-if="importStatus === 'success'"
              class="animate-status-pop border-[3px] border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-none p-8 flex flex-col items-center justify-center gap-3 text-center shadow-[4px_4px_0px_0px_#10b981]"
            >
              <div
                class="w-12 h-12 rounded-none border-[3px] border-emerald-500 bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-500 animate-check-pop"
              >
                <CheckCircle2 class="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div>
                <p class="text-sm font-black uppercase tracking-wide">
                  {{ $t("home.importSuccessLabel") }}
                </p>
                <p class="text-xs font-bold mt-1 leading-relaxed">
                  {{ importMessage }}
                </p>
              </div>
              <button
                @click.stop="importStatus = 'idle'"
                class="mt-1 px-3 py-1.5 border-[2px] border-emerald-500 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[10px] font-black uppercase tracking-wider transition-colors"
              >
                {{ $t("home.importAnotherBtn") }}
              </button>
            </div>

            <!-- Error State -->
            <div
              v-else-if="importStatus === 'error'"
              class="animate-status-pop border-[3px] border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-none p-8 flex flex-col items-center justify-center gap-3 text-center shadow-[4px_4px_0px_0px_#f43f5e]"
            >
              <div
                class="w-12 h-12 rounded-none border-[3px] border-rose-500 bg-white dark:bg-slate-950 flex items-center justify-center text-rose-500 animate-error-shake"
              >
                <XCircle class="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div>
                <p class="text-sm font-black uppercase tracking-wide">
                  {{ $t("home.importFailedLabel") }}
                </p>
                <p
                  class="text-xs font-bold mt-1 max-w-sm mx-auto leading-relaxed"
                >
                  {{ importMessage }}
                </p>
              </div>
              <button
                @click.stop="
                  importStatus = 'idle';
                  triggerFileInput();
                "
                class="mt-1 px-3 py-1.5 border-[2px] border-rose-500 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[10px] font-black uppercase tracking-wider transition-colors"
              >
                {{ $t("home.importRetryBtn") }}
              </button>
            </div>
          </div>
        </NeoBrutalistCard>
      </div>

      <!-- Right Column: External Learning Resources -->
      <div
        class="space-y-8 flex flex-col justify-between h-full animate-cascade-right"
      >
        <!-- Resources Introduction (Neo-brutalist) -->
        <NeoBrutalistCard
          :title="$t('home.resourcesTitle')"
          :description="$t('home.resourcesDesc')"
          header-bg="bg-amber-200 dark:bg-amber-950/40"
          card-class="flex-1 flex flex-col justify-between"
          content-class="space-y-6 flex-1 flex flex-col justify-center"
        >
          <template #icon>
            <BookOpen class="w-6 h-6" />
          </template>

          <div class="flex flex-col gap-6">
            <!-- Tofugu Hiragana Card -->
            <NeoBrutalistLinkCard
              href="https://www.tofugu.com/japanese/learn-hiragana/"
              tag-text="HIRAGANA"
              tag-bg="bg-violet-300"
              :title="$t('home.tofuguHiraganaTitle')"
              :description="$t('home.tofuguHiraganaDesc')"
              :learn-more-text="$t('home.learnMore')"
            />

            <!-- Tofugu Katakana Card -->
            <NeoBrutalistLinkCard
              href="https://www.tofugu.com/japanese/learn-katakana/"
              tag-text="KATAKANA"
              tag-bg="bg-indigo-300"
              :title="$t('home.tofuguKatakanaTitle')"
              :description="$t('home.tofuguKatakanaDesc')"
              :learn-more-text="$t('home.learnMore')"
            />
          </div>
        </NeoBrutalistCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hero stamp entrance */
.animate-hero-stamp {
  animation: heroStamp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroStamp {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Staggered column arrivals */
.animate-cascade-left {
  animation: cascadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}

.animate-cascade-right {
  animation: cascadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
}

@keyframes cascadeSlide {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtle ambient watermark drift */
.animate-watermark-float {
  animation: watermarkDrift 8s ease-in-out infinite alternate;
}

@keyframes watermarkDrift {
  0% {
    transform: translate(16.666%, 16.666%) rotate(0deg);
  }
  50% {
    transform: translate(15%, 18%) rotate(-1deg);
  }
  100% {
    transform: translate(18%, 15%) rotate(1deg);
  }
}

/* Dropzone drag active pulse */
.animate-dropzone-active {
  animation: dropzonePulse 1.2s ease-in-out infinite alternate;
}

@keyframes dropzonePulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.01);
  }
}

/* Subtle float on upload icon while dragging */
.animate-icon-float {
  animation: iconFloat 0.7s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}

@keyframes iconFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}

/* Tactile pop on status changes */
.animate-status-pop {
  animation: statusPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes statusPop {
  0% {
    opacity: 0;
    transform: scale(0.97);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Checkmark pop on save confirmation */
.animate-check-pop {
  animation: checkPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes checkPop {
  0% {
    opacity: 0;
    transform: scale(0.75);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Error shake on failure */
.animate-error-shake {
  animation: errorShake 0.3s ease-in-out both;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-3px);
  }
  40%,
  80% {
    transform: translateX(3px);
  }
}

/* Prefers-reduced-motion: preserve opacity/clarity, remove motion */
@media (prefers-reduced-motion: reduce) {
  .animate-hero-stamp,
  .animate-cascade-left,
  .animate-cascade-right,
  .animate-watermark-float,
  .animate-dropzone-active,
  .animate-icon-float,
  .animate-status-pop,
  .animate-check-pop,
  .animate-error-shake {
    animation: none !important;
    transform: none !important;
    transition: opacity 0.15s ease !important;
  }
}
</style>
