# AGENTS.md - Panduan & Aturan Pengembangan TM-KANA

Selamat datang di repositori **TM-KANA**! Dokumen ini adalah panduan utama bagi Agen AI (Antigravity, Claude, Copilot, Cursor, Codex) untuk memahami konteks proyek, aturan penulisan kode, arsitektur, dan instruksi kerja guna menghadirkan TM-KANA v1.0 yang solid, teruji, dan berstandar tinggi.

---

## 1. Visi & Prinsip Utama Proyek
TM-KANA adalah aplikasi web interaktif untuk mempelajari membaca dan menulis karakter bahasa Jepang (**Hiragana** & **Katakana**) yang mengusung desain **Neo-Brutalism**.

* **100% Client-Side (Local-First):** Aplikasi beroperasi sepenuhnya di sisi peramban pengguna tanpa database atau backend luar. Seluruh data pengguna disimpan di `localStorage`.
* **Privasi & Bebas Hambatan:** Bebas biaya, bebas iklan, tanpa login/registrasi, dan dapat berjalan secara offline (PWA).
* **Desain Neo-Brutalism:** Kontras tinggi, garis border tebal (`border-[3px] border-slate-950 dark:border-white`), bayangan tegas tanpa blur (`shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]`), serta warna-warna berani (amber, violet, emerald, slate).

---

## 2. Berkas Aturan Wajib (Agent Rules)

Setiap agen AI yang bekerja di repositori ini **WAJIB membaca dan mematuhi** aturan-aturan terinci di folder `.agents/rules/`:

