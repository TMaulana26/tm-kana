# Aturan Alur Kerja & Validasi Kode

## 1. Aturan Pembaruan Dokumen Tugas (Tasks Update)
Setiap kali AI selesai mengimplementasikan sebuah fitur atau halaman yang diminta:
- AI **wajib** memperbarui file `.md` yang relevan di folder `.agents/tasks/` untuk selalu menandai (*checklist*) tugas-tugas yang telah selesai dikerjakan.
- Ubah status kotak centang tugas dari belum selesai `[ ]` menjadi selesai `[x]`.
- Jika ada catatan teknis penting atau perubahan skema selama implementasi, AI harus menambahkannya di bagian bawah file tugas tersebut sebagai referensi.

## 2. Validasi Kode Otomatis (Sanity Check & Automated Testing)
Sebelum AI menyatakan bahwa tugas telah "Selesai" dan siap diserahkan kepada pengguna, AI wajib menjalankan validasi berikut secara berurutan di terminal:

1. **Validasi Kualitas Kode:** Jalankan `npm run lint`. Semua eror *linting* atau format kode wajib diperbaiki terlebih dahulu oleh AI.
2. **Validasi Pengujian (Testing) & I18n:** Jalankan `npm run test` (atau perintah pengujian unit yang dikonfigurasi seperti `npm run test:unit`). Semua skenario tes wajib berstatus lolos (*passed* 100%). Pastikan bahwa pengujian validasi kunci I18n (`src/utils/__tests__/i18n.spec.ts`) terlewati dengan sukses untuk memastikan semua kunci terjemahan sinkron dan tidak ada yang terlewat antara `en.json` dan `id.json`.
3. **Validasi Kecocokan Build:** Jalankan `npm run build`. AI wajib memastikan proyek dapat terkompilasi dengan sukses tanpa ada eror TypeScript atau eror bundler.

> **PENTING:** Jika salah satu dari ketiga perintah di atas menghasilkan eror atau ada skenario tes yang gagal (*failed*), AI dilarang menandai tugas sebagai selesai. AI harus memperbaiki kode atau tesnya terlebih dahulu sampai ketiga perintah tersebut berjalan dengan status sukses (exit code 0).

---

## 3. Aturan Pembaruan Versi Aplikasi (`package.json`)
Setiap kali ada tugas perubahan kode yang selesai divalidasi dan siap di-commit:
1. **Identifikasi Skala Perubahan:**
   - **Perubahan Kecil / Minor Tweak (Patch `+0.0.1`):** Perbaikan bug (*bugfix*), perbaikan styling/CSS mikro, penyesuaian teks/i18n, penataan layout kecil, optimasi performa kecil.
     *Contoh alur:* `1.0.0` $\rightarrow$ `1.0.1` $\rightarrow$ `1.0.2`.
   - **Perubahan Besar (Minor `+0.1.0`):** Penambahan fitur baru, halaman/rute baru, modal/komponen besar baru, atau perubahan alur fungsionalitas aplikasi yang signifikan.
     *Aturan Reset:* Saat versi minor bertambah, angka patch **wajib direset kembali ke 0**.
     *Contoh alur:* `1.0.2` $\rightarrow$ `1.1.0` $\rightarrow$ `1.1.1` $\rightarrow$ `1.2.0`.
2. **Sinkronisasi Berkas:** Ubah nilai `"version"` pada `package.json`. Nilai ini akan otomatis terinjeksi ke footer aplikasi saat kompilasi.

---

## 4. Kebijakan Operasi Git (Commit & Push Guardrail)
1. **Otonomi Git Commit Lokal:**
   - AI diperbolehkan dan disarankan melakukan `git add` dan `git commit` lokal setiap kali selesai melakukan perubahan yang telah lulus seluruh validasi (`npm run lint`, `npm run test`, `npm run build`).
   - Format pesan commit wajib deskriptif, ringkas, dan jelas (contoh: `feat: add app footer with dynamic version and github link` atau `fix: resolve duplicate close button in preferences modal`).
2. **Larangan Keras Git Push Otomatis:**
   - AI **DILARANG KERAS** menjalankan perintah `git push` ke repositori remote secara otomatis.
   - `git push` **HANYA** boleh dieksekusi jika dan hanya jika pengguna secara eksplisit memberikan perintah langsung (contoh instruksi user: *"push ke github kang"*, *"tolong git push"*).

