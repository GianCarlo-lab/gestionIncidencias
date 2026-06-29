# Contexto: Workflow Engine

> Resumen operativo. Detalle en `docs/SDD-PideServicio.md` (secc. 9, 13). Documento ampliado pendiente en `docs/WROKFLOWS.md` (vacío; nombre con typo, ver decisions.md).

## Flujo de estados

```
Nuevo → Sin Asignar → Asignado → En Proceso → Pendiente de Validación
                                                  ├─ Usuario confirma → Cerrado
                                                  └─ Usuario rechaza → Reabierto → Asignado
```

## Transiciones permitidas (estrictas)

| Estado actual | Pasa a | Actor |
|---|---|---|
| Nuevo | Sin Asignar | Sistema |
| Sin Asignar | Asignado | Administrador |
| Asignado | En Proceso | Trabajador |
| En Proceso | Pendiente de Validación | Trabajador |
| Pendiente de Validación | Cerrado | Usuario |
| Pendiente de Validación | Reabierto | Usuario |
| Reabierto | Asignado | Sistema |

> Ninguna otra transición está permitida. No se saltan estados.

## Reglas (WF-001 a WF-007)

- No cerrar sin haber sido asignado.
- No "En Proceso" sin trabajador asignado.
- Todo ticket finalizado requiere ≥1 evidencia final.
- Todo reabierto requiere comentario del usuario con el motivo.
- Toda transición genera historial + auditoría + Realtime + dashboard.
- Solo Administrador asigna/reasigna.
- Trabajador inactivo/suspendido/vacaciones no recibe nuevas asignaciones, pero conserva su historial.

## Estados visuales (configurables)

Sin Asignar=Gris ⏳ · Asignado=Azul 👤 · En Proceso=Naranja 🔧 · Pendiente de Validación=Amarillo ⌛ · Cerrado=Verde ✅ · Reabierto=Rojo 🔄.
