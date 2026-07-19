# Modul Tugas 6: Optimasi SEO & Aksesibilitas Website

## 1. Deskripsi Tugas
Tugas ini berfokus pada peningkatan visibilitas mesin pencari (SEO) dan aksesibilitas (Aria/Semantic) pada web TM-KANA. Mengingat aplikasi ini berbasis client-side murni (Vite + Vue 3), optimasi ini mencakup penyediaan meta tags dinamis (Title & Description) menggunakan Router Navigation Guards, konfigurasi metadata Open Graph / Twitter Card, penambahan berkas `robots.txt` & `sitemap.xml`, struktur data JSON-LD, serta audit markup semantik HTML.

## 2. Kriteria Sukses & Ketentuan Spesifik
- **Meta Tags & Judul Dinamis:**
  - Halaman harus memperbarui `document.title` secara otomatis saat navigasi (misal: "Beranda - TM-KANA", "Tabel Kana - TM-KANA", "Arena Latihan - TM-KANA", "Dasbor Progres - TM-KANA").
  - Meta description harus diperbarui secara dinamis agar sesuai dengan konten halaman aktif.
- **Open Graph & Twitter Cards:**
  - Tambahkan tag `og:title`, `og:description`, `og:image`, dan `twitter:card` di `index.html` sebagai fallback utama yang informatif.
- **Robots.txt & Sitemap.xml:**
  - Tempatkan berkas `robots.txt` dan `sitemap.xml` di dalam folder `public/` dengan konfigurasi indeksasi lengkap.
- **Structured Data (JSON-LD):**
  - Implementasikan skema structured data berjenis `SoftwareApplication` atau `EducationalApplication` di `index.html` untuk mempermudah perayap mesin pencari memahami fungsi aplikasi.
- **HTML Semantik & Aksesibilitas:**
  - Lakukan audit pada `HomeView.vue`, `KanaChartView.vue`, `PracticeView.vue`, dan `ProgressView.vue` agar menggunakan tag semantik HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`).
  - Pastikan setiap halaman memiliki tepat satu tag `<h1>`.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Meta Tags & Navigasi Router Dinamis
- [x] Tambahkan properti `meta: { titleKey: string, descKey: string }` pada setiap rute di `src/router/index.ts`.
- [x] Implementasikan guard `router.afterEach` untuk memperbarui judul dokumen dan meta tag deskripsi secara dinamis menggunakan modul i18n (`t()`).

### [x] Konfigurasi Metadata Sosial Media (Open Graph)
- [x] Sunting `index.html` untuk menempatkan meta tags Open Graph dan Twitter Cards yang lengkap di dalam blok `<head>`.
- [x] Sediakan gambar preview logo/representasi sederhana (bisa menggunakan placeholder SVG lokal di `public/`).

### [x] Berkas Sitemap & Robots.txt
- [x] Buat berkas `public/robots.txt` yang mengizinkan perayapan umum dan mereferensikan lokasi sitemap (`https://tm-kana.mtim.my.id/sitemap.xml`).
- [x] Buat berkas `public/sitemap.xml` yang mendaftarkan seluruh rute fungsional (`/`, `/chart`, `/practice`, `/progress`) dengan domain `https://tm-kana.mtim.my.id`.

### [x] Struktur Data Skema JSON-LD
- [x] Tambahkan tag `<script type="application/ld+json">` di `index.html` yang menjelaskan detail aplikasi TM-KANA sebagai alat bantu edukasi bahasa Jepang gratis.

### [x] Audit Semantik HTML & Aksesibilitas
- [x] Periksa dan ubah struktur div utama pada halaman View menjadi elemen `<main>`, header bagian menjadi `<header>`, dan bagian isi tabel/kuis menjadi `<section>`.
- [x] Pastikan tombol ikon murni (seperti tombol back/delete) memiliki atribut `aria-label` yang dapat dibaca oleh pembaca layar.

### [x] Pembuatan Unit Testing SEO
- [x] Buat berkas pengujian `src/router/__tests__/seo.spec.ts` untuk memverifikasi perubahan judul dokumen dan penyesuaian deskripsi meta tag saat navigasi rute diuji secara simulasi.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [x] `npm run lint` (Bebas eror linting)
- [x] `npm run test` (Semua tes unit lolos 100%)
- [x] `npm run build` (Build produksi terkompilasi bersih)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Belum ada catatan.*
