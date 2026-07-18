# Modul Tugas 5: Dokumentasi Proyek & Panduan Kontribusi

## 1. Deskripsi Tugas
Tugas ini berfokus pada penyusunan dokumentasi lengkap di akar repositori (root repository). Tujuannya adalah memastikan orang lain yang ingin melakukan *fork* atau berkontribusi dapat memahami visi proyek, cara menjalankan aplikasi secara lokal, arsitektur kode, serta cara menggunakan sistem AI Agents workflow yang ada.

## 2. Kriteria Sukses & Ketentuan Spesifik Dokumentasi
- **README.md Utama yang Informatif:** Harus mencakup deskripsi proyek, fitur utama, *tech stack*, instruksi instalasi lokal, dan lisensi proyek.
- **Panduan Pengembang (Developer Guide):** Menjelaskan arsitektur folder utama, terutama cara kerja sistem manajemen state lokal (Pinia) dan enkripsi Base64 untuk mempermudah pemahaman alur data.
- **Dokumentasi AI-Driven Workflow:** Menjelaskan fungsi folder `.agents/rules/` dan `.agents/tasks/` agar pengembang lain yang menggunakan AI Editor (seperti *antigravity*/Cursor) bisa melanjutkan proyek ini dengan disiplin *spec-driven development* yang sama.
- **Panduan Kontribusi (CONTRIBUTING.md):** Menyediakan aturan dasar bagi orang lain jika ingin membuat *Pull Request* (PR), termasuk kewajiban menjalankan *linting*, *testing*, dan *building* sebelum mengajukan perubahan.

## 3. Daftar Tugas (Checklist Kerja AI)

### [x] Pembuatan Berkas README.md Utama
- [x] Buat berkas `README.md` di root project dengan gaya penulisan Markdown yang rapi dan profesional.
- [x] Tulis bagian "Fitur Utama" (Tabel Kana Interaktif, Latihan Kuis, Kanvas Menggambar, Ekspor/Impor Txt Base64, Dukungan Multi-bahasa i18n).
- [x] Tulis panduan instalasi lokal langkah-demi-langkah (kloning repo, `npm install`, `npm run dev`).

### [x] Pembuatan Dokumen Workflow AI & Struktur Agen
- [x] Tambahkan seksi khusus di `README.md` atau buat berkas `DEVELOPER.md` yang menjelaskan struktur proyek.
- [x] Jelaskan aturan main penggunaan folder `.agents/rules/` dan bagaimana cara kontributor baru menggunakan berkas tugas di `.agents/tasks/` untuk memandu AI mereka.

### [x] Pembuatan Panduan Kontribusi (CONTRIBUTING.md)
- [x] Buat berkas `CONTRIBUTING.md` di root project.
- [x] Tulis standar sebelum *commit* kode (Wajib meloloskan `npm run lint`, `npm run test`, dan `npm run build` sesuai aturan `workflow.md`).
- [x] Berikan panduan singkat cara melakukan *fork*, membuat *branch* baru, dan mengirimkan *Pull Request*.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [x] `npm run lint` (Memastikan tidak ada berkas atau skrip baru yang merusak konfigurasi linting)
- [x] `npm run test` (Memastikan semua tes tetap lolos 100%)
- [x] `npm run build` (Memastikan proyek tetap dapat di-build dengan sukses)

---
## Catatan Teknis (Diisi oleh AI jika ada perubahan skema)
*Telah selesai membuat README.md dan CONTRIBUTING.md yang terperinci.*
