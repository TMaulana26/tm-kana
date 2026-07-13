# Modul Tugas 1: Halaman Beranda & Manajemen Pengguna (Home Page)

## 1. Deskripsi Tugas
Tugas ini berfokus pada pembuatan antarmuka Halaman Beranda (Home / Welcome View). Halaman ini berfungsi sebagai pintu masuk pengguna untuk mengatur nama panggilan mereka, melakukan pencadangan atau pemulihan data progres secara lokal via file teks, serta menyediakan akses cepat ke panduan belajar eksternal.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Internasionalisasi (i18n):** Seluruh label teks (seperti judul, placeholder input, teks tombol) wajib menggunakan key path dari berkas translasi di `src/locales/`.
- **Manajemen Nickname:** 
  - Menyediakan input teks untuk Nickname (opsional). Jika dikosongkan, sistem otomatis memberikan nilai bawaan aksara Jepang `ユーザー` (User).
  - Data Nickname ini harus reaktif dan langsung tersimpan ke Pinia store.
- **Panel Sinkronisasi Data Progres:**
  - **Tombol Ekspor:** Ketika diklik, memicu utilitas `progressCrypto` untuk membungkus data progres aktif + Nickname menjadi file `.txt` terenkripsi Base64, lalu otomatis mengunduhnya ke perangkat pengguna.
  - **Tombol Impor:** Menyediakan area drop atau tombol upload berkas `.txt`. Sistem wajib membaca berkas tersebut, memvalidasi kecocokan Nickname pengguna saat ini dengan Nickname di dalam file (secara case-insensitive), lalu memulihkan state progres jika valid.
  - Tampilkan pesan sukses/gagal yang jelas menggunakan komponen toast/alert dari shadcn-vue apabila validasi impor gagal atau berhasil.
- **Tautan Eksternal Tofugu:** Menyediakan section kartu informasi yang rapi untuk mengarahkan pengguna belajar dasar alfabet Jepang ke Tofugu secara elegan.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Pembaruan Berkas Bahasa (i18n JSON)
- [x] Tambahkan key-value baru untuk kebutuhan halaman beranda di `src/locales/id.json` dan `src/locales/en.json` (seperti label input nickname, tombol cadangan, eror enkripsi, dll.).

### [x] Pembuatan UI Halaman Beranda
- [x] Buat layout kartu selamat datang yang minimalis dan bersih di pusat halaman.
- [x] Implementasikan input teks Nickname menggunakan komponen form dari shadcn-vue.
- [x] Buat section "Pencadangan Data" yang berisi dua tombol aksi: Ekspor (.txt) dan Impor (.txt).

### [x] Integrasi Logika Store & File API
- [x] Hubungkan input Nickname ke *action* perubahan nama di Pinia Store.
- [x] Hubungkan tombol ekspor dengan fungsi unduh file teks berbasis Base64.
- [x] Hubungkan tombol impor dengan input file HTML, lalu implementasikan penanganan eror jika berkas rusak atau Nickname tidak cocok.

### [x] Pembuatan Integration & UI Testing
- [x] Buat berkas tes komponen `src/views/__tests__/HomeView.spec.ts`.
- [x] Pastikan tes mencakup skenario: pengisian nickname default berjalan, tombol ekspor memicu unduhan, dan validasi file teks impor berjalan semestinya dengan mock i18n terpasang.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [x] `npm run lint` (Bebas eror)
- [x] `npm run test` (Semua tes unit & komponen berstatus lolos)
- [x] `npm run build` (Berhasil terkompilasi sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
- Digunakan `vue-sonner` (Toaster) menggantikan komponen `toast` lama yang sudah deprecated di `shadcn-vue` untuk menampilkan umpan balik.
- `localStorage` dimock secara khusus pada pengujian `HomeView.spec.ts` sebelum store diinisiasi untuk mencegah error JSDOM.
- Konstruktor `FileReader` dimock menggunakan ES6 class `MockFileReader` agar kompatibel dengan pemanggilan `new FileReader()`.
- Error TS2783 double-binding `toastOptions` pada auto-generated `Sonner.vue` diperbaiki dengan mendestruktur `toastOptions` dari `props` sebelum di-bind.
```
