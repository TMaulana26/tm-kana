---
name: TM-KANA
description: Client-side interactive Japanese Kana learning web application featuring punchy Neo-Brutalism design
colors:
  primary: "#fbbf24"
  primary-hover: "#f59e0b"
  secondary: "#a78bfa"
  secondary-hover: "#8b5cf6"
  success: "#34d399"
  success-hover: "#10b981"
  danger: "#f87171"
  danger-hover: "#ef4444"
  bg-light: "#f4f3ec"
  bg-dark: "#0c0e14"
  surface-light: "#ffffff"
  surface-dark: "#0f172a"
  text-light: "#020617"
  text-dark: "#f8fafc"
  border-light: "#020617"
  border-dark: "#334155"
  shadow-light: "#000000"
  shadow-dark-primary: "#f59e0b"
  shadow-dark-secondary: "#8b5cf6"
  shadow-dark-success: "#10b981"
  shadow-dark-danger: "#ef4444"
  shadow-dark-neutral: "#1e293b"
typography:
  font-family: "'Outfit', 'Noto Sans JP', system-ui, sans-serif"
  display:
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 900
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  headline:
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: "1.2"
  body:
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "1.5"
  label:
    fontSize: "0.75rem"
    fontWeight: 700
  micro:
    fontSize: "10px"
    fontWeight: 800
rounded:
  none: "0px"
  sm: "0px"
  md: "0px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-base:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.none}"
    padding: "16px"
---

# Design System: TM-KANA (Neo-Brutalism)

## 1. Overview

TM-KANA mengusung estetika **Neo-Brutalism** kontemporer yang dirancang khusus untuk platform edukasi bahasa Jepang. Desain ini menggabungkan prinsip kejujuran material antarmuka (*raw UI honesty*), garis tepi tebal, warna-warna berani (*punchy pastel & vivid tones*), bayangan tanpa blur (*hard drop shadows*), dan perataan geometris kaku (*zero border radius*).

Tujuan desain ini adalah:
1. **Daya Pikat Visual yang Kuat:** Menghadirkan suasana belajar yang berenergi, ceria, dan tidak membosankan.
2. **Keterbacaan Huruf Maksimal:** Karakter Hiragana & Katakana diletakkan di atas kanvas berkontras tinggi dengan grid terstruktur rapi.
3. **Afodansi Interaksi Tegas:** Semua elemen interaktif (tombol, tab, kartu, input) memiliki status klik (*active state*) dengan efek pergeseran fisik (*tactile button press*).

---

## 2. Colors & Palette

Palet warna TM-KANA dirancang dengan rasio kontras tinggi, kenyamanan visual (*eye comfort*), dan makna fungsi yang spesifik:

### A. Surface & Canvas
- **Light Mode Canvas (`#f4f3ec`):** Warna kertas hangat (*warm retro newsprint*). Menghilangkan silau putih murni pada layar dan memberikan tekstur editorial klasik.
- **Dark Mode Canvas (`#0c0e14`):** Hitam arang mendalam (*deep midnight slate*). Mengeliminasi silau retina, menciptakan kontras yang nyaman dan berkarakter.
- **Card Surface (`#ffffff` light / `#0f172a` dark):** Latar kartu konten utama.
- **Dark Mode Borders (`#334155` / `slate-700`):** Garis batas industrial slate yang tegas dan rapi, atau border beraksen warna sesuai status.
- **Dark Mode Colored Offset Shadows (Vibe 2):** Bayangan blok fisik berwarna solid (*solid colored hard drop shadows*) tanpa blur ala arcade retro era 90-an. Memberikan kedalaman 3D taktil yang hidup di atas kanvas gelap:
  - **Amber (`#f59e0b`):** Kartu profil, hero banner, primary buttons, stroke master.
  - **Violet (`#8b5cf6`):** Active nav link, external resource cards, quiz master.
  - **Emerald (`#10b981`):** Success buttons, learned kana cards, progress completion.
  - **Rose (`#ef4444`):** Danger zone, reset actions, exit modal, ultimate master.
  - **Neutral Slate (`#1e293b`):** Unlearned kana cards (beralih ke violet cerah saat hover).

