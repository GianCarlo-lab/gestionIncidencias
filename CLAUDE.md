# CLAUDE.md — Pide Servicio

> Memoria operativa principal. Este archivo se carga automáticamente al iniciar cada sesión.
> El documento oficial de referencia es [`docs/SDD-PideServicio.md`](docs/SDD-PideServicio.md). **No se modifica el SDD.**

---

## 1. Protocolo de Sesión (OBLIGATORIO)

Antes de programar cualquier cosa, leer **en este orden**:

1. `.claude/prompts/project-summary.md` — resumen ejecutivo del sistema.
2. `.claude/progress/current-phase.md` — fase y tarea actual.
3. `.claude/progress/pending.md` — tareas pendientes.

> Nunca empezar leyendo todo el SDD. Solo releer el SDD completo si: se agrega un módulo nuevo, hay contradicción entre documentos, el usuario modifica el SDD, o existe una ambigüedad irresoluble con `.claude/`.

Después de terminar **cada** tarea, actualizar:
- `.claude/progress/completed.md`
- `.claude/progress/pending.md`
- `.claude/progress/current-phase.md`
- `.claude/progress/changelog.md`
- `.claude/project-status.json`

Esta sincronización es responsabilidad del subagente **Documentation Manager** y es parte de la Definición de Terminado.

---

## 2. Qué es Pide Servicio

PWA **Mobile First** para registrar, asignar, seguir y resolver incidencias, solicitudes y riesgos de una empresa con múltiples sucursales. Reemplaza el flujo por correo por uno digital, trazable y auditable.

**Stack:** React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod · Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions).

**Roles:** SuperAdministrador → Administrador → Trabajador → Usuario.

**Flujo del ticket:** Nuevo → Sin Asignar → Asignado → En Proceso → Pendiente de Validación → (Cerrado | Reabierto → Asignado).

---

## 3. Reglas de Arquitectura Inviolables

1. **Mobile First** siempre.
2. **Sin lógica de negocio en componentes React.** Toda lógica vive en servicios, hooks o utilidades.
3. Los componentes **nunca** consumen Supabase directamente: siempre vía capa de servicios (`src/services/` o `features/*/services/`).
4. Ningún estado del workflow se modifica directo en BD: pasa por la lógica del sistema.
5. **Borrado lógico** (`deleted_at`), nunca `DELETE` físico.
6. Todo catálogo es **configurable**, nunca hardcodeado.
7. Todo cambio de estado genera: historial + auditoría + notificación (si aplica) + actualización de dashboard.
8. Todo permiso se valida en **Backend**, nunca solo en Frontend.
9. TypeScript strict, ESLint sin errores, **sin `any`** injustificado.

---

## 4. Reglas de Commits

- Commits **pequeños**: máx. 10 archivos / 500 líneas; **un único objetivo** por commit.
- Título y descripción **en español**, claros, sin jerga (`fix`, `feat`, `varios ajustes` están prohibidos).
- **Nunca** mencionar IA, Claude ni "generado automáticamente".
- Descripción = qué se hizo + por qué + impacto.
- **Validación obligatoria antes de cada commit** (skill `control-de-commits`: Git Guardian → Release Reviewer).
- Nunca commitear con dudas sobre la estabilidad del proyecto.

Detalles completos: `.claude/WORKFLOW.md` y `.claude/prompts/coding-rules.md`.

---

## 5. Subagentes (responsabilidades, no se solapan)

| Subagente | Responsabilidad |
|---|---|
| `arquitecto` | Arquitectura, patrones, carpetas, escalabilidad |
| `dba` | PostgreSQL, índices, triggers, RLS, funciones SQL, migraciones |
| `backend` | Edge Functions, servicios, seguridad, API, Auth |
| `frontend` | React, responsive, componentes, UX, accesibilidad |
| `ui-designer` | Color, tipografía, espaciados, consistencia visual, Mobile First |
| `qa` | Testing, casos borde, validaciones, regresión |
| `reviewer` | Revisión Senior final antes de marcar terminado |
| `documentation-manager` | Mantener `.claude/` siempre sincronizado |
| `git-guardian` | Validación técnica antes del commit |
| `release-reviewer` | Validación de calidad del commit |
| `recovery-manager` | Estabilidad y recuperación ante errores |

---

## 6. Plan de Fases

0. **Infraestructura** (`.claude`, subagentes, skills, flujo) — *en curso*.
1. Inicialización (React+Vite+TS, Tailwind, shadcn, lint, routing, stores, Supabase, carpetas).
2. Base de Datos (migraciones, índices, FKs, funciones, triggers, RLS, seeds).
3. Autenticación · 4. Layout Base · 5. Componentes Base · 6. Módulos (Usuarios → Configuración → Tickets → Dashboard → Notificaciones → Auditoría → Reportes) · 7. Optimización · 8. Testing · 9. Producción.

> No iniciar una fase/módulo sin terminar el anterior.
