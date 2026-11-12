---
status: accepted
---

# 0001. Migrate to React 19

## Context and Decision

The repository was operating on React 18 with legacy peer dependencies. We decided to upgrade `react`, `react-dom`, and their associated TypeScript definitions (`@types/react`, `@types/react-dom`) to React 19. This aligns the application with the modern React component model, enables newer compiler optimizations, and cleans up legacy dependencies.

## Consequences

- Requires strict adherence to React 19 typing rules.
- Existing components continue to render cleanly with zero deprecation warnings under Vite 8 and TypeScript 6.
