# WORKFLOW — Pide Servicio

> Flujo de trabajo operativo del proyecto. Complementa `CLAUDE.md` y `docs/SDD-PideServicio.md` (secc. 21, 24).

## 1. Inicio de cada sesión

Leer en orden: `CLAUDE.md` → `.claude/prompts/project-summary.md` → `.claude/progress/current-phase.md` → `.claude/progress/pending.md`. Recién entonces programar.

## 2. Ciclo de una tarea

```
Pensar (10 reglas) → Revisar memoria → Implementar por bloques pequeños
   → Auto-auditoría → Validaciones (.claude/validations/) → Reviewer
   → Control de commits (skill) → Commit → Sincronizar memoria → Siguiente
```

### 2.1 Antes de codificar (Regla N°1)
¿Qué pide el SDD? ¿Existe algo similar? ¿Rompo la arquitectura? ¿Duplico lógica? ¿Qué impacto tiene? ¿Qué docs actualizo? Si algo no está claro → **NO PROGRAMAR**: revisar documentación.

### 2.2 Auto-auditoría (Regla N°8)
Compila · ESLint · TypeScript · Responsive · Mobile · Accesibilidad · Permisos · RLS · Testing · Documentación.

## 3. Reparto de responsabilidades (subagentes)

| Rol | Cuándo interviene |
|---|---|
| `arquitecto` | Antes de crear módulos/carpetas/patrones; decisiones de estructura |
| `dba` | Migraciones, índices, funciones SQL, triggers, RLS, seeds |
| `backend` | Edge Functions, servicios, Auth, seguridad, contrato |
| `frontend` | Componentes, páginas, hooks UI, responsive, UX |
| `ui-designer` | Tokens visuales, consistencia, estados visuales |
| `qa` | Pruebas y regresión antes de cerrar |
| `reviewer` | Revisión Senior final antes de marcar terminado |
| `documentation-manager` | Sincronizar `.claude/` tras cada tarea/commit |
| `git-guardian` | Validación técnica antes del commit |
| `release-reviewer` | Calidad del commit |
| `recovery-manager` | Estabilidad y recuperación ante errores |

> Cada subagente tiene un dominio claro y **no invade** el de los demás. La coordinación es explícita (ej.: `frontend` consume servicios de `backend`; `backend` acuerda esquema con `dba`).

## 4. Reglas de commits

- Pequeños: ≤10 archivos / ≤500 líneas; **un único objetivo**.
- Título y descripción **en español**; sin `fix/feat/varios ajustes`.
- **Nunca** mencionar IA/Claude/"generado automáticamente".
- Validación obligatoria (skill `control-de-commits`) antes de confirmar.
- Nunca commitear con dudas sobre la estabilidad.

### Estado final esperado tras cada commit
Build ✔ · ESLint ✔ · TypeScript ✔ · Tests ✔ · Commit ✔ · Documentación ✔ · Memoria sincronizada ✔.

## 5. Ramas (Git Flow)

`main` (producción) · `develop` (desarrollo) · `feature/*` · `fix/*` · `hotfix/*`. No desplegar directo de ramas de desarrollo a producción.

## 6. Actualización automática de la memoria

Tras cada tarea/decisión/commit se actualiza `.claude/` (responsable: `documentation-manager`). Un hook de `SessionStart` recuerda este protocolo al abrir sesión (ver `.claude/settings.json` y `.claude/hooks/`).
