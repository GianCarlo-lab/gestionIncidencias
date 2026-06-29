# Contexto: Roles y Permisos

> Resumen operativo. Detalle en `docs/SDD-PideServicio.md` (secc. 10, 16). Documento ampliado pendiente en `docs/PERMISSIONS.md` (vacío).

## Jerarquía

SuperAdministrador → Administrador → Trabajador → Usuario.

## Matriz de permisos (resumen)

| Acción | Usuario | Trabajador | Admin | SuperAdmin |
|---|:--:|:--:|:--:|:--:|
| Crear ticket | ✅ | ❌ | ✅ | ✅ |
| Ver todos los tickets | ❌ | ❌ | ✅ | ✅ |
| Asignar / reasignar | ❌ | ❌ | ✅ | ✅ |
| Cambiar estado | ❌ | ✅ | ❌ | ❌ |
| Validar solución | ✅ | ❌ | ❌ | ❌ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |
| Gestionar catálogos | ❌ | ❌ | Según permisos | ✅ |
| Ver auditoría | ❌ | ❌ | ✅ | ✅ |

## Estado laboral (Trabajador / Admin)

| Estado | Inicia sesión | Recibe asignaciones |
|---|:--:|:--:|
| Activo | ✅ | ✅ |
| Vacaciones | ✅ | ❌ |
| Licencia | ✅ | ❌ |
| Suspendido | ❌ | ❌ |
| Retirado | ❌ | ❌ |

## Reglas de seguridad

- Todo permiso se valida en Backend (no solo en Frontend); ocultar un botón no da seguridad.
- Acceso por URL directa también se protege (no basta ocultar el menú).
- RLS por rol: Usuario→sus tickets, Trabajador→asignados, Admin→sus sucursales, SuperAdmin→todo.
- Acciones denegadas se registran en auditoría cuando corresponde.

## Política de contraseñas (inicial)

Mín. 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial.