1. [**Visi & Prinsip TM-KANA (`.agents/rules/goal.md`)**](file:///c:/Users/dimen/Herd/tm-kana/.agents/rules/goal.md)  
   Panduan filosofi client-side, privasi pengguna, dan kemudahan penggunaan tanpa hambatan.
2. [**Spesifikasi Tech Stack (`.agents/rules/tech-stack.md`)**](file:///c:/Users/dimen/Herd/tm-kana/.agents/rules/tech-stack.md)  
   Spesifikasi Vue 3 Composition API (`<script setup lang="ts">`), Tailwind CSS utility-first, komponen shadcn-vue, Pinia, vue-i18n, dan Vitest.
3. [**Aturan Penulisan Kode & Clean Code (`.agents/rules/write.md`)**](file:///c:/Users/dimen/Herd/tm-kana/.agents/rules/write.md)  
   - **Struktur Berkas Vue:** `<script setup lang="ts">` $\rightarrow$ `<template>` $\rightarrow$ `<style scoped>`.
   - **Type-Safety Murni:** Gunakan compiler macro TypeScript murni (`defineProps<Props>()`, `defineEmits<Emits>()`).
   - **i18n Wajib (Zero Hardcoded Strings):** Dilarang keras menulis teks langsung di template atau script. Wajib menggunakan `$t('key')` atau `t('key')` dengan kamus di `src/locales/` (`id.json`, `en.json`, `ja.json`).
   - **Single Responsibility Principle (SRP):** Komponen yang melebihi 250 baris wajib dipecah menjadi sub-komponen. Logika reaktif berstatus wajib dipisahkan ke `src/composables/use[Name].ts`, fungsi kalkulasi murni ke `src/utils/`.
   - **Keamanan State Pinia:** Dilarang memutasi state Pinia secara langsung dari komponen. Wajib menggunakan **Actions** di Store.
   - **Aturan Testing:** Mock global i18n terpusat di `tests/setup.ts`. Pengujian unit wajib mencakup *happy path* dan *edge cases*.
4. [**Alur Kerja & Validasi Kode (`.agents/rules/workflow.md`)**](file:///c:/Users/dimen/Herd/tm-kana/.agents/rules/workflow.md)  
   Sebelum pekerjaan diserahkan, agen wajib memverifikasi secara berurutan:
   1. `npm run lint` (Bebas eror linting)
   2. `npm run test` (Semua skenario tes unit lulus 100%)
   3. `npm run build` (Kompilasi produksi bersih)
   4. **Tata Kelola Versi (`package.json`):** Naikkan patch (`+0.0.1`) untuk perubahan kecil (misal `1.0.0` $\rightarrow$ `1.0.1`), atau minor (`+0.1.0` dengan patch direset ke `0`) untuk fitur/perubahan besar (misal `1.0.2` $\rightarrow$ `1.1.0`).
   5. **Kebijakan Git:** Boleh melakukan `git commit` lokal setelah seluruh validasi lulus; **dilarang keras** melakukan `git push` kecuali atas perintah langsung dari pengguna.

---

## 3. Ekstensi & Alat Tambahan: Impeccable UI/UX Skill

Proyek ini telah dilengkapi dengan skill **Impeccable** yang terpasang di:
- [`.agents/skills/impeccable/SKILL.md`](file:///c:/Users/dimen/Herd/tm-kana/.agents/skills/impeccable/SKILL.md)

Gunakan kemampuan Impeccable untuk:
* Mendeteksi anti-pattern visual, hierarki visual yang rancu, atau kontras yang buruk.
* Mengaudit dan merombak tampilan halaman agar semakin memikat, rapi, dan konsisten dengan kaidah desain Neo-Brutalism.
* Mengevaluasi interaksi mikro, transisi, dan responsivitas tata letak di berbagai ukuran layar.

---

## 4. Fitur-Fitur Inti v1.0 yang Perlu Diperhatikan

1. **Kanvas Latihan Stroke (Drawing Arena):**
   - Menggunakan [`src/components/KanaCanvas.vue`](file:///c:/Users/dimen/Herd/tm-kana/src/components/KanaCanvas.vue) dan algoritma geometric recognizer [`src/utils/strokeRecognizer.ts`](file:///c:/Users/dimen/Herd/tm-kana/src/utils/strokeRecognizer.ts).
   - Karakter majemuk (*Yoon*, panjang karakter $\ge 2$) harus terskala secara proporsional dan tidak boleh terpotong batas kanvas (`overflow-hidden`).
2. **Sistem Tema Terang / Gelap (Light / Dark Mode):**
   - Dikelola via [`src/stores/preferences.ts`](file:///c:/Users/dimen/Herd/tm-kana/src/stores/preferences.ts) dan disinkronkan ke kelas `dark` pada elemen `<html>`.
3. **Mode Auto-Submit Kuis Romaji:**
   - Evaluasi real-time pada saat pengguna mengetik jawaban romaji di [`src/views/PracticeView.vue`](file:///c:/Users/dimen/Herd/tm-kana/src/views/PracticeView.vue). Jika cocok, otomatis submit tanpa perlu menekan Enter, dan tombol submit disembunyikan.
4. **Dialog Preferensi Pengguna (`UserPreferencesDialog.vue`):**
   - Pengaturan Bahasa Aplikasi (ID, EN, JA), Tema (Light/Dark), dan Mode Auto-Submit terpusat di satu modal yang dapat diakses kapan saja.

---

## 5. Ringkasan Struktur Direktori

```bash
tm-kana/
├── .agents/
│   ├── proposals/             # Cetak biru arsitektur & ide fitur masa depan (Cloud Sync, Leaderboard)
│   ├── rules/                 # Aturan baku (goal, tech-stack, write, workflow)
│   ├── skills/impeccable/     # Skill audit & perombakan UI/UX
│   └── tasks/                 # Modul checklist pengerjaan tugas (Task 0 s/d 8)
├── AGENTS.md                  # Berkas instruksi agen (berkas ini)
├── public/                    # Manifest PWA, favicon, robots.txt, sitemap.xml
├── src/
│   ├── components/            # Komponen UI & Neo-Brutalism
│   │   ├── ui/                # Primitif shadcn-vue
│   │   ├── UserPreferencesDialog.vue # Modal preferensi pengguna
│   │   ├── KanaCanvas.vue     # Kanvas latihan menulis
│   │   └── MainLayout.vue     # Layout utama desktop & mobile
│   ├── composables/           # Logika reaktif (useCanvas.ts)
│   ├── constants/             # Data kana (kanaData.ts)
│   ├── locales/               # Kamus terjemahan (id.json, en.json, ja.json)
│   ├── router/                # Rute aplikasi & meta guards SEO
│   ├── stores/                # Pinia stores (progress.ts, preferences.ts)
│   ├── utils/                 # Pure functions (strokeRecognizer, progressCrypto)
│   └── views/                 # Halaman aplikasi (Home, Chart, Practice, Progress)
└── package.json
```
