# Hook SessionStart - Pide Servicio
# Recuerda el protocolo de memoria al iniciar cada sesion.
# La salida estandar se inyecta como contexto para Claude Code.

Write-Output "PIDE SERVICIO - Protocolo de sesion:"
Write-Output "1) Lee .claude/prompts/project-summary.md"
Write-Output "2) Lee .claude/progress/current-phase.md"
Write-Output "3) Lee .claude/progress/pending.md"
Write-Output "Recuerda: tras cada tarea/commit actualiza .claude/ (completed, pending, current-phase, changelog, project-status.json)."
Write-Output "Commits: pequenos, un objetivo, en espanol, sin mencionar IA. Valida con la skill control-de-commits antes de confirmar."
