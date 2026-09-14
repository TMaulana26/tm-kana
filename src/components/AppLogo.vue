<script setup lang="ts">
import { computed } from "vue";
import logoImg from "@/assets/logo.png";

interface Props {
  animated?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  size: "md",
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "h-6";
    case "sm":
      return "h-7";
    case "lg":
      return "h-12";
    case "auto":
      return "h-full";
    case "md":
    default:
      return "h-8";
  }
});
</script>

<template>
  <div :class="['inline-flex items-center select-none', sizeClass]">
    <span class="sr-only">{{ $t("common.appName") }}</span>
    <img
      :src="logoImg"
      :alt="$t('common.appName')"
      class="h-full w-auto object-contain cursor-pointer transition-transform duration-200 active:scale-95"
      :class="{ 'animate-fade-in': props.animated }"
    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none !important;
  }
}
</style>
