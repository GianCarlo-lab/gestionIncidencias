# Contexto: Backend (Supabase)

> Resumen operativo. Detalle en `docs/SDD-PideServicio.md` (secc. 6, 8). Contrato ampliado pendiente en `docs/API.md` (vacío).

## Componentes Supabase

PostgreSQL · Authentication · Storage · Realtime · Edge Functions · Database Functions · Triggers · RLS · Cron (si se requiere).

## Edge Functions principales

`send-ticket-created`, `send-worker-assigned`, `send-ticket-finished`, `send-ticket-validated`, `upload-evidence`, `create-audit`.

## Contrato Frontend/Backend — Respuestas estándar

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "code": "VALIDATION_ERROR", "message": "...", "errors": [] }
{ "success": false, "code": "FORBIDDEN", "message": "..." }
{ "success": false, "code": "INTERNAL_ERROR", "message": "..." }
```

## Operaciones críticas

- **Crear ticket**: crea → genera `PS-000001` → historial → auditoría → notificaciones → correo a admins → dashboard → evento Realtime.
- **Asignar trabajador**: valida ticket existente y no cerrado, trabajador activo/disponible, permisos del admin.

## Reglas (BE-001 a BE-008)

Ver `.claude/prompts/coding-rules.md`. Esenciales: nunca modificar datos desde React, todo cambio auditado, validar permisos en asignaciones, eliminación lógica, validar workflow en cambios de estado, validar archivos, correos por cola, auditoría completa.

## Estado actual

Sin Edge Functions ni funciones SQL. Se construye en Fases 2-6.
