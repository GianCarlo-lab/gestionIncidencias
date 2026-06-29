# Reglas de Arquitectura — Pide Servicio

> Derivadas del SDD (secciones 2, 4, 5, 6, 7). Inviolables.

## Principios obligatorios

| Regla | Descripción |
|---|---|
| R1 | La aplicación es **Mobile First**. |
| R2 | No hay lógica de negocio en componentes React: va en servicios, hooks o utilidades. |
| R3 | Todo cambio importante genera registro de auditoría. |
| R4 | Ningún estado del workflow se modifica directo en BD: pasa por la lógica del sistema. |
| R5 | Sin eliminación física: borrado lógico con `deleted_at`. |
| R6 | Todo catálogo es configurable por el administrador, nunca hardcodeado. |
| R7 | Todo cambio de estado genera: historial + auditoría + notificación (si aplica) + dashboard. |

## Capas

| Capa | Responsabilidad |
|---|---|
| Presentación | UI (React, TS, Vite, Tailwind, shadcn) |
| Lógica de negocio | Validaciones, workflow, estados, permisos (servicios, hooks, utils) |
| Acceso a datos | Capa de servicios (`src/services/`, `features/*/services/`) |
| Persistencia | Supabase PostgreSQL |
| Integraciones | Correo, Storage, Auth, Realtime |

**Regla de oro:** los componentes React **nunca** consumen Supabase directamente. Siempre hay una capa de servicios.

## Estructura Frontend

```
src/
├── app/        (router, providers, layouts, guards, config, App.tsx)
├── features/   (auth, dashboard, tickets, notifications, users, workers, reports, settings, profile)
├── shared/     (components, ui, dialogs, forms, tables, charts, cards, skeletons, empty-states)
├── services/  ├── hooks/  ├── types/  ├── utils/  ├── constants/  ├── lib/  ├── assets/  └── styles/
```

Cada feature es autónoma: `pages/ components/ hooks/ services/ schemas/ types/ constants/ utils/ routes.ts`.

## Flujo Backend

```
Frontend → Service → Edge Function → Business Rules → Database Function → PostgreSQL
                                                      ↓
                                      Realtime + Auditoría + Notificaciones
```

## Base de Datos

- Normalizada (3FN mínimo), PKs `UUID`, FKs, índices en columnas de búsqueda.
- Columnas estándar en toda tabla: `id, created_at, updated_at, created_by, updated_by, deleted_at`.
- Catálogos configurables: `ticket_types, ticket_categories, ticket_status, priorities, worker_status, notification_types`.

## Estado (Frontend)

- **Zustand**: estado global (usuario, tema, notificaciones, configuración, preferencias).
- **TanStack Query**: datos del servidor (tickets, usuarios, dashboard, reportes, catálogos).
- **useState**: estado local (modales, inputs temporales).

## Evolución (RNF-007, RNF-013)

Toda funcionalidad nueva respeta esta arquitectura. Las integraciones futuras se desarrollan como módulos independientes.
