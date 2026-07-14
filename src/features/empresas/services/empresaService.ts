import { apiClient, type PagedBackendResponse } from '@services/apiClient'

export interface EmpresaResumenDto {
  id: string
  nombre: string
  ruc: string
  correo: string
  telefono: string | null
  logoUrl: string | null
  activo: boolean
  totalSucursales: number
  creadoEn: string
}

export interface EmpresaDetalleDto extends EmpresaResumenDto {
  direccion: string | null
  descripcion: string | null
  sitioWeb: string | null
}

export interface EmpresaListParams {
  busqueda?: string
  activo?: boolean
  pagina?: number
  tamanoPagina?: number
}

export interface CrearEmpresaDto {
  nombre: string
  ruc: string
  correo: string
  telefono?: string
  direccion?: string
  descripcion?: string
  sitioWeb?: string
}

export interface ActualizarEmpresaDto {
  nombre: string
  ruc: string
  correo: string
  telefono?: string
  direccion?: string
  descripcion?: string
  sitioWeb?: string
}

type Params = Record<string, string | number | boolean | null | undefined>

export const empresaService = {
  listar: (params?: EmpresaListParams) =>
    apiClient.get<PagedBackendResponse<EmpresaResumenDto>>('/empresas', params as Params),

  obtener: (id: string) => apiClient.get<EmpresaDetalleDto>(`/empresas/${id}`),

  crear: (dto: CrearEmpresaDto) => apiClient.post<EmpresaDetalleDto>('/empresas', dto),

  actualizar: (id: string, dto: ActualizarEmpresaDto) =>
    apiClient.put<EmpresaDetalleDto>(`/empresas/${id}`, dto),

  toggleActivo: (id: string) =>
    apiClient.put<{ activo: boolean }>(`/empresas/${id}/toggle-activo`, {}),
}
