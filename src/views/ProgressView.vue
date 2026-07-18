<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useProgressStore } from "@/stores/progress";
import { kanaData } from "@/constants/kanaData";
import NeoBrutalistButton from "@/components/NeoBrutalistButton.vue";
import {
  Award,
  Layers,
  GraduationCap,
  PenTool,
  Search,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-vue-next";

const { t } = useI18n();
const store = useProgressStore();
const router = useRouter();

// State
const searchQuery = ref("");
const alphabetFilter = ref<"all" | "hiragana" | "katakana">("all");
const groupFilter = ref<"all" | "gojuon" | "dakuten" | "yoon">("all");
const showResetModal = ref(false);

// Flat character maps
const hiraganaCharacters = computed(() => [
  ...kanaData.hiragana.gojuon,
  ...kanaData.hiragana.dakuten,
  ...kanaData.hiragana.yoon
]);

const katakanaCharacters = computed(() => [
  ...kanaData.katakana.gojuon,
  ...kanaData.katakana.dakuten,
  ...kanaData.katakana.yoon
]);

const allCharacters = computed(() => [
  ...hiraganaCharacters.value.map((c) => ({ ...c, type: "hiragana" })),
  ...katakanaCharacters.value.map((c) => ({ ...c, type: "katakana" }))
]);

// Summary metrics
const learnedHiraganaCount = computed(() => {
  return hiraganaCharacters.value.filter((c) => store.progress[c.id]?.hasLearned).length;
});

const learnedKatakanaCount = computed(() => {
  return katakanaCharacters.value.filter((c) => store.progress[c.id]?.hasLearned).length;
});

const quizStats = computed(() => {
  let success = 0;
  let total = 0;
  for (const c of allCharacters.value) {
    const p = store.progress[c.id];
    if (p) {
      success += p.quizSuccessCount || 0;
      total += (p.quizSuccessCount || 0) + (p.quizFailCount || 0);
    }
  }
  return { success, total };
});

const writingStats = computed(() => {
  let success = 0;
  let total = 0;
  for (const c of allCharacters.value) {
    const p = store.progress[c.id];
    if (p) {
      success += p.drawSuccessCount || 0;
      total += (p.drawSuccessCount || 0) + (p.drawFailCount || 0);
    }
  }
  return { success, total };
});

const quizAccuracy = computed(() => {
  const stats = quizStats.value;
  return stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
});

const writingAccuracy = computed(() => {
  const stats = writingStats.value;
  return stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
});


// Filtered characters for list
const filteredCharacters = computed(() => {
  let list = allCharacters.value;

  // Apply Alphabet Filter
  if (alphabetFilter.value !== "all") {
    list = list.filter((c) => c.type === alphabetFilter.value);
  }

  // Apply Group Filter
  if (groupFilter.value !== "all") {
    list = list.filter((c) => {
      const type = c.type as "hiragana" | "katakana";
      const grp = groupFilter.value as "gojuon" | "dakuten" | "yoon";
      const itemsInGroup = kanaData[type][grp] || [];
      return itemsInGroup.some((item) => item.id === c.id);
    });
  }

  // Apply Search
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (c) =>
        c.character.includes(query) ||
        c.romaji.toLowerCase().includes(query) ||
        ((c.id === "h-dji" || c.id === "k-dji") && "di".includes(query)) ||
        ((c.id === "h-dzu" || c.id === "k-dzu") && "du".includes(query))
    );
  }

  return list;
});

// Toggle learned state
function toggleCharacterLearned(charId: string) {
  store.toggleLearned(charId);
}

