<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import {
  Home,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Menu,
  X,
  User,
} from "lucide-vue-next";

const route = useRoute();
const progressStore = useProgressStore();

const isMobileMenuOpen = ref(false);

const nickname = computed(() => progressStore.nickname);

const navigationItems = computed(() => [
  { name: "nav.home", path: "/", icon: Home },
  { name: "nav.chart", path: "/chart", icon: BookOpen },
  { name: "nav.practice", path: "/practice", icon: GraduationCap },
  { name: "nav.progress", path: "/progress", icon: TrendingUp },
]);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <div
    class="min-h-screen bg-[#f4f3ec] dark:bg-[#121318] flex flex-col md:flex-row text-slate-950 dark:text-slate-50 font-sans"
  >
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r-[4px] border-slate-950 dark:border-white shrink-0"
    >
      <!-- Logo Section -->
      <div
        class="h-16 flex items-center justify-between px-6 border-b-[4px] border-slate-950 dark:border-white"
      >
        <span
          class="text-2xl font-extrabold tracking-wider uppercase text-slate-950 dark:text-white"
        >
          {{ $t("common.appName") }}
        </span>
        <LanguageSwitcher
          class="border-[2px] border-slate-950 dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
        />
      </div>

      <!-- User Profile Summary (Neo-brutalist card) -->
      <div class="p-6 border-b-[4px] border-slate-950 dark:border-white">
        <div
          class="bg-amber-300 dark:bg-amber-500 text-slate-950 border-[3px] border-slate-950 dark:border-white p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-white border-[2px] border-slate-950 flex items-center justify-center"
          >
            <User class="w-5 h-5 text-slate-950" />
          </div>
          <div class="overflow-hidden">
            <p
              class="text-[10px] uppercase font-black tracking-wider text-slate-800"
            >
              {{ $t("common.nickname") }}
            </p>
            <p class="font-extrabold text-base truncate">{{ nickname }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-3">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 border-[3px] border-transparent font-bold text-sm tracking-wide transition-all transform hover:-translate-x-1 hover:-translate-y-1 hover:border-slate-950 dark:hover:border-white hover:bg-violet-200 dark:hover:bg-violet-950 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff]"
          :class="[
            route.path === item.path
              ? 'bg-violet-300 text-slate-950 dark:bg-violet-400 dark:text-slate-950 border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]'
              : 'text-slate-700 dark:text-slate-300',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          {{ $t(item.name) }}
        </router-link>
      </nav>
    </aside>

    <!-- Mobile Top Header -->
    <header
      class="md:hidden h-16 bg-white dark:bg-slate-900 border-b-[4px] border-slate-950 dark:border-white flex items-center justify-between px-6 sticky top-0 z-40"
    >
      <div class="flex items-center gap-3">
        <button
          @click="toggleMobileMenu"
          class="p-2 border-[2px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]"
          aria-label="Toggle menu"
        >
          <Menu
            v-if="!isMobileMenuOpen"
            class="w-5 h-5 text-slate-950 dark:text-white"
          />
          <X class="w-5 h-5 text-slate-950 dark:text-white" />
        </button>
        <span
          class="text-xl font-black uppercase tracking-wider text-slate-950 dark:text-white"
        >
          {{ $t("common.appName") }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span
          class="text-xs font-bold px-3 py-1 bg-amber-300 dark:bg-amber-500 text-slate-950 border-[2px] border-slate-950 dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] truncate max-w-[100px]"
          >{{ nickname }}</span
        >
        <LanguageSwitcher
          class="border-[2px] border-slate-950 dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
        />
      </div>
    </header>

    <!-- Mobile Sidebar Menu Overlay -->
    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        @click="closeMobileMenu"
        class="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
      ></div>
    </transition>

    <!-- Mobile Navigation Drawer -->
    <transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="isMobileMenuOpen"
        class="md:hidden fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r-[4px] border-slate-950 dark:border-white z-50 flex flex-col shadow-2xl"
      >
        <!-- Header -->
        <div
          class="h-16 flex items-center justify-between px-6 border-b-[4px] border-slate-950 dark:border-white"
        >
          <span
            class="text-xl font-black uppercase text-slate-950 dark:text-white"
          >
            {{ $t("common.appName") }}
          </span>
          <button
            @click="closeMobileMenu"
            class="p-2 border-[2px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Nickname -->
        <div class="p-6 border-b-[4px] border-slate-950 dark:border-white">
          <div
            class="bg-amber-300 dark:bg-amber-500 text-slate-950 border-[2px] border-slate-950 dark:border-white p-3 shadow-[3px_3px_0px_0px_#000] flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-white border-[2px] border-slate-950 flex items-center justify-center"
            >
              <User class="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <p class="text-[9px] uppercase font-black text-slate-700">
                Nickname
              </p>
              <p class="font-extrabold text-sm">{{ nickname }}</p>
            </div>
          </div>
        </div>

        <!-- Links -->
        <nav class="flex-1 px-4 py-6 space-y-3">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 border-[3px] border-transparent font-bold text-sm tracking-wide transition-all transform active:translate-x-[1px] active:translate-y-[1px]"
            :class="[
              route.path === item.path
                ? 'bg-violet-300 text-slate-950 dark:bg-violet-400 dark:text-slate-950 border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]'
                : 'text-slate-700 dark:text-slate-300',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            {{ $t(item.name) }}
          </router-link>
        </nav>
      </aside>
    </transition>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- App container -->
      <div class="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
