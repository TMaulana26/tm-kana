<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Languages } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { locale } = useI18n();

function setLocale(newLocale: "id" | "en" | "ja") {
  locale.value = newLocale;
  localStorage.setItem("locale", newLocale);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon" class="w-10 h-10 rounded-full">
        <Languages class="w-5 h-5 text-muted-foreground" />
        <span class="sr-only">{{ $t("common.toggleLanguage") }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        @click="setLocale('id')"
        :class="{
          'font-bold bg-violet-300 dark:bg-violet-900 text-slate-950 dark:text-white':
            locale === 'id',
        }"
      >
        {{ $t("common.langId") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="setLocale('en')"
        :class="{
          'font-bold bg-violet-300 dark:bg-violet-900 text-slate-950 dark:text-white':
            locale === 'en',
        }"
      >
        {{ $t("common.langEn") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="setLocale('ja')"
        :class="{
          'font-bold bg-violet-300 dark:bg-violet-900 text-slate-950 dark:text-white':
            locale === 'ja',
        }"
      >
        {{ $t("common.langJa") }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