// Reset progress action
function handleResetConfirm() {
  store.resetProgress();
  toast.success(t("progressPage.resetToastSuccess"));
  showResetModal.value = false;
  router.push({ name: "home" });
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 min-h-[80vh] flex flex-col">
    <!-- Headers -->
    <header class="space-y-2 border-b-[3px] border-slate-950 dark:border-white pb-6">
      <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
        <Layers class="w-10 h-10 text-violet-500" />
        {{ $t("progressPage.title") }}
      </h1>
      <p class="text-slate-600 dark:text-slate-400 font-semibold">
        {{ $t("progressPage.desc") }}
      </p>
    </header>

    <!-- Phase 1: Summary Statistics Cards -->
    <section class="space-y-4">
      <h2 class="text-2xl font-black uppercase tracking-wider bg-yellow-300 dark:bg-yellow-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
        {{ $t("progressPage.summaryTitle") }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Hiragana Progress Card -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ $t("progressPage.hiraganaProgress") }}
            </span>
            <GraduationCap class="w-5 h-5 text-violet-500" />
          </div>
          <div class="mt-4">
            <div class="text-2xl font-black">
              {{ learnedHiraganaCount }} / {{ hiraganaCharacters.length }}
            </div>
            <div class="text-[10px] font-black uppercase text-slate-500 mt-1">
              {{ $t("progressPage.charLearnedCount", { learned: learnedHiraganaCount, total: hiraganaCharacters.length }) }}
            </div>
          </div>
        </div>

        <!-- Katakana Progress Card -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ $t("progressPage.katakanaProgress") }}
            </span>
            <GraduationCap class="w-5 h-5 text-emerald-500" />
          </div>
          <div class="mt-4">
            <div class="text-2xl font-black">
              {{ learnedKatakanaCount }} / {{ katakanaCharacters.length }}
            </div>
            <div class="text-[10px] font-black uppercase text-slate-500 mt-1">
              {{ $t("progressPage.charLearnedCount", { learned: learnedKatakanaCount, total: katakanaCharacters.length }) }}
            </div>
          </div>
        </div>

        <!-- Quiz Accuracy Card -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ $t("progressPage.quizAccuracy") }}
            </span>
            <Award class="w-5 h-5 text-amber-500" />
          </div>
          <div class="mt-4">
            <div class="text-2xl font-black">
              {{ quizAccuracy }}%
            </div>
            <div class="text-[10px] font-black uppercase text-slate-500 mt-1">
              {{ quizStats.success }} {{ $t("practice.resultCorrect") }} / {{ quizStats.total }} {{ $t("progressPage.totalAttempts") }}
            </div>
          </div>
        </div>

        <!-- Writing Accuracy Card -->
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ $t("progressPage.writingAccuracy") }}
            </span>
            <PenTool class="w-5 h-5 text-rose-500" />
          </div>
          <div class="mt-4">
            <div class="text-2xl font-black">
              {{ writingAccuracy }}%
            </div>
            <div class="text-[10px] font-black uppercase text-slate-500 mt-1">
              {{ writingStats.success }} {{ $t("practice.resultCorrect") }} / {{ writingStats.total }} {{ $t("progressPage.totalAttempts") }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Bars Row -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Hiragana Progress Bar Card -->
      <div class="bg-[#f4f3ec] dark:bg-slate-950 border-[3px] border-slate-950 dark:border-white p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] space-y-3">
        <div class="flex justify-between items-center font-black uppercase text-sm">
          <span>{{ $t("progressPage.hiraganaProgress") }}</span>
          <span>{{ Math.round((learnedHiraganaCount / hiraganaCharacters.length) * 100) }}%</span>
        </div>
        <div class="w-full bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white h-8 overflow-hidden flex shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
          <div
            class="bg-emerald-400 border-r-[3px] border-slate-950 dark:border-white transition-all duration-500"
            :style="{ width: `${(learnedHiraganaCount / hiraganaCharacters.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Katakana Progress Bar Card -->
      <div class="bg-[#f4f3ec] dark:bg-slate-950 border-[3px] border-slate-950 dark:border-white p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] space-y-3">
        <div class="flex justify-between items-center font-black uppercase text-sm">
          <span>{{ $t("progressPage.katakanaProgress") }}</span>
          <span>{{ Math.round((learnedKatakanaCount / katakanaCharacters.length) * 100) }}%</span>
        </div>
        <div class="w-full bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white h-8 overflow-hidden flex shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
          <div
            class="bg-violet-400 border-r-[3px] border-slate-950 dark:border-white transition-all duration-500"
            :style="{ width: `${(learnedKatakanaCount / katakanaCharacters.length) * 100}%` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Phase 2: Detailed List of Characters -->
    <section class="space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-[3px] border-slate-950 dark:border-white pb-4">
        <h2 class="text-2xl font-black uppercase tracking-wider">
          {{ $t("practice.questionSummary") }}
        </h2>
        
        <!-- Controls area: Search & Filter Tabs -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Search input -->
          <div class="relative flex-1 sm:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-4 py-2 border-[2px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-950 font-black text-xs uppercase placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
              :placeholder="$t('progressPage.searchPlaceholder')"
            />
          </div>

          <!-- Alphabet filter tabs -->
          <div class="flex border-[2px] border-slate-950 dark:border-white p-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
            <button
              @click="alphabetFilter = 'all'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="alphabetFilter === 'all' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.allAlphabet") }}
            </button>
            <button
              @click="alphabetFilter = 'hiragana'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="alphabetFilter === 'hiragana' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.hiraganaFilter") }}
            </button>
            <button
              @click="alphabetFilter = 'katakana'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="alphabetFilter === 'katakana' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.katakanaFilter") }}
            </button>
          </div>

          <!-- Group filter tabs -->
          <div class="flex border-[2px] border-slate-950 dark:border-white p-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
            <button
              @click="groupFilter = 'all'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="groupFilter === 'all' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.allGroup") }}
            </button>
            <button
              @click="groupFilter = 'gojuon'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="groupFilter === 'gojuon' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.gojuonFilter") }}
            </button>
            <button
              @click="groupFilter = 'dakuten'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="groupFilter === 'dakuten' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.dakutenFilter") }}
            </button>
            <button
              @click="groupFilter = 'yoon'"
              class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="groupFilter === 'yoon' ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
            >
              {{ $t("progressPage.yoonFilter") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Detailed Table container -->
      <div class="border-[3px] border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] overflow-hidden">
        <!-- Table header wrapper -->
        <div class="overflow-x-auto">
          <table class="w-full text-left bg-white dark:bg-slate-900 border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase text-xs tracking-wider">
                <th class="py-3 px-4 w-12">{{ $t("progressPage.tableNo") }}</th>
                <th class="py-3 px-4 w-24">{{ $t("progressPage.tableChar") }}</th>
                <th class="py-3 px-4 w-28">{{ $t("progressPage.tableRomaji") }}</th>
                <th class="py-3 px-4 w-44 text-center">{{ $t("progressPage.tableStatus") }}</th>
                <th class="py-3 px-4">{{ $t("progressPage.tableQuiz") }}</th>
                <th class="py-3 px-4">{{ $t("progressPage.tableWriting") }}</th>
              </tr>
            </thead>
          </table>
        </div>

        <!-- Scrollable table body wrapper -->
        <div class="overflow-auto max-h-[500px] overflow-x-auto">
          <table class="w-full text-left bg-white dark:bg-slate-900 border-collapse">
            <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-800">
              <!-- Empty filter state -->
              <tr v-if="filteredCharacters.length === 0">
                <td colspan="6" class="py-12 text-center text-slate-400 dark:text-slate-600 font-black uppercase tracking-wider text-xs">
                  {{ $t("practice.filterEmpty") }}
                </td>
              </tr>

              <tr
                v-for="(c, idx) in filteredCharacters"
                :key="c.id"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 font-semibold"
                :class="[
                  idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#f4f3ec]/20 dark:bg-slate-950/20'
                ]"
              >
                <!-- Index -->
                <td class="py-3 px-4 text-xs font-black text-slate-400 dark:text-slate-600 w-12">
                  {{ idx + 1 }}
                </td>
                <!-- Character -->
                <td class="py-3 px-4 font-black text-2xl text-slate-950 dark:text-white w-24">
                  {{ c.character }}
                </td>
                <!-- Romaji -->
                <td class="py-3 px-4 font-mono font-bold uppercase text-slate-700 dark:text-slate-300 w-28">
                  {{ c.romaji }}
                </td>
                <!-- Status Badge -->
                <td class="py-3 px-4 w-44">
                  <div class="flex justify-center">
                    <button
                      @click="toggleCharacterLearned(c.id)"
                      class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 border-[2px] border-slate-950 dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] dark:active:shadow-[1px_1px_0px_0px_#fff] transition-all"
                      :class="store.progress[c.id]?.hasLearned
                        ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'"
                    >
                      <component :is="store.progress[c.id]?.hasLearned ? Unlock : Lock" class="w-3.5 h-3.5" />
                      {{ store.progress[c.id]?.hasLearned ? $t("progressPage.statusLearned") : $t("progressPage.statusNotLearned") }}
                    </button>
                  </div>
                </td>
                <!-- Quiz History -->
                <td class="py-3 px-4">
                  <div v-if="store.progress[c.id] && (store.progress[c.id].quizSuccessCount + store.progress[c.id].quizFailCount) > 0">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">
                      {{ store.progress[c.id].quizSuccessCount }} {{ $t("progressPage.correctSymbol") }}
                    </span>
                    <span class="text-slate-400 dark:text-slate-500 px-1">/</span>
                    <span class="text-rose-500 dark:text-rose-450 font-bold">
                      {{ store.progress[c.id].quizFailCount }} {{ $t("progressPage.incorrectSymbol") }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-slate-400 dark:text-slate-600">
                    {{ $t("progressPage.noHistory") }}
                  </span>
                </td>
                <!-- Writing History -->
                <td class="py-3 px-4">
                  <div v-if="store.progress[c.id] && (store.progress[c.id].drawSuccessCount + store.progress[c.id].drawFailCount) > 0">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">
                      {{ store.progress[c.id].drawSuccessCount }} {{ $t("progressPage.correctSymbol") }}
                    </span>
                    <span class="text-slate-400 dark:text-slate-500 px-1">/</span>
                    <span class="text-rose-500 dark:text-rose-450 font-bold">
                      {{ store.progress[c.id].drawFailCount }} {{ $t("progressPage.incorrectSymbol") }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-slate-400 dark:text-slate-600">
                    {{ $t("progressPage.noHistory") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Phase 3: Danger Zone Reset -->
    <section class="border-[3px] border-rose-500 bg-rose-50 dark:bg-rose-950/10 p-6 shadow-[4px_4px_0px_0px_#ef4444] space-y-4">
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h3 class="font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 text-base">
            {{ $t("progressPage.dangerZoneTitle") }}
          </h3>
          <p class="text-xs font-semibold text-rose-700/80 dark:text-rose-300/80 leading-relaxed max-w-2xl">
            {{ $t("progressPage.dangerZoneDesc") }}
          </p>
        </div>
      </div>
      <button
        @click="showResetModal = true"
        class="px-5 py-3 text-xs font-black uppercase bg-rose-500 text-white hover:bg-rose-600 border-[2px] border-slate-950 dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000] dark:active:shadow-[2px_2px_0px_0px_#fff] transition-all"
      >
        {{ $t("progressPage.resetBtn") }}
      </button>
    </section>

    <!-- Inline Reset Confirmation Modal Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showResetModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        @click.self="showResetModal = false"
      >
        <div class="bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white max-w-md w-full p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] space-y-6">
          <div class="space-y-2">
            <h3 class="text-xl font-black uppercase text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <AlertTriangle class="w-5 h-5 text-rose-500" />
              {{ $t("progressPage.resetConfirmTitle") }}
            </h3>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ $t("progressPage.resetConfirmDesc") }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <NeoBrutalistButton
              @click="showResetModal = false"
              class="py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-black uppercase"
            >
              {{ $t("progressPage.resetCancelBtn") }}
            </NeoBrutalistButton>
            <NeoBrutalistButton
              @click="handleResetConfirm"
              class="py-2.5 bg-rose-500 text-white hover:bg-rose-600 text-xs font-black uppercase"
            >
              {{ $t("progressPage.resetConfirmBtn") }}
            </NeoBrutalistButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
