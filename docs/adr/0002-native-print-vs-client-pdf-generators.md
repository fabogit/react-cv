---
status: accepted
---

# 0002. Native Browser Print Over Client-Side Canvas PDF Generators

## Context and Decision

To generate downloadable PDF copies of the curriculum vitae, we evaluated client-side PDF generation libraries (`html2canvas`, `jspdf`, `pdfmake`) versus leveraging the browser's native print-to-PDF pipeline (`window.print()` with `@media print` CSS rules). We decided to maintain the browser's native print workflow.

## Considered Options

- **html2canvas / jspdf**: Converts DOM nodes to bitmap canvases before embedding into a PDF container. Rejected because it destroys text selection, produces blurred typography upon zoom, bloats file sizes, and breaks ATS (Applicant Tracking System) text parsing.
- **Dedicated PDF templates (e.g. `@react-pdf/renderer`)**: Requires duplicating all CSS styles and JSX templates into a separate rendering tree.
- **Native Browser Print (`window.print`)**: Uses the browser's built-in PDF export, maintaining vector typography, hyperlinks, ATS-compatible text selection, and zero extra bundle dependencies.

## Consequences

- Requires strict CSS media query management (`@media print`, `.no-print`).
- Page fragmentation remains dependent on client print engine behavior across different platforms.
