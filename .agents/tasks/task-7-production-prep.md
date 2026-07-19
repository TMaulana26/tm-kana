# Modul Tugas 7: Persiapan Rilis Produksi & Dukungan PWA Offline

## 1. Deskripsi Tugas
Tugas ini berfokus pada pematangan aplikasi TM-KANA untuk siap rilis ke lingkungan produksi. Mengingat aplikasi ini berjalan 100% di sisi klien (client-side), optimasi rilis difokuskan pada pembersihan log debug, pengamanan parser impor cadangan dari serangan injeksi XSS, pembuatan layar batas kesalahan (*error boundary*), penyediaan aset favicon modern, serta implementasi PWA (Progressive Web App) dasar dengan `manifest.json` agar aplikasi dapat diinstal dan berjalan sepenuhnya secara offline.

## 2. Kriteria Sukses & Ketentuan Spesifik
- **Pembersihan Kode Debug Produksi:**
  - Konfigurasikan Vite bundler agar secara otomatis menghapus fungsi `console.log` dan `console.warn` pada build produksi untuk efisiensi ukuran file.
- **Pengamanan Sanitasi Input Impor Data:**
  - Perketat parser di `src/utils/progressCrypto.ts` saat melakukan impor. Lakukan sanitasi nilai string nama panggilan (*nickname*) untuk mencegah kerentanan XSS sebelum dimasukkan ke dalam state Pinia store.
- **Layar Batas Kesalahan (Error Boundary / Fallback Screen):**
  - Implementasikan penanganan kesalahan global di `main.ts` (`app.config.errorHandler`) untuk menangkap kegagalan runtime asinkron secara elegan dan menampilkan layar Neo-Brutalist fallback daripada aplikasi membeku/blank putih.
- **Instalabilitas Aplikasi (Manifest PWA Dasar):**
  - Sediakan berkas `public/manifest.json` yang menjelaskan nama aplikasi, tema warna Neo-Brutalisme, dan ikon instalasi.
  - Tambahkan tag link manifest di `index.html`.
- **Aset & Favicon Lengkap:**
  - Buat favicon dan ikon resolusi standar (192x192 dan 512x512) di folder `public/` dengan visual bertema Jepang/Kana Neo-Brutalisme.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Pembersihan & Optimasi Konfigurasi Vite
- [x] Sunting `vite.config.ts` untuk mengonfigurasi opsi kompresi `esbuild` agar menghapus `console.log` dan `debugger` khusus pada build produksi.

### [x] Pengamanan Impor Progres Belajar (Input Sanitation)
- [x] Tambahkan sanitasi string menggunakan regex atau parser sederhana pada properti `nickname` di `src/utils/progressCrypto.ts` saat mendekripsi berkas impor. Pastikan karakter HTML khusus disanitasi.

### [x] Layar Penanganan Eror Global (Error Boundary)
- [x] Buat komponen Neo-Brutalist error fallback screen sederhana `src/components/ErrorFallback.vue`.
- [x] Daftarkan penanganan eror global di `src/main.ts` untuk merender fallback component tersebut ketika terjadi *unhandled runtime error*.

### [x] Konfigurasi Manifest PWA Dasar & Favicon
- [x] Buat berkas `public/manifest.json` berisi detail instalasi aplikasi (ikon, warna dasar, orientasi display standalone).
- [x] Tambahkan ikon-ikon PWA standar ke folder `public/` (favicon.ico, icon-192.png, icon-512.png).
- [x] Daftarkan manifest di `<head>` pada `index.html`.

### [x] Pembuatan Unit Test Keamanan Input
- [x] Buat berkas unit test `src/utils/__tests__/security.spec.ts` untuk memverifikasi bahwa parser progres menolak payload impor yang disusupi skrip XSS berbahaya (`<script>alert(1)</script>`) atau melakukan sanitasi dengan benar.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [x] `npm run lint` (Bebas eror linting)
- [x] `npm run test` (Semua tes unit lolos 100%)
- [x] `npm run build` (Build produksi terkompilasi bersih)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Belum ada catatan.*
