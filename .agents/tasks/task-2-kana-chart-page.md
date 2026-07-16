# Modul Tugas 2: Halaman Kamus & Tabel Interaktif (Kana Chart Page)

## 1. Deskripsi Tugas

Tugas ini berfokus pada pembuatan Halaman Kamus Interaktif (Kana Chart View). Halaman ini menampilkan seluruh grid karakter Hiragana dan Katakana yang dikelompokkan secara terstruktur, menampilkan status hafalan pengguna secara visual, dan menyediakan panduan detail cara menulis setiap karakter.

## 2. Kriteria Sukses & Ketentuan Spesifik Fitur

- **Internasionalisasi (i18n Mandatory):** Seluruh label navigasi kelompok huruf, kategori baris, dan teks tombol utilitas wajib menggunakan sistem lokalisasi `$t()`. Dilarang keras menulis string mentah bahasa tertentu langsung di dalam template.
- **Struktur Pengelompokan Kana (Tofugu & Reference Standard):**
  - Grid wajib memisahkan dan mengelompokkan karakter secara rapi menjadi tiga kategori utama: _Gojuon_ (Karakter Utama), _Dakuten/Handakuon_ (Kana Turunan), dan _Yoon_ (Karakter Kombinasi Klasik & Modern).
  - Menyediakan komponen `Tabs` dari shadcn-vue yang responsif untuk berpindah antara tabel "Hiragana" dan "Katakana".
- **Integrasi State Progres (Pinia + Persistensi LocalStorage):**
  - Setiap kartu huruf dalam grid wajib membaca status progres dari Pinia Store berdasarkan ID unik karakter (`progress[characterId].hasLearned`).
  - **Efek Visual:** Kartu huruf yang sudah ditandai sukses/hafal wajib berubah warna secara visual (menggunakan utility classes dari Tailwind CSS) untuk memberikan kepuasan progres visual kepada pengguna.
- **Detail Drawer/Modal (Stroke Order Guide):**
  - Jika salah satu kartu Kana diklik, aplikasi wajib memunculkan komponen Drawer atau Dialog (dari shadcn-vue) yang menampilkan:
    1. Karakter Kana berukuran besar.
    2. Cara baca Romaji.
    3. Panduan urutan goresan (_Stroke Order_ menggunakan aset SVG/gambar lokal).
    4. Tombol aksi manual: "Tandai Sudah Hafal" / "Hapus dari Daftar Hafalan" yang langsung memicu _Actions_ di dalam Pinia Store.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Pembaruan Berkas Bahasa & Data Aset Kana

- [x] Tambahkan key lokalisasi baru untuk menu navigasi chart dan tombol aksi di `src/locales/id.json`, `src/locales/en.json`, dan `src/locales/ja.json`.
- [x] Gunakan berkas data statis/konstanta tergetik (_strongly typed interface_) di `src/constants/kanaData.ts` yang menampung seluruh karakter Hiragana & Katakana (Gojuon, Dakuten, Yoon) lengkap dengan `id`, `character`, `romaji`, dan `rowGroup`.
- [x] _Catatan Koreksi Data:_ Pastikan Hiragana Dakuten E-Row menggunakan karakter `で` (DE) dan Yoon menggunakan huruf kecil murni hiragana (`みゃ`, `びゃ`).

### [x] Pembuatan UI Grid & Tab Navigasi

- [x] Implementasikan komponen Tabs dari shadcn-vue untuk memisahkan view Hiragana dan Katakana pada file `KanaChartView.vue`.
- [x] Bangun komponen `KanaCard.vue` reusable menggunakan `<script setup lang="ts">` yang menerima props objek karakter dan otomatis menampilkan indikator visual berdasarkan status dari Pinia store.
- [x] Susun layout grid Tailwind CSS yang rapi, modular, dan responsif (aman dibuka di mobile maupun desktop).

### [x] Pembuatan Detail Modal & Aksi State

- [x] Implementasikan komponen Dialog/Drawer shadcn-vue untuk menampilkan detail karakter saat kartu diklik.
- [x] Tampilkan panduan goresan (menggunakan aset SVG urutan menulis lokal di dalam modal).
- [x] Hubungkan tombol saklar (toggle) di dalam modal ke _action_ Pinia untuk memperbarui status hafalan secara manual (dilarang memutasi state secara langsung dari komponen).

### [x] Pembuatan Unit & Component Testing

- [x] Buat berkas pengujian `src/components/__tests__/KanaCard.spec.ts` untuk memastikan properti indikator warna berubah sesuai status state Pinia.
- [x] Buat berkas pengujian `src/views/__tests__/KanaChartView.spec.ts` untuk memastikan perpindahan tab dan pemanggilan modal berfungsi 100%.
- [x] Pastikan infrastruktur pengujian menggunakan global mock i18n pada file `tests/setup.ts` agar fungsi `$t` otomatis dikenali tanpa eror.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan Sebelum Selesai)

- [x] `npm run lint` (Bebas eror linting statis)
- [x] `npm run test` (Semua skenario tes unit & komponen berstatus lolos 100%)
- [x] `npm run build` (Proyek dapat terkompilasi dengan sukses tanpa eror TypeScript atau bundler)

---

## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)

_Belum ada catatan._
