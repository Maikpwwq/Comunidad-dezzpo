/**
 * CategoryChipScroller
 *
 * Horizontal scrollable chip bar for quick category selection.
 * Purely presentational — all state is owned by the consumer.
 *
 * Used by: portal-servicios, directorio-requerimientos, tiendas.
 */
import { Box, Chip } from '@mui/material'

export interface CategoryChipScrollerProps {
    /** Options to render as chips */
    categories: ReadonlyArray<{ key: string | number; label: string }>
    /** Key of the currently selected category ('' = none) */
    selectedKey: string
    /** Callback when user selects or deselects a chip */
    onSelect: (key: string) => void
    /** Label for the "All" chip (default: 'Todas las Categorías') */
    allLabel?: string
    /** Show only on desktop (default: false → always visible) */
    desktopOnly?: boolean
}

export function CategoryChipScroller({
    categories,
    selectedKey,
    onSelect,
    allLabel = 'Todas las Categorías',
    desktopOnly = false,
}: CategoryChipScrollerProps) {
    return (
        <Box
            sx={{
                mt: 2,
                display: desktopOnly ? { xs: 'none', md: 'flex' } : 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                pt: 0.5,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#cbd5e1',
                    borderRadius: 3,
                },
            }}
        >
            <Chip
                label={allLabel}
                clickable
                color={selectedKey === '' ? 'primary' : 'default'}
                variant={selectedKey === '' ? 'filled' : 'outlined'}
                onClick={() => onSelect('')}
                sx={{ fontWeight: 600, flexShrink: 0 }}
            />
            {categories.map((cat) => {
                const catKey = String(cat.key)
                const isSelected = selectedKey === catKey
                return (
                    <Chip
                        key={cat.key}
                        label={cat.label}
                        clickable
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => onSelect(isSelected ? '' : catKey)}
                        sx={{ fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}
                    />
                )
            })}
        </Box>
    )
}
