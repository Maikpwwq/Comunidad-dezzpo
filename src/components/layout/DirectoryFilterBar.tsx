/**
 * DirectoryFilterBar
 *
 * Unified filter Paper with search TextField, configurable dropdown(s),
 * optional children (e.g. view toggle), a "Clear filters" button,
 * and an optional horizontal chip scroller for categories.
 *
 * Reference design: app/tiendas.
 * Used by: portal-servicios, directorio-requerimientos, tiendas.
 */
import type { ReactNode } from 'react'
import { Paper, Grid, TextField, MenuItem, Button } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
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
    /** Value for the "All" option (default: 'all') */
    allValue?: string
    /** Grid column span for md screens (default: 2.5) */
    gridMd?: number
}

export interface DirectoryFilterBarProps {
    /** Search input value */
    searchQuery?: string
    /** Search change handler */
    onSearchChange?: (value: string) => void
    /** Search placeholder */
    searchPlaceholder?: string
    /** Search grid md width */
    searchGridMd?: number
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
    /** Children grid md width */
    childrenGridMd?: number
    /** Sx override for the Paper */
    sx?: SxProps<Theme>
}

export function DirectoryFilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder,
    searchGridMd = 3.5,
    dropdowns,
    categoryChips,
    hasActiveFilters,
    onClearAll,
    children,
    childrenGridMd,
    sx,
}: DirectoryFilterBarProps) {
    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: '#ffffff', ...sx }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* Search TextField (matching tiendas) */}
                {searchPlaceholder && onSearchChange && (
                    <Grid item xs={12} sm={6} md={searchGridMd}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={searchPlaceholder}
                            value={searchQuery || ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                endAdornment: searchQuery ? (
                                    <ClearIcon
                                        fontSize="small"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => onSearchChange('')}
                                    />
                                ) : null,
                            }}
                        />
                    </Grid>
                )}

                {/* Dropdowns */}
                {dropdowns.map((dd, idx) => (
                    <Grid key={idx} item xs={12} sm={6} md={dd.gridMd ?? 2.5}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label={dd.label}
                            value={dd.value}
                            onChange={(e) => dd.onChange(e.target.value)}
                        >
                            {dd.allLabel && (
                                <MenuItem value={dd.allValue !== undefined ? dd.allValue : 'all'}>
                                    <em>{dd.allLabel}</em>
                                </MenuItem>
                            )}
                            {dd.options.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                ))}

                {/* Additional content / controls */}
                {children && (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={childrenGridMd ?? 3}
                        sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
                    >
                        {children}
                    </Grid>
                )}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Grid item xs={12} sm="auto" sx={{ ml: { md: 'auto' } }}>
                        <Button
                            size="small"
                            onClick={onClearAll}
                            startIcon={<ClearIcon fontSize="small" />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                color: '#dc2626',
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Grid>
                )}
            </Grid>

            {categoryChips && <CategoryChipScroller {...categoryChips} />}
        </Paper>
    )
}
