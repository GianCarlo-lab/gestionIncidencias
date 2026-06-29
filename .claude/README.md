# `.claude/` — Memoria e Infraestructura de Pide Servicio

Esta carpeta combina la **memoria persistente** definida en el SDD (secc. 22) con la **infraestructura operativa** de Claude Code (subagentes, skills, comandos, hooks). Ver decisión `ADR-001` en `context/decisions.md`.

## Estructura

```
.claude/
├── context/        # Conocimiento por dominio (architecture, database, frontend, backend,
│                   #   permissions, notifications, workflows, decisions)
├── progress/       # Estado vivo (current-phase, completed, pending, blockers, changelog)
├── tasks/          # Backlog y planificación (backlog, sprint-current, next-steps)
├── validations/    # Checklists de calidad (frontend, backend, database, testing)
├── prompts/        # Resumen y reglas (project-summary, coding-rules, architecture-rules)
├── agents/         # 11 subagentes especializados
├── skills/         # Skills (control-de-commits)
├── commands/       # Comandos (/estado, /commit-seguro)
├── hooks/          # Scripts de hooks (session-start.ps1)
├── settings.json   # Configuración de Claude Code (hooks)
├── WORKFLOW.md     # Flujo de trabajo y reglas de commits
└── project-status.json  # Estado global del proyecto
```

## Cómo usarla

1. **Inicio de sesión:** leer `../CLAUDE.md` → `prompts/project-summary.md` → `progress/current-phase.md` → `progress/pending.md`.
2. **Durante el trabajo:** consultar `context/` y `validations/`; delegar en los `agents/` según el dominio.
3. **Antes de commitear:** usar la skill `control-de-commits`.
4. **Después de cada tarea/commit:** sincronizar `progress/` y `project-status.json` (subagente `documentation-manager`).

El documento oficial de referencia es `../docs/SDD-PideServicio.md` y **no se modifica**.
