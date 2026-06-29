# SDD — Pide Servicio
> Documento de Diseño del Sistema · Versión 1.0

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Arquitectura General](#2-arquitectura-general)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Principios de Arquitectura](#4-principios-de-arquitectura)
5. [Arquitectura Frontend](#5-arquitectura-frontend)
6. [Arquitectura Backend](#6-arquitectura-backend)
7. [Base de Datos](#7-base-de-datos)
8. [Contrato Frontend / Backend](#8-contrato-frontend--backend)
9. [Workflow Engine](#9-workflow-engine)
10. [Roles y Permisos](#10-roles-y-permisos)
11. [Sistema de Notificaciones](#11-sistema-de-notificaciones)
12. [Dashboard y Analítica](#12-dashboard-y-analítica)
13. [Gestión de Tickets](#13-gestión-de-tickets)
14. [Gestión de Usuarios](#14-gestión-de-usuarios)
15. [Configuración del Sistema](#15-configuración-del-sistema)
16. [Seguridad](#16-seguridad)
17. [Requisitos No Funcionales](#17-requisitos-no-funcionales)
18. [Estrategia de Pruebas](#18-estrategia-de-pruebas)
19. [Infraestructura y Despliegue](#19-infraestructura-y-despliegue)
20. [Product Backlog v1.0](#20-product-backlog-v10)
21. [Plan Maestro de Desarrollo](#21-plan-maestro-de-desarrollo)
22. [Memoria Persistente del Proyecto](#22-memoria-persistente-del-proyecto)
23. [Subagentes Especializados](#23-subagentes-especializados)
24. [Skill: Git Guardian + Release Reviewer + Recovery Manager](#24-skill-git-guardian--release-reviewer--recovery-manager)

---

## 1. Introducción

### 1.1 Propósito

Este documento define la arquitectura, estructura, funcionamiento y reglas técnicas del sistema **Pide Servicio**, permitiendo que cualquier desarrollador o agente de IA (Claude Code) pueda implementar el proyecto respetando la arquitectura diseñada, las reglas de negocio y los estándares de calidad definidos.

Este documento es la fuente oficial para el desarrollo del sistema.

### 1.2 Descripción del Sistema

Pide Servicio es una aplicación web **Mobile First (PWA)** diseñada para centralizar el registro, asignación, seguimiento y resolución de incidencias, solicitudes y riesgos dentro de una empresa con múltiples sucursales.

El sistema reemplaza el proceso actual basado en correos electrónicos por un flujo digital, trazable y auditable.

**Objetivos principales:**

- Facilitar el registro de casos.
- Reducir tiempos de atención.
- Centralizar toda la información.
- Dar seguimiento en tiempo real.
- Mejorar la comunicación entre usuarios, administradores y trabajadores.
- Obtener indicadores de gestión mediante dashboards.

### 1.3 Objetivos Técnicos

El sistema deberá ser:

- Rápido
- Escalable
- Seguro
- Completamente responsive
- Priorizar la experiencia móvil
- Mantener una arquitectura modular y fácilmente mantenible
- Permitir agregar nuevos módulos sin modificar la arquitectura principal

---

## 2. Arquitectura General

### Diagrama de Componentes

```
┌──────────────────────┐
│      Navegador       │
│     PWA / Web App    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      React App       │
│  (Frontend)          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Supabase        │
│                      │
│ Authentication       │
│ PostgreSQL           │
│ Storage              │
│ Realtime             │
│ Edge Functions       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Correo Electrónico   │
│ Notificaciones       │
└──────────────────────┘
```

### Arquitectura por Capas

| Capa | Responsabilidad | Tecnologías |
|---|---|---|
| Presentación | Interfaz del usuario | React, TypeScript, Vite, TailwindCSS, Shadcn UI |
| Lógica de Negocio | Validaciones, Workflow, Estados, Permisos | Servicios, Hooks, Utilidades |
| Acceso a Datos | Comunicación con Supabase | Capa de servicios (`src/services/`) |
| Persistencia | Almacenamiento | Supabase PostgreSQL |
| Integraciones | Servicios externos | Correo, Storage, Auth, Realtime |

> **Regla:** Los componentes React nunca consumirán Supabase directamente. Siempre deberá existir una capa de servicios.

---

## 3. Stack Tecnológico

### Frontend

| Tecnología | Motivo |
|---|---|
| React 19 | Framework principal, componentes reutilizables |
| TypeScript | Tipado fuerte |
| Vite | Rapidez de compilación |
| TailwindCSS | Desarrollo rápido de estilos |
| Shadcn UI | Componentes modernos |
| React Router DOM | Navegación |
| TanStack Query | Gestión de datos y caché |
| Zustand | Estado global |
| React Hook Form | Formularios |
| Zod | Validaciones |
| Lucide React | Iconos |
| Framer Motion | Animaciones |
| Sonner | Toasts |
| Recharts | Gráficos |
| Supabase JS | Comunicación con Supabase |

### Backend (Supabase)

```
Supabase
├── PostgreSQL
├── Authentication
├── Storage
├── Realtime
├── Edge Functions
├── Database Functions
├── Database Triggers
├── Row Level Security (RLS)
└── Cron Jobs (si se requieren)
```

> No existirá un backend tradicional (Node.js, Laravel, etc.) en la primera versión.

---

## 4. Principios de Arquitectura

Estas reglas son **obligatorias**.

| Regla | Descripción |
|---|---|
| **Regla 1** | La aplicación será **Mobile First**. |
| **Regla 2** | No existirá lógica de negocio dentro de componentes React. Toda lógica deberá implementarse mediante servicios, hooks o utilidades. |
| **Regla 3** | Todos los cambios importantes deberán generar un registro de auditoría. |
| **Regla 4** | Ningún estado del workflow podrá modificarse directamente desde la base de datos. Todo cambio deberá pasar por la lógica del sistema. |
| **Regla 5** | No se permitirá eliminar registros físicamente. Se utilizará borrado lógico (`deleted_at`). |
| **Regla 6** | Todo catálogo (categorías, tipos, prioridades, etc.) deberá ser configurable por el administrador y nunca estar hardcodeado. |
| **Regla 7** | Todo cambio de estado deberá generar automáticamente: registro en el historial, auditoría, notificación (si aplica) y actualización del dashboard. |

---

## 5. Arquitectura Frontend

### 5.1 Estructura de Carpetas

```
src/
│
├── app/
│   ├── router/
│   ├── providers/
│   ├── layouts/
│   ├── guards/
│   ├── config/
│   └── App.tsx
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── tickets/
│   ├── notifications/
│   ├── users/
│   ├── workers/
│   ├── reports/
│   ├── settings/
│   └── profile/
│
├── shared/
│   ├── components/
│   ├── ui/
│   ├── dialogs/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   ├── cards/
│   ├── skeletons/
│   └── empty-states/
│
├── services/
├── hooks/
├── types/
├── utils/
├── constants/
├── lib/
├── assets/
└── styles/
```

### 5.2 Arquitectura por Feature

Cada módulo será completamente independiente. Ejemplo para `tickets/`:

```
features/tickets/
├── pages/          # Solo páginas (CreateTicketPage, MyTicketsPage, TicketDetailsPage)
├── components/     # Componentes exclusivos (TicketCard, TicketHistory, TicketTimeline...)
├── hooks/          # Hooks propios sin JSX (useCreateTicket, useTicketHistory...)
├── services/       # Comunicación con Supabase (ticket.service.ts)
├── schemas/        # Validaciones Zod (CreateTicketSchema, CommentSchema...)
├── types/          # Interfaces (Ticket, TicketStatus, TicketPriority...)
├── constants/      # Valores fijos (TicketColors, TicketIcons...)
├── utils/          # Funciones auxiliares (formatPriority, calculateSLA...)
└── routes.ts
```

### 5.3 Gestión del Estado

| Herramienta | Uso |
|---|---|
| **Zustand** | Estado global: usuario autenticado, tema, notificaciones, configuración, preferencias |
| **TanStack Query** | Datos del servidor: tickets, usuarios, dashboard, reportes, catálogos |
| **useState** | Estado local: modales, inputs, formularios temporales, elementos visuales |

### 5.4 Flujo Frontend

```
Usuario → Página React → Hook → Service → Supabase → Respuesta → TanStack Query → Actualizar UI
```

### 5.5 Reglas del Frontend

| Regla | Descripción |
|---|---|
| FE-001 | Una página nunca consumirá Supabase directamente. Siempre deberá utilizar un Service. |
| FE-002 | Una página nunca realizará validaciones manuales. Siempre utilizará Zod. |
| FE-003 | Nunca existirá lógica de negocio dentro del JSX. |
| FE-004 | Los componentes deberán ser pequeños. Máximo recomendado: 300 líneas. |
| FE-005 | No se utilizarán estilos inline. Todo deberá implementarse mediante TailwindCSS. |
| FE-006 | Todos los formularios utilizarán React Hook Form + Zod. |
| FE-007 | Todos los listados deberán soportar búsqueda, filtros, paginación y ordenamiento. |
| FE-008 | Todos los botones deberán mostrar estado de carga y nunca poder presionarse dos veces. |
| FE-009 | Todo error deberá mostrarse mediante Toast y nunca romper la aplicación. |
| FE-010 | Toda pantalla deberá tener estado de Loading, Empty State, Error State y Success State. |

---

## 6. Arquitectura Backend

### 6.1 Flujo General

```
Frontend → Service → Edge Function → Business Rules → Database Function → PostgreSQL
                                                                          ↓
                                                        Realtime + Auditoría + Notificaciones
```

### 6.2 Edge Functions Principales

| Función | Responsabilidad |
|---|---|
| `send-ticket-created` | Correo a responsables, notificación interna, auditoría, evento |
| `send-worker-assigned` | Correo al trabajador, notificación, historial |
| `send-ticket-finished` | Correo al administrador, notificación, historial |
| `send-ticket-validated` | Cerrar caso, auditoría, correo final |
| `upload-evidence` | Validar y subir archivos, registrar evidencia |
| `create-audit` | Registrar cualquier cambio importante |

### 6.3 Database Functions (PostgreSQL)

```sql
create_ticket()
assign_worker()
change_status()
close_ticket()
reopen_ticket()
get_dashboard()
get_ticket_history()
validate_ticket()
create_notification()
generate_ticket_code()
```

### 6.4 Supabase Storage — Buckets

| Bucket | Uso |
|---|---|
| `tickets-evidence` | Evidencias de tickets (inicial y final) |
| `avatars` | Fotografías de perfil |
| `system-assets` | Logos, recursos del sistema |
| `email-images` | Imágenes para plantillas de correo |

### 6.5 Reglas del Backend

| Regla | Descripción |
|---|---|
| BE-001 | Nunca modificar datos directamente desde React. |
| BE-002 | Todo cambio importante deberá quedar auditado. |
| BE-003 | Toda asignación deberá validar permisos. |
| BE-004 | Toda eliminación será lógica. Nunca `DELETE` físico. |
| BE-005 | Todo cambio de estado deberá validar el workflow. No se podrá saltar estados. |
| BE-006 | Toda carga de archivos deberá validar tipo MIME, tamaño máximo, extensión e integridad. |
| BE-007 | Todo correo deberá enviarse mediante una cola. El usuario nunca esperará el envío. |
| BE-008 | Toda acción importante deberá registrar: usuario, fecha, hora, IP, dispositivo, acción, valor anterior, valor nuevo. |

---

## 7. Base de Datos

### 7.1 Principios Obligatorios

- Base de datos normalizada (3FN como mínimo).
- Claves primarias `UUID`.
- Relaciones mediante claves foráneas.
- Índices en todas las columnas utilizadas para búsqueda.
- Auditoría completa de operaciones críticas.
- Borrado lógico (`deleted_at`) cuando aplique.
- Timestamps automáticos (`created_at`, `updated_at`).

### 7.2 Convención Estándar de Tablas

Todas las tablas deberán incluir:

```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
created_by UUID REFERENCES users(id)
updated_by UUID REFERENCES users(id)
deleted_at TIMESTAMP WITH TIME ZONE NULL
```

### 7.3 Tablas Principales

#### `users`
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| auth_user_id | UUID | Referencia a auth.users de Supabase |
| nombre | TEXT | Nombre del usuario |
| apellido | TEXT | Apellido del usuario |
| correo | TEXT UNIQUE | Correo electrónico |
| usuario | TEXT UNIQUE | Nombre de usuario |
| telefono | TEXT | Teléfono de contacto |
| rol_id | UUID | Referencia a roles |
| sucursal_id | UUID | Referencia a sucursales |
| area_id | UUID | Referencia a áreas |
| estado_laboral | ENUM | Activo, Vacaciones, Licencia, Suspendido, Retirado |
| activo | BOOLEAN | Estado de la cuenta |
| ultimo_acceso | TIMESTAMP | Último inicio de sesión |
| foto | TEXT | URL de la fotografía de perfil |

#### `tickets`
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| codigo | TEXT UNIQUE | Formato PS-000001 |
| titulo | TEXT | Título del caso |
| descripcion | TEXT | Descripción detallada |
| tipo_id | UUID | Referencia a ticket_types |
| categoria_id | UUID | Referencia a ticket_categories |
| prioridad_usuario | UUID | Prioridad asignada por el usuario |
| prioridad_admin | UUID | Prioridad ajustada por administrador |
| estado_id | UUID | Referencia a ticket_status |
| usuario_id | UUID | Usuario que creó el ticket |
| trabajador_id | UUID | Trabajador asignado |
| sucursal_id | UUID | Sucursal del ticket |
| area_id | UUID | Área del ticket |
| ubicacion | TEXT | Ubicación específica |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_asignacion | TIMESTAMP | Fecha de asignación |
| fecha_inicio | TIMESTAMP | Fecha de inicio de atención |
| fecha_finalizacion | TIMESTAMP | Fecha de finalización |
| fecha_validacion | TIMESTAMP | Fecha de validación del usuario |
| fecha_cierre | TIMESTAMP | Fecha de cierre definitivo |
| requiere_validacion | BOOLEAN | Si requiere confirmación del usuario |
| tiempo_estimado | INTEGER | Tiempo estimado en minutos |
| tiempo_real | INTEGER | Tiempo real empleado |

#### `ticket_comments`
```sql
id          UUID PRIMARY KEY
ticket_id   UUID REFERENCES tickets(id)
usuario_id  UUID REFERENCES users(id)
comentario  TEXT
es_interno  BOOLEAN  -- Si true, solo visible para Admins y Trabajadores
created_at  TIMESTAMP
```

#### `ticket_history`
Almacena absolutamente todos los eventos de un ticket. Nunca se eliminará información.

#### `ticket_evidence`
```sql
id         UUID PRIMARY KEY
ticket_id  UUID REFERENCES tickets(id)
usuario_id UUID REFERENCES users(id)
tipo       ENUM('inicial', 'final')
archivo    TEXT  -- URL en Storage
mime       TEXT
peso       INTEGER  -- Tamaño en bytes
created_at TIMESTAMP
```

#### `ticket_assignments`
Historial completo de todas las asignaciones realizadas.

#### `notifications`
```sql
id         UUID PRIMARY KEY
usuario_id UUID REFERENCES users(id)
titulo     TEXT
mensaje    TEXT
tipo       TEXT
leido      BOOLEAN DEFAULT false
url        TEXT  -- Enlace al recurso relacionado
created_at TIMESTAMP
```

#### `audit_logs`
Tabla inmutable. Registra todo.
```sql
id             UUID PRIMARY KEY
usuario_id     UUID
accion         TEXT
tabla          TEXT
registro_id    UUID
valor_anterior JSONB
valor_nuevo    JSONB
ip             INET
dispositivo    TEXT
created_at     TIMESTAMP
```

### 7.4 Catálogos (Configurables)

- `ticket_types` — Tipos de ticket
- `ticket_categories` — Categorías
- `ticket_status` — Estados
- `priorities` — Prioridades
- `worker_status` — Estados laborales
- `notification_types` — Tipos de notificación

### 7.5 Índices Obligatorios

Se crearán índices para: `codigo`, `estado`, `trabajador`, `usuario`, `sucursal`, `categoria`, `prioridad`, `fecha`, `tipo`.

---

## 8. Contrato Frontend / Backend

### 8.1 Flujo General

```
React → Service → Edge Function → Business Rules → Database Function → PostgreSQL → Realtime + Auditoría + Notificaciones
```

### 8.2 Respuestas Estándar

**Éxito:**
```json
{
  "success": true,
  "message": "Operación realizada correctamente.",
  "data": {}
}
```

**Error de validación:**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "La evidencia es obligatoria.",
  "errors": []
}
```

**Error de permisos:**
```json
{
  "success": false,
  "code": "FORBIDDEN",
  "message": "No tiene permisos para realizar esta acción."
}
```

**Error interno:**
```json
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "Ha ocurrido un error interno."
}
```

### 8.3 Operaciones Críticas

#### Crear Ticket
**Frontend envía:**
```json
{
  "tipo_id": "...",
  "categoria_id": "...",
  "titulo": "...",
  "descripcion": "...",
  "prioridad": "...",
  "ubicacion": "...",
  "evidencias": []
}
```

**Backend ejecuta automáticamente:**
1. Crear ticket
2. Generar código `PS-000001`
3. Crear historial
4. Crear auditoría
5. Crear notificaciones
6. Enviar correo a Administradores
7. Actualizar dashboard
8. Emitir evento Realtime

#### Asignar Trabajador
**Frontend envía:**
```json
{
  "ticketId": "...",
  "workerId": "..."
}
```

**Backend valida:** existencia del ticket, que no esté cerrado, trabajador activo y disponible, permisos del administrador.

---

## 9. Workflow Engine

### 9.1 Flujo Principal

```
                    NUEVO
                      │
                      ▼
                 SIN ASIGNAR
                      │
          (Administrador asigna)
                      │
                      ▼
                  ASIGNADO
                      │
        (Trabajador inicia atención)
                      │
                      ▼
                 EN PROCESO
                      │
      (Trabajador termina reparación)
                      │
                      ▼
        PENDIENTE DE VALIDACIÓN
                      │
          ┌───────────┴────────────┐
          │                        │
 Usuario confirma          Usuario rechaza
          │                        │
          ▼                        ▼
     CERRADO                 REABIERTO
                                  │
                                  ▼
                             ASIGNADO
```

### 9.2 Transiciones Permitidas

| Estado Actual | Puede pasar a | Actor |
|---|---|---|
| Nuevo | Sin Asignar | Sistema |
| Sin Asignar | Asignado | Administrador |
| Asignado | En Proceso | Trabajador |
| En Proceso | Pendiente de Validación | Trabajador |
| Pendiente de Validación | Cerrado | Usuario |
| Pendiente de Validación | Reabierto | Usuario |
| Reabierto | Asignado | Sistema |

> No se permitirá ninguna otra transición.

### 9.3 Reglas del Workflow

| Regla | Descripción |
|---|---|
| WF-001 | Un ticket nunca podrá cerrarse sin haber sido asignado. |
| WF-002 | No podrá existir un ticket en proceso sin trabajador asignado. |
| WF-003 | Todo ticket finalizado deberá tener al menos una evidencia final. |
| WF-004 | Todo ticket reabierto deberá contener un comentario del usuario indicando el motivo. |
| WF-005 | Toda transición generará automáticamente: historial, auditoría, evento Realtime y actualización del dashboard. |
| WF-006 | Solo un Administrador podrá asignar o reasignar trabajadores. |
| WF-007 | Si un trabajador es desactivado, suspendido o en Vacaciones, no podrá recibir nuevas asignaciones, pero conservará el historial de los casos que ya atendió. |

---

## 10. Roles y Permisos

### 10.1 Jerarquía

```
SuperAdministrador → Administrador → Trabajador → Usuario
```

### 10.2 Matriz de Permisos

| Acción | Usuario | Trabajador | Administrador | SuperAdministrador |
|---|:---:|:---:|:---:|:---:|
| Iniciar sesión | ✅ | ✅ | ✅ | ✅ |
| Crear ticket | ✅ | ❌ | ✅ | ✅ |
| Ver mis tickets | ✅ | ✅ | ✅ | ✅ |
| Ver todos los tickets | ❌ | ❌ | ✅ | ✅ |
| Asignar trabajador | ❌ | ❌ | ✅ | ✅ |
| Reasignar trabajador | ❌ | ❌ | ✅ | ✅ |
| Cambiar estado | ❌ | ✅ | ❌ | ❌ |
| Validar solución | ✅ | ❌ | ❌ | ❌ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |
| Gestionar catálogos | ❌ | ❌ | Según permisos | ✅ |
| Ver auditoría | ❌ | ❌ | ✅ | ✅ |

### 10.3 Estado Laboral (Trabajadores y Administradores)

| Estado | Puede iniciar sesión | Puede recibir asignaciones |
|---|:---:|:---:|
| Activo | ✅ | ✅ |
| Vacaciones | ✅ | ❌ |
| Licencia | ✅ | ❌ |
| Suspendido | ❌ | ❌ |
| Retirado | ❌ | ❌ |

### 10.4 Reglas de Seguridad

| Regla | Descripción |
|---|---|
| SEC-001 | Todo permiso será validado en el Backend. Nunca únicamente en el Frontend. |
| SEC-002 | Ocultar un botón en la interfaz no otorga seguridad. El Backend siempre deberá validar. |
| SEC-003 | Toda acción denegada deberá registrarse en la auditoría si corresponde. |
| SEC-004 | Ningún usuario podrá acceder mediante URL directa a un módulo para el cual no tiene permisos. |

---

## 11. Sistema de Notificaciones

### 11.1 Canales

- **Notificaciones Internas** — Dentro de la aplicación, persistentes hasta que el usuario las marque como leídas.
- **Correo Electrónico** — Solo para eventos importantes del flujo principal.

### 11.2 Eventos que Generan Notificaciones

| Evento | Destinatarios | Interna | Correo |
|---|---|:---:|:---:|
| Ticket creado | Administradores | ✅ | ✅ |
| Trabajador asignado | Trabajador | ✅ | ✅ |
| Cambio de estado | — | ✅ | ❌ |
| Trabajador finaliza | Usuario + Admin | ✅ | ✅ |
| Usuario confirma solución | Admin + Trabajador | ✅ | ✅ |
| Usuario rechaza solución | Admin + Trabajador | ✅ | ✅ |
| Comentario público | Todos los participantes | ✅ | ❌ |
| Comentario interno | Admin + Trabajador | ✅ | ❌ |
| Reasignación | Trabajador anterior + nuevo + Admin | ✅ | ✅ |

### 11.3 Reglas

| Regla | Descripción |
|---|---|
| NT-001 | No enviar correos innecesarios. Solo eventos importantes. |
| NT-002 | Toda notificación deberá estar relacionada con un ticket cuando corresponda. |
| NT-003 | Si falla el envío de un correo, el proceso principal no deberá fallar. El correo quedará en cola para reintento. |
| NT-004 | Las notificaciones internas deberán aparecer sin necesidad de recargar la página (Supabase Realtime). |
| NT-005 | Toda notificación enviada deberá quedar registrada para fines de auditoría. |

---

## 12. Dashboard y Analítica

### 12.1 Dashboard por Rol

| Dashboard | Rol | Contenido Principal |
|---|---|---|
| Usuario | Usuario | Sus propios tickets, gráfico dona, actividad reciente, acceso rápido a crear ticket |
| Trabajador | Trabajador | Casos asignados, distribución por estado, lista priorizada, últimos comentarios |
| Administrador | Administrador / SuperAdmin | KPIs globales, todos los gráficos, filtros por sucursal/área/fecha |

### 12.2 Gráficos del Dashboard Administrador

1. Tickets por Estado (Dona)
2. Tickets por Categoría (Barras)
3. Tickets por Prioridad (Barras)
4. Tickets por Sucursal
5. Rendimiento de Trabajadores
6. Tendencia Mensual (Línea)
7. Tickets sin Responsable (Alerta visible)

### 12.3 Reglas del Dashboard

| Regla | Descripción |
|---|---|
| DASH-001 | Todo KPI deberá ser consistente con la base de datos. |
| DASH-002 | Al hacer clic en un indicador o gráfico, se abrirá la vista correspondiente con filtros aplicados automáticamente. |
| DASH-003 | Los dashboards respetarán los permisos del usuario. |
| DASH-004 | Los gráficos deberán mantener diseño consistente en móvil, tablet y escritorio. |

---

## 13. Gestión de Tickets

### 13.1 Tipos de Ticket (Configurables)
- Incidencia
- Solicitud
- Riesgo
- Otro

### 13.2 Ciclo de Vida Completo

```
Usuario crea Ticket → Edge Function: create-ticket → Validaciones → Guardar Ticket
→ Crear Historial / Crear Auditoría / Crear Notificaciones / Enviar Correos / Actualizar Dashboard
→ Administrador asigna Trabajador → Trabajador atiende → Sube Evidencia Final
→ Pendiente de Validación → Usuario confirma → Cerrar / Usuario rechaza → Reabrir
```

### 13.3 Reglas

| Regla | Descripción |
|---|---|
| TKT-001 | Todo ticket deberá tener un código único (formato `PS-000001`). |
| TKT-002 | Todo ticket deberá conservar su historial completo. |
| TKT-003 | Ninguna evidencia podrá eliminarse físicamente. |
| TKT-004 | Toda modificación importante deberá registrarse en auditoría. |
| TKT-005 | Toda operación deberá respetar los permisos del usuario autenticado. |

### 13.4 Estados Visuales

| Estado | Color | Icono |
|---|---|---|
| Sin Asignar | Gris | ⏳ |
| Asignado | Azul | 👤 |
| En Proceso | Naranja | 🔧 |
| Pendiente de Validación | Amarillo | ⌛ |
| Cerrado | Verde | ✅ |
| Reabierto | Rojo | 🔄 |

> Los colores e iconos podrán modificarse desde configuración.

---

## 14. Gestión de Usuarios

### 14.1 Reglas de Negocio

| Regla | Descripción |
|---|---|
| USR-001 | No podrán existir dos usuarios con el mismo correo electrónico. |
| USR-002 | No podrán existir dos usuarios con el mismo nombre de usuario. |
| USR-003 | Todo usuario deberá pertenecer al menos a una sucursal. |
| USR-004 | Todo usuario deberá tener un rol asignado. |
| USR-005 | La desactivación de un usuario nunca eliminará su historial. |
| USR-006 | Un trabajador no podrá recibir nuevas asignaciones si su estado laboral no es Activo. |
| USR-007 | Toda modificación realizada por un Administrador o SuperAdministrador deberá quedar registrada en la auditoría. |

### 14.2 Inicio de Sesión — Validaciones

1. Usuario existente
2. Contraseña correcta
3. Usuario activo
4. Estado laboral permitido
5. Rol activo

**Acciones automáticas al iniciar sesión:** registrar último acceso, IP, dispositivo/navegador, crear registro en auditoría.

---

## 15. Configuración del Sistema

### 15.1 Módulos Configurables

- Información general (nombre, logo, colores institucionales)
- Sucursales
- Áreas
- Categorías de tickets
- Tipos de ticket
- Prioridades
- Estados (apariencia visual únicamente)
- Plantillas de correo con variables dinámicas (`{{ticket_codigo}}`, `{{usuario}}`, etc.)
- Parámetros generales (tamaño máximo de archivos, tiempo de sesión, paginación, etc.)
- Configuración de notificaciones por evento

### 15.2 Reglas

| Regla | Descripción |
|---|---|
| CFG-001 | Ninguna configuración crítica podrá eliminarse físicamente. |
| CFG-002 | Toda modificación deberá registrarse en auditoría. |
| CFG-003 | Las configuraciones deberán validarse antes de guardarse. |
| CFG-004 | El sistema utilizará siempre la configuración almacenada en la base de datos, evitando valores fijos en el código. |
| CFG-005 | Los cambios de configuración no deberán afectar la estabilidad del sistema ni interrumpir las sesiones activas, salvo cuando sea estrictamente necesario. |

---

## 16. Seguridad

### 16.1 Autenticación

- Supabase Auth como proveedor.
- JWT para autenticación de sesiones.
- Contraseñas nunca almacenadas en tablas propias.
- Recuperación de contraseña mediante enlaces temporales.

### 16.2 Row Level Security (RLS)

| Rol | Alcance |
|---|---|
| Usuario | Solo sus propios tickets |
| Trabajador | Solo tickets asignados |
| Administrador | Solo sucursales bajo su responsabilidad |
| SuperAdministrador | Acceso completo |

### 16.3 Política de Contraseñas (Inicial)

- Longitud mínima: 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial

### 16.4 Reglas de Seguridad

| Regla | Descripción |
|---|---|
| SEC-001 | Toda operación deberá requerir un usuario autenticado, salvo login y recuperación de contraseña. |
| SEC-002 | Ningún permiso deberá validarse únicamente en el Frontend. |
| SEC-003 | Todas las tablas sensibles deberán utilizar Row Level Security. |
| SEC-004 | Toda acción administrativa deberá quedar registrada en la auditoría. |
| SEC-005 | Los archivos subidos por los usuarios deberán validarse antes de almacenarse. |
| SEC-006 | Las credenciales y claves del sistema nunca deberán almacenarse en el repositorio ni exponerse al cliente. |
| SEC-007 | Las variables sensibles deberán gestionarse mediante variables de entorno seguras. |

---

## 17. Requisitos No Funcionales

| Código | Categoría | Requisito |
|---|---|---|
| RNF-001 | Rendimiento | Prohibido recuperar todos los registros cuando solo se necesita una parte. |
| RNF-002 | Escalabilidad | El crecimiento en tickets no deberá afectar significativamente el tiempo de respuesta. |
| RNF-003 | Disponibilidad | Las operaciones críticas deberán manejar fallos parciales de manera controlada. |
| RNF-004 | Usabilidad | La creación de un ticket deberá completarse en la menor cantidad de pasos posible. |
| RNF-005 | Accesibilidad | Ninguna funcionalidad crítica deberá depender exclusivamente del mouse o gestos táctiles. |
| RNF-006 | Compatibilidad | Diseño responsive Mobile First. Compatibilidad con Chrome, Edge, Firefox y Safari. |
| RNF-007 | Mantenibilidad | Toda funcionalidad nueva deberá integrarse respetando la arquitectura definida en este SDD. |
| RNF-008 | Observabilidad | Los logs deberán ser claros, consistentes y sin información sensible. |
| RNF-009 | Seguridad | Toda funcionalidad implementada deberá respetar las políticas de seguridad definidas. |
| RNF-010 | Calidad del Código | No se permitirá fusionar código que incumpla las reglas de calidad (TypeScript strict, ESLint sin errores, sin `any`). |
| RNF-011 | UX | Toda acción deberá proporcionar respuesta visual inmediata. |
| RNF-012 | Internacionalización | Todos los textos visibles deberán centralizarse para facilitar una futura i18n. |
| RNF-013 | Evolución | Las futuras integraciones deberán desarrollarse como módulos independientes. |

**Objetivos de rendimiento:**

- Inicio de sesión: < 2 segundos
- Carga del Dashboard: < 3 segundos
- Apertura de detalle de ticket: < 2 segundos
- Búsquedas: < 1 segundo

---

## 18. Estrategia de Pruebas

### 18.1 Tipos de Pruebas

| Tipo | Herramienta | Ejemplos |
|---|---|---|
| Unitarias | Vitest | Generación de código, validaciones, transiciones de estado |
| Integración | Vitest | Creación de ticket + auditoría, asignación + notificación |
| End-to-End | Playwright | Flujo completo login → crear ticket → asignar → resolver → cerrar |

### 18.2 Criterios de Aceptación

Una funcionalidad se considera **finalizada** cuando:

- ✅ Cumple con los requisitos del SDD
- ✅ Pasa las pruebas unitarias
- ✅ Pasa las pruebas de integración
- ✅ No presenta errores críticos
- ✅ Mantiene la compatibilidad responsive
- ✅ Respeta las reglas de seguridad

### 18.3 Reglas de Testing

| Regla | Descripción |
|---|---|
| TEST-001 | Toda funcionalidad nueva deberá contar con pruebas acordes a su complejidad. |
| TEST-002 | Ningún cambio podrá romper funcionalidades previamente implementadas. |
| TEST-003 | Los errores detectados deberán corregirse antes de considerar completada una funcionalidad. |
| TEST-004 | Las pruebas deberán ejecutarse en un entorno aislado del ambiente de producción. |
| TEST-005 | Las pruebas deberán documentarse para facilitar futuras regresiones. |

---

## 19. Infraestructura y Despliegue

### 19.1 Entornos

| Entorno | Propósito |
|---|---|
| Development | Uso exclusivo para desarrolladores. Datos de prueba, logs detallados, hot reload. |
| Staging | Validar funcionalidades antes de producción. Base de datos independiente. |
| Production | Usuarios finales. Alta estabilidad, variables de entorno protegidas, monitoreo activo. |

### 19.2 Variables de Entorno Requeridas

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
APP_ENV=
APP_URL=
```

> Las variables **nunca** deberán almacenarse en el repositorio.

### 19.3 Gestión de Versiones (Git)

| Rama | Propósito |
|---|---|
| `main` | Producción |
| `develop` | Desarrollo |
| `feature/*` | Nuevas funcionalidades |
| `fix/*` | Correcciones |
| `hotfix/*` | Correcciones urgentes en Producción |

### 19.4 Proceso de Despliegue

```
Desarrollo → Revisión de código → Pruebas automatizadas → Despliegue a Staging → Validación funcional → Despliegue a Producción
```

> No se permitirá desplegar directamente desde ramas de desarrollo a Producción.

### 19.5 Reglas de Infraestructura

| Regla | Descripción |
|---|---|
| INF-001 | Ningún dato sensible deberá almacenarse en el repositorio. |
| INF-002 | Todas las migraciones deberán estar versionadas. |
| INF-003 | Las configuraciones de cada entorno deberán mantenerse separadas. |
| INF-004 | Los despliegues deberán ser repetibles y consistentes. |
| INF-005 | Toda la infraestructura deberá estar documentada. |

---

## 20. Product Backlog v1.0

### EPIC 1 — Autenticación
- HU-001: Iniciar sesión (correo/usuario, validaciones, recordar sesión, cierre de sesión)
- HU-002: Recuperar contraseña (solicitud, correo, cambio, confirmación)
- HU-003: Perfil (ver información, cambiar contraseña, foto, teléfono)

### EPIC 2 — Dashboard
- HU-004: Dashboard Usuario
- HU-005: Dashboard Administrador
- HU-006: Dashboard Trabajador

### EPIC 3 — Tickets
- HU-007: Crear Ticket (formulario, evidencias, validaciones, correo, auditoría)
- HU-008: Ver Ticket (información, timeline, comentarios, evidencias, historial)
- HU-009: Buscar Tickets (filtros, ordenamiento, paginación, responsive)
- HU-010: Comentarios (públicos, internos, adjuntos)
- HU-011: Evidencias (subir, ver, descargar)

### EPIC 4 — Gestión de Tickets
- HU-012: Asignar Ticket
- HU-013: Reasignar Ticket
- HU-014: Cambiar Estado
- HU-015: Validar Solución

### EPIC 5 — Usuarios
- HU-016: Crear Usuario
- HU-017: Editar Usuario
- HU-018: Desactivar Usuario
- HU-019: Estados Laborales
- HU-020: Gestión de Roles

### EPIC 6 — Configuración
- HU-021: Sucursales
- HU-022: Áreas
- HU-023: Categorías
- HU-024: Prioridades
- HU-025: Tipos de Ticket
- HU-026: Plantillas de Correo
- HU-027: Configuración General

### EPIC 7 — Notificaciones
- HU-028: Notificaciones Internas
- HU-029: Correos Automáticos
- HU-030: Tiempo Real

### EPIC 8 — Auditoría
- HU-031: Historial General
- HU-032: Historial por Ticket
- HU-033: Historial por Usuario

### EPIC 9 — Reportes
- HU-034: Dashboard Ejecutivo
- HU-035: Exportar Información
- HU-036: Estadísticas

### EPIC 10 — Administración
- HU-037: Parámetros
- HU-038: Configuración del Sistema
- HU-039: Gestión de Administradores

### Definition of Done (DoD) Global

Una historia solo podrá marcarse como **Completada** cuando:

- ✅ Código implementado
- ✅ Migraciones creadas
- ✅ Políticas RLS definidas
- ✅ Edge Functions funcionando
- ✅ Frontend conectado
- ✅ Correos funcionando
- ✅ Notificaciones funcionando
- ✅ Pruebas pasando
- ✅ Sin errores críticos
- ✅ Documentación actualizada

---

## 21. Plan Maestro de Desarrollo

### 21.1 Orden Obligatorio de Fases

**Fase 1 — Inicialización**
Crear proyecto React + Vite + TypeScript, configurar TailwindCSS, shadcn/ui, ESLint, Prettier, React Router, TanStack Query, Zustand, Supabase, variables de entorno y estructura de carpetas.
> No desarrollar funcionalidades hasta completar esta fase.

**Fase 2 — Base de Datos**
Crear migraciones, tablas, índices, claves foráneas, restricciones, funciones SQL, triggers, configurar RLS y crear seeds.
> No continuar hasta validar la base de datos.

**Fase 3 — Autenticación**
Configurar Supabase Auth, implementar login, recuperación de contraseña, protección de rutas y gestión de sesiones.

**Fase 4 — Layout Base**
Header, Sidebar, Navbar, Footer, sistema de navegación, layout responsive.

**Fase 5 — Componentes Base**
Crear todos los componentes reutilizables antes de desarrollar módulos: Button, Input, Select, Card, Modal, Badge, Table, Avatar, Toast, Loader, Empty State, Confirm Dialog, File Upload, Data Grid, Timeline, Chart Wrapper.
> No duplicar componentes.

**Fase 6 — Módulos** (en este orden)
1. Usuarios
2. Configuración
3. Tickets
4. Dashboard
5. Notificaciones
6. Auditoría
7. Reportes

> No iniciar un módulo sin finalizar el anterior.

**Fase 7 — Optimización**
Lazy Loading, optimización de consultas e imágenes, caché, Realtime, accesibilidad, rendimiento.

**Fase 8 — Testing**
Unit Testing, Integration Testing, End-to-End, Responsive, Seguridad.

**Fase 9 — Producción**
Build, revisión, despliegue, verificación final.

### 21.2 Reglas para Generar Código

- Nunca crear archivos innecesarios.
- Nunca duplicar lógica.
- Nunca usar `any` sin justificación.
- Nunca mezclar lógica de negocio con componentes visuales.
- Nunca acceder directamente a Supabase desde componentes de UI.

### 21.3 10 Reglas de Desarrollo

**Regla N°1** — Antes de escribir una sola línea de código, responder internamente:
- ¿Qué quiere exactamente el SDD?
- ¿Existe ya un componente/servicio/tabla similar?
- ¿Estoy rompiendo alguna arquitectura?
- ¿Estoy duplicando lógica?
- ¿Qué impacto tendrá este cambio?
- ¿Qué documentación debo actualizar?

Si alguna respuesta no está clara: **NO PROGRAMAR**. Primero revisar la documentación.

**Regla N°2** — Nunca trabajar sobre memoria. Siempre revisar primero `.claude/project-status.json`, luego `current-phase.md`, `pending.md`, `architecture.md`.

**Regla N°3** — No crear archivos innecesarios. Buscar si ya existe uno similar antes de crear.

**Regla N°4** — No generar deuda técnica. Si una solución rápida rompe la arquitectura, está **prohibido** implementarla.

**Regla N°5** — Todo cambio debe actualizar la memoria (`completed.md`, `pending.md`, `changelog.md`, `project-status.json`).

**Regla N°6** — Nunca asumir reglas. Si no se sabe quién puede realizar una acción, buscar en `workflow.md`. Si no existe, crear `TODO` y continuar con la opción más conservadora.

**Regla N°7** — Siempre trabajar por pequeños bloques. Crear → Validar → Continuar.

**Regla N°8** — Después de terminar cada tarea, ejecutar auto auditoría:
- ✔ Compila | ✔ ESLint | ✔ TypeScript | ✔ Responsive | ✔ Mobile | ✔ Accesibilidad
- ✔ Permisos | ✔ RLS | ✔ Testing | ✔ Documentación

**Regla N°9** — Nunca modificar código sin entenderlo. Leer imports, dependencias, servicios, hooks, contexto y componentes relacionados.

**Regla N°10** — Todo cambio deberá ser reversible. Si modifica algo importante, documentar.

### 21.4 Reglas de Desarrollo (DEV)

| Regla | Descripción |
|---|---|
| DEV-001 | No implementar funcionalidades fuera del alcance del SDD sin aprobación. |
| DEV-002 | Toda funcionalidad deberá ser modular y reutilizable. |
| DEV-003 | Todo cambio deberá respetar la arquitectura definida. |
| DEV-004 | No eliminar código existente sin analizar su impacto. |
| DEV-005 | Toda funcionalidad deberá ser compatible con dispositivos móviles. |
| DEV-006 | Toda operación crítica deberá quedar registrada en la auditoría. |
| DEV-007 | No utilizar valores hardcodeados cuando deban ser configurables. |
| DEV-008 | Toda nueva funcionalidad deberá integrarse con el sistema de permisos existente. |

---

## 22. Memoria Persistente del Proyecto

### 22.1 Estructura `.claude/`

```
.claude/
│
├── context/
│   ├── architecture.md
│   ├── database.md
│   ├── frontend.md
│   ├── backend.md
│   ├── permissions.md
│   ├── notifications.md
│   ├── workflows.md
│   └── decisions.md
│
├── progress/
│   ├── current-phase.md
│   ├── completed.md
│   ├── pending.md
│   ├── blockers.md
│   └── changelog.md
│
├── tasks/
│   ├── backlog.md
│   ├── sprint-current.md
│   └── next-steps.md
│
├── validations/
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   └── testing.md
│
└── prompts/
    ├── coding-rules.md
    ├── architecture-rules.md
    └── project-summary.md
```

### 22.2 Protocolo de Sesión

**Al iniciar una sesión, leer en orden:**
1. `.claude/prompts/project-summary.md`
2. `.claude/progress/current-phase.md`
3. `.claude/progress/pending.md`
4. Comenzar a programar.

> Nunca empezar directamente leyendo todo el SDD.

**Después de terminar una tarea, actualizar:**
- `completed.md`
- `pending.md`
- `current-phase.md`
- `changelog.md`

### 22.3 `project-summary.md`

Este archivo es el más importante. No debe superar 2-3 páginas. Debe contener únicamente: objetivo del sistema, arquitectura, tecnologías, módulos, roles, flujo de tickets y reglas importantes.

### 22.4 Cuándo Releer el SDD Completo

Solo en estos casos:
1. Se agregue un módulo completamente nuevo.
2. Exista una contradicción entre los documentos.
3. El usuario modifique el SDD.
4. Se detecte una ambigüedad que no pueda resolverse con la documentación de `.claude`.

---

## 23. Subagentes Especializados

El sistema de desarrollo utilizará subagentes con responsabilidades claramente definidas:

| Subagente | Responsabilidad |
|---|---|
| **Arquitecto** | Arquitectura, patrones, carpetas, escalabilidad |
| **DBA** | PostgreSQL, índices, triggers, RLS, funciones SQL, migraciones |
| **Backend** | Edge Functions, servicios, seguridad, API, Auth |
| **Frontend** | React, responsive, componentes, UX, accesibilidad |
| **UI Designer** | Colores, tipografía, espaciados, consistencia visual, Mobile First |
| **QA** | Testing, casos borde, validaciones, regresión |
| **Reviewer** | Revisar todo antes de marcar terminado. Debe comportarse como un Senior Developer. |
| **Documentation Manager** | Actualizar `.claude/` siempre. Nunca olvidar documentación. |
| **Git Guardian** | Validar calidad técnica antes de permitir un commit |
| **Release Reviewer** | Validar la calidad del commit |
| **Recovery Manager** | Mantener la estabilidad del proyecto ante errores |

---

## 24. Skill: Git Guardian + Release Reviewer + Recovery Manager

### 24.1 Objetivo

Garantizar que cada cambio realizado en el proyecto sea estable, correctamente documentado, fácilmente rastreable y recuperable. Este agente es **responsable del control de versiones**. No desarrolla funcionalidades.

### 24.2 Git Guardian — Validaciones Técnicas Obligatorias

Antes de permitir un commit, debe verificar:

- ✅ El proyecto compila correctamente.
- ✅ No existen errores de TypeScript.
- ✅ No existen errores de ESLint.
- ✅ No existen imports sin usar.
- ✅ No existen variables sin utilizar.
- ✅ No existen `console.log`.
- ✅ No existe código comentado innecesario.
- ✅ No existen archivos duplicados.
- ✅ No existen componentes duplicados.
- ✅ No existen cambios que rompan la arquitectura.

Si cualquiera de estas validaciones falla: **NO PERMITIR EL COMMIT**.

### 24.3 Release Reviewer — Validaciones de Calidad del Commit

Debe verificar:

- ✅ El commit representa una única tarea.
- ✅ El título es claro y en español.
- ✅ La descripción explica correctamente el cambio.
- ✅ El cambio puede entenderse sin leer el código.
- ✅ El commit deja el proyecto funcionando.

Si alguna respuesta es negativa: **RECHAZAR EL COMMIT**.

### 24.4 Recovery Manager — Gestión de Estabilidad

Si una nueva implementación rompe el sistema:

1. Comparar el estado actual con el último commit exitoso.
2. Detectar exactamente qué archivos produjeron el problema.
3. Intentar corregir el error sin perder funcionalidades.
4. Solo utilizar `git revert` como último recurso.

> Nunca deberá rehacer funcionalidades ya implementadas sin revisar primero el historial de commits.

### 24.5 Reglas de Commits

#### Formato obligatorio

**Título:**
- Siempre en **español**.
- Corto y claro.
- Representa una única unidad lógica de trabajo.

```
✅ Crear componente reutilizable de botón
✅ Implementar formulario de creación de tickets
✅ Agregar validaciones del inicio de sesión
✅ Corregir paginación de usuarios

❌ fix
❌ feat
❌ update
❌ commit
❌ cambios
❌ varios ajustes
```

**Descripción:**

Debe indicar:
- Qué se hizo.
- Por qué se hizo.
- Qué impacto tiene.

**Nunca mencionar:** Claude, Inteligencia Artificial, "Generado automáticamente".

**Ejemplo completo:**

```
Implementar tabla de tickets

Se implementó la tabla principal de tickets utilizando TanStack Table.
Incluye paginación, ordenamiento, búsqueda y diseño responsive.
La tabla aún no consume datos reales; la conexión con Supabase
se implementará en una fase posterior.
```

### 24.6 Límites por Commit

| Límite | Valor recomendado |
|---|---|
| Archivos modificados | Máximo 10 |
| Líneas modificadas | Máximo 500 |
| Funcionalidades mezcladas | Prohibido |

> Si supera estos límites, el Git Guardian debe recomendar dividir el trabajo.

### 24.7 Archivos Nunca Incluidos en un Commit

```
node_modules/
dist/
coverage/
.env
logs/
archivos temporales
```

### 24.8 Actualizaciones Obligatorias Después de Cada Commit

```
.claude/progress/completed.md
.claude/progress/changelog.md
.claude/project-status.json
```

### 24.9 Flujo Obligatorio

```
Desarrollar tarea
      │
      ▼
Validar funcionamiento
      │
      ▼
Ejecutar pruebas
      │
      ▼
Git Guardian revisa cambios
      │
      ├── ❌ Rechaza → Explica errores → Devuelve la tarea
      │
      └── ✅ Aprueba
               │
               ▼
Release Reviewer valida
               │
               ├── ❌ Rechaza → Devuelve la tarea
               │
               └── ✅ Aprueba
                        │
                        ▼
               Realizar commit
                        │
                        ▼
               Actualizar .claude/
                        │
                        ▼
               Continuar siguiente tarea
```

### 24.10 Estado Final Después de Cada Commit

```
✔ Build correcto
✔ ESLint correcto
✔ TypeScript correcto
✔ Tests correctos
✔ Commit realizado
✔ Documentación actualizada
✔ Memoria sincronizada
```

### 24.11 Regla Final

> **Nunca realizar un commit si existe cualquier duda sobre la estabilidad del proyecto.**
> Es preferible retrasar un commit que registrar un estado inestable del sistema.

---

## Apéndice — Historial de Commits Esperado

En lugar de commits masivos, el historial deberá verse así:

```
Crear estructura base del proyecto
Configurar ESLint y Prettier
Instalar Tailwind CSS
Configurar shadcn/ui
Crear layout principal
Crear componente Button
Crear componente Input
Crear componente Modal
Crear componente Card
Crear componente Badge
Implementar autenticación
Crear tabla usuarios
Crear tabla sucursales
Crear tabla tickets
Implementar formulario de creación de tickets
Agregar validaciones del formulario
Implementar subida de evidencias
Crear dashboard de usuario
Crear dashboard de administrador
Implementar notificaciones
Conectar Supabase Realtime
```

> Cada commit cuenta una historia y deja el proyecto en un estado funcional.

---

*SDD — Pide Servicio · Versión 1.0 · Documento oficial de referencia para el desarrollo.*
