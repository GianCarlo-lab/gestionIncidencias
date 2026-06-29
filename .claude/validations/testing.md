# Checklist de Validación — Testing

> Verificar antes de marcar una funcionalidad como terminada. Responsable: `qa` + `reviewer`.

## Tipos de prueba (SDD secc. 18)
- [ ] Unitarias (Vitest): generación de código, validaciones, transiciones de estado.
- [ ] Integración (Vitest): p.ej. crear ticket + auditoría, asignación + notificación.
- [ ] E2E (Playwright) cuando aplique: login → crear → asignar → resolver → cerrar.

## Criterios de aceptación
- [ ] Cumple los requisitos del SDD.
- [ ] Pruebas unitarias y de integración pasan.
- [ ] Sin errores críticos.
- [ ] Responsive mantenido.
- [ ] Reglas de seguridad respetadas.

## Reglas de testing (TEST-001 a TEST-005)
- [ ] Toda funcionalidad nueva tiene pruebas acordes a su complejidad.
- [ ] Ningún cambio rompe funcionalidades previas (regresión).
- [ ] Errores detectados corregidos antes de cerrar la tarea.
- [ ] Pruebas en entorno aislado de producción.
- [ ] Pruebas documentadas para futuras regresiones.
