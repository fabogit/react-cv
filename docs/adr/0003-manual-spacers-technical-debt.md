---
status: accepted
---

# 0003. Manual Spacers for Print Layout as Temporary Technical Debt

## Context and Decision

Automated CSS page breaks (`break-before: page`, `break-after: page`, `break-inside: avoid`) applied to section cards caused unpredictable fragmentation, pushing excessive content onto page 2 and leaving page 1 largely empty. As a pragmatic fallback requested by the user, we restored manual DOM spacing elements (`#spacer-top` and `#spacer-bot` around the divider `<hr />`).

## Consequences `[TECHNICAL DEBT]`

- **Fragility**: Layout breaks will desynchronize if font sizes, margins, or DPI settings vary across target clients, or if new entries are added to `cvData.json`.
- **Maintenance Cost**: Any content expansion requires manual recalibration of spacer heights.
- **Future Migration**: Must be superseded by deterministic page-budgeting calculations, CSS Paged Media `@page` standards, or a server-side headless browser generation script (e.g. Playwright/Puppeteer).
