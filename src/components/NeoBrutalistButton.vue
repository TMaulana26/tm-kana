<script setup lang="ts">
import { Button } from "@/components/ui/button";

defineProps<{
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <Button
    :type="type || 'button'"
    class="rounded-none border-[3px] border-slate-950 dark:border-white font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-all"
  >
    <slot />
  </Button>
</template>
