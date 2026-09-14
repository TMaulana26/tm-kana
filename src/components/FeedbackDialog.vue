<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NeoBrutalistButton from "@/components/NeoBrutalistButton.vue";
import { FORMSPREE_ENDPOINT, APP_VERSION } from "@/constants/appInfo";
import { formatIndonesianDateTime } from "@/utils/date";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  HelpCircle,
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-vue-next";

interface Props {
  open: boolean;
}

interface Emits {
  (e: "update:open", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

type FeedbackCategory = "bug" | "suggestion" | "other";

const category = ref<FeedbackCategory>("bug");
const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");

const categories: {
  id: FeedbackCategory;
  labelKey: string;
  icon: any;
  activeColor: string;
}[] = [
  {
    id: "bug",
    labelKey: "feedback.categoryBug",
    icon: Bug,
    activeColor: "bg-rose-300 dark:bg-rose-950/80 text-black dark:text-rose-200 dark:border-rose-700",
  },
  {
    id: "suggestion",
    labelKey: "feedback.categorySuggestion",
    icon: Lightbulb,
    activeColor: "bg-amber-300 dark:bg-amber-950/80 text-black dark:text-amber-200 dark:border-amber-700",
  },
  {
    id: "other",
    labelKey: "feedback.categoryOther",
    icon: HelpCircle,
    activeColor: "bg-violet-300 dark:bg-violet-950/80 text-black dark:text-violet-200 dark:border-violet-700",
  },
];

async function submitFeedback() {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage) {
    errorMessage.value = t("feedback.messageRequired");
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  // Prepare FormData matching Formspree Vanilla JS Ajax guide
  const formData = new FormData();
  formData.append("_gotcha", ""); // Formspree honeypot confirmation
  formData.append("category", category.value);
  if (email.value.trim()) {
    formData.append("email", email.value.trim());
  }
  formData.append("message", trimmedMessage);
  formData.append("_subject", `[TM-KANA ${APP_VERSION}] ${category.value.toUpperCase()} Report`);
  formData.append("waktuPengiriman", formatIndonesianDateTime());
  formData.append("appVersion", APP_VERSION);
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    formData.append("pageUrl", window.location.href);
  }

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (response.ok) {
      isSuccess.value = true;
      message.value = "";
      email.value = "";
    } else {
      const data = await response.json().catch(() => null);
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage.value = data.errors.map((err: any) => err.message).join(", ");
      } else if (data?.error) {
        errorMessage.value = data.error;
      } else {
        errorMessage.value = t("feedback.errorDesc");
      }
    }
  } catch (err) {
    console.error("Formspree submission error:", err);
    errorMessage.value = t("feedback.errorDesc");
  } finally {
    isSubmitting.value = false;
  }
}

