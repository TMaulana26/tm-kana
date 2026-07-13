# Modul Tugas 4: Halaman Dashboard Progres & Statistik (Progress Page)

## 1. Deskripsi Tugas
Tugas ini berfokus pada pembuatan Halaman Dasbor Kemajuan Pengguna (Progress & Statistics View). Halaman ini bertugas menyajikan ringkasan data analitik dari Pinia store secara visual, memberikan informasi detail mengenai persentase penguasaan karakter Hiragana dan Katakana, serta menyediakan kontrol untuk melakukan reset data.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Internasionalisasi (i18n):** Semua teks label grafik, kartu ringkasan data, dan jendela konfirmasi reset wajib terintegrasi dengan berkas lokalisasi bahasa.
- **Visualisasi Statistik & Persentase:**
  - Menampilkan kartu ringkasan (Summary Cards) berisi total karakter yang sudah dikuasai vs total keseluruhan (contoh: "35 / 46 Hiragana", "12 / 46 Katakana").
  - Menampilkan komponen bilah kemajuan (Progress Bar dari shadcn-vue) yang menunjukkan persentase kelulusan secara real-time.
  - Menyediakan ringkasan performa latihan (berapa kali mencoba kuis dan menggambar untuk tiap karakter).
- **Fitur Destruktif (Reset Data):**
  - Menyediakan tombol "Reset Semua Progres" untuk menghapus seluruh data belajar yang ada di LocalStorage.
  - **Keamanan Aksi:** Aksi ini wajib memicu jendela konfirmasi (AlertDialog dari shadcn-vue) untuk mencegah ketidaksengajaan pengguna. Data hanya akan benar-benar dihapus jika pengguna memberikan konfirmasi final. Setelah di-reset, status aplikasi akan kembali ke keadaan awal (kondisi bersih).

## 3. Daftar Tugas (Checklist Kerja AI)

### [ ] Pembaruan Berkas Bahasa (i18n JSON)
- [ ] Lengkapi string i18n khusus halaman progres di `src/locales/id.json` dan `src/locales/en.json` (termasuk teks peringatan bahaya reset data).

### [ ] Desain Tampilan UI Dashboard
- [ ] Susun layout grid untuk kartu informasi statistik utama (Total Hafal, Akurasi Latihan, Hari Belajar).
- [ ] Implementasikan komponen Progress Bar shadcn-vue untuk visualisasi persentase penguasaan alfabet Hiragana dan Katakana secara terpisah.

### [ ] Pembuatan Daftar Rincian Karakter (Detailed List)
- [ ] Buat tabel atau list kolaps (Accordion/Table dari shadcn-vue) yang menjabarkan riwayat performa per karakter (menampilkan berapa kali salah/benar dalam mode kuis dan menggambar).

### [ ] Integrasi Jendela Konfirmasi & Fungsi Reset
- [ ] Implementasikan komponen AlertDialog shadcn-vue pada tombol reset.
- [ ] Hubungkan konfirmasi sukses dengan *action* di Pinia store untuk mengosongkan state progres dan membersihkan LocalStorage, lalu arahkan user kembali ke halaman Home dengan status awal.

### [ ] Pembuatan Component & Integration Testing
- [ ] Buat berkas pengujian komponen `src/views/__tests__/ProgressView.spec.ts`.
- [ ] Pastikan skenario pengujian mencakup: data statistik terhitung dengan benar dari mock store, bar kemajuan merespons perubahan state, dan fungsi pembersihan LocalStorage terpicu saat konfirmasi dialog reset ditekan.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [ ] `npm run lint` (Bebas eror)
- [ ] `npm run test` (Semua tes unit & komponen berstatus lolos)
- [ ] `npm run build` (Berhasil terkompilasi sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Belum ada catatan.*
