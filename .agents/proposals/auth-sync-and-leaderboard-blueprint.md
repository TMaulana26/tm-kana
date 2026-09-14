# Cetak Biru Arsitektur: Autentikasi Opsional (Cloud Sync) & Gamifikasi Leaderboard TM-KANA

Dokumen ini memuat spesifikasi arsitektur, skema data, strategi sinkronisasi, dan konsep gamifikasi untuk menghadirkan fitur **Cloud Sync (Auth Opsional)** dan **Leaderboard Global** pada aplikasi TM-KANA tanpa menghilangkan identitas aslinya sebagai aplikasi *Local-First*, *Zero-Barrier*, dan *100% Client-Side*.

---

## 1. Visi & Filosofi Utama (Local-First Zero-Barrier)

TM-KANA tetap berpegang teguh pada prinsip utama:
1. **Zero-Barrier (Tanpa Registrasi Wajib):** Pengguna baru dapat langsung belajar, menghafal, dan mencoret kanvas 1 detik setelah membuka website. Tidak ada popup atau pemaksaan login.
2. **Local-First Resilient:** Semua data kemajuan belajar (learnedKana, akurasi, riwayat kuis, streak) selalu disimpan dan diakses dari localStorage terlebih dahulu. Aplikasi tetap 100% fungsional saat offline.
3. **Auth Sebagai Fitur Nilai Tambah (Value-Add):** Autentikasi hanya dibutuhkan jika pengguna ingin:
   - Menyinkronkan kemajuan belajar antar-perangkat (Laptop <-> Smartphone/Tablet).
   - Berpartisipasi dalam papan peringkat (*Global & Weekly Leaderboard*).
   - Menjaga cadangan data aman jika peramban dibersihkan (*browser cache clear*).

---

## 2. Pilihan Komparasi Infrastruktur Backend

Frontend TM-KANA tetap di-deploy di **Cloudflare Pages** (ultra-cepat di 300+ Edge Data Center dengan proteksi DDoS bawaan). Untuk backend dan database, tersedia dua opsi utama:

### Opsi A: Serverless Edge (Cloudflare D1 + Workers) - *Rekomendasi Utama*
- **Biaya:** Rp 0 (100% dalam batas Free Tier).
- **Maintenance:** Zero Server Management (tanpa patching OS, tanpa kelola SSH, tanpa renew certbot manual).
- **Komponen:**
  - **Cloudflare Workers:** API micro-service di Edge dengan latensi ultra-rendah (<15ms).
  - **Cloudflare D1:** Database SQLite serverless terdistribusi (gratis 5GB storage, 5 juta queries/hari).
  - **Cloudflare KV:** Session store & caching leaderboard mingguan.
  - **Auth Provider:** Supabase Auth (Free tier 50.000 MAU) atau Google OAuth 2.0 langsung via Workers.

### Opsi B: Self-Hosted di VPS Pribadi (Full Control)
- **Kelebihan:** Memanfaatkan VPS yang sudah disewa dan kendali 100% atas database terpusat.
- **Komponen:**
  - **Backend Runtime:** Node.js (Hono / Fastify) atau Go / Bun.
  - **Database:** PostgreSQL atau SQLite + Litestream (sangat hemat RAM).
  - **Reverse Proxy:** Caddy / Nginx dengan SSL otomatis, diletakkan di balik **Cloudflare Proxy (Orange Cloud)** agar IP VPS tidak terekspos langsung ke internet.
  - **Auth:** OAuth 2.0 (Google Login) + JWT HTTP-Only Cookies.

---

## 3. Skema Basis Data (Database Schema)

`sql
-- 1. Tabel Pengguna
CREATE TABLE users (
    id TEXT PRIMARY KEY,                       -- UUID / Provider ID
    email TEXT UNIQUE NOT NULL,
    codename TEXT NOT NULL,                    -- Nama samaran unik (misal: 'Ninja Matcha')
    avatar_id TEXT DEFAULT 'default',          -- ID avatar geometris Neo-Brutalism
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Kemajuan Belajar Pengguna (Cloud Progress)
CREATE TABLE user_progress (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    learned_characters TEXT NOT NULL,         -- JSON array ID kana: ['a', 'i', 'u', 'ka', ...]
    accuracy_stats TEXT NOT NULL,             -- JSON object akurasi per karakter: {'a': 95, 'ka': 88}
    total_quizzes_taken INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    last_practice_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Leaderboard Skor Kompetisi
CREATE TABLE leaderboard_scores (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL,                       -- 'time_attack' | 'streak' | 'mastery'
    score INTEGER NOT NULL,
    combo_max INTEGER DEFAULT 0,
    season_week TEXT NOT NULL,                -- Format: 'YYYY-WW' (misal: '2026-38')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_mode_week ON leaderboard_scores(mode, season_week, score DESC);
`

