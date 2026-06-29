# Checklist de Validación — Frontend

> Verificar antes de dar por terminada cualquier tarea de UI. Responsable: subagente `frontend` + `reviewer`.

## Arquitectura
- [ ] La página/componente no consume Supabase directamente (usa un Service). [FE-001]
- [ ] No hay lógica de negocio dentro del JSX. [FE-003]
- [ ] Validaciones con Zod, no manuales. [FE-002]
- [ ] Formularios con React Hook Form + Zod. [FE-006]

## Calidad
- [ ] TypeScript strict, sin `any` injustificado.
- [ ] ESLint sin errores ni warnings.
- [ ] Componente ≤ ~300 líneas. [FE-004]
- [ ] Sin estilos inline; solo TailwindCSS. [FE-005]
- [ ] Sin `console.log`, imports/variables sin usar, ni código muerto.

## UX / Estados
- [ ] Estados Loading / Empty / Error / Success implementados. [FE-010]
- [ ] Errores mostrados por Toast; la app no se rompe. [FE-009]
- [ ] Botones con loading y anti-doble-click. [FE-008]
- [ ] Listados con búsqueda, filtros, paginación y ordenamiento. [FE-007]

## Responsive / Accesibilidad
- [ ] Mobile First verificado (móvil, tablet, escritorio).
- [ ] Operable por teclado; no depende solo de mouse/gestos. [RNF-005]
- [ ] Respuesta visual inmediata a cada acción. [RNF-011]

## Permisos
- [ ] La UI respeta permisos del rol (y el Backend los valida igualmente).
