# Reglas de Código — Pide Servicio

> Derivadas del SDD (secciones 4, 5, 6, 21). De cumplimiento obligatorio.

## Las 10 Reglas de Desarrollo

1. **Pensar antes de codificar.** Responder: ¿qué pide el SDD?, ¿ya existe algo similar?, ¿rompo la arquitectura?, ¿duplico lógica?, ¿qué impacto tiene?, ¿qué docs actualizar? Si algo no está claro → **NO PROGRAMAR**, revisar documentación primero.
2. **Nunca trabajar de memoria.** Revisar `project-status.json`, `current-phase.md`, `pending.md`, `architecture.md` antes de empezar.
3. **No crear archivos innecesarios.** Buscar uno existente antes de crear.
4. **No generar deuda técnica.** Si una solución rápida rompe la arquitectura, está prohibida.
5. **Todo cambio actualiza la memoria** (`completed.md`, `pending.md`, `changelog.md`, `project-status.json`).
6. **Nunca asumir reglas.** Si no se sabe quién puede hacer algo, buscar en `workflows.md`/`permissions.md`. Si no existe, crear `TODO` y tomar la opción más conservadora.
7. **Trabajar por bloques pequeños:** Crear → Validar → Continuar.
8. **Auto-auditoría al terminar cada tarea:** Compila · ESLint · TypeScript · Responsive · Mobile · Accesibilidad · Permisos · RLS · Testing · Documentación.
9. **Nunca modificar código sin entenderlo** (imports, dependencias, servicios, hooks, contexto).
10. **Todo cambio debe ser reversible** y documentado.

## Frontend (FE)

- FE-001: Página nunca consume Supabase directo → siempre Service.
- FE-002: Validaciones siempre con Zod, nunca manuales.
- FE-003: Sin lógica de negocio en el JSX.
- FE-004: Componentes pequeños, máx. ~300 líneas.
- FE-005: Sin estilos inline; solo TailwindCSS.
- FE-006: Formularios con React Hook Form + Zod.
- FE-007: Listados con búsqueda, filtros, paginación y ordenamiento.
- FE-008: Botones con estado de carga; nunca doble click.
- FE-009: Errores vía Toast (Sonner); nunca romper la app.
- FE-010: Toda pantalla con estados Loading / Empty / Error / Success.

## Backend (BE)

- BE-001: Nunca modificar datos directo desde React.
- BE-002: Todo cambio importante auditado.
- BE-003: Toda asignación valida permisos.
- BE-004: Eliminación lógica, nunca `DELETE` físico.
- BE-005: Cambios de estado validan el workflow; no saltar estados.
- BE-006: Cargas de archivos validan MIME, tamaño, extensión e integridad.
- BE-007: Correos por cola; el usuario nunca espera el envío.
- BE-008: Auditar usuario, fecha, hora, IP, dispositivo, acción, valor anterior y nuevo.

## Reglas para generar código

- Nunca crear archivos innecesarios ni duplicar lógica.
- Nunca usar `any` sin justificación.
- Nunca mezclar lógica de negocio con componentes visuales.
- Nunca acceder a Supabase desde componentes UI.

## Calidad (RNF-010)

No se fusiona código que incumpla: TypeScript strict, ESLint sin errores, sin `any`.
