# Contribution Guidelines (CONTRIBUTING.md)

We love contributions! TM-KANA is an open-source project, and we welcome contributions from developers, designers, and documentation writers.

To maintain our codebase integrity and performance standards, all contributors must adhere to the guidelines outlined below.

---

## 🛠️ Mandatory Checks Before Submitting Changes

Before you commit your code or submit a Pull Request (PR), you **must** run the following validation scripts locally and verify they pass with no errors:

1.  **Code Formatting & Style (Linting):**
    Run ESLint to check for code styles, types, and bare-string rules in templates:
    ```bash
    npm run lint
    ```
    *All linting warnings and errors must be resolved.*

2.  **Automated Testing (Testing):**
    Verify all unit and component tests pass 100% and no regressions are introduced:
    ```bash
    npm run test
    ```

3.  **Production Compilation (Building):**
    Ensure TypeScript type-safety is correct and the bundler can package production assets cleanly:
    ```bash
    npm run build
    ```

---

## 💻 Coding Style

All contributions must follow these clean code conventions:
- **Vue SFC Block Order:** Components in `.vue` files should follow the top-down order of: `<script setup lang="ts">`, `<template>`, and `<style scoped>` (if styling is required).
- **TypeScript Strictness:** Use clear TypeScript interfaces and types. Avoid using `any` unless absolutely necessary.
- **Internationalization (i18n):** Never write raw or hardcoded strings directly in HTML templates or logic scripts. Map all strings to the translation JSON files under `src/locales/` and reference them with `$t('path.key')` or `t('path.key')`.
- **Pinia State Security:** Never mutate global reactive state directly from components. All status updates must be performed using **Actions** inside the respective Pinia store to ensure traceability.

---

## 🚀 Contribution Workflow

Follow these steps to contribute code changes:

### 1. Fork the Repository
Create a copy of this repository on your GitHub account by clicking the **Fork** button in the top right corner of the page.

### 2. Clone & Create a New Branch
Clone your forked repository locally and checkout a new branch describing your feature or fix:
```bash
git clone https://github.com/USERNAME/tm-kana.git
cd tm-kana
git checkout -b feature/your-new-feature
```

### 3. Implement Changes & Test Locally
Write your code, add test cases if implementing new helpers or components, and run validations:
```bash
npm run lint
npm run test
npm run build
```

### 4. Commit & Push
Write clear, semantic commit messages and push the branch to your GitHub fork:
```bash
git add .
git commit -m "feat: allow alternate romaji inputs 'di' and 'du' in practice view"
git push origin feature/your-new-feature
```

### 5. Submit a Pull Request (PR)
Open the original TM-KANA repository on GitHub. Click the **Compare & pull request** button, provide a detailed description of your changes, and submit the Pull Request. Our team will review it as soon as possible!
