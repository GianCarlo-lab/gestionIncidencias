---
name: control-de-commits
description: Flujo obligatorio de validación de commits para Pide Servicio (Git Guardian + Release Reviewer + Recovery Manager). Úsalo SIEMPRE antes de confirmar cambios en git. Valida calidad técnica, calidad del commit y deja la opción de recuperación si algo se rompe. Disparadores - "voy a commitear", "haz commit", "confirmar cambios", "guardar en git".
---

# Control de Commits — Pide Servicio

Esta skill orquesta el control de versiones definido en `docs/SDD-PideServicio.md` (secc. 24). **Ningún commit se realiza sin pasar este flujo.**

## Flujo obligatorio

```
Desarrollar tarea → Validar funcionamiento → Ejecutar pruebas
   → Git Guardian (técnico) → ❌ Rechaza: explica y devuelve / ✅ Aprueba
       → Release Reviewer (calidad commit) → ❌ Rechaza y devuelve / ✅ Aprueba
           → Realizar commit → Actualizar .claude/ → Continuar
```

## Paso 1 — Git Guardian (validación técnica)
Delegar al subagente `git-guardian`. Verifica: compila, sin errores TS/ESLint, sin imports/variables sin usar, sin `console.log`, sin código muerto, sin duplicados, sin romper arquitectura. Límites: ≤10 archivos, ≤500 líneas, una sola funcionalidad. Si falla → **no commitear**.

## Paso 2 — Release Reviewer (calidad del commit)
Delegar al subagente `release-reviewer`. Verifica: tarea única, título claro **en español**, descripción (qué/por qué/impacto), entendible sin leer el código, deja el proyecto funcionando. **Nunca** mencionar IA/Claude. Si falla → **rechazar y corregir el mensaje**.

## Paso 3 — Commit
Solo si ambos aprueban. Verificar que `.env`, `node_modules/`, `dist/`, `coverage/`, `logs/` no estén en el staging.

Formato del mensaje:
```
<Título en español, una unidad lógica>

<Qué se hizo. Por qué. Qué impacto tiene.>
```

## Paso 4 — Sincronizar memoria (SDD 24.8)
Delegar a `documentation-manager` para actualizar:
- `.claude/progress/completed.md`
- `.claude/progress/changelog.md`
- `.claude/project-status.json` (incluido `ultimo_commit_estable`)

## Recuperación
Si un cambio rompe el sistema, invocar al subagente `recovery-manager`: comparar con el último commit estable, aislar archivos culpables, corregir sin perder funcionalidades; `git revert` solo como último recurso.

## Regla final
> Nunca realizar un commit si existe cualquier duda sobre la estabilidad del proyecto. Es preferible retrasar un commit que registrar un estado inestable.
