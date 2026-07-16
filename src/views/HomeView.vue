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
import { User, Download, Upload, BookOpen, Info } from "lucide-vue-next";

const { t } = useI18n();
const store = useProgressStore();

const localNickname = ref(store.nickname);

function updateNickname() {
  store.setNickname(localNickname.value);
  toast.success(
    t("toast.exportSuccess").replace(
      /.*dieksport.*/,
      "Nama panggilan berhasil diperbarui!",
    ),
  );
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
      toast.success(
        t("toast.importSuccess", { name: result.progressData.nickname }),
      );
    } else {
      if (result.error === "nickname_mismatch") {
        toast.error(
          t("toast.importErrorMismatch", {
            fileNickname: result.fileNickname || "?",
            currentNickname: store.nickname,
          }),
        );
      } else {
        toast.error(t("toast.importErrorInvalid"));
      }
    }
  };
  reader.onerror = () => {
    toast.error(t("toast.importErrorInvalid"));
  };
  reader.readAsText(file);
}
</script>

<template>
  <div class="space-y-8 py-4 animate-fade-in">
    <!-- Welcome Header Banner (Neo-brutalist Style) -->
    <div
      class="relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-white bg-[#00f5d4] text-slate-950 p-8 md:p-12 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#fff]"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]"
      ></div>
      <div class="relative z-10 max-w-3xl space-y-4">
        <h1
          class="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950"
        >
          {{ $t("common.welcome") }}
        </h1>
        <p
          class="text-lg md:text-xl font-bold leading-relaxed text-slate-900 max-w-2xl"
        >
          {{ $t("home.homeDesc") }}
        </p>
      </div>
      <!-- Background Decorative Aksara -->
      <div
        class="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 text-[10rem] font-black text-slate-950/10 select-none pointer-events-none font-sans"
      >
        {{ 'あア' }}
      </div>
    </div>

    <!-- Main Grid Configuration -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Profile and Backup Management -->
      <div class="space-y-8">
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
                @click="updateNickname"
                class="h-12 px-6 bg-[#ff007f] hover:bg-[#e60072] text-white"
              >
                {{ $t("common.save") }}
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
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#f4f3ec] dark:bg-slate-950/50 border-[3px] border-slate-950 dark:border-white rounded-none gap-4"
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
            <div
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
              @click="triggerFileInput"
              class="border-[3px] border-dashed rounded-none p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 text-center"
              :class="[
                isDragging
                  ? 'border-violet-500 bg-violet-100 dark:bg-violet-950/40 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]'
                  : 'border-slate-950 dark:border-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-[#f4f3ec] dark:bg-[#1f2028] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]',
              ]"
            >
              <div
                class="w-12 h-12 rounded-none border-[3px] border-slate-950 dark:border-white bg-white dark:bg-slate-950 flex items-center justify-center text-slate-950 dark:text-white"
              >
                <Upload class="w-6 h-6" />
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
          </div>
        </NeoBrutalistCard>
      </div>

      <!-- Right Column: External Learning Resources -->
      <div class="space-y-8 flex flex-col justify-between h-full">
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
