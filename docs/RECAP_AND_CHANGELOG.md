# Recap & Session Changelog

## 1. Scope of Work

This changelog documents the architectural refactoring, build isolation, runtime schema validation, deterministic Typst PDF pipeline, UI download integration, print layout fixes, React 19 best-practices alignment, and alignment with Node.js `26.13.1` and `pnpm` `11.21.0`.

---

## 2. Detailed Modifications

### 2.1 Public/Private Build Isolation & Git Hygiene

- Created `src/adapters/cvProfile.types.ts`, `src/adapters/cvProfile.public.ts`, and `src/adapters/cvProfile.private.ts`.
- Added the `cv-profile-adapter` (`enforce: "pre"`) plugin in `vite.config.ts` and environment configuration via `.env.example` and `.env.local` (`VITE_CV_PROFILE`, `VITE_CV_DATA_FILE`).
- Hardened `.gitignore` to protect private JSON datasets, private underscore directories (`_img`, `_work`, `_school`), and generated PDFs (`public/pdf/`).

### 2.2 Runtime Schema Validation

- Created `src/utils/validateCvData.ts` exporting `validateCvData(raw, sourceName)`.
- Enforces runtime typing and structural validation for `CvDataSchema` across all supported languages (`Italiano`, `English`), safeguarding both client components and PDF compilers against schema divergence.
- Integrated validator calls into `src/adapters/cvProfile.public.ts`, `src/adapters/cvProfile.private.ts`, and `scripts/pdfGenerator.ts`.

### 2.3 Deterministic Typst PDF Generation & UI Integration

- Added `@myriaddreamin/typst-ts-node-compiler` to `devDependencies`.
- Created `typst/flags.typ` containing vector 4:3 SVGs for 21 common countries/languages and `#let render-flag(iso)` with ISO badge fallback.
- Created `typst/cv.typ` implementing an A4 layout calibrated to 2 pages for the comprehensive private profile, matching web colors (`#003366`, `#2d3748`, `#4a5568`, `#e2e8f0`).
- Created `scripts/pdfGenerator.ts` exporting `generateCvPdfVariants`, `decodeFlagEmoji`, and `resolveAssetPath`.
- Registered `cv-pdf-generator` plugin in `vite.config.ts` to regenerate PDFs in `public/pdf/` on `buildStart()`, which are copied to `dist/pdf/` during build.
- Updated `src/App.tsx` with a dynamic download link (`📥`, `.control-action`) for the active language/photo combination alongside native print (`🖨️`).

### 2.4 Styling, Layout & Print Flow

- Removed unused `tailwindcss` and `@tailwindcss/vite` dependencies, replacing `@import "tailwindcss";` with a concise CSS reset in `src/styles/index.css` (reducing production CSS by 35.8%).
- Fixed vertical text overflow in `WorkExperience.css` and `Education.css` (`min-height: var(--logo-size, 2rem)`).
- Refined `@media print` in `App.css`: switched `.work-list` and `.education-list` to `display: block` during printing and applied `break-inside: avoid` to `.work-header` (`+ break-after: avoid`), `.work-tasks li`, `.education-item`, and `.legal-notes`.

### 2.5 React Components, Hooks & Utilities

- Extracted `formatCvDate` and local-timezone `formatLocalIsoDate` to `src/utils/formatters.ts`; exported `SupportedLanguage` in `src/types/cv.ts`.
- Refactored `src/hooks/useTheme.ts` to compute `resolvedTheme` during render, remove side effects from state updaters, and reset to `"system"` when storage is cleared.
- Guarded `<img>` rendering in `WorkExperience.tsx` and `Education.tsx`, restricted `target="_blank"` to HTTP(S) URLs in `Header.tsx`, and added `<html lang>` synchronization and localized ARIA labels in `App.tsx`.

### 2.6 Node `26.13.1`, pnpm `11.21.0` & Oxc Toolchain

- Configured `packageManager: "pnpm@11.21.0"` and `engines: { "node": ">=26.13.1", "pnpm": ">=11.21.0" }` in `package.json`.
- Pinned `.npmrc` (`use-node-version=26.13.1`) and `.nvmrc` (`26.13.1`).
- Replaced ESLint and Prettier with `oxlint` and `oxfmt`.
- Added `pnpm generate:pdf` and `pnpm generate:pdf:private` scripts to `package.json`.

### 2.7 Security, Type Hardening & PDF Layout Refinements (`v2.1.0`)

- Consolidated shared CV constants, asset directory maps, and `isSafeContactLink` URI scheme validation in `src/constants/cv.ts` (allowing only `https:`, `http:`, `mailto:`, `tel:`).
- Enforced strict asset/JSON path containment and `.env.local` alignment in `scripts/pdfGenerator.ts` and `vite.config.ts`, removing silent fallback to `cvData.json` in private mode.
- Eliminated `as unknown as T` casts in `src/utils/validateCvData.ts`, enabled `noUncheckedIndexedAccess` in `tsconfig.app.json` and `tsconfig.node.json`, and isolated `tsconfig.app.json` to `vite/client` types.
- Moved `signatureAlt` into `LegalData` / JSON data templates (`LegalNotes.tsx`, `App.tsx`, `cvData.json`), hardened `Header.tsx` semantic markup and link safety, and sanitized PDF download filenames.
- Updated `typst/cv.typ` with the 2-column split header (`H1`) and adaptive page-2 layout (`L2`) stacking Languages above Soft Skills when technical skills are denser.
- Bumped `package.json` version to `2.1.0` and added declarative `netlify.toml` with bundled `LiberationSans` TTF fonts in `typst/fonts/` and custom SVG `public/favicon.svg`.
