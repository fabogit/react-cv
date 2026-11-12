# Architecture Audit & Engineering Analysis

## Executive Summary

This document summarizes the architectural state of `react-cv` following the React 19 upgrade, build-time public/private profile isolation, runtime schema validation, deterministic Typst PDF generation, CSS print-flow refinement, and alignment with Node.js `26.13.1`, `pnpm` `11.21.0`, and the Oxc toolchain (`oxlint` + `oxfmt`).

---

## 1. Resolved Architectural Issues

### 1.1 Public vs. Private Build Isolation

- **Previous Issue**: Static imports of gitignored JSON data (`cvData.revised.json`) broke clean CI/cloud builds, while broad `import.meta.glob` patterns bundled gitignored private images (`_img/`, `icons/_work/`, `icons/_school/`) into `dist/assets/`.
- **Resolution**: Implemented a compile-time adapter seam in `src/adapters/`:
  - `cvProfile.public.ts`: Statically imports `cvData.json` and restricts asset globs to public directories (`img/`, `icons/header/`, `icons/work/`, `icons/school/`).
  - `cvProfile.private.ts`: Dynamically resolves `VITE_CV_DATA_FILE` (with fallback to `cvData.json`) and prioritizes private underscore-prefixed asset directories (`_img/`, `icons/_work/`, `icons/_school/`).
  - `vite.config.ts` (`cv-profile-adapter` with `enforce: "pre"`): Activates the private adapter only in local development (`VITE_CV_PROFILE=private`) or via `pnpm build:private`, guaranteeing that standard `pnpm build` outputs strictly public assets.

### 1.2 Runtime Schema Validation

- **Resolution**: Implemented `src/utils/validateCvData.ts` exporting `validateCvData(raw, sourceName)`.
- Validates that untrusted or imported JSON files strictly adhere to `CvDataSchema` (`src/types/cv.ts`), enforcing structure on `language.Italiano` and `language.English`, headers, work items, education, languages, hard/soft skills, and legal compliance notes before runtime rendering or PDF generation.

### 1.3 Deterministic Typst PDF Generation & UI Download

- **Resolution**: Integrated `@myriaddreamin/typst-ts-node-compiler` via `scripts/pdfGenerator.ts` and `typst/cv.typ` (ADR 0004):
  - **Option B1-A SVG Flag System** (`typst/flags.typ`): Decodes Unicode Regional Indicator emojis or language names into ISO country codes, rendering crisp rectangular 4:3 vector SVGs inside subtle borders (`width: 13pt`, `height: 9.5pt`, `radius: 1.5pt`) with typographical ISO badge fallback.
  - **A4 2-Page Calibration**: Calibrated typography, spacing, and breakable card containers so that the comprehensive private profile (`cvData.revised.json`) compiles to exactly 2 pages with 0 overflow across all 4 variants (`cv-italiano-photo.pdf`, `cv-italiano-nophoto.pdf`, `cv-english-photo.pdf`, `cv-english-nophoto.pdf`).
  - **Vite Lifecycle Hook** (`vite.config.ts`): Registers `cv-pdf-generator` plugin running on `buildStart()`, generating all 4 PDF variants into `public/pdf/` on every `dev` or `build` invocation, automatically copied to `dist/pdf/`.
  - **UI Direct Download** (`src/App.tsx`): Exposes an instant download link (`📥`, `.control-action`) bound dynamically to the current language and photo state alongside native browser print (`🖨️`).

### 1.4 CSS Architecture & Print Pagination

- **Previous Issue**: Unused `@tailwindcss/vite` and `tailwindcss` dependencies inflated the CSS bundle; fixed `height: 2rem` on `.work-info` and `.education-info` caused vertical overflow on wrapped titles; `break-inside: avoid` on large `.work-item` blocks inside flex containers left quarter-page blank gaps on Page 1 during printing.
- **Resolution**:
  - Removed Tailwind CSS v4 dependencies and replaced `@import "tailwindcss";` with a lightweight base reset in `src/styles/index.css` (−35.8% CSS bundle size).
  - Switched `.work-info` and `.education-info` to `min-height: var(--logo-size, 2rem)`.
  - Configured `@media print` in `src/styles/App.css` to use `display: block` on `.work-list` and `.education-list`, applying `break-inside: avoid; break-after: avoid;` on `.work-header` and `break-inside: avoid` on `.work-tasks li`, `.education-item`, and `.legal-notes`. Manual `#spacer-bot`, `#spacer-top`, and `.print-divider` rules are preserved for optional manual pagination.

### 1.5 React State Purity, Local Timezone & A11y

- **Resolution**:
  - Refactored `src/hooks/useTheme.ts` to derive `resolvedTheme` during render without redundant `useState`/`useEffect` pairs and moved `localStorage` persistence out of state updater callbacks.
  - Extracted `formatCvDate` and local-timezone `formatLocalIsoDate` into `src/utils/formatters.ts`.
  - Added conditional rendering guards on optional logos in `WorkExperience.tsx` and `Education.tsx`, restricted `target="_blank"` to HTTP/HTTPS links in `Header.tsx`, and synchronized `<html lang>` and localized ARIA labels in `App.tsx`.

### 1.6 Toolchain Modernization (`Node.js 26.13.1`, `pnpm 11.21.0`, Oxc)

- **Resolution**:
  - Pinned `packageManager: "pnpm@11.21.0"` and `engines: { "node": ">=26.13.1", "pnpm": ">=11.21.0" }` in `package.json`, `.npmrc` (`use-node-version=26.13.1`), and `.nvmrc` (`26.13.1`).
  - Replaced ESLint with `oxlint` (`.oxlintrc.json`) and Prettier with `oxfmt` (`.oxfmtrc.json`).
