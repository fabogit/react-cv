# React CV

A responsive, print-ready Curriculum Vitae web application built with **React 19**, **TypeScript 7**, and **Vite 8**, featuring strict build-time isolation between public demo data and private personal data, runtime schema validation, and deterministic build-time PDF generation via **Typst**.

## Key Features

- **Dual-Profile Architecture (`public` vs `private`)**:
  - **Public Mode (Default / Cloud / CI)**: Bundles the tracked demo CV ([`src/assets/data/cvData.json`](src/assets/data/cvData.json) — Vincent van Gogh) and public assets only (`img/`, `icons/header/`, `icons/work/`, `icons/school/`). Private directories (`_img/`, `icons/_work/`, `icons/_school/`) and local JSON datasets are completely excluded from the production bundle.
  - **Private Mode (Local Development & Local Print)**: Driven by `.env.local` (`VITE_CV_PROFILE=private` and `VITE_CV_DATA_FILE=cvData.revised.json`), resolving gitignored personal JSON data and assets from underscore-prefixed folders.
- **Runtime Schema Validation**:
  - Strict runtime contract enforcement in [`src/utils/validateCvData.ts`](src/utils/validateCvData.ts) verifying all dataset sections (`header`, `work`, `education`, `languages`, `skills`, `legal`) across both languages (`Italiano` and `English`) before execution or PDF generation.
- **Deterministic Typst PDF Pipeline**:
  - Powered by `@myriaddreamin/typst-ts-node-compiler` and [`typst/cv.typ`](typst/cv.typ), precompiling all 4 PDF variants (`cv-italiano-photo.pdf`, `cv-italiano-nophoto.pdf`, `cv-english-photo.pdf`, `cv-english-nophoto.pdf`) during Vite's `buildStart()` hook into `public/pdf/` and copied to `dist/pdf/`.
  - Calibrated for precise 2-page A4 output on the revised profile with clean vector flag badges ([`typst/flags.typ`](typst/flags.typ)).
  - Direct UI download button (`📥`) dynamically routed to the current language and photo toggle state.
- **Native Print Flow**: Styled with `@media print` rules for browser-based print-to-PDF (`🖨️`), automatic light-theme enforcement during printing, and granular page-break controls.
- **Theme Management**: Supports `light`, `dark`, and `system` modes with zero-FOUC inline initialization, `localStorage` persistence, and cross-tab synchronization.
- **Bilingual Support**: Instant switching between `Italiano` and `English` with localized ARIA labels and `<html lang>` synchronization.
- **Toolchain**: Pinned to **Node.js `26.13.1`** and **pnpm `11.21.0`**, linted with `oxlint`, and formatted with `oxfmt`.

## Environment Configuration

Copy [`.env.example`](.env.example) to `.env.local` for local private usage:

```ini
VITE_CV_PROFILE=private
VITE_CV_DATA_FILE=cvData.revised.json
```

## Available Scripts (`pnpm`)

- `pnpm dev`: Starts the Vite development server (uses `.env.local` if present; regenerates PDFs to `public/pdf/`).
- `pnpm dev:public`: Forces the development server to load the public demo profile (`cvData.json`).
- `pnpm build`: Type-checks, generates public PDFs, and builds the **public** production bundle into `dist/`.
- `pnpm build:private`: Type-checks, generates private PDFs, and builds the **private** bundle into `dist/`.
- `pnpm generate:pdf`: Manually compiles the 4 public PDF variants via `scripts/pdfGenerator.ts`.
- `pnpm generate:pdf:private`: Manually compiles the 4 private PDF variants via `scripts/pdfGenerator.ts --private`.
- `pnpm lint`: Runs `oxlint` across the codebase (`react`, `typescript`, `unicorn`, `jsx-a11y` plugins).
- `pnpm format`: Formats project files using `oxfmt`.
- `pnpm format:check`: Verifies formatting compliance using `oxfmt --check`.
- `pnpm preview`: Locally previews the production build.
