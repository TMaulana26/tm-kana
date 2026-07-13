# Modul Tugas 3: Halaman Latihan Interaktif (Quiz & Draw Arena)

## 1. Deskripsi Tugas
Tugas ini berfokus pada pembuatan fitur utama aplikasi: Arena Latihan. Modul ini mencakup konfigurator pencampur karakter, Mode Kuis (tebak ketik Romaji), dan Mode Menggambar (validasi koordinat goresan pada kanvas), serta sistem penilaian otomatis yang langsung memperbarui state progres pengguna.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Internasionalisasi (i18n):** Teks instruksi kuis, pesan umpan balik (Benar/Salah), dan kontrol kanvas wajib menggunakan lokalisasi i18n.
- **Konfigurator Pencampur Karakter Bebas Batas:**
  - Menyediakan panel multi-select (menggunakan checkbox/badge dari shadcn-vue) di mana pengguna bebas mencentang kombinasi grup baris Hiragana dan Katakana mana saja tanpa batasan (contoh: mencampur Hiragana baris A-K dengan Katakana baris S-T).
  - Pilihan jumlah soal kuis bersifat dinamis (opsi: 10, 20, 50 soal, atau Uji Semua).
- **Mode Kuis (Quiz Mode):**
  - Menampilkan karakter Kana acak dari hasil filter konfigurator.
  - Menyediakan input teks untuk pengguna mengetik Romaji-nya. Validasi jawaban bersifat case-insensitive (contoh: "ka" atau "KA" dinilai sama).
- **Mode Menggambar (Draw Mode):**
  - Menampilkan karakter Kana sasaran.
  - Menyediakan komponen **Kanvas Menggambar** interaktif yang mendeteksi input kursor mouse (desktop) dan sentuhan jari (mobile).
  - **Validasi Koordinat Garis:** Menggunakan pustaka pencocokan koordinat sederhana (seperti implementasi algoritma `$1 Recognizer` atau pustaka berbasis koordinat sejenis) untuk mengecek apakah pola goresan pengguna sesuai dengan koordinat dasar bentuk Kana tersebut.
- **Sistem Penilaian & Dampak State:**
  - Jika jawaban Benar (baik Kuis ketik maupun Menggambar), sistem langsung memperbarui Pinia store: `progress[character].hasLearned = true`, dan menambah hitungan percobaan sukses.
  - Menampilkan animasi/efek umpan balik visual singkat saat jawaban dinilai (Benar = Hijau, Salah = Merah) sebelum otomatis lanjut ke soal berikutnya.

## 3. Daftar Tugas (Checklist Kerja AI)

### [ ] Pembaruan Berkas Bahasa & Integrasi Pustaka Kanvas
- [ ] Tambahkan seluruh string i18n untuk instruksi kuis, tombol hapus kanvas, dan notifikasi hasil di berkas JSON.
- [ ] Konfigurasikan atau buat pustaka utilitas pembaca/pencocok koordinat garis ($1 Recognizer helper) di folder `src/utils/` untuk validasi goresan kuas.

### [ ] Pembuatan UI Konfigurator Latihan
- [ ] Buat antarmuka pemilihan grup baris Kana (Hiragana & Katakana) menggunakan komponen layout grid yang rapi.
- [ ] Buat tombol opsi jumlah soal dan tombol saklar untuk memilih antara "Mode Kuis" atau "Mode Menggambar".

### [ ] Implementasi Mode Kuis (Ketik Romaji)
- [ ] Bangun logika pengacakan (*shuffling algorithm*) karakter berdasarkan grup yang dipilih.
- [ ] Buat komponen input teks dengan validasi otomatis saat pengguna menekan tombol Enter atau tombol kirim.
- [ ] Integrasikan sistem pemicu suara (opsional/jika ada aset) atau feedback visual sukses.

### [ ] Implementasi Mode Menggambar (Draw Canvas)
- [ ] Buat komponen `KanaCanvas.vue` reusable menggunakan HTML5 Canvas API yang mendukung *mouse events* dan *touch events*.
- [ ] Hubungkan goresan kanvas dengan fungsi deteksi koordinat garis untuk menentukan status kelulusan goresan.
- [ ] Sediakan tombol "Hapus Kanvas" (Clear) dan "Lewati" (Skip).

### [ ] Pembuatan Unit & Integration Testing
- [ ] Buat berkas tes unit `src/utils/__tests__/strokeRecognizer.spec.ts` untuk memvalidasi akurasi algoritma pencocokan koordinat.
- [ ] Buat berkas tes komponen `src/views/__tests__/PracticeView.spec.ts` untuk memastikan alur kuis dari soal pertama hingga selesai berjalan mulus tanpa kebocoran memori.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [ ] `npm run lint` (Bebas eror)
- [ ] `npm run test` (Semua tes unit & komponen berstatus lolos)
- [ ] `npm run build` (Berhasil terkompilasi sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Belum ada catatan.*
