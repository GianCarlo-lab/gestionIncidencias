# Changelog

> Cambios significativos del proyecto. Formato: fecha — descripción. Se actualiza tras cada commit.

## [Sin versión] — Fase 1

### 2026-06-29
- Proyecto React 19 + Vite 5 + TypeScript strict inicializado.
- ESLint 9 flat config + Prettier + Tailwind + shadcn/ui (components.json).
- React Router DOM 6 · TanStack Query 5 · Zustand 5 · RHF 7 · Zod 3 · Supabase JS 2.
- ThemeProvider (dark/light/system) + `useTheme` hook separado.
- Stores Zustand: auth y ui. Alias de importacion en vite + tsconfig.
- Estructura src/ completa: 9 features, 9 dirs shared, app, services, hooks, store, types, utils, constants, lib, styles.
- Vitest 2 (5 tests pasando) · Playwright 1 · Husky + lint-staged.
- Build produccion: OK (1.93s, 97.78 kB gzip).
- Commit: `Inicializar proyecto React con infraestructura tecnica completa`.

## [Sin versión] — Fase 0

### 2026-06-29
- Infraestructura de Fase 0: estructura `.claude/` completa (context, progress, tasks, validations, prompts).
- Memoria persistente: `CLAUDE.md`, `WORKFLOW.md`, `project-status.json`.
- 11 subagentes especializados documentados.
- Skill `control-de-commits` (Git Guardian + Release Reviewer + Recovery Manager).
- `.gitignore` poblado; `settings.json` con hook de protocolo de sesión.

> Aún sin commits de esta fase: pendientes de validación y aprobación.
