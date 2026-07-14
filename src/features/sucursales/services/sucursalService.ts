import { apiClient, type PagedBackendResponse } from '@services/apiClient'

export interface SucursalResumenDto {
  id: string
  empresaId: string
  empresaNombre: string
  nombre: string
  codigo: string
  ciudad: string
  pais: string
  telefono: string | null
  activo: boolean
  totalUsuarios: number
  creadoEn: string
}

export interface SucursalDetalleDto extends SucursalResumenDto {
  direccion: string | null
  latitud: number | null
  longitud: number | null
}

export interface SucursalListParams {
  busqueda?: string
  empresaId?: string
  activo?: boolean
  pagina?: number
  tamanoPagina?: number
}

export interface CrearSucursalDto {
  empresaId: string
  nombre: string
  codigo: string
  ciudad: string
  pais: string
  telefono?: string
  direccion?: string
  latitud?: number
  longitud?: number
}

export interface ActualizarSucursalDto {
  nombre: string
  codigo: string
  ciudad: string
  pais: string
  telefono?: string
  direccion?: string
  latitud?: number
  longitud?: number
}

type Params = Record<string, string | number | boolean | null | undefined>

export const sucursalService = {
  listar: (params?: SucursalListParams) =>
    apiClient.get<PagedBackendResponse<SucursalResumenDto>>('/sucursales', params as Params),

  obtener: (id: string) => apiClient.get<SucursalDetalleDto>(`/sucursales/${id}`),

  crear: (dto: CrearSucursalDto) => apiClient.post<SucursalDetalleDto>('/sucursales', dto),

  actualizar: (id: string, dto: ActualizarSucursalDto) =>
    apiClient.put<SucursalDetalleDto>(`/sucursales/${id}`, dto),

  toggleActivo: (id: string) =>
    apiClient.put<{ activo: boolean }>(`/sucursales/${id}/toggle-activo`, {}),
}
