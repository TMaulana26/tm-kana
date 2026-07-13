# Aturan Penulisan Kode (Coding Style, Clean Code & Testing Guide)

## 1. Komponen Vue 3 & TypeScript
- **Struktur Berkas:** Selalu ikuti urutan: Script, Template, Style.
- **Penamaan:** Berkas komponen wajib menggunakan PascalCase (contoh: `KanaCard.vue`).
- **Props & Emits:** Wajib didefinisikan menggunakan TypeScript interfaces untuk menjamin type-safety.

## 2. Prinsip Clean Code & Best Practices
- **Multi-Bahasa (i18n Mandatory):** Dilarang keras menulis teks (string) mentah bahasa tertentu langsung di dalam tag HTML/Template (contoh buruk: `<button>Simpan</button>`). Semua teks antarmuka wajib menggunakan fungsi lokalisasi `$t('key.path')`.
- **Manajemen Berkas Bahasa:** Semua string teks wajib ditaruh di berkas JSON terpisah di dalam folder `src/locales/` (misalnya: `id.json` untuk Bahasa Indonesia, `en.json` untuk English, dan `ja.json` untuk Japanese).
- **Single Responsibility Principle (SRP):** Satu komponen atau fungsi hanya boleh melakukan satu hal dengan baik.
- **Fungsi Utilitas Murni (Pure Functions):** Semua fungsi kalkulasi, logika enkripsi/dekripsi Base64 ditaruh di `src/utils/` dan bersifat *pure*.

## 3. Aturan Pengujian (Testing Rules)
- **Unit Testing (Utils & Stores):** Wajib mencakup kasus sukses dan penanganan eror.
- **Component Testing (UI):** Saat menguji komponen yang menggunakan i18n, pastikan untuk men-mock plugin `vue-i18n` atau menyertakan konfigurasi i18n dasar di Vue Test Utils agar pengujian tidak menghasilkan eror karena fungsi `$t` tidak ditemukan.