### B. Functional & Accent Colors
- **Amber (`#fbbf24` / `#f59e0b`):** Warna primer aksi utama, sorotan kartu profil, kartu CTA kuis, dan tombol bersihkan kanvas. Di dark mode, aksen menggunakan `dark:bg-amber-400` atau `dark:border-amber-400`.
- **Violet (`#a78bfa` / `#8b5cf6`):** Warna sekunder dan status navigasi aktif. Memberikan keseimbangan modern dan artistik.
- **Emerald (`#34d399` / `#10b981`):** Warna umpan balik sukses (*Nailed it!*), akurasi tinggi, status hafalan karakter selesai, dan toggle aktif.
- **Rose (`#f87171` / `#ef4444`):** Warna peringatan salah (*Try again*), zona bahaya reset data, dan penolakan goresan kanvas.
- **Indigo (`#818cf8`):** Aksen pendukung untuk kartu variasi Katakana.

### C. Contrast Rules (Anti-Washout Guidelines)
- **Teks di atas warna terang (Amber/Violet/Emerald):** Wajib menggunakan warna gelap pekat (`#020617` / `#000000`) dengan bobot font tebal (`font-black` / `font-extrabold`). Dilarang keras menggunakan teks abu-abu pudar.
- **Teks di atas warna gelap:** Wajib menggunakan warna putih murni (`#ffffff`) atau `#f8fafc`.

---

## 3. Typography

- **Font Family Utama:** `'Outfit', 'Noto Sans JP', system-ui, sans-serif`. Memberikan nuansa geometric punchy, modern, dan sangat cocok dengan prinsip Neo-Brutalism.
- **Type Ramp & Scale:**
  - **Large Display & Watermark Kana:** `text-9xl` (8rem), `text-[8.5rem]`, `text-[9rem]`, `text-[10rem]` dengan bobot `font-black` untuk representasi visual goresan karakter kana secara megah dan tegas.
  - **Display Compound Kana (Yoon):** `text-5xl md:text-7xl font-black tracking-tight` (terskala proporsional agar tidak terpotong kontainer).
  - **Heading:** `text-4xl md:text-5xl` (h1/hero), `text-2xl md:text-3xl` (h2/section), `text-xl` (h3). Bobot `font-black` atau `font-extrabold`, huruf kapital (*uppercase*), dengan `tracking-wider` atau `tracking-widest`.
  - **Body & Actions:** `text-sm` (0.875rem), `text-base` (1rem), `text-[0.8rem]` (tombol aksi kompak).
  - **Micro-Copy, Badges & Sub-labels:** `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-xs` (12px) dengan bobot `font-black` atau `font-bold` dan `uppercase tracking-wider`.

---

## 4. Layout & Spacing

- **Batas Tepi Berkarakter:** Seluruh pembatas menggunakan border tebal:
  - Komponen atomik (tombol, input, kartu): `border-[2px]` hingga `border-[3px] border-slate-950 dark:border-slate-700`.
  - Struktur besar (sidebar, header, modal): `border-[4px] border-slate-950 dark:border-slate-700`.
- **Grid Responsif:**
  - Halaman Tabel Kana: Grid fleksibel kolom 5 (Gojuon) dengan spacing ketat `gap-2 sm:gap-3`.
  - Dasbor Progres: Grid 2 kolom desktop, 1 kolom mobile.

---

## 5. Elevation & Depth (Colored Offset Shadows)

Dalam Neo-Brutalism, kedalaman tidak menggunakan *blur radius*, melainkan proyeksi bayangan solid bergeser 45 derajat ke kanan bawah:

- **Kartu Besar / Dialog Modal:**
  - Light Mode: `shadow-[6px_6px_0px_0px_#000]` / `shadow-[8px_8px_0px_0px_#000]`
  - Dark Mode: `dark:shadow-[6px_6px_0px_0px_#f59e0b]` (Amber hero) atau `dark:shadow-[8px_8px_0px_0px_#8b5cf6]` (Violet dialog)
- **Tombol Standar & Card Biasa:**
  - Light Mode: `shadow-[3px_3px_0px_0px_#000]` atau `shadow-[4px_4px_0px_0px_#000]`
  - Dark Mode (Per Fungsi):
    - Primary: `dark:shadow-[4px_4px_0px_0px_#f59e0b]`
    - Secondary: `dark:shadow-[4px_4px_0px_0px_#8b5cf6]`
    - Success: `dark:shadow-[4px_4px_0px_0px_#10b981]`
    - Danger: `dark:shadow-[4px_4px_0px_0px_#ef4444]`
