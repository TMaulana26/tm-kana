# TM-KANA

TM-KANA is a client-side interactive web application to learn reading, pronouncing, and writing Japanese Hiragana and Katakana characters. Built with a modern tech stack of Vue 3, Vite, Tailwind CSS, and TypeScript, this project features a strong and high-contrast Neo-Brutalist design.

---

## 🌟 Key Features

- **Interactive Kana Chart:** Displays the complete set of Hiragana & Katakana characters (Gojuon, Dakuten, Yoon) in a beautifully structured grid.
- **Interactive Practice Arena:** Features Quiz Mode (Romaji) and Drawing Mode (Stroke writing) with dynamic KanjiVG stroke order guide silhouettes.
- **Real-time Stroke Detection:** Utilizes a custom geometric analysis algorithm (hybrid $1 Recognizer) to match user strokes on a stroke-by-stroke basis.
- **Progress & Statistics Dashboard:** A visual dashboard presenting character mastery percentages, cumulative quiz/writing accuracy ratios, and detailed history per character.
- **Self-contained Backup (100% Client-Side):** Export and import study progress to encrypted Base64 text files instantly without requiring a backend database.
- **Multi-language Support (i18n):** Fully localized in English, Indonesian, and Japanese.

---

## 📂 Project Structure

Here is the directory structure of the repository:

```bash
tm-kana/
├── .agents/                    # AI-driven development guidelines and tasks
│   ├── rules/                  # Coding style & tech stack rule files
│   └── tasks/                  # Modular task files for developer guidance
├── src/
│   ├── components/             # Reusable Vue components
│   │   ├── ui/                 # UI primitives (shadcn-vue)
│   │   └── KanaCanvas.vue      # HTML5 Canvas stroke drawing arena
│   ├── constants/              # Static data configs (kanaData, etc.)
│   ├── locales/                # JSON translation files (en, id, ja)
│   ├── router/                 # Vue Router configurations
│   ├── stores/                 # Pinia global state stores
│   │   └── progress.ts         # User study progress & statistics store
│   ├── utils/                  # Pure utility function helpers
│   │   ├── progressCrypto.ts   # Base64 encryption & owner validation for backups
│   │   └── strokeRecognizer.ts # Geometric matching algorithms for strokes
│   ├── views/                  # Primary page views of the application
│   └── main.ts                 # Vue main entrypoint
└── package.json                # npm scripts & dependencies
```

---

## 🛠️ Data Flow & State Management

### 1. Secure Local State (Pinia & LocalStorage)
All progress data is managed via the Pinia store `useProgressStore` inside [src/stores/progress.ts](file:///src/stores/progress.ts).
- State must never be mutated directly from Vue components. All modifications (e.g. toggling mastery, recording quiz/drawing scores) must be performed through Pinia **Actions** to ensure full data traceability.
- The store automatically synchronizes with `LocalStorage` on every state change to persist progress across browser refreshes.

### 2. Encrypted Base64 Backup System
Data export and import flows are implemented in [src/utils/progressCrypto.ts](file:///src/utils/progressCrypto.ts).
- It encrypts the user's progress JSON payload using the user's nickname as a validation key.
- The encryption and decryption happen entirely on the client-side using secure `btoa`/`atob` browser APIs.

---

## 🤖 AI-Driven Workflow & Spec-Driven Development

This project is built around the principles of *Spec-driven Development* to enable seamless collaboration with AI coding assistants (e.g., Google Gemini Antigravity, Cursor, GitHub Copilot):

1.  **Rules (`.agents/rules/`):** Houses coding styles and stack rules. Make sure to feed these to your AI assistant's System Prompt to maintain code format and styling integrity.
2.  **Tasks (`.agents/tasks/`):** Contains checklist items for modular tasks. Developers and AI assistants should implement these tasks one-by-one to prevent regressions.
3.  **Collaborating with AI:** Suggest your AI editor read the `.agents/` folder first before making modifications, ensuring coding guidelines and i18n specifications are strictly followed.

---

## 🚀 Local Installation Guide

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/TMaulana26/tm-kana.git
cd tm-kana
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended):
```bash
npm install
```

### 3. Run Developer Server
Start the local Vite dev server:
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### 4. Run Unit & Component Tests
To execute all automated tests:
```bash
npm run test
```

### 5. Build for Production
To compile and bundle optimized production assets:
```bash
npm run build
```
The output files will be created in the `/dist` directory.
