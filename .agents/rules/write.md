---
trigger: always_on
---

# Aturan Penulisan Kode (Coding Style, Clean Code & Testing Guide)

## 1. Komponen Vue 3 & TypeScript

### A. Struktur Berkas & Sintaksis

- **Urutan Blok Standard:** Setiap berkas komponen `.vue` wajib mengikuti urutan blok teratas hingga terbawah sebagai berikut:
  1. `<script setup lang="ts">`
  2. `<template>`
  3. `<style scoped>`
- **Gaya Penamaan Berkas:** Berkas komponen wajib menggunakan **PascalCase** (contoh: `KanaCard.vue`, `CanvasBoard.vue`).
- **Gaya Penamaan Atribut:** Properti/Props pada template ditulis menggunakan **kebab-case** (contoh: `<kana-card card-id="123" />`), sedangkan di dalam script wajib menggunakan **camelCase** (contoh: `cardId`).

### B. Type-Safety (Props & Emits)

- **Definisi Berbasis Kompilator:** Props dan Emits wajib didefinisikan menggunakan _Compiler Macro_ murni dengan TypeScript interfaces (`defineProps<Props>()` dan `defineEmits<Emits>()`). Dilarang menggunakan runtime validation objek JavaScript biasa.
- **Definisi Nilai Default:** Gunakan `withDefaults` untuk mendefinisikan nilai bawaan properti opsional.

```typescript
// Contoh Best Practice Komponen (PascalCase.vue)
<script setup lang="ts">
interface Props {
  kanaCharacter: string;
  isCorrect?: boolean;
}

interface Emits {
  (e: 'select', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  isCorrect: false
});

const emit = defineEmits<Emits>();
</script>

<template>
  <button class="kana-card" @click="emit('select', props.kanaCharacter)">
    <span>{{ props.kanaCharacter }}</span>
  </button>
</template>

<style scoped>
/* Hanya untuk style yang tidak bisa di-handle Tailwind (misal: kanvas / efek khusus) */
</style>
```

---

## 2. Prinsip Clean Code, Arsitektur & Performa

### A. Internasionalisasi Tingkat Tinggi (i18n Mandatory)

- **Larangan Teks Mentah:** Dilarang keras menulis teks (_hardcoded string_) bahasa tertentu langsung di dalam tag HTML/Template maupun di dalam kode logika Script (contoh buruk: `<button>Simpan</button>` atau `alert('Eror')`).
- **Metode Pemanggilan:** Semua teks antarmuka wajib dipanggil melalui fungsi lokalisasi `$t('key.path')` pada template atau `t('key.path')` dari `useI18n()` pada script.
- **Manajemen Berkas Bahasa:** Semua string teks wajib dipisahkan berdasarkan bahasa ke dalam folder `src/locales/` menggunakan format JSON (`id.json` untuk Bahasa Indonesia, `en.json` untuk English, dan `ja.json` untuk Japanese).

### B. Separasi Perhatian (Separation of Concerns & SRP)

- **Single Responsibility Principle (SRP):** Satu komponen hanya boleh menangani satu representasi visual atau satu alur kerja spesifik. Jika komponen melebihi 250 baris, wajib dipecah menjadi sub-komponen.
- **Komposisi Logika Berstatus (Composables):** Logika fitur yang memiliki status reaktif (_reactive state_) atau terikat dengan siklus hidup Vue (_lifecycle hooks_)—seperti logika pelacakan koordinat kanvas menggambar atau pengatur waktu kuis—wajib dipisahkan ke folder `src/composables/` dengan konvensi penamaan `use[Name].ts` (contoh: `useCanvas.ts`, `useQuizTimer.ts`).
- **Fungsi Utilitas Murni (Pure Functions):** Logika perhitungan matematika kanvas, pemformatan teks, transformasi data, atau fungsi enkripsi/dekripsi Base64 wajib ditempatkan di folder `src/utils/` dan dirancang sebagai _pure functions_ (tanpa efek samping/side-effects).

### C. Arsitektur Folder & Manajemen State

- **Struktur Folder Komponen:**
  - `src/components/ui/` : Komponen atomik global tanpa status bisnis (diambil dari/berbasis shadcn-vue seperti button, dialog, input).
  - `src/components/shared/` : Komponen yang dipakai ulang lintas fitur.
  - `src/features/[nama-fitur]/components/` : Komponen eksklusif milik fitur tertentu (misal: `features/quiz/components/`).
- **Keamanan State (Pinia):** Modifikasi state global Pinia dilarang keras dilakukan secara langsung dari komponen (contoh buruk: `store.score++`). Semua perubahan data reaktif global wajib dieksekusi melalui **Actions** di dalam _Store_ terkait untuk menjaga keterlacakan data (_traceability_).

---

## 3. Aturan Pengujian (Testing Rules)

- **Unit Testing (Utils & Stores):** Wajib diterapkan secara menyeluruh pada folder `src/utils/` dan `src/stores/`. Pengujian harus mencakup skenario sukses (_happy paths_) dan penanganan eror (_edge/error cases_).
- **Component Testing (UI):** Fokus pada pengujian interaksi pengguna dan emisi event bisnis, bukan pengujian visual/CSS.
- **Infrastruktur Mock i18n Global:** Dilarang melakukan _mocking_ plugin i18n secara manual di setiap berkas tes individu. Semua _mocking_ objek global wajib dikonfigurasikan terpusat pada berkas `tests/setup.ts` agar fungsi `$t` otomatis dikenali oleh Vue Test Utils secara global.

```typescript
// Di dalam berkas tests/setup.ts
import { config } from "@vue/test-utils";

config.global.mocks = {
  $t: (key: string) => key, // Mengembalikan key sebagai string pengganti teks asli saat pengujian
};
```
