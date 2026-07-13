# Modul Tugas 0: Inisialisasi & Setup Proyek Utama

## 1. Deskripsi Tugas
Tugas ini berfokus pada penyiapan struktur dasar repositori aplikasi web "Learn Japanese App", konfigurasi *tooling* (Vue 3, Tailwind, shadcn-vue, Pinia, vue-i18n, Vitest), serta pembuatan utilitas global untuk sistem ekspor/impor data berbasis Base64.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Inisialisasi Project:** Repositori terkonfigurasi dengan Vue 3, Tailwind CSS, shadcn-vue, vue-i18n, dan TypeScript.
- **Struktur i18n:** Terkonfigurasi instansi i18n global. Setup berkas bahasa awal di `src/locales/id.json` dan `src/locales/en.json` yang berisi teks dasar untuk navigasi (Home, Chart, Quiz, Progress).
- **Konfigurasi Testing:** Vitest dan Vue Test Utils siap dijalankan dan dikonfigurasi agar mengenali fungsi i18n `$t`.
- **Global Layout:** Terdapat struktur layout induk (Navbar/Sidebar) responsif yang menggunakan teks dari i18n, dilengkapi dengan komponen pemilih bahasa (Language Switcher dropdown).
- **Core Utility (Base64 Txt System):** Fungsi enkripsi/dekripsi progres berbasis JSON ke string Base64 yang diunduh/diunggah sebagai file `.txt` dengan proteksi Nickname.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Inisialisasi & Konfigurasi Tooling
- [x] Jalankan setup awal Vue 3 + Vite + TypeScript.
- [x] Konfigurasikan Tailwind CSS dan inisialisasi library komponen shadcn-vue.
- [x] Setup Pinia Store beserta plugin persistensi lokal (LocalStorage wrapper).
- [x] Instal dan konfigurasi `vue-i18n` (buat berkas konfigurasi utama di `src/i18n.ts`).
- [x] Buat berkas kamus bahasa awal di `src/locales/id.json` dan `src/locales/en.json`.
- [x] Konfigurasikan Vitest untuk unit testing (termasuk mock helper untuk i18n).

### [x] Pembuatan Layout Utama & Router
- [x] Setup Vue Router untuk navigasi halaman (Home, Chart, Latihan, Progres).
- [x] Buat komponen Layout Induk (Navbar & Sidebar navigasi) yang memanfaatkan i18n.
- [x] Buat komponen dropdown Pemilih Bahasa (Language Switcher) menggunakan shadcn-vue untuk mengganti locale aktif.

### [x] Pembuatan Core Utility & Unit Testing (Base64 System)
- [x] Buat berkas `src/utils/progressCrypto.ts` untuk fungsi *encoding*/*decoding* Base64 beserta skema validasi *nickname*.
- [x] Buat berkas tes `src/utils/__tests__/progressCrypto.spec.ts` untuk memverifikasi keakuratan fungsi enkripsi/dekripsi tersebut.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [x] `npm run lint` (Bebas eror)
- [x] `npm run test` (100% tes unit utilitas lolos)
- [x] `npm run build` (Berhasil terkompilasi sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
- Setup lint menggunakan ESLint 9+ flat config (`eslint.config.js`). Dilengkapi dengan relax rules untuk file Vue.
- `ignoreDeprecations: "6.0"` ditambahkan ke tsconfig untuk menanggulangi deprecation warning `baseUrl` pada TypeScript 6.
- Custom Pinia persistence logic diimplementasikan secara internal pada Pinia store (`src/stores/progress.ts`) yang mensinkronisasi data user secara otomatis ke `localStorage`.
- Fungsi `exportProgress` dan `importProgress` mendukung karakter non-ASCII (seperti nickname bawaan `ユーザー`) menggunakan unicode-safe Base64 encode/decode logic.