- **Kartu Karakter Kana (KanaCard):**
  - Belum Hafal: `dark:shadow-[3px_3px_0px_0px_#1e293b]` (hover: `dark:hover:shadow-[5px_5px_0px_0px_#8b5cf6]`)
  - Sudah Dipelajari: `dark:shadow-[3px_3px_0px_0px_#10b981]`
  - Quiz Master: `dark:shadow-[3px_3px_0px_0px_#8b5cf6]`
  - Stroke Master: `dark:shadow-[3px_3px_0px_0px_#f59e0b]`
  - Ultimate Master: `dark:shadow-[3px_3px_0px_0px_#ef4444]`
- **Micro Badge / Mini Buttons:**
  - Light Mode: `shadow-[2px_2px_0px_0px_#000]`
  - Dark Mode: `dark:shadow-[2px_2px_0px_0px_#f59e0b]` atau warna aksen terkait.
- **Efek Tekan (Tactile Press Interaction):**
  - Pada status `:active`: Elemen bergeser `translate-x-[2px] translate-y-[2px]` dan ukuran bayangan menyusut menjadi `shadow-[1px_1px_0px_0px_...]`, memberikan sensasi tombol fisik mekanis yang nyata.

---

## 6. Shapes, Form Language & Scrollbars

- **Sudut Siku Tegas (`rounded-none`):**
  - Tombol, kartu, dialog, input, dan thumb scrollbar secara baku menggunakan sudut siku 90 derajat (`rounded-none` / `border-radius: 0px`).
  - Satu-satunya pengecualian adalah elemen avatar bulat (`rounded-full`) untuk pembeda visual hierarkis.

- **Neo-Brutalist Themed Scrollbars:**
  - Lebar/Tinggi kompak: `8px` (tanpa tombol panah OS default yang kaku).
  - Track: `transparent` (berbaur sempurna dengan kontainer atau kartu di mana pun berada).
  - **Light Mode:** Thumb `#94a3b8` (hover: `#64748b`, active: `#020617`).
  - **Dark Mode:** Thumb `#334155` (hover: `#475569`, active: `#fbbf24` aksen amber), didukung `color-scheme: dark`.
  - Menggunakan properti standar W3C (`scrollbar-width: thin`, `scrollbar-color`) dan WebKit (`::-webkit-scrollbar`).

---

## 7. Components & Micro-Interactions

### A. NeoBrutalistButton
- Tombol dengan kontras warna berani, border tebal hitam/slate, dan bayangan tegas solid hitam.
- Status disabled: `opacity-40 pointer-events-none`.

### B. KanaCard
- Kartu karakter di tabel kana. Menampilkan karakter besar, romaji di bawah, status penguasaan (centang hijau), serta aksi klik untuk membuka dialog goresan.

### C. KanaCanvas (Arena Menggambar)
- Kanvas dengan grid pemandu sumbu simetri putus-putus (*dashed centerlines*).
- Siluet panduan transparan di latar belakang yang terskala proporsional untuk karakter tunggal maupun majemuk.

### D. UserPreferencesDialog
- Dialog pengaturan terpadu untuk tema, bahasa, dan opsi auto-submit.

---

## 8. Do's and Don'ts

### Do's:
- Gunakan selalu border tebal `border-slate-950 dark:border-slate-700` pada setiap kontainer.
- Gunakan bayangan solid `shadow-[Xpx_Xpx_0px_0px_#000] dark:shadow-[Xpx_Xpx_0px_0px_#000]` tanpa blur.
- Gunakan teks hitam pekat `text-slate-950` di atas warna pastel cerah (`bg-amber-300`, `bg-emerald-400`, dll.).
- Pertahankan sudut siku `rounded-none` untuk konsistensi Neo-Brutalism.
- Pastikan semua teks antarmuka menggunakan kunci lokalisasi i18n (`$t()`).

### Don'ts:
- Jangan gunakan bayangan lembut/blur (`shadow-lg`, `shadow-xl`, `blur-md`).
- Jangan gunakan sudut membulat berlebihan (`rounded-xl`, `rounded-2xl`) pada kartu dan tombol utama.
- Jangan gunakan border putih murni (`dark:border-white`) tebal atau bayangan putih di dark mode karena menimbulkan efek laser cage dan silau berlebihan.
- Jangan gunakan teks abu-abu tipis di atas latar belakang berwarna terang karena merusak keterbacaan.
- Jangan membiarkan karakter majemuk terpotong kontainer; selalu gunakan skala responsif.
- Jangan hardcode string teks bahasa tertentu di template atau script.
