# Contexto: Frontend

> Resumen operativo. Detalle en `docs/SDD-PideServicio.md` (secc. 5). Guía visual ampliada pendiente en `docs/UI_GUIDE.md` y `docs/COMPONENTS.md` (vacíos).

## Stack

React 19 · TypeScript strict · Vite · TailwindCSS · shadcn/ui · React Router DOM · TanStack Query · Zustand · React Hook Form · Zod · Lucide · Framer Motion · Sonner · Recharts · Supabase JS.

## Gestión de estado

- Zustand: usuario autenticado, tema, notificaciones, configuración, preferencias.
- TanStack Query: tickets, usuarios, dashboard, reportes, catálogos.
- useState: modales, inputs y formularios temporales.

## Reglas (FE-001 a FE-010)

Ver `.claude/prompts/coding-rules.md`. Esenciales: UI nunca toca Supabase (usa Service), validación con Zod, sin lógica en JSX, componentes ≤300 líneas, solo Tailwind, RHF+Zod en formularios, listados con búsqueda/filtros/paginación/orden, botones con loading anti-doble-click, errores por Toast, y cuatro estados por pantalla (Loading/Empty/Error/Success).

## Componentes base (Fase 5, antes de los módulos)

Button, Input, Select, Card, Modal, Badge, Table, Avatar, Toast, Loader, Empty State, Confirm Dialog, File Upload, Data Grid, Timeline, Chart Wrapper. **No duplicar.**

## Estado actual

Sin proyecto React aún. Se inicializa en Fase 1; componentes base en Fase 5.
