// Roles del sistema
export type UserRole = 'superadmin' | 'admin' | 'worker' | 'user'

// Estado laboral de trabajadores y administradores
export type LaborStatus = 'activo' | 'vacaciones' | 'licencia' | 'suspendido' | 'retirado'

// Estados del workflow de tickets (en el mismo orden que el flujo)
export type TicketStatus =
  'sin_asignar' | 'asignado' | 'en_proceso' | 'pendiente_validacion' | 'cerrado' | 'reabierto'

export type TicketPriority = 'baja' | 'media' | 'alta' | 'critica'

export type EvidenceType = 'inicial' | 'final'

// Perfil de usuario de la aplicacion (distinto de auth.users de Supabase)
export interface AppUser {
  id: string
  authUserId: string
  nombre: string
  apellido: string
  correo: string
  usuario: string
  telefono?: string
  rolId: string
  rol: UserRole
  sucursalId: string
  areaId?: string
  estadoLaboral: LaborStatus
  activo: boolean
  ultimoAcceso?: string
  foto?: string
}

// Respuestas estandar del backend (SDD secc. 8.2)
export interface ApiSuccess<T = unknown> {
  success: true
  message: string
  data: T
}

export interface ApiError {
  success: false
  code: 'VALIDATION_ERROR' | 'FORBIDDEN' | 'INTERNAL_ERROR' | 'NOT_FOUND'
  message: string
  errors?: string[]
}

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiError

// Paginacion estandar
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  orderBy?: string
  orderDir?: 'asc' | 'desc'
}
