# Decisiones de Arquitectura (ADR ligero)

> Registro cronológico de decisiones importantes. Cada decisión: contexto, decisión, motivo, impacto. No se borra; se añade.

---

## ADR-001 — Coexistencia de la memoria `.claude/` con la configuración operativa de Claude Code
**Fecha:** 2026-06-29 · **Estado:** Aceptada

**Contexto:** El SDD (secc. 22) define `.claude/` como memoria persistente (`context/`, `progress/`, `tasks/`, `validations/`, `prompts/`). Claude Code también usa `.claude/` para `agents/`, `skills/`, `commands/`, `hooks/` y `settings.json`.

**Decisión:** Mantener ambas en `.claude/` de forma aditiva. La memoria del SDD se respeta tal cual; se añaden las carpetas operativas de Claude Code sin renombrar ni mover lo del SDD.

**Motivo:** No hay conflicto de nombres; permite que la memoria y la automatización vivan juntas y versionadas.

**Impacto:** `.claude/` ahora contiene tanto documentación de proyecto como infraestructura de agentes/skills.

---

## ADR-002 — `CLAUDE.md` en la raíz del repositorio
**Fecha:** 2026-06-29 · **Estado:** Aceptada

**Contexto:** Se necesita un punto de entrada que se cargue automáticamente cada sesión.

**Decisión:** Colocar `CLAUDE.md` en la raíz (convención de Claude Code) con el protocolo de sesión y punteros a la memoria. `WORKFLOW.md` se ubica en `.claude/WORKFLOW.md`.

**Motivo:** `CLAUDE.md` en raíz se autocarga; centraliza el protocolo de arranque.

**Impacto:** Toda sesión arranca leyendo `CLAUDE.md` → `project-summary.md` → `current-phase.md` → `pending.md`.

---

## ADR-003 — `.gitignore` poblado en Fase 0
**Fecha:** 2026-06-29 · **Estado:** Aceptada

**Contexto:** El `.gitignore` estaba vacío; riesgo de commitear `node_modules/`, `.env`, builds, logs (incumple SDD secc. 24.7 e INF-001/SEC-006).

**Decisión:** Poblar `.gitignore` con dependencias, builds, secretos, cobertura, logs, temporales y archivos de IDE/SO.

**Motivo:** Evitar fugas de secretos y ruido en el repositorio desde el inicio.

**Impacto:** Base segura para los commits desde Fase 1.

---

## PENDIENTE-001 — Typo en `docs/WROKFLOWS.md`
**Fecha:** 2026-06-29 · **Estado:** Propuesta (requiere aprobación)

**Contexto:** El archivo está en staging como `WROKFLOWS.md` (debería ser `WORKFLOWS.md`). Está vacío.

**Propuesta:** Renombrar a `docs/WORKFLOWS.md` (`git mv`). No se ejecuta hasta aprobación del usuario, por estar ya rastreado en git.

**Impacto:** Consistencia de nombres de documentación.
