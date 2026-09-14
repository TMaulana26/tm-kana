<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { usePreferencesStore } from "@/stores/preferences";
import UserPreferencesDialog from "./UserPreferencesDialog.vue";
import AppLogo from "./AppLogo.vue";
import AppFooter from "./AppFooter.vue";
import {
  Home,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Menu,
  X,
  User,
  Settings
} from "lucide-vue-next";

const route = useRoute();
const progressStore = useProgressStore();
const preferencesStore = usePreferencesStore();

const isMobileMenuOpen = ref(false);
const isPreferencesOpen = ref(false);

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
      class="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r-[4px] border-slate-950 dark:border-white shrink-0 sticky top-0 h-screen"
    >
      <!-- Logo Section -->
      <div
        class="h-16 flex items-center justify-center px-4 border-b-[4px] border-slate-950 dark:border-white"
      >
        <router-link
          to="/"
          class="w-full h-full flex items-center justify-center hover:opacity-95 transition-opacity"
        >
          <AppLogo size="md" />
        </router-link>
      </div>

      <!-- User Profile Summary (Neo-brutalist card) -->
      <div class="p-6 border-b-[4px] border-slate-950 dark:border-white">
        <div
          class="bg-amber-300 dark:bg-amber-500 text-black border-[3px] border-slate-950 dark:border-white p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-white border-[2px] border-slate-950 flex items-center justify-center"
          >
            <User class="w-5 h-5 text-slate-950" />
          </div>
          <div class="overflow-hidden">
            <p
              class="text-xs uppercase font-black tracking-wider text-amber-950"
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
              ? 'bg-violet-300 text-black dark:bg-violet-400 dark:text-black border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]'
              : 'text-slate-700 dark:text-slate-300',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          {{ $t(item.name) }}
        </router-link>
      </nav>

      <!-- Desktop Sidebar Bottom Preferences -->
      <div class="p-4 border-t-[4px] border-slate-950 dark:border-white">
        <button
          type="button"
          @click="isPreferencesOpen = true"
          class="w-full flex items-center justify-between px-3 py-2.5 bg-amber-300 dark:bg-amber-500 text-black border-[2px] border-slate-950 dark:border-white font-extrabold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px]"
        >
          <span class="flex items-center gap-2">
            <Settings class="w-4 h-4" />
            {{ $t('preferences.openBtn') }}
          </span>
          <span class="text-xs uppercase font-black px-1.5 py-0.5 bg-white border border-slate-950 text-slate-950">
            {{ preferencesStore.theme }}
          </span>
        </button>
      </div>
    </aside>

    <!-- Mobile Top Header -->
    <header
      class="md:hidden h-16 bg-white dark:bg-slate-900 border-b-[4px] border-slate-950 dark:border-white flex items-center justify-between px-4 sticky top-0 z-40"
    >
      <div class="flex items-center gap-2">
        <button
          @click="toggleMobileMenu"
          class="p-2 border-[2px] border-slate-950 dark:border-white bg-[#f4f3ec] dark:bg-slate-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]"
          aria-label="Toggle menu"
        >
          <Menu
            v-if="!isMobileMenuOpen"
            class="w-5 h-5 text-slate-950 dark:text-white"
          />
          <X v-else class="w-5 h-5 text-slate-950 dark:text-white" />
        </button>
        <router-link to="/" class="flex items-center">
          <AppLogo size="sm" />
        </router-link>
      </div>
      <button
        type="button"
        @click="isPreferencesOpen = true"
        class="w-8 h-8 flex items-center justify-center border-[2px] border-slate-950 dark:border-white bg-white dark:bg-slate-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] text-slate-950 dark:text-white"
        :aria-label="$t('preferences.title')"
      >
        <Settings class="w-4 h-4" />
      </button>
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
          <router-link to="/" @click="closeMobileMenu" class="flex items-center">
            <AppLogo size="sm" />
          </router-link>
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
            class="bg-amber-300 dark:bg-amber-500 text-black border-[2px] border-slate-950 dark:border-white p-3 shadow-[3px_3px_0px_0px_#000] flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-white border-[2px] border-slate-950 flex items-center justify-center"
            >
              <User class="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <p class="text-xs uppercase font-black text-amber-950">
                {{ $t('common.nickname') }}
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
                ? 'bg-violet-300 text-black dark:bg-violet-400 dark:text-black border-slate-950 dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]'
                : 'text-slate-700 dark:text-slate-300',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            {{ $t(item.name) }}
          </router-link>
        </nav>

        <!-- Mobile Drawer Bottom Preferences -->
        <div class="p-4 border-t-[4px] border-slate-950 dark:border-white">
          <button
            type="button"
            @click="isPreferencesOpen = true; closeMobileMenu()"
            class="w-full flex items-center justify-between px-3 py-2.5 bg-amber-300 dark:bg-amber-500 text-black border-[2px] border-slate-950 dark:border-white font-extrabold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <span class="flex items-center gap-2">
              <Settings class="w-4 h-4" />
              {{ $t('preferences.openBtn') }}
            </span>
            <span class="text-xs uppercase font-black px-1.5 py-0.5 bg-white border border-slate-950 text-slate-950">
              {{ preferencesStore.theme }}
            </span>
          </button>
        </div>
      </aside>
    </transition>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- App scroll container -->
      <div class="flex-1 overflow-y-auto flex flex-col">
        <div class="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

        <!-- Global App Footer -->
        <AppFooter />
      </div>
    </main>

    <!-- Global User Preferences Dialog -->
    <UserPreferencesDialog v-model:open="isPreferencesOpen" />
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
