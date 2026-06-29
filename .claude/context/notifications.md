# Contexto: Notificaciones

> Resumen operativo. Detalle en `docs/SDD-PideServicio.md` (secc. 11).

## Canales

- **Internas**: dentro de la app, persistentes hasta marcarse como leídas; aparecen sin recargar (Supabase Realtime).
- **Correo**: solo eventos importantes del flujo principal, enviados por cola.

## Eventos y destinatarios

| Evento | Destinatarios | Interna | Correo |
|---|---|:--:|:--:|
| Ticket creado | Administradores | ✅ | ✅ |
| Trabajador asignado | Trabajador | ✅ | ✅ |
| Cambio de estado | — | ✅ | ❌ |
| Trabajador finaliza | Usuario + Admin | ✅ | ✅ |
| Usuario confirma | Admin + Trabajador | ✅ | ✅ |
| Usuario rechaza | Admin + Trabajador | ✅ | ✅ |
| Comentario público | Participantes | ✅ | ❌ |
| Comentario interno | Admin + Trabajador | ✅ | ❌ |
| Reasignación | Trabajador anterior + nuevo + Admin | ✅ | ✅ |

## Reglas (NT-001 a NT-005)

- No enviar correos innecesarios.
- Notificación ligada a un ticket cuando corresponde.
- Si falla el correo, el proceso principal no falla (queda en cola para reintento).
- Internas en tiempo real (Realtime).
- Toda notificación queda registrada para auditoría.
