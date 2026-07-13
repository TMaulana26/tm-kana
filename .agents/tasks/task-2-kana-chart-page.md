# Modul Tugas 2: Halaman Kamus & Tabel Interaktif (Kana Chart Page)

## 1. Deskripsi Tugas
Tugas ini berfokus pada pembuatan Halaman Kamus Interaktif (Kana Chart View). Halaman ini menampilkan seluruh grid karakter Hiragana dan Katakana yang dikelompokkan secara terstruktur, menampilkan status hafalan pengguna secara visual, dan menyediakan panduan detail cara menulis setiap karakter.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur
- **Internasionalisasi (i18n):** Seluruh label navigasi kelompok huruf dan teks tombol utilitas wajib menggunakan sistem lokalisasi `$t()`.
- **Struktur Pengelompokan Kana (Tofugu Reference):**
  - Grid wajib memisahkan dan mengelompokkan karakter secara rapi menjadi: *Gojuon* (Karakter Utama: A, K, S, T, N, H, M, Y, R, W-row), *Dakuon/Handakuon* (G, Z, D, B, P-row), dan *Yoon* (Karakter Kombinasi: Kya, Sha, Cha, dst.).
  - Menyediakan tombol *Toggle/Tab switch* yang responsif untuk berpindah antara tabel "Hiragana" dan "Katakana".
- **Integrasi State Progres (Game Dev Style):**
  - Setiap kartu huruf dalam grid wajib membaca status progres dari Pinia Store (`progress[character].hasLearned`).
  - **Efek Visual:** Kartu huruf yang sudah ditandai sukses/hafal wajib berubah warna secara visual (misal: aksen warna hijau atau border khusus dari Tailwind) untuk memberikan kepuasan progres visual kepada pengguna.
- **Detail Drawer/Modal (Stroke Order Guide):**
  - Jika salah satu kartu Kana diklik, aplikasi wajib memunculkan komponen Drawer atau Dialog (dari shadcn-vue) yang menampilkan:
    1. Karakter Kana berukuran besar.
    2. Cara baca Romaji.
    3. Panduan urutan goresan (*Stroke Order*).
    4. Tombol aksi manual: "Tandai Sudah Hafal" / "Hapus dari Daftar Hafalan" yang langsung memperbarui state di Pinia.

## 3. Daftar Tugas (Checklist Kerja AI)

### [ ] Pembaruan Berkas Bahasa & Data Aset Kana
- [ ] Tambahkan key lokalisasi baru untuk chart di `src/locales/id.json` dan `src/locales/en.json`.
- [ ] Buat berkas data statis/konstanta JSON di `src/constants/kanaData.ts` yang menampung daftar seluruh karakter Hiragana & Katakana beserta kelompok baris dan romajinya.

### [ ] Pembuatan UI Grid & Tab Navigasi
- [ ] Implementasikan komponen Tabs dari shadcn-vue untuk memisahkan view Hiragana dan Katakana.
- [ ] Bangun komponen `KanaCard.vue` reusable yang menerima props karakter dan otomatis menampilkan indikator visual berdasarkan status dari Pinia store.
- [ ] Susun layout grid Tailwind yang rapi dan responsif (nyaman dibuka di mobile maupun desktop).

### [ ] Pembuatan Detail Modal & Aksi State
- [ ] Implementasikan komponen Dialog/Drawer shadcn-vue untuk menampilkan detail karakter saat kartu diklik.
- [ ] Tampilkan panduan goresan (bisa berupa aset gambar lokal/SVG urutan menulis di dalam modal).
- [ ] Hubungkan tombol saklar (toggle) di dalam modal ke *action* Pinia untuk memperbarui status hafalan secara manual.

### [ ] Pembuatan Unit & Component Testing
- [ ] Buat berkas pengujian `src/components/__tests__/KanaCard.spec.ts` untuk memastikan indikator warna berubah sesuai state Pinia.
- [ ] Buat berkas pengujian `src/views/__tests__/KanaChartView.spec.ts` untuk memastikan perpindahan tab dan pemanggilan modal berfungsi 100% tanpa eror i18n.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [ ] `npm run lint` (Bebas eror)
- [ ] `npm run test` (Semua tes unit & komponen berstatus lolos)
- [ ] `npm run build` (Berhasil terkompilasi sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Belum ada catatan.*
