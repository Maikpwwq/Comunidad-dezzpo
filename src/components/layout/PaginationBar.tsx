/**
 * PaginationBar — Responsive pagination controls
 *
 * Renders navigation buttons (Anterior / Siguiente) with page info.
 * Uses brand CSS variables for consistency with the design system.
 *
 * @example
 * <PaginationBar
 *   page={page}
 *   totalPages={totalPages}
 *   totalItems={totalItems}
 *   onPageChange={goToPage}
 *   itemLabel="tiendas"
 * />
 */
import { Box, Button, Typography } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export interface PaginationBarProps {
    /** Current page (0-based) */
    page: number
    /** Total number of pages */
    totalPages: number
    /** Total number of items */
    totalItems: number
    /** Callback when page changes */
    onPageChange: (page: number) => void
    /** Label for items (e.g. "tiendas", "usuarios") */
    itemLabel?: string
    /** Visual variant: full (desktop) or compact (mobile) */
    variant?: 'compact' | 'full'
}

export function PaginationBar({
    page,
    totalPages,
    totalItems,
    onPageChange,
    itemLabel = 'resultados',
    variant = 'full',
}: PaginationBarProps) {
    if (totalPages <= 1) return null

    const isFirst = page === 0
    const isLast = page >= totalPages - 1

    const buttonSx = {
        textTransform: 'none' as const,
        fontWeight: 600,
        fontSize: variant === 'compact' ? '0.8rem' : '0.875rem',
        color: 'var(--brand-teal, #00897b)',
        '&.Mui-disabled': {
            color: 'var(--content-text-light-gray-color, #bababa)',
        },
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2.5,
                mb: 1,
                px: variant === 'compact' ? 0.5 : 1,
                py: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Button
                size="small"
                disabled={isFirst}
                onClick={() => onPageChange(page - 1)}
                startIcon={<NavigateBeforeIcon />}
                sx={buttonSx}
            >
                {variant === 'compact' ? 'Ant.' : 'Anterior'}
            </Button>

            <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ userSelect: 'none', textAlign: 'center', lineHeight: 1.3 }}
            >
                {variant === 'compact' ? (
                    `${page + 1}/${totalPages}`
                ) : (
                    <>
                        Pág. {page + 1} de {totalPages}
                        <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: 'var(--content-text-light-gray-color, #bababa)' }}
                        >
                            ({totalItems} {itemLabel})
                        </Typography>
                    </>
                )}
            </Typography>

            <Button
                size="small"
                disabled={isLast}
                onClick={() => onPageChange(page + 1)}
                endIcon={<NavigateNextIcon />}
                sx={buttonSx}
            >
                {variant === 'compact' ? 'Sig.' : 'Siguiente'}
            </Button>
        </Box>
    )
}
