import { useContext } from 'react'
import { ThemeContext } from '@shared/components/ThemeContext'
import type { ThemeContextValue } from '@shared/components/ThemeContext'

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider.')
  }
  return context
}
