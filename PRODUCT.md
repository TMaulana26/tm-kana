# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Pelajar Bahasa Jepang Pemula (Self-Directed Learners):** Orang yang baru memulai belajar bahasa Jepang dan perlu menghafal 46 karakter dasar Hiragana dan Katakana (Gojuon), beserta variasi Dakuon dan Yoon (kombinasi).
- **Pengguna Mobile & Desktop yang Menghargai Privasi:** Pengguna yang ingin belajar langsung di peramban tanpa harus mengunduh aplikasi native berat, tanpa login/registrasi, dan tanpa khawatir data riwayat belajarnya dilacak atau dijual.
- **Visual & Kinetik Learner:** Siswa yang belajar lebih efektif dengan metode interaktif: melihat urutan goresan (*stroke order*), melatih memori otot dengan menggambar langsung di kanvas, dan menguji ingatan melalui kuis kilat.

## Product Purpose

TM-KANA adalah platform web edukasi interaktif mandiri (*100% Client-Side / Local-First*) untuk menguasai sistem tulisan bahasa Jepang (Hiragana dan Katakana). TM-KANA hadir untuk menghilangkan segala dinding penghalang (*friction-free*): tanpa akun, bebas biaya, bebas iklan, responsif, dan dapat berjalan secara offline (PWA). Keberhasilan produk diukur dari kemudahan pengguna mengenali huruf, ketepatan menulis goresan kana, serta kecepatan pencapaian hafalan karakter (100% mastery).

## Positioning

Berbeda dengan aplikasi populer seperti Duolingo atau Quizlet yang memerlukan akun, memuat iklan/paywall, dan membatasi sesi latihan dengan sistem energi/kuota:
- **100% Client-Side & Zero-Cost:** Beroperasi penuh di peramban pengguna melalui LocalStorage; tidak memerlukan server backend atau database eksternal.
- **Latihan Menulis Goresan Real-Time (Geometric Stroke Recognizer):** Menggunakan algoritma pengenalan geometri hibrida goresan per goresan (*stroke-by-stroke recognition*) berbasis KanjiVG langsung di kanvas HTML5.
- **Portabilitas Cadangan Terenkripsi Mandiri:** Fitur ekspor dan impor progres belajar terenkripsi Base64 yang aman dari serangan XSS tanpa memerlukan cloud database.

## Operating Context

- **Skenario Penggunaan:** Pengguna membuka web melalui laptop/tablet (menggunakan mouse/stylus pen) atau smartphone (menggunakan sentuhan jari) dalam sesi belajar singkat 5–15 menit setiap hari.
- **Lingkungan Jaringan:** Digunakan di rumah, sekolah, maupun saat bepergian (komuter/pesawat) tanpa koneksi internet stabil berkat kapabilitas PWA dan aset lokal mandiri.

## Capabilities and Constraints

- **Kemampuan Utama:**
  - **Tabel Interaktif Kana (Gojuon, Dakuten, Yoon):** Menampilkan audio pelafalan, kartu detail, dan panduan animasi goresan.
  - **Arena Latihan (Practice Mode):**
    - *Mode Kuis Romaji:* Input mengetik dan pilihan ganda dengan opsi Auto-Submit instan.
    - *Mode Menulis Kanvas:* Kanvas interaktif dengan grid pemandu, siluet KanjiVG, validasi arah & bentuk goresan secara real-time.
  - **Dasbor Statistik & Hafalan:** Grafik tingkat penguasaan per karakter, rasio akurasi kuis, dan riwayat menulis.
  - **Preferensi Pengguna:** Pengaturan bahasa multi-lingual (ID, EN, JA), tema Terang/Gelap, dan toggle mode Auto-Submit.
- **Batasan Teknis:**
  - Tidak ada backend terpusat; sinkronisasi multi-device hanya dimungkinkan melalui transfer file cadangan teks terenkripsi.
  - Bergantung pada LocalStorage peramban (penghapusan cache browser total akan menghapus progres jika belum diekspor).

## Brand Commitments

- **Identitas Visual:** Mengusung filosofi **Neo-Brutalism** modern:
  - Kontras ultra-tinggi: Batas border tebal (`border-[3px] border-slate-950 dark:border-white`).
  - Bayangan tegas tanpa blur (*hard shadow*): `shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]`.
  - Palet warna berkarakter: Amber (energi & aksi), Violet (aksen interaksi), Emerald (keberhasilan/benar), Rose (peringatan/salah), dan Slate (struktur netral).
- **Tone of Voice:** Ringkas, percaya diri, lugas, dan menyemangati tanpa basa-basi (*clean & empowering*).

## Evidence on Hand

- **Data Karakter:** Katalog lengkap 200+ karakter kana (Hiragana & Katakana) di `src/constants/kanaData.ts`.
- **Logika Recognizer:** Pengenalan goresan kanvas geometris di `src/utils/strokeRecognizer.ts`.
- **Sistem Keamanan Data:** Enkripsi Base64 dan sanitasi input XSS di `src/utils/progressCrypto.ts`.
- **Suite Pengujian Otomatis:** 57 pengujian unit lulus 100% di Vitest.

## Product Principles

1. **Zero Friction, Zero Barrier:** Buka langsung bisa belajar tanpa registrasi, tanpa login, dan tanpa interupsi iklan.
2. **Kemandirian Pengguna (Local-First):** Pengguna adalah pemilik tunggal atas data progresnya.
3. **Umpan Balik Kinetik Langsung:** Belajar kana bukan hanya menghafal bentuk visual, tapi melatih urutan goresan tangan yang benar dengan feedback visual seketika.
4. **Kejelasan di Atas Ornamen:** Desain Neo-Brutalism menegaskan fungsi, kejelasan teks, dan tombol interaktif tanpa elemen dekoratif yang mengalihkan fokus belajar.

## Accessibility & Inclusion

- Memenuhi standar WCAG AA untuk rasio kontras teks dan tombol aksi.
- Mendukung navigasi keyboard pada seluruh alur kuis dan form input.
- Menyediakan label ARIA semantik pada tombol berbasis ikon.
- Dukungan multi-bahasa penuh (Bahasa Indonesia, English, 日本語) tanpa teks yang tercampur (*zero hardcoded strings*).
