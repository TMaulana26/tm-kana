# Modul Tugas 4: Halaman Dashboard Progres & Statistik (Progress Page)

## 1. Deskripsi Tugas
Tugas ini berfokus pada pembuatan Halaman Dasbor Kemajuan Pengguna (Progress & Statistics View). Halaman ini bertugas menyajikan ringkasan data analitik dari Pinia store (`useProgressStore`) secara visual dengan desain Neo-Brutalisme yang konsisten, menyajikan persentase penguasaan karakter Hiragana dan Katakana, rincian aktivitas latihan (Kuis vs Menulis Goresan), serta menyediakan tombol destruktif untuk me-reset data dengan aman menggunakan dialog konfirmasi.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Internasionalisasi (i18n):** Semua label teks, status progres, tooltip grafik, dan pesan konfirmasi dialog wajib menggunakan lokalisasi bahasa via `$t()` atau `t()`.
- **Desain & Estetika Neo-Brutalisme:**
  - Layout wajib menggunakan border tegas (`border-[3px] border-slate-950 dark:border-white`), bayangan solid tanpa blur (`shadow-[4px_4px_0px_0px_#000]`), warna kontras (seperti warna primer kuning `bg-yellow-300`, violet `bg-violet-400`, atau emerald `bg-emerald-400`), serta tipografi tebal (`font-black uppercase`).
- **Visualisasi Statistik & Persentase:**
  - **Summary Cards (Kartu Ringkasan):**
    - Total karakter yang telah dipelajari (`hasLearned: true`) dibandingkan dengan jumlah total Hiragana (46) dan Katakana (46).
    - Statistik detail latihan: total percobaan kuis dan menggambar coretan, rasio akurasi sukses/gagal secara kumulatif.
  - **Progress Bar:** Menampilkan bar progres visual yang tebal dan kontras untuk Hiragana dan Katakana.
- **Rincian Performa Karakter (Detailed List):**
  - Menyediakan filter atau tabel kolaps (Accordion/Table) untuk melihat performa per karakter.
  - Setiap baris menunjukkan: karakter, romaji, jumlah keberhasilan/kegagalan kuis (`quizSuccessCount` / `quizFailCount`), serta jumlah keberhasilan/kegagalan coretan (`drawSuccessCount` / `drawFailCount`).
  - Menyediakan tombol cepat untuk mengubah status hafalan (`hasLearned`) per karakter langsung dari tabel secara reaktif.
- **Fitur Reset Data Belajar:**
  - Menyediakan tombol "Reset Semua Progres" dengan peringatan bahaya yang jelas.
  - Wajib dilindungi dengan `AlertDialog` konfirmasi. Jika disetujui, panggil action `resetProgress` di Pinia store dan alihkan user ke halaman Home dengan state bersih.

## 3. Daftar Tugas (Checklist Kerja AI)

### [ ] Pembaruan Berkas Bahasa (i18n JSON)
- [ ] Tambahkan i18n keys untuk halaman progres (misal: statistik utama, tabel riwayat latihan, konfirmasi dialog reset, tombol filter) di `src/locales/id.json`, `src/locales/en.json`, dan `src/locales/ja.json`.

### [ ] Desain Tampilan UI Dashboard
- [ ] Implementasikan grid layout yang responsif untuk kartu statistik (Kemajuan Hiragana, Kemajuan Katakana, Akurasi Latihan, Hari Belajar).
- [ ] Gunakan komponen Progress Bar ber-style Neo-Brutalisme dengan border hitam solid dan warna cerah (`bg-emerald-400` / `bg-violet-400`).

### [ ] Tabel Rincian & Riwayat Latihan Per Karakter
- [ ] Buat tabel rincian ber-style Neo-Brutalisme dengan sticky header dan scrollable container (`max-h-[600px]`) agar nyaman saat data banyak.
- [ ] Tampilkan statistik latihan Kuis dan Menulis secara berdampingan untuk setiap karakter.
- [ ] Tambahkan badge reaktif untuk menunjukkan status "Dikuasai" yang dapat di-toggle (`toggleLearned`) langsung oleh user di baris tabel.
- [ ] Tambahkan pencarian sederhana atau filter grup (Gojuon, Dakuten, Yoon) untuk menyaring data karakter yang tampil di tabel.

### [ ] Integrasi Jendela Konfirmasi & Fungsi Reset
- [ ] Pasang tombol Reset dengan visualisasi peringatan merah (`bg-rose-400`).
- [ ] Integrasikan dengan komponen dialog konfirmasi agar aman dari salah klik.
- [ ] Pastikan setelah reset berhasil, LocalStorage bersih, state Pinia di-reset, dan view diperbarui secara instan.

### [ ] Pembuatan Component & Integration Testing
- [ ] Buat berkas pengujian komponen `src/views/__tests__/ProgressView.spec.ts`.
- [ ] Uji kalkulasi persentase kemajuan di dashboard, interaksi pencarian/filter di tabel rincian, pemanggilan action `toggleLearned` di store, serta alur sukses pembersihan data progres saat tombol reset dikonfirmasi.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [ ] `npm run lint` (Bebas dari segala peringatan/eror linting)
- [ ] `npm run test` (Semua pengujian unit & komponen lolos 100%)
- [ ] `npm run build` (Build produksi berhasil terkompilasi bersih)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Disesuaikan agar sejalan dengan implementasi interaktif stroke-by-stroke dan fungsionalitas detail dialog.*
