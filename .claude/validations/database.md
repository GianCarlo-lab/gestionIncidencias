# Checklist de Validación — Base de Datos

> Verificar antes de dar por terminada cualquier migración. Responsable: `dba` + `reviewer`.

## Estructura
- [ ] PK `UUID` (`gen_random_uuid()`).
- [ ] Columnas estándar: `created_at, updated_at, created_by, updated_by, deleted_at`.
- [ ] FKs correctas y normalización ≥ 3FN.
- [ ] Índices en columnas de búsqueda: `codigo, estado, trabajador, usuario, sucursal, categoria, prioridad, fecha, tipo`.

## Reglas
- [ ] Borrado lógico habilitado; sin `DELETE` físico.
- [ ] Catálogos configurables (no valores hardcodeados).
- [ ] `audit_logs` inmutable; `ticket_history` sin borrado.

## Seguridad
- [ ] RLS habilitada en tablas sensibles, por rol (Usuario/Trabajador/Admin/SuperAdmin).
- [ ] Funciones SQL validan reglas de negocio del workflow.

## Versionado
- [ ] Migración versionada y reproducible. [INF-002/004]
- [ ] Seeds de catálogos y datos mínimos creados cuando aplique.
