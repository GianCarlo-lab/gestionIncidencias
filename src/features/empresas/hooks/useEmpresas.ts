import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  empresaService,
  type EmpresaListParams,
  type CrearEmpresaDto,
  type ActualizarEmpresaDto,
} from '../services/empresaService'

const EMPRESA_KEYS = {
  all: ['empresas'] as const,
  list: (params?: EmpresaListParams) => ['empresas', 'list', params] as const,
  detail: (id: string) => ['empresas', 'detail', id] as const,
  correosCopia: (id: string) => ['empresas', 'correosCopia', id] as const,
}

export function useEmpresas(params?: EmpresaListParams) {
  return useQuery({
    queryKey: EMPRESA_KEYS.list(params),
    queryFn: () => empresaService.listar(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useEmpresa(id: string) {
  return useQuery({
    queryKey: EMPRESA_KEYS.detail(id),
    queryFn: () => empresaService.obtener(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCrearEmpresa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CrearEmpresaDto) => empresaService.crear(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.all })
      toast.success('Empresa creada correctamente.')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useActualizarEmpresa(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: ActualizarEmpresaDto) => empresaService.actualizar(id, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.all })
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.detail(id) })
      toast.success('Empresa actualizada correctamente.')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useToggleEmpresa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) =>
      activa ? empresaService.desactivar(id) : empresaService.activar(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.all })
      toast.success('Estado de empresa actualizado.')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useCorreosCopiaEmpresa(empresaId: string) {
  return useQuery({
    queryKey: EMPRESA_KEYS.correosCopia(empresaId),
    queryFn: () => empresaService.listarCorreosCopia(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAgregarCorreoCopia(empresaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (correo: string) => empresaService.agregarCorreoCopia(empresaId, correo),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.correosCopia(empresaId) })
      toast.success('Correo en copia agregado.')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo agregar el correo.')
    },
  })
}

export function useEliminarCorreoCopia(empresaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (correoId: string) => empresaService.eliminarCorreoCopia(empresaId, correoId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMPRESA_KEYS.correosCopia(empresaId) })
      toast.success('Correo en copia eliminado.')
    },
    onError: () => {
      toast.error('No se pudo eliminar el correo.')
    },
  })
}
