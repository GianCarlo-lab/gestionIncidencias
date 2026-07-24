import type { KeyboardEvent } from 'react'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { z } from 'zod'
import { Badge } from '@shared/ui/badge'
import { Input } from '@shared/ui/input'
import { cn } from '@lib/utils'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  maxItems?: number
  error?: string
  disabled?: boolean
  placeholder?: string
}

const emailSchema = z.string().email()

export function EmailChipsInput({
  value,
  onChange,
  maxItems = 5,
  error,
  disabled = false,
  placeholder = 'nombre@empresa.com',
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isAtLimit = value.length >= maxItems

  function tryAddEmail(raw: string) {
    const trimmed = raw.trim().replace(/,+$/, '').trim()
    if (!trimmed) {
      setInputValue('')
      setInputError(null)
      return
    }

    const parsed = emailSchema.safeParse(trimmed)
    if (!parsed.success) {
      setInputError('Correo inválido.')
      return
    }

    if (value.includes(trimmed)) {
      setInputValue('')
      setInputError(null)
      return
    }

    onChange([...value, trimmed])
    setInputValue('')
    setInputError(null)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault()
      tryAddEmail(inputValue)
    }
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function handleBlur() {
    if (inputValue.trim()) {
      tryAddEmail(inputValue)
    }
  }

  function handleChange(raw: string) {
    setInputError(null)
    // Si el usuario escribe una coma, intentar agregar inmediatamente
    if (raw.endsWith(',')) {
      tryAddEmail(raw)
    } else {
      setInputValue(raw)
    }
  }

  function removeEmail(email: string) {
    onChange(value.filter((e) => e !== email))
  }

  return (
    <div className="space-y-1.5">
      {/* Chips de correos agregados */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((email) => (
            <Badge
              key={email}
              variant="secondary"
              className="flex h-6 items-center gap-1 pr-1 text-[11px] font-normal"
            >
              <span className="max-w-[180px] truncate">{email}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="ml-0.5 shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  aria-label={`Eliminar ${email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input + contador */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            ref={inputRef}
            type="email"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled || isAtLimit}
            placeholder={isAtLimit ? `Límite de ${maxItems} correos alcanzado` : placeholder}
            className={cn(
              'h-8 text-xs',
              inputError && 'border-destructive ring-1 ring-destructive/30',
              isAtLimit && 'cursor-not-allowed opacity-60',
            )}
            aria-invalid={!!inputError}
          />
        </div>

        <div className="flex items-center justify-between">
          {inputError ? (
            <p className="text-[11px] text-destructive">{inputError}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Presiona Enter, Tab o coma para agregar.
            </p>
          )}
          {value.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {value.length}/{maxItems}
            </span>
          )}
        </div>
      </div>

      {/* Error del padre */}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  )
}