function resetAndClose() {
  isOpen.value = false;
  isSuccess.value = false;
  errorMessage.value = "";
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :show-close-button="false"
      class="max-w-lg w-[92vw] bg-[#f4f3ec] dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 rounded-none p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#000]"
    >
      <!-- Header -->
      <DialogHeader class="border-b-[3px] border-slate-950 dark:border-slate-700 pb-4 mb-4 relative">
        <div class="flex items-start gap-3.5 pr-10">
          <div
            class="w-10 h-10 bg-amber-300 dark:bg-amber-400 border-[2px] border-slate-950 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] mt-0.5"
          >
            <MessageSquarePlus class="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div class="space-y-1 min-w-0">
            <DialogTitle class="text-lg sm:text-xl font-black uppercase text-slate-950 dark:text-white tracking-wide leading-tight">
              {{ $t("feedback.title") }}
            </DialogTitle>
            <DialogDescription class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-normal">
              {{ $t("feedback.desc") }}
            </DialogDescription>
          </div>
        </div>

        <!-- Neo-Brutalist Close Button -->
        <button
          type="button"
          @click="resetAndClose"
          class="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-rose-400 hover:bg-rose-500 text-black border-[2px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          :aria-label="$t('feedback.closeBtn')"
        >
          <X class="w-4 h-4 stroke-[2.5]" />
        </button>
      </DialogHeader>

      <!-- Success Screen -->
      <div v-if="isSuccess" class="py-6 flex flex-col items-center text-center space-y-4">
        <div
          class="w-16 h-16 bg-emerald-400 border-[3px] border-slate-950 dark:border-slate-700 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#000]"
        >
          <CheckCircle2 class="w-10 h-10 text-slate-950 stroke-[2.5]" />
        </div>
        <div class="space-y-1.5 max-w-sm">
          <h3 class="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            {{ $t("feedback.successTitle") }}
          </h3>
          <p class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ $t("feedback.successDesc") }}
          </p>
        </div>
        <NeoBrutalistButton
          type="button"
          @click="resetAndClose"
          class="px-6 py-2.5 bg-emerald-400 text-black hover:bg-emerald-500 text-xs sm:text-sm font-black mt-2"
        >
          {{ $t("feedback.closeBtn") }}
        </NeoBrutalistButton>
      </div>

      <!-- Form Screen -->
      <form
        v-else
        :action="FORMSPREE_ENDPOINT"
        method="POST"
        @submit.prevent="submitFeedback"
        class="space-y-4 text-left"
      >
        <!-- Formspree Anti-Spam Honeypot Field -->
        <input type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off" />

        <!-- Category Selector -->
        <div class="space-y-1.5">
          <label class="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {{ $t("feedback.categoryLabel") }}
          </label>
          <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="category = cat.id"
              class="flex flex-col items-center justify-center gap-1.5 p-2 sm:p-2.5 min-h-[68px] sm:min-h-[72px] border-[2px] border-slate-950 dark:border-slate-700 transition-all active:translate-x-[1px] active:translate-y-[1px]"
              :class="[
                category === cat.id
                  ? [cat.activeColor, 'shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#000]']
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000]'
              ]"
            >
              <component :is="cat.icon" class="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />
              <span class="text-xs font-black uppercase tracking-wide text-center leading-tight whitespace-normal break-words max-w-full">
                {{ $t(cat.labelKey) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Email Field (Optional) -->
        <div class="space-y-1">
          <label
            for="feedback-email"
            class="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200"
          >
            {{ $t("feedback.emailLabel") }}
          </label>
          <input
            id="feedback-email"
            name="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 text-xs sm:text-sm font-medium border-[2px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
            :placeholder="$t('feedback.emailPlaceholder')"
            autocomplete="email"
          />
          <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {{ $t("feedback.emailHint") }}
          </p>
        </div>

        <!-- Message Field (Required) -->
        <div class="space-y-1">
          <label
            for="feedback-message"
            class="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200"
          >
            {{ $t("feedback.messageLabel") }} *
          </label>
          <textarea
            id="feedback-message"
            name="message"
            v-model="message"
            rows="4"
            required
            class="w-full px-3 py-2 text-xs sm:text-sm font-medium border-[2px] border-slate-950 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400 resize-y"
            :placeholder="$t('feedback.messagePlaceholder')"
          ></textarea>
        </div>

        <!-- Error Alert Banner -->
        <div
          v-if="errorMessage"
          class="p-3 bg-rose-200 dark:bg-rose-950/50 border-[2px] border-rose-500 text-rose-900 dark:text-rose-200 flex items-start gap-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000]"
        >
          <AlertTriangle class="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <p class="font-black uppercase tracking-wider">{{ $t("feedback.errorTitle") }}</p>
            <p class="font-medium text-xs leading-tight">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <NeoBrutalistButton
            type="button"
            @click="resetAndClose"
            class="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-black"
          >
            {{ $t("feedback.closeBtn") }}
          </NeoBrutalistButton>
          <NeoBrutalistButton
            type="submit"
            :disabled="isSubmitting || !message.trim()"
            class="w-full sm:w-auto px-5 py-2 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-500 text-black text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#000]"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <Send v-else class="w-4 h-4 stroke-[2.5]" />
            <span>{{ isSubmitting ? $t("feedback.sendingBtn") : $t("feedback.sendBtn") }}</span>
          </NeoBrutalistButton>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
