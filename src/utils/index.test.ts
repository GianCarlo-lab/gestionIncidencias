import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatFileSize, getInitials, truncate } from './index'

describe('formatDate', () => {
  it('formatea una fecha correctamente en español', () => {
    const result = formatDate('2026-01-15')
    expect(result).toBe('15/01/2026')
  })
})

describe('formatDateTime', () => {
  it('formatea fecha con hora en español', () => {
    const result = formatDateTime(new Date('2026-01-15T10:30:00'))
    expect(result).toMatch(/15\/01\/2026/)
    expect(result).toMatch(/10:30/)
  })
})

describe('formatFileSize', () => {
  it('formatea bytes correctamente', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })
})

describe('getInitials', () => {
  it('obtiene las iniciales de un nombre completo', () => {
    expect(getInitials('Juan Pérez')).toBe('JP')
    expect(getInitials('María')).toBe('M')
    expect(getInitials('Carlos Alberto García')).toBe('CA')
  })
})

describe('truncate', () => {
  it('trunca textos largos', () => {
    expect(truncate('Hola mundo', 100)).toBe('Hola mundo')
    expect(truncate('Hola mundo', 5)).toBe('Hola ...')
  })
})
