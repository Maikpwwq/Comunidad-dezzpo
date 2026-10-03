/**
 * SearchInput — Reusable search field with integrated debounce
 *
 * Consistent with the admin/usuarios search pattern:
 * Paper container + TextField variant="standard" + SearchIcon + ClearIcon.
 *
 * @example
 * <SearchInput
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Buscar por nombre..."
 * />
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { Paper, TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

export interface SearchInputProps {
    /** Current controlled value */
    value: string
    /** Called with the new value (after debounce) */
    onChange: (value: string) => void
    /** Placeholder text */
    placeholder?: string
    /** Debounce delay in ms (default: 300) */
    debounceMs?: number
    /** Show clear button when value is non-empty (default: true) */
    showClearButton?: boolean
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Buscar...',
    debounceMs = 300,
    showClearButton = true,
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Sync external value changes (e.g. programmatic clear)
    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = useCallback(
        (newValue: string) => {
            setLocalValue(newValue)

            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            timerRef.current = setTimeout(() => {
                onChange(newValue)
            }, debounceMs)
        },
        [onChange, debounceMs],
    )

    const handleClear = useCallback(() => {
        setLocalValue('')
        onChange('')
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
    }, [onChange])

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        <Paper
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: { xs: 0.8, sm: 1 },
                flex: 1,
                borderRadius: 2,
                minWidth: 0,
            }}
            elevation={0}
            variant="outlined"
        >
            <SearchIcon color="action" />
            <TextField
                placeholder={placeholder}
                variant="standard"
                fullWidth
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5 } }}
            />
            {showClearButton && localValue && (
                <IconButton
                    size="small"
                    onClick={handleClear}
                    aria-label="Limpiar búsqueda"
                    sx={{ color: 'text.secondary' }}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            )}
        </Paper>
    )
}
