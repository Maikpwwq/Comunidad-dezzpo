/**
 * ActiveFiltersBar
 *
 * Displays a summary of active filters as removable chips
 * with a "Reset All" button. Only renders when `visible` is true.
 *
 * Used by: portal-servicios, directorio-requerimientos.
 */
import { Box, Chip, Button, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

export interface ActiveFilterChip {
    /** Visible text: 'Inmueble: Hogar', 'Categoría: Pintura', etc. */
    label: string
    /** Chip color */
    color?: 'primary' | 'secondary' | 'info' | 'default'
    /** Callback to remove this individual filter */
    onDelete: () => void
}

export interface ActiveFiltersBarProps {
    /** Controls whether the bar renders */
    visible: boolean
    /** List of active filter chips to display */
    chips: ActiveFilterChip[]
    /** Callback for the "Reset all" button */
    onResetAll: () => void
    /** Sx override */
    sx?: SxProps<Theme>
}

export function ActiveFiltersBar({ visible, chips, onResetAll, sx }: ActiveFiltersBarProps) {
    if (!visible || chips.length === 0) return null

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
                ...sx,
            }}
        >
            <Typography variant="caption" fontWeight={700} color="text.secondary">
                Filtros activos:
            </Typography>
            {chips.map((chip, idx) => (
                <Chip
                    key={idx}
                    size="small"
                    label={chip.label}
                    onDelete={chip.onDelete}
                    color={chip.color ?? 'default'}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                />
            ))}
            <Button
                size="small"
                onClick={onResetAll}
                startIcon={<CloseIcon fontSize="small" />}
                sx={{
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    ml: 'auto',
                    color: '#dc2626',
                    fontWeight: 600,
                }}
            >
                Restablecer filtros
            </Button>
        </Box>
    )
}
