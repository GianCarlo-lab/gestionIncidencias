# Resumen del Proyecto — Pide Servicio

> Archivo más importante de la memoria. Máx. 2-3 páginas. Es lo primero que se lee en cada sesión.
> Fuente oficial: `docs/SDD-PideServicio.md`.

## Objetivo

PWA **Mobile First** para centralizar el registro, asignación, seguimiento y resolución de **incidencias, solicitudes y riesgos** de una empresa con múltiples sucursales. Reemplaza el flujo por correo por uno digital, trazable y auditable. Debe ser rápido, escalable, seguro, responsive y modular.

## Arquitectura

Por capas, con **capa de servicios obligatoria** entre la UI y Supabase:

```
Usuario → Página React → Hook → Service → Supabase → Respuesta → TanStack Query → UI
```

- Presentación: React + TS + Vite + Tailwind + shadcn/ui.
- Lógica de negocio: servicios, hooks, utilidades (nunca dentro del JSX).
- Acceso a datos: `src/services/` y `features/*/services/`.
- Persistencia e integraciones: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions). **No hay backend tradicional.**

Frontend organizado por **features** independientes (`features/<modulo>/{pages,components,hooks,services,schemas,types,constants,utils,routes.ts}`) + `shared/`, `services/`, `hooks/`, `types/`, `utils/`, `constants/`, `lib/`.

## Tecnologías clave

React 19 · TypeScript (strict) · Vite · TailwindCSS · shadcn/ui · React Router DOM · TanStack Query (datos servidor) · Zustand (estado global) · React Hook Form + Zod (formularios/validación) · Lucide · Framer Motion · Sonner · Recharts · Supabase JS.

## Módulos (orden de desarrollo)

1. Usuarios → 2. Configuración → 3. Tickets → 4. Dashboard → 5. Notificaciones → 6. Auditoría → 7. Reportes.

## Roles

Jerarquía: **SuperAdministrador → Administrador → Trabajador → Usuario.**
- Usuario: crea tickets, ve los suyos, valida la solución.
- Trabajador: atiende tickets asignados, cambia estado, sube evidencia.
- Administrador: ve todo, asigna/reasigna, ve auditoría (según sucursal).
- SuperAdministrador: acceso total, gestiona usuarios y catálogos.

Estado laboral (Trabajador/Admin): Activo, Vacaciones, Licencia, Suspendido, Retirado. Solo *Activo* recibe asignaciones; *Suspendido/Retirado* no inician sesión.

## Flujo del ticket (Workflow Engine)

```
Nuevo → Sin Asignar → Asignado → En Proceso → Pendiente de Validación
                                                      ├─ Usuario confirma → Cerrado
                                                      └─ Usuario rechaza → Reabierto → Asignado
```

Transiciones estrictas: no se pueden saltar estados. Cada transición genera **historial + auditoría + evento Realtime + actualización de dashboard**.

## Reglas importantes (resumen)

- Sin lógica de negocio en componentes; UI nunca toca Supabase directo.
- Borrado lógico (`deleted_at`), nunca físico.
- Catálogos configurables, nada hardcodeado.
- Permisos validados en Backend + RLS por rol.
- Toda acción crítica auditada (usuario, fecha, IP, dispositivo, valor anterior/nuevo).
- Código: TS strict, ESLint limpio, sin `any`, componentes ≤ 300 líneas, todo formulario con RHF + Zod, toda pantalla con Loading/Empty/Error/Success.
- Correos solo en eventos importantes y mediante cola (el usuario nunca espera el envío).

## Definición de Terminado (DoD)

Código + migraciones + RLS + Edge Functions + frontend conectado + correos + notificaciones + pruebas pasando + sin errores críticos + **documentación `.claude/` actualizada**.
