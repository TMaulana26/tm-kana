# Modul Tugas 8: Autentikasi Opsional (Cloud Sync) & Gamifikasi Leaderboard Global

## 1. Deskripsi Tugas
Modul tugas ini bertujuan untuk memperluas kemampuan TM-KANA dengan fitur **Sinkronisasi Data Awan (Cloud Sync)** berbasis autentikasi opsional dan **Gamifikasi Leaderboard Global**, sambil tetap mempertahankan filosofi dasar aplikasi: *100% Client-Side*, *Zero-Barrier*, dan *Local-First*. Pengguna tetap dapat belajar tanpa login, namun dapat menghubungkan akun untuk menyinkronkan data antar-perangkat dan berkompetisi di arena mingguan.

## 2. Kriteria Sukses & Ketentuan Spesifik
- **Zero-Barrier UX:**
  - Aplikasi tidak boleh memaksa pengguna untuk login saat pertama kali dibuka.
  - Semua fitur belajar, menggambar kanvas, dan progres lokal tetap 100% dapat digunakan tanpa akun.
- **Opsi Autentikasi Modern:**
  - Login pihak ketiga (Google Sign-In) atau Magic Link Email tanpa kata sandi rumit.
  - Tombol login terintegrasi rapi pada UserPreferencesDialog.vue dan banner progres.
- **Sinkronisasi Resilient (Conflict-Free Union Merge):**
  - Menggabungkan data lokal di localStorage dengan data di cloud tanpa menghilangkan riwayat hafalan yang sudah dicapai di salah satu perangkat.
- **Arena Time Attack 60 Detik:**
  - Mode mini-game kuis kecepatan 60 detik dengan sistem combo multiplier (1.2x, 1.5x, 2.0x).
- **Papan Peringkat Neo-Brutalist (Leaderboard):**
  - Halaman rute baru /leaderboard dengan desain kontras tinggi, border tebal, dan bayangan tegas.
  - Peringkat Liga Mingguan (Minggu 23:59 WIB reset) dan Peringkat Sepanjang Masa.
  - Privasi terjamin: menampilkan Codename acak/custom (misal: *Ronin Shinjuku*) tanpa email.

## 3. Daftar Tugas (Checklist Kerja AI)

### [ ] Persiapan Arsitektur & Database
- [ ] Tentukan target backend: Cloudflare D1 + Workers (Serverless) atau VPS (Fastify/Go + PostgreSQL).
- [ ] Terapkan skema tabel: users, user_progress, dan leaderboard_scores.

### [ ] Sistem Autentikasi Opsional (Frontend & Backend)
- [ ] Buat composable src/composables/useAuth.ts untuk mengelola status login, token, dan profil pengguna.
- [ ] Tambahkan kartu login/sinkronisasi awan di dalam src/components/UserPreferencesDialog.vue.
- [ ] Buat utilitas penggabung data src/utils/progressSync.ts (algoritma *Union Set Merge*).

### [ ] Mini Game Time Attack (Arena Kecepatan 60 Detik)
- [ ] Bangun komponen TimeAttackArena.vue di folder latihan kuis.
- [ ] Implementasikan timer countdown, multiplier skor combo, dan kalkulasi skor akhir.

### [ ] Halaman Leaderboard (/leaderboard)
- [ ] Buat rute dan tampilan src/views/LeaderboardView.vue dengan tab Liga Mingguan & Papan Streak.
- [ ] Sediakan komponen LeaderboardCard.vue dengan badge peringkat bernuansa Neo-Brutalisme.

### [ ] Internasionalisasi & Type-Safety
- [ ] Tambahkan kamus i18n untuk namespace uth dan leaderboard pada id.json, en.json, dan ja.json.
- [ ] Buat interface TypeScript lengkap di src/types/auth.ts dan src/types/leaderboard.ts.

### [ ] Pengujian Unit & E2E
- [ ] Buat unit test 	ests/utils/progressSync.spec.ts untuk memvalidasi algoritma penggabungan data offline & online.
- [ ] Buat component test untuk LeaderboardView.spec.ts.

## 4. Validasi Akhir (Wajib Dijalankan Berurutan)
- [ ] 
pm run lint (Bebas eror linting)
- [ ] 
pm run test (Semua skenario tes unit lulus 100%)
- [ ] 
pm run build (Kompilasi produksi bersih)
