<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "neutral";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
  }>(),
  {
    type: "button",
    variant: "primary",
  }
);

const shadowClass = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#8b5cf6] dark:active:shadow-[1px_1px_0px_0px_#8b5cf6]";
    case "success":
      return "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#10b981] dark:active:shadow-[1px_1px_0px_0px_#10b981]";
    case "danger":
      return "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#ef4444] dark:active:shadow-[1px_1px_0px_0px_#ef4444]";
    case "neutral":
      return "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#334155] dark:active:shadow-[1px_1px_0px_0px_#334155]";
    case "primary":
    default:
      return "shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f59e0b] dark:active:shadow-[1px_1px_0px_0px_#f59e0b]";
  }
});
</script>

<template>
  <Button
    :type="type"
    :class="[
      'rounded-none border-[3px] border-slate-950 dark:border-slate-700 font-black uppercase tracking-wider active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-0.5 transition-all',
      shadowClass,
    ]"
  >
    <slot />
  </Button>
</template>
