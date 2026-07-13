---
trigger: model_decision
description: Saat akan inisiasi proyek nya
---

# Spesifikasi Tech Stack & Arsitektur

## Teknologi Utama

- **Framework:** Vue.js 3 (Wajib menggunakan Composition API dengan struktur `<script setup>`).
- **Styling:** Tailwind CSS. Gunakan utility classes secara penuh. Dilarang keras menulis CSS vanilla di dalam blok `<style>` kecuali sangat mendesak untuk interaksi kanvas.
- **Komponen UI:** shadcn-vue. Pastikan semua komponen diimplementasikan secara bersih, modular, dan reusable.
- **State Management & Persistensi:** Pinia untuk mengelola data progres belajar global yang tersinkronisasi otomatis dengan LocalStorage/SessionStorage.
- **Internasionalisasi (i18n):** `vue-i18n` (v9/v10+) untuk mendukung multi-bahasa sejak awal proyek.
- **Testing Framework:** Vitest dan Vue Test Utils untuk Unit & Integration Testing.
