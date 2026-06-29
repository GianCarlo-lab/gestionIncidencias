---
description: Ejecuta el flujo de control de commits (Git Guardian + Release Reviewer)
---

Invoca la skill `control-de-commits` para validar y confirmar los cambios actuales siguiendo el flujo obligatorio del SDD:

1. `git-guardian`: validación técnica (compila, TS, ESLint, sin console.log/duplicados, límites de tamaño).
2. `release-reviewer`: calidad del commit (tarea única, mensaje en español, sin mención a IA).
3. Realizar el commit solo si ambos aprueban.
4. `documentation-manager`: actualizar `completed.md`, `changelog.md` y `project-status.json`.

Si algo falla, detente, explica los motivos y no realices el commit.
