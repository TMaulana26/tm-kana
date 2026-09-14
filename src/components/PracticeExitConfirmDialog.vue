<script setup lang="ts">
import { computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NeoBrutalistButton from "@/components/NeoBrutalistButton.vue";
import { AlertTriangle, X } from "lucide-vue-next";

interface Props {
  open: boolean;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  emit("cancel");
  isOpen.value = false;
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :show-close-button="false"
      class="max-w-md w-[92vw] bg-[#f4f3ec] dark:bg-slate-900 border-[3px] border-slate-950 dark:border-slate-700 rounded-none p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#000]"
    >
      <DialogHeader class="border-b-[3px] border-slate-950 dark:border-slate-700 pb-4 mb-5 relative">
        <div class="flex items-start gap-3.5 pr-10">
          <div
            class="w-10 h-10 bg-amber-300 dark:bg-amber-400 border-[2px] border-slate-950 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] mt-0.5"
          >
            <AlertTriangle class="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div class="space-y-1 min-w-0">
            <DialogTitle class="text-lg sm:text-xl font-black uppercase text-slate-950 dark:text-white tracking-wide leading-tight">
              {{ $t("practice.exitConfirmTitle") }}
            </DialogTitle>
            <DialogDescription class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-normal">
              {{ $t("practice.exitConfirmDesc") }}
            </DialogDescription>
          </div>
        </div>

        <!-- Neo-Brutalist Close Button -->
        <button
          type="button"
          @click="handleCancel"
          class="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-rose-400 hover:bg-rose-500 text-black border-[2px] border-slate-950 dark:border-slate-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          :aria-label="$t('preferences.closeBtn')"
        >
          <X class="w-4 h-4" />
        </button>
      </DialogHeader>

      <!-- Action Buttons -->
      <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <NeoBrutalistButton
          type="button"
          @click="handleCancel"
          class="w-full sm:w-auto px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 text-xs sm:text-sm font-black"
        >
          {{ $t("practice.stayBtn") }}
        </NeoBrutalistButton>
        <NeoBrutalistButton
          type="button"
          @click="handleConfirm"
          class="w-full sm:w-auto px-5 py-2.5 bg-rose-400 hover:bg-rose-500 text-black text-xs sm:text-sm font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#000]"
        >
          {{ $t("practice.leaveBtn") }}
        </NeoBrutalistButton>
      </div>
    </DialogContent>
  </Dialog>
</template>
