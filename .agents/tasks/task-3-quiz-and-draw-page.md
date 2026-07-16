# Modul Tugas 3: Halaman Latihan Interaktif (Quiz & Draw Arena)

## 1. Deskripsi Tugas

Tugas ini berfokus pada pembuatan fitur utama aplikasi: Arena Latihan. Modul ini mencakup konfigurator pencampur karakter bebas batas, Mode Kuis (tebak ketik Romaji), dan Mode Menggambar (validasi koordinat goresan pada kanvas), serta sistem penilaian otomatis berbasis _Actions_ Pinia yang langsung memperbarui state progres pengguna.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur

- **Internasionalisasi (i18n Mandatory):** Teks instruksi kuis, pesan umpan balik (Benar/Salah), status skor, dan kontrol aksi kanvas wajib menggunakan lokalisasi i18n (`$t` atau `t()`). Dilarang keras menulis string mentah langsung di dalam template/script.
- **Konfigurator Pencampur Karakter Bebas Batas:**
  - Menyediakan panel multi-select (menggunakan checkbox/badge dari shadcn-vue) di mana pengguna bebas mencentang kombinasi grup baris Hiragana dan Katakana mana saja tanpa batasan (contoh: mencampur Hiragana baris A-K dengan Katakana baris S-T).
  - Pilihan jumlah soal kuis bersifat dinamis (opsi: 10, 20, 50 soal, atau Uji Semua).
- **Mode Kuis (Quiz Mode):**
  - Menampilkan karakter Kana acak dari hasil filter konfigurator.
  - Menyediakan input teks untuk pengguna mengetik Romaji-nya. Validasi jawaban wajib bersifat _case-insensitive_ dan membersihkan spasi tak sengaja (_trimmed_).
- **Mode Menggambar (Draw Mode):**
  - Menampilkan karakter Kana sasaran sebagai referensi visual.
  - Menyediakan komponen **Kanvas Menggambar** interaktif yang mendeteksi input kursor mouse (desktop) dan sentuhan jari (mobile).
  - **Validasi Koordinat Garis:** Menggunakan algoritma geometri murni (seperti `$1 Recognizer`) yang diisolasi di folder `src/utils/` sebagai _pure functions_. Pustaka harus membandingkan pola titik koordinat array hasil goresan pengguna dengan pola dasar koordinat target secara akurat.
- **Sistem Penilaian & Dampak State Store:**
  - Jika jawaban Benar (baik Kuis ketik maupun Menggambar), sistem wajib memicu _Action_ Pinia untuk memperbarui status progres: `progress[characterId].hasLearned = true`[cite: 2]. Pencarian data wajib menggunakan `id` unik karakter dari konstanta `kanaData.ts` (contoh: `h-a` vs `k-a`) untuk menghindari bentrokan data karena kesamaan nama Romaji.
  - Menampilkan efek umpan balik visual singkat saat jawaban dinilai (Benar = Hijau, Salah = Merah) sebelum otomatis lanjut ke soal berikutnya secara asinkron.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Pembaruan Berkas Bahasa & Integrasi Pustaka Kanvas

- [x] Tambahkan seluruh string i18n untuk instruksi kuis, tombol hapus kanvas, status soal, tombol lewati, dan notifikasi hasil di berkas JSON bahasa (ID, EN, JA)[cite: 2].
- [x] Implementasikan algoritma pencocokan koordinat garis (`$1 Recognizer helper`) sebagai _pure functions_ di folder `src/utils/strokeRecognizer.ts`[cite: 2].

### [x] Pembuatan UI Konfigurator Latihan

- [x] Buat antarmuka pemilihan grup baris Kana (Hiragana & Katakana) menggunakan komponen layout grid Tailwind CSS yang rapi dan responsif.
- [x] Buat tombol opsi jumlah soal dan tombol saklar berbasis shadcn-vue untuk memilih antara "Mode Kuis" atau "Mode Menggambar".

### [x] Implementasi Mode Kuis (Ketik Romaji)

- [x] Bangun logika pengacakan (_shuffling algorithm_) karakter murni yang efisien berdasarkan array ID karakter terpilih.
- [x] Buat komponen input teks dengan validasi otomatis saat pengguna menekan tombol Enter atau tombol kirim.
- [x] Integrasikan umpan balik visual sukses/gagal dengan transisi status yang bersih tanpa memicu kebocoran memori.

### [x] Implementasi Mode Menggambar & Composable Kanvas

- [x] Ekstrak seluruh logika reaktif manajemen kanvas, pelacakan _mouse/touch events_, pembukaan jalur _path_, dan pembersihan kanvas ke dalam sebuah _Composable_ terpisah: `src/composables/useCanvas.ts`[cite: 2].
- [x] Bangun komponen `KanaCanvas.vue` reusable dengan struktur `<script setup lang="ts">` yang memanfaatkan HTML5 Canvas API dan terikat dengan `useCanvas.ts`[cite: 2].
- [x] Pastikan event listener dibersihkan secara otomatis saat komponen di-_unmount_ menggunakan siklus hidup Vue (`onUnmounted`) untuk mencegah _memory leak_[cite: 2].
- [x] Sediakan tombol kontrol "Hapus Kanvas" (Clear) dan "Lewati" (Skip).

### [x] Pembuatan Unit & Component Testing

- [x] Buat berkas tes unit `src/utils/__tests__/strokeRecognizer.spec.ts` untuk memvalidasi akurasi algoritma pencocokan koordinat geometris pada kasus sukses dan gagal[cite: 2].
- [x] Buat berkas tes komponen `src/views/__tests__/PracticeView.spec.ts` untuk memastikan alur kuis dari soal pertama hingga layar skor akhir berjalan mulus tanpa kegagalan i18n (gunakan konfigurasi mock global)[cite: 2].

## 4. Validasi Akhir (Wajib Dijalankan Berurutan Sebelum Selesai)

- [x] `npm run lint` (Bebas eror linting statis)
- [x] `npm run test` (Semua skenario tes unit & komponen berstatus lolos 100%)
- [x] `npm run build` (Proyek dapat terkompilasi dengan sukses tanpa eror TypeScript atau bundler)

---

## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)

- Implementasi algoritma stroke recognizer hibrida ($1 Recognizer + offscreen pixel tracer) berhasil disematkan dengan kinerja tinggi secara offline.
- Canvas state management diekstrak secara fungsional ke dalam `useCanvas` composable untuk menjaga kebersihan komponen dan mempermudah unit testing.
