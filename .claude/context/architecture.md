# Contexto: Arquitectura

> Resumen operativo. Detalle completo en `docs/SDD-PideServicio.md` (secc. 2-6) y `.claude/prompts/architecture-rules.md`.

## Visión

Navegador (PWA) → React App (Frontend) → Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) → Correo/Notificaciones.

Sin backend tradicional. Toda comunicación con datos pasa por la **capa de servicios**.

## Capas y flujo

```
Usuario → Página → Hook → Service → Supabase → TanStack Query → UI
Frontend → Service → Edge Function → Business Rules → DB Function → PostgreSQL → Realtime + Auditoría + Notificaciones
```

## Estructura de carpetas (objetivo, aún no creada)

`src/{app,features,shared,services,hooks,types,utils,constants,lib,assets,styles}` — ver `architecture-rules.md`.
Cada feature autónoma con `pages/components/hooks/services/schemas/types/constants/utils/routes.ts`.

## Decisiones de arquitectura

Registradas en `.claude/context/decisions.md`.

## Estado actual

Fase 0 (infraestructura). El código fuente (`src/`) aún no existe; se creará en la Fase 1.
