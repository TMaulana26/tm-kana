---
trigger: model_decision
description: Saat akan inisiasi proyek nya
---

# Spesifikasi Tech Stack & Arsitektur

## Teknologi Utama

- **Framework:** Vue.js 3 (Wajib menggunakan Composition API dengan struktur `<script setup>` secara eksklusif).
- **Styling:** Tailwind CSS. Gunakan utility classes secara penuh. Dilarang keras menulis CSS vanilla di dalam blok `<style>` kecuali sangat mendesak untuk interaksi penyesuaian responsivitas kanvas menggambar (Draw).
- **Komponen UI:** shadcn-vue. Pastikan semua komponen diimplementasikan secara bersih, modular, terisolasi, dan reusable.
- **State Management & Persistensi:** Pinia untuk mengelola data progres belajar global. Wajib menggunakan plugin `@pinia/plugin-persistedstate` untuk otomatisasi sinkronisasi state ke `LocalStorage` demi menjaga integritas data progres pengguna secara mandiri di sisi klien.
- **Internasionalisasi (i18n):** `vue-i18n` (v9/v10+) untuk mendukung multi-bahasa (ID, EN, JA) sejak awal proyek.
- **Testing Framework:** Vitest dan Vue Test Utils untuk Unit & Integration Testing.
