// Funciones utilitarias generales del proyecto

/**
 * Formatea una fecha en formato dd/mm/yyyy en espanol.
 */
export function formatDate(date: string | Date): string {
  // Los strings YYYY-MM-DD se parsean como UTC; agregar la hora local evita el desfase de zona horaria.
  const d =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00`)
      : new Date(date)
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formatea una fecha con hora en formato dd/mm/yyyy HH:mm en espanol.
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Formatea un numero de bytes en una representacion legible (KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Convierte un string a formato de iniciales (ej: "Juan Perez" -> "JP").
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/**
 * Trunca un texto a un numero maximo de caracteres agregando "...".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}
