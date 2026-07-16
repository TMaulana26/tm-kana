<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { kanaData, type KanaItem } from '@/constants/kanaData'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import KanaCard from '@/components/KanaCard.vue'
import KanaDetailDialog from '@/components/KanaDetailDialog.vue'
import { groupKanaData } from '@/utils/kana'

useI18n()

const activeTab = ref('hiragana')
const selectedCharacter = ref<KanaItem | null>(null)
const isDialogOpen = ref(false)

const hiraganaGroups = computed(() => groupKanaData(kanaData.hiragana))
const katakanaGroups = computed(() => groupKanaData(kanaData.katakana))

function selectCharacter(char: KanaItem) {
  selectedCharacter.value = char
  isDialogOpen.value = true
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-none border-[4px] border-slate-950 dark:border-white bg-[#00f5d4] text-slate-950 p-8 shadow-[6px_6px_0px_0px_#08060d] dark:shadow-[6px_6px_0px_0px_#fff]"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]"></div>
      <div class="relative z-10 space-y-2">
        <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
          {{ $t('chart.title') }}
        </h1>
        <p class="text-sm md:text-base font-bold text-slate-900 max-w-3xl leading-relaxed">
          {{ $t('chart.desc') }}
        </p>
      </div>
    </div>

    <!-- Tabs Section -->
    <Tabs default-value="hiragana" v-model="activeTab" class="w-full">
      <TabsList
        class="w-full grid grid-cols-2 h-14 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-1 rounded-none shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] mb-8"
      >
        <TabsTrigger
          value="hiragana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-[#ff007f] dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-[#ff007f] dark:data-active:text-white"
        >
          {{ $t('chart.hiragana') }}
        </TabsTrigger>
        <TabsTrigger
          value="katakana"
          class="h-full rounded-none font-black text-sm md:text-base uppercase tracking-wider transition-all duration-200 border-none data-[state=active]:bg-[#ff007f] data-[state=active]:text-white dark:data-[state=active]:bg-[#ff007f] dark:data-[state=active]:text-white data-[state=active]:shadow-none dark:data-active:bg-[#ff007f] dark:data-active:text-white"
        >
          {{ $t('chart.katakana') }}
        </TabsTrigger>
      </TabsList>

      <!-- Tabs Contents -->
      <template v-for="tabKey in ['hiragana', 'katakana']" :key="tabKey">
        <TabsContent :value="tabKey" class="space-y-12 outline-hidden">
          <!-- Gojuon Section -->
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-violet-300 dark:bg-violet-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.gojuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <!-- Grid Header columns: Vowels (A, I, U, E, O) -->
              <div class="hidden sm:flex gap-4 items-center border-b-[3px] border-slate-950 dark:border-white pb-3 mb-2">
                <div class="w-20 shrink-0"></div>
                <div class="grid grid-cols-5 gap-4 flex-1 text-center font-black text-sm text-slate-500 uppercase tracking-wider">
                  <span>A</span>
                  <span>I</span>
                  <span>U</span>
                  <span>E</span>
                  <span>O</span>
                </div>
              </div>

              <!-- Rows -->
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.gojuon : katakanaGroups.gojuon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ $t('rows.' + row.rowName) }}
                  </div>
                  <div class="grid grid-cols-5 gap-3 flex-1 w-full">
                    <template v-for="(char, idx) in row.chars" :key="idx">
                      <KanaCard v-if="char" :character="char" @click="selectCharacter" />
                      <div v-else class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-slate-200 dark:border-slate-800 rounded-none opacity-20"></div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Dakuon Section -->
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-indigo-300 dark:bg-indigo-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.dakuon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.dakuon : katakanaGroups.dakuon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ $t('rows.' + row.rowName) }}
                  </div>
                  <div class="grid grid-cols-5 gap-3 flex-1 w-full">
                    <template v-for="(char, idx) in row.chars" :key="idx">
                      <KanaCard v-if="char" :character="char" @click="selectCharacter" />
                      <div v-else class="aspect-square bg-slate-100 dark:bg-slate-800/40 border-[2px] border-slate-200 dark:border-slate-800 rounded-none opacity-20"></div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Yoon Section -->
          <section class="space-y-6">
            <h2
              class="text-xl md:text-2xl font-black uppercase tracking-wider bg-amber-300 dark:bg-amber-950 dark:text-slate-50 border-[3px] border-slate-950 dark:border-white px-4 py-2 w-fit shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              {{ $t('chart.yoon') }}
            </h2>
            <div class="space-y-4 bg-white dark:bg-slate-900 border-[3px] border-slate-950 dark:border-white p-6 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]">
              <div class="space-y-4">
                <div
                  v-for="row in (tabKey === 'hiragana' ? hiraganaGroups.yoon : katakanaGroups.yoon)"
                  :key="row.rowName"
                  class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center"
                >
                  <div class="w-20 shrink-0 font-black uppercase text-xs tracking-wider text-slate-500 text-left">
                    {{ $t('rows.' + row.rowName) }}
                  </div>
                  <div class="grid grid-cols-3 gap-3 flex-1 w-full">
                    <KanaCard
                      v-for="char in row.chars"
                      :key="char.id"
                      :character="char"
                      @click="selectCharacter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </template>
    </Tabs>

    <!-- Details Dialog (Interactive Writing & Stroke Order) -->
    <KanaDetailDialog v-model:open="isDialogOpen" :character="selectedCharacter" />
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