---

## 4. Mekanisme Sinkronisasi Data (Local-First Merge)

Ketika pengguna login pada perangkat baru atau perangkat yang sudah memiliki data lokal:

1. **Unduh Data Cloud:** Frontend memanggil GET /api/sync.
2. **Algoritma Penggabungan (Union Set Merge):**
   - **Karakter Terhafal (learnedKana):** Dilakukan operasi himpunan gabungan (*Union Set*). Karakter yang dihafal di perangkat A dan perangkat B disatukan tanpa ada yang terhapus.
   - **Akurasi (ccuracyStats):** Ambil nilai akurasi tertinggi untuk tiap karakter dari kedua sisi.
   - **Streak:** Ambil nilai streak tertinggi yang masih valid terhadap tanggal latihan terakhir.
3. **Unggah Hasil Gabungan:** Frontend mengirimkan payload gabungan via POST /api/sync untuk memperbarui cloud database.
4. **Sinkronisasi Background:** Setiap kali pengguna menyelesaikan sesi latihan atau kuis, jika status login aktif, sinkronisasi dilakukan secara transparan di latar belakang (*background sync debounced*).

---

## 5. Gamifikasi Leaderboard: Seru, Sehat & Adiktif

### A. Tiga Kategori Kompetisi
1. **Papan Konsistensi (Streak Harian):**
   - Mengukur jumlah hari beruntun pengguna berlatih minimal 1 sesi per hari.
   - Membangun kebiasaan jangka panjang tanpa intimidasi kompetisi kecepatan.
2. **Time Attack 60 Detik (Arena Kecepatan):**
   - Pengguna menebak sebanyak mungkin karakter Hiragana/Katakana dalam 60 detik.
   - Setiap jawaban benar berturut-turut memicu *Combo Multiplier* (1.2x, 1.5x, 2.0x).
   - Jawaban salah memutus combo dan memberikan penalti waktu.
3. **Koleksi Karakter (Kana Mastery 104/104):**
   - Peringkat berdasarkan jumlah karakter yang mencapai akurasi >= 90%.

### B. Sistem Liga Mingguan (Weekly Leagues)
- Leaderboard di-reset setiap **Minggu pukul 23:59 WIB**.
- Mencegah stagnasi di mana pemain baru tidak bisa mengejar skor pemain lama.
- Struktur Tingkatan Liga:
  Liga Perunggu (Bronze) -> Perak (Silver) -> Emas (Gold) -> Shogun (Diamond)
- Top 5 pemain tiap minggu promosi ke liga atasnya, 5 terbawah turun liga.

### C. Privasi & Identitas Neo-Brutalism
- **Zero Real Names:** Tidak menampilkan nama asli atau email di publik.
- **Generator Codename Khas Jepang:** Pengguna dapat memilih/merandom nama unik berkarakter Neo-Brutalism, seperti:
  - *Ninja Matcha*, *Ronin Shinjuku*, *Cyber Sakura*, *Bento Master*, *Tokyo Drifter*, *Wasabi Strike*.
- **Avatar Geometris:** Avatar vektor bergaris tebal dengan pilihan ekspresi khas Neo-Brutalism.

### D. Anti-Cheat Sederhana
- Validasi logika kuis di backend: kirim log waktu per pertanyaan. Jika 50 soal diselesaikan dalam waktu kurang dari 5 detik, skor otomatis ditolak.

---

## 6. Rencana Tahapan Eksekusi (Phased Roadmap)

* **Fase 1: Cloud Sync MVP**
  - Buat tabel users dan user_progress.
  - Integrasikan Google OAuth 2.0 / Magic Link.
  - Implementasikan tombol 'Simpan ke Cloud' di dialog preferensi/profil.
  - Logika merge localStorage <-> Cloud.
* **Fase 2: Mini Game Time Attack (Frontend First)**
  - Bangun tampilan arena Time Attack 60 detik di src/views/PracticeView.vue atau rute terpisah /arena.
  - Animasi combo, penanda waktu Neo-Brutalist, dan hitung skor lokal.
* **Fase 3: Global & Weekly Leaderboard**
  - Tambahkan rute /leaderboard.
  - API endpoint GET /api/leaderboard dengan filter mingguan & global.
  - Tampilan kartu peringkat Neo-Brutalist dengan medali emas, perak, perunggu.
