import { apiClient, type PagedBackendResponse } from '@services/apiClient'

export interface SucursalResumenDto {
  id: string
  empresaId: string
  nombre: string
  activa: boolean
  createdAt: string
}

export interface SucursalDto {
  id: string
  empresaId: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  responsableId: string | null
  activa: boolean
  createdAt: string
}

export interface SucursalListParams {
  busqueda?: string
  empresaId?: string
  soloActivas?: boolean
  pagina?: number
  tamanoPagina?: number
}

export interface CrearSucursalDto {
  empresaId: string
  nombre: string
  descripcion?: string
  direccion?: string
  responsableId?: string
}

export interface ActualizarSucursalDto {
  nombre: string
  descripcion?: string
  direccion?: string
  responsableId?: string
}

type Params = Record<string, string | number | boolean | null | undefined>

export const sucursalService = {
  listar: (params?: SucursalListParams) =>
    apiClient.get<PagedBackendResponse<SucursalResumenDto>>('/sucursales', params as Params),

  obtener: (id: string) => apiClient.get<SucursalDto>(`/sucursales/${id}`),

  crear: (dto: CrearSucursalDto) => apiClient.post<SucursalDto>('/sucursales', dto),

  actualizar: (id: string, dto: ActualizarSucursalDto) =>
    apiClient.put<SucursalDto>(`/sucursales/${id}`, dto),

  activar: (id: string) => apiClient.patch<void>(`/sucursales/${id}/activar`),

  desactivar: (id: string) => apiClient.patch<void>(`/sucursales/${id}/desactivar`),
}
