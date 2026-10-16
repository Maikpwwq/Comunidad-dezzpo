/**
 * DirectoryFilterBar
 *
 * Unified filter Paper with configurable dropdown(s), an optional
 * horizontal chip scroller for categories, and a "Clear filters" button.
 *
 * Used by: portal-servicios, directorio-requerimientos.
 * Can also be adopted by tiendas.
 */
import type { ReactNode } from 'react'
import { Paper, Stack, TextField, MenuItem, Button } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import ClearIcon from '@mui/icons-material/Clear'
import { CategoryChipScroller, type CategoryChipScrollerProps } from './CategoryChipScroller'

export interface FilterDropdownConfig {
    /** Dropdown label */
    label: string
    /** Current value */
    value: string
    /** Change callback */
    onChange: (value: string) => void
    /** Dropdown menu options */
    options: ReadonlyArray<{ id: string; label: string }>
    /** Placeholder for the "All" option (if set, an italic "All" item is prepended) */
    allLabel?: string
}

export interface DirectoryFilterBarProps {
    /** Array of dropdown configurations (1 to N) */
    dropdowns: FilterDropdownConfig[]
    /** Category chip scroller config (optional) */
    categoryChips?: CategoryChipScrollerProps
    /** Are there any active filters? Controls clear button visibility */
    hasActiveFilters: boolean
    /** Callback for the "Clear filters" button */
    onClearAll: () => void
    /** Additional injectable content (e.g. ToggleButtonGroup) */
    children?: ReactNode
    /** Sx override for the Paper */
    sx?: SxProps<Theme>
}

export function DirectoryFilterBar({
    dropdowns,
    categoryChips,
    hasActiveFilters,
    onClearAll,
    children,
    sx,
}: DirectoryFilterBarProps) {
    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 2, borderRadius: 3, backgroundColor: '#ffffff', ...sx }}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                {dropdowns.map((dd, idx) => (
                    <TextField
                        key={idx}
                        select
                        fullWidth
                        size="small"
                        label={dd.label}
                        value={dd.value}
                        onChange={(e) => dd.onChange(e.target.value)}
                        sx={{ minWidth: { md: 200 }, maxWidth: { md: 240 } }}
                    >
                        {dd.allLabel && (
                            <MenuItem value="all">
                                <em>{dd.allLabel}</em>
                            </MenuItem>
                        )}
                        {dd.options.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                ))}

                {children}

                {hasActiveFilters && (
                    <Button
                        size="small"
                        onClick={onClearAll}
                        startIcon={<ClearIcon fontSize="small" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            color: '#dc2626',
                            ml: { md: 'auto' },
                        }}
                    >
                        Limpiar filtros
                    </Button>
                )}
            </Stack>

            {categoryChips && <CategoryChipScroller {...categoryChips} />}
        </Paper>
    )
}
