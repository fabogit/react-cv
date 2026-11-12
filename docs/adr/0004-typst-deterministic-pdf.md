---
status: accepted
---

# 0004. Deterministic Typst PDF Generation Beside Native Browser Print

## Context and Problem Statement

While native browser printing (`window.print()` with `@media print`, accepted in ADR 0002) provides zero-dependency vector PDF exports from the browser, client print engines (Chromium, WebKit, Gecko) produce subtly divergent page breaks, margins, and header/footer stamps across different operating systems. Furthermore, generating all 4 downloadable PDF variants (`Italiano` vs. `English`, `photo` vs. `nophoto`) required manual human interaction in the web UI.

We needed a deterministic, high-performance, ATS-compliant PDF generation pipeline capable of precompiling pixel-perfect A4 PDF artifacts during Vite build/dev lifecycle without relying on headless Chromium (Puppeteer/Playwright) or canvas-based client-side rasterizers.

## Considered Options

- **Headless Chromium / Puppeteer**: Launches a headless browser instance to invoke `page.pdf()`. Rejected due to heavy binary footprints (hundreds of megabytes), slow execution times (seconds per variant), and substantial CI memory overhead.
- **Client-Side PDF Engines (jsPDF, @react-pdf/renderer)**: Adds bundle bloat, suffers from font metric inconsistencies in web workers, and fails to guarantee strict A4 2-page calibration across varying client environments.
- **Typst Native Node Compiler (`@myriaddreamin/typst-ts-node-compiler`)**: Leverages Typst's Rust-based document formatting engine compiled as a native Node.js binary/N-API addon. Delivers sub-100ms compilation times, exact typographic grid control, vector SVG flag badges, and zero browser dependencies.

## Decision

We adopted `@myriaddreamin/typst-ts-node-compiler` to power a deterministic PDF generator (`scripts/pdfGenerator.ts` + `typst/cv.typ`):

1. **Four Pre-Generated Variants**: Precompiles `cv-italiano-photo.pdf`, `cv-italiano-nophoto.pdf`, `cv-english-photo.pdf`, and `cv-english-nophoto.pdf` during `buildStart()` in Vite or on-demand via `pnpm generate:pdf` / `pnpm generate:pdf:private`.
2. **Deterministic 2-Page Calibration**: Calibrates margins, typography, line height, and breakable card containers so that the rich revised profile fits precisely onto 2 A4 pages without awkward pagination breaks.
3. **Option B1-A SVG Flag System**: Decodes Unicode Regional Indicator emojis or language names to ISO codes and renders crisp rectangular 4:3 vector SVG flags (`typst/flags.typ`) with typographical badge fallbacks.
4. **Vite Lifecycle Integration**: Writes generated PDFs to `public/pdf/` (gitignored), ensuring they are served instantly during `pnpm dev` and copied to `dist/pdf/` during `pnpm build` / `pnpm build:private`.
5. **Complementary Coexistence**: Retains native browser print (`🖨️`) in `src/App.tsx` alongside an instant one-click download action (`📥`) mapped to the active language and photo state.

## Consequences

- The repository gains a lightweight native Rust-based compiler dependency (`@myriaddreamin/typst-ts-node-compiler`).
- `public/pdf/` is excluded from git tracking via `.gitignore`.
- Changes to data structures in `src/types/cv.ts` are validated at runtime by `src/utils/validateCvData.ts` before PDF generation, safeguarding against silent compilation failures.
