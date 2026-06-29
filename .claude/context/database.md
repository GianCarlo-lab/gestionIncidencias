# Contexto: Base de Datos

> Resumen operativo. Detalle completo en `docs/SDD-PideServicio.md` (secc. 7). Documento ampliado pendiente en `docs/DATABASE.md` (vacío).

## Principios

- Normalizada (3FN mín.), PKs `UUID` (`gen_random_uuid()`), FKs, índices en columnas de búsqueda.
- Borrado lógico (`deleted_at`), timestamps automáticos.
- Auditoría completa de operaciones críticas.
- Columnas estándar en toda tabla: `id, created_at, updated_at, created_by, updated_by, deleted_at`.

## Tablas principales

- `users` — perfil de aplicación (vinculado a `auth.users`), rol, sucursal, área, estado laboral.
- `tickets` — caso completo; código único `PS-000001`; estados, prioridades (usuario/admin), fechas del ciclo de vida.
- `ticket_comments` — públicos e internos (`es_interno`).
- `ticket_history` — todos los eventos; nunca se elimina.
- `ticket_evidence` — evidencias `inicial`/`final` en Storage (mime, peso).
- `ticket_assignments` — historial de asignaciones.
- `notifications` — notificaciones internas.
- `audit_logs` — tabla inmutable; registra todo (valor anterior/nuevo JSONB, IP, dispositivo).

## Catálogos (configurables)

`ticket_types, ticket_categories, ticket_status, priorities, worker_status, notification_types`.

## Funciones SQL (objetivo)

`create_ticket(), assign_worker(), change_status(), close_ticket(), reopen_ticket(), get_dashboard(), get_ticket_history(), validate_ticket(), create_notification(), generate_ticket_code()`.

## Buckets Storage

`tickets-evidence, avatars, system-assets, email-images`.

## Índices obligatorios

`codigo, estado, trabajador, usuario, sucursal, categoria, prioridad, fecha, tipo`.

## RLS por rol

Usuario: sus tickets · Trabajador: tickets asignados · Administrador: sus sucursales · SuperAdministrador: todo.

## Estado actual

Sin migraciones. Carpeta `database/` vacía. Se construye en la Fase 2.
