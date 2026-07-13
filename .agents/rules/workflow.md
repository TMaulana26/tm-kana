# Aturan Alur Kerja & Validasi Kode

## 1. Aturan Pembaruan Dokumen Tugas (Tasks Update)
Setiap kali AI selesai mengimplementasikan sebuah fitur atau halaman yang diminta:
- AI **wajib** memperbarui file `.md` yang relevan di folder `.agents/tasks/`.
- Ubah status kotak centang tugas dari belum selesai `[ ]` menjadi selesai `[x]`.
- Jika ada catatan teknis penting atau perubahan skema selama implementasi, AI harus menambahkannya di bagian bawah file tugas tersebut sebagai referensi.

## 2. Validasi Kode Otomatis (Sanity Check & Automated Testing)
Sebelum AI menyatakan bahwa tugas telah "Selesai" dan siap diserahkan kepada pengguna, AI wajib menjalankan validasi berikut secara berurutan di terminal:

1. **Validasi Kualitas Kode:** Jalankan `npm run lint`. Semua eror *linting* atau format kode wajib diperbaiki terlebih dahulu oleh AI.
2. **Validasi Pengujian (Testing):** Jalankan `npm run test` (atau perintah pengujian unit yang dikonfigurasi seperti `npm run test:unit`). Semua skenario tes yang dibuat untuk modul, store, atau utilitas tersebut wajib berstatus lolos (*passed* 100%).
3. **Validasi Kecocokan Build:** Jalankan `npm run build`. AI wajib memastikan proyek dapat terkompilasi dengan sukses tanpa ada eror TypeScript atau eror bundler.

> **PENTING:** Jika salah satu dari ketiga perintah di atas menghasilkan eror atau ada skenario tes yang gagal (*failed*), AI dilarang menandai tugas sebagai selesai. AI harus memperbaiki kode atau tesnya terlebih dahulu sampai ketiga perintah tersebut berjalan dengan status sukses (exit code 0).
