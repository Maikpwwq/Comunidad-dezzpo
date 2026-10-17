/**
 * Accessible SVG Pie Chart with Dedicated Summary (`PieChartWithSummary.tsx`)
 *
 * Implements:
 * - Requirements R2, R4, R5, R6 (Interactive Pie Chart, Synchronized Legend, Dedicated Summary)
 * - ADR-2: Pure custom SVG pie chart (zero external chart dependencies, WCAG 2.2 AA)
 * - ADR-3: Dedicated summary per card with reserved height for zero CLS
 * - Keyboard navigation (Arrow keys, Home, End, Enter, Space, Escape)
 * - Touch & Hover bidirectional sync between slices and legend items
 * - Live screen reader announcements (aria-live="polite")
 * - High-contrast accessible color palette
 */

import { useState, useRef, useId } from 'react'
import {
    Box,
    Paper,
    Typography,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import type { PieDataset, PieSlice, SearchDimension } from '@/services/admin/analytics/types'

// Accessible, distinct, contrast-tested palette
const SLICE_COLORS: readonly string[] = [
    '#00897b', // Teal 600
    '#1e88e5', // Blue 600
    '#8e24aa', // Purple 600
    '#fb8c00', // Amber/Orange 600
    '#00acc1', // Cyan 600
    '#43a047', // Green 600
    '#3949ab', // Indigo 600
    '#d81b60', // Rose 600
] as const

const COLOR_OTROS = '#64748b' // Slate 500
const COLOR_SIN_DATO = '#94a3b8' // Slate 400

function getSliceColor(slice: PieSlice, index: number): string {
    if (slice.kind === 'sin_dato') return COLOR_SIN_DATO
    if (slice.kind === 'otros') return COLOR_OTROS
    return SLICE_COLORS[index % SLICE_COLORS.length]!
}

function formatPermilleToPercent(permille: number): string {
    const pct = permille / 10
    return pct.toLocaleString('es-CO', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }) + '%'
}

interface Point {
    x: number
    y: number
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInRadians: number): Point {
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
    }
}

function describeArc(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
): string {
    // Clamp arc to slightly below 2*PI to avoid 0-length degeneracies in SVG arc commands
    const diff = endAngle - startAngle
    const effectiveEnd = diff >= 2 * Math.PI ? startAngle + 2 * Math.PI - 0.0001 : endAngle

    const p1 = polarToCartesian(cx, cy, outerRadius, startAngle)
    const p2 = polarToCartesian(cx, cy, outerRadius, effectiveEnd)
    const p3 = polarToCartesian(cx, cy, innerRadius, effectiveEnd)
    const p4 = polarToCartesian(cx, cy, innerRadius, startAngle)

    const largeArcFlag = effectiveEnd - startAngle > Math.PI ? 1 : 0

    return [
        `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
        `A ${outerRadius.toFixed(2)} ${outerRadius.toFixed(2)} 0 ${largeArcFlag} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
        `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
        `A ${innerRadius.toFixed(2)} ${innerRadius.toFixed(2)} 0 ${largeArcFlag} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
        'Z',
    ].join(' ')
}

export interface PieChartWithSummaryProps {
    readonly title: string
    readonly subtitle: string
    readonly dimension: SearchDimension
    readonly dataset: PieDataset | null
    readonly loading?: boolean
    readonly onSliceClick?: ((slice: PieSlice) => void) | undefined
}

export function PieChartWithSummary({
    title,
    subtitle,
    dimension,
    dataset,
    loading = false,
    onSliceClick,
}: PieChartWithSummaryProps) {
    const [selectedKey, setSelectedKey] = useState<string | null>(null)
    const [isPinned, setIsPinned] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState<number>(0)
    const liveRegionId = useId()
    const containerRef = useRef<HTMLDivElement>(null)

    if (loading) {
        return (
            <Paper
                variant="outlined"
                elevation={0}
                data-dimension={dimension}
                sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%', minHeight: 420 }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <Box sx={{ width: 180, height: 180, borderRadius: '50%', bgcolor: '#f1f5f9' }} />
                </Box>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Box sx={{ height: 16, width: '60%', bgcolor: '#f1f5f9', mb: 1, borderRadius: 1 }} />
                    <Box sx={{ height: 12, width: '90%', bgcolor: '#f1f5f9', borderRadius: 1 }} />
                </Box>
            </Paper>
        )
    }

    const slices = dataset?.slices || []
    const total = dataset?.total || 0
    const distinct = dataset?.distinct || 0

    // Selected slice object
    const selectedSlice = selectedKey
        ? slices.find((s) => s.key === selectedKey) || null
        : null

    // Dominant item for default summary (Top 1)
    const dominantSlice = slices.length > 0
        ? slices.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), slices[0]!)
        : null

    const handleSelectSlice = (slice: PieSlice, pin = false) => {
        setSelectedKey(slice.key)
        if (pin) {
            setIsPinned(true)
        }
        if (onSliceClick) {
            onSliceClick(slice)
        }
    }

    const handleClearSelection = () => {
        setSelectedKey(null)
        setIsPinned(false)
    }

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (slices.length === 0) return

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault()
            const nextIdx = (focusedIndex + 1) % slices.length
            setFocusedIndex(nextIdx)
            const slice = slices[nextIdx]
            if (slice) handleSelectSlice(slice, false)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault()
            const prevIdx = (focusedIndex - 1 + slices.length) % slices.length
            setFocusedIndex(prevIdx)
            const slice = slices[prevIdx]
            if (slice) handleSelectSlice(slice, false)
        } else if (e.key === 'Home') {
            e.preventDefault()
            setFocusedIndex(0)
            const slice = slices[0]
            if (slice) handleSelectSlice(slice, false)
        } else if (e.key === 'End') {
            e.preventDefault()
            const lastIdx = slices.length - 1
            setFocusedIndex(lastIdx)
            const slice = slices[lastIdx]
            if (slice) handleSelectSlice(slice, false)
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            const slice = slices[focusedIndex]
            if (slice) {
                if (selectedKey === slice.key && isPinned) {
                    handleClearSelection()
                } else {
                    handleSelectSlice(slice, true)
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault()
            handleClearSelection()
        }
    }

    // Keep screen reader live message updated
    const liveAnnouncement = selectedSlice
        ? `${selectedSlice.label}: ${selectedSlice.count} búsquedas, ${formatPermilleToPercent(selectedSlice.permille)} del total.`
        : `Resumen general: ${total} búsquedas registradas en ${distinct} opciones.`

    // Geometry constants
    const cx = 110
    const cy = 110
    const baseOuterRadius = 90
    const expandedOuterRadius = 98
    const innerRadius = 52

    // Precalculate arc angles
    let currentAngle = -Math.PI / 2 // Start at 12 o'clock
    const arcSegments = slices.map((slice, index) => {
        const sweepAngle = (slice.permille / 1000) * (2 * Math.PI)
        const start = currentAngle
        const end = currentAngle + sweepAngle
        currentAngle = end

        const isSelected = selectedKey === slice.key
        const outerR = isSelected ? expandedOuterRadius : baseOuterRadius
        const d = describeArc(cx, cy, innerRadius, outerR, start, end)
        const color = getSliceColor(slice, index)

        return {
            slice,
            index,
            d,
            color,
            isSelected,
        }
    })

    return (
        <Paper
            ref={containerRef}
            variant="outlined"
            elevation={0}
            data-dimension={dimension}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label={`Gráfico de torta: ${title}`}
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: '#ffffff',
                borderColor: '#e2e8f0',
                outline: 'none',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                '&:focus-visible': {
                    borderColor: 'var(--brand-teal, #00897b)',
                    boxShadow: '0 0 0 3px rgba(0, 137, 123, 0.15)',
                },
            }}
        >
            {/* Screen reader live region */}
            <Box
                id={liveRegionId}
                aria-live="polite"
                aria-atomic="true"
                sx={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                {liveAnnouncement}
            </Box>

            {/* Header */}
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="#0f172a"
                        sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, lineHeight: 1.3 }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        {subtitle}
                    </Typography>
                </Box>
                {selectedKey && (
                    <Tooltip title="Restablecer selección (Esc)">
                        <IconButton
                            size="small"
                            onClick={handleClearSelection}
                            aria-label="Restablecer selección"
                            sx={{ color: '#64748b', '&:hover': { color: '#0f172a' } }}
                        >
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Empty State */}
            {total === 0 ? (
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 260,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 3,
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px dashed #cbd5e1',
                    }}
                >
                    <InfoOutlinedIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                    <Typography variant="body2" fontWeight={600} color="#475569" gutterBottom>
                        Sin búsquedas registradas
                    </Typography>
                    <Typography variant="caption" color="#64748b" sx={{ maxWidth: 220 }}>
                        No se encontraron eventos de consulta en esta dimensión para el periodo seleccionado.
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* SVG Pie Visualization */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            my: 1,
                            position: 'relative',
                        }}
                    >
                        <Box
                            component="svg"
                            viewBox="0 0 220 220"
                            width="100%"
                            height="auto"
                            sx={{
                                maxWidth: 220,
                                maxHeight: 220,
                                display: 'block',
                                overflow: 'visible',
                            }}
                            role="img"
                            aria-label={`Visualización circular de ${title}`}
                        >
                            {/* SVG Donut Slices */}
                            <g>
                                {arcSegments.map(({ slice, index, d, color, isSelected }) => {
                                    const strokeWidth = isSelected ? 3 : 1.5
                                    const strokeColor = isSelected ? '#0f172a' : '#ffffff'

                                    return (
                                        <path
                                            key={slice.key}
                                            d={d}
                                            fill={color}
                                            stroke={strokeColor}
                                            strokeWidth={strokeWidth}
                                            strokeLinejoin="round"
                                            cursor="pointer"
                                            role="button"
                                            tabIndex={focusedIndex === index ? 0 : -1}
                                            aria-label={`${slice.label}: ${slice.count} búsquedas (${formatPermilleToPercent(slice.permille)})`}
                                            aria-pressed={isSelected}
                                            style={{
                                                transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease',
                                                transformOrigin: `${cx}px ${cy}px`,
                                                opacity: selectedKey && !isSelected ? 0.45 : 1,
                                            }}
                                            onMouseEnter={() => {
                                                if (!isPinned) {
                                                    setFocusedIndex(index)
                                                    handleSelectSlice(slice, false)
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (!isPinned) {
                                                    handleClearSelection()
                                                }
                                            }}
                                            onClick={() => {
                                                if (selectedKey === slice.key && isPinned) {
                                                    handleClearSelection()
                                                } else {
                                                    setFocusedIndex(index)
                                                    handleSelectSlice(slice, true)
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </g>

                            {/* Center Donut Hole Labels */}
                            <g pointerEvents="none">
                                <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#ffffff" />
                                <text
                                    x={cx}
                                    y={cy - 6}
                                    textAnchor="middle"
                                    fontSize="18"
                                    fontWeight="800"
                                    fill="#0f172a"
                                    fontFamily="inherit"
                                >
                                    {selectedSlice ? selectedSlice.count : total}
                                </text>
                                <text
                                    x={cx}
                                    y={cy + 12}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="600"
                                    fill="#64748b"
                                    fontFamily="inherit"
                                >
                                    {selectedSlice ? formatPermilleToPercent(selectedSlice.permille) : 'Consultas'}
                                </text>
                            </g>
                        </Box>
                    </Box>

                    {/* Interactive Legend */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                            mt: 1,
                            mb: 2,
                            maxHeight: 160,
                            overflowY: 'auto',
                            pr: 0.5,
                            '&::-webkit-scrollbar': { width: 4 },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 2 },
                        }}
                    >
                        {slices.map((slice, idx) => {
                            const isSelected = selectedKey === slice.key
                            const color = getSliceColor(slice, idx)

                            return (
                                <Box
                                    key={slice.key}
                                    onClick={() => {
                                        if (isSelected && isPinned) {
                                            handleClearSelection()
                                        } else {
                                            setFocusedIndex(idx)
                                            handleSelectSlice(slice, true)
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (!isPinned) {
                                            setFocusedIndex(idx)
                                            handleSelectSlice(slice, false)
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (!isPinned) {
                                            handleClearSelection()
                                        }
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1.5,
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? 'rgba(15, 23, 42, 0.05)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: isSelected ? '#0f172a' : 'transparent',
                                        transition: 'background-color 0.15s ease, border-color 0.15s ease',
                                        opacity: selectedKey && !isSelected ? 0.5 : 1,
                                        '&:hover': {
                                            bgcolor: 'rgba(15, 23, 42, 0.04)',
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, mr: 1 }}>
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: color,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            fontWeight={isSelected ? 700 : 500}
                                            color="#1e293b"
                                            noWrap
                                            title={slice.label}
                                            sx={{ fontSize: '0.8rem' }}
                                        >
                                            {slice.label}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                        <Typography variant="caption" fontWeight={600} color="#64748b" sx={{ fontSize: '0.75rem' }}>
                                            {slice.count}
                                        </Typography>
                                        <Chip
                                            label={formatPermilleToPercent(slice.permille)}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.675rem',
                                                fontWeight: 700,
                                                bgcolor: isSelected ? '#0f172a' : '#f1f5f9',
                                                color: isSelected ? '#ffffff' : '#475569',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>

                    {/* Dedicated Informative Summary (ADR-3: Fixed min-height to guarantee 0 CLS) */}
                    <Box
                        sx={{
                            mt: 'auto',
                            pt: 1.5,
                            borderTop: '1px solid #f1f5f9',
                            minHeight: 88, // Reserved height guarantees 0 CLS
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedSlice ? (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight={700} color="var(--brand-teal, #00897b)" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {selectedSlice.kind === 'otros'
                                            ? 'Grupo Otros'
                                            : selectedSlice.kind === 'sin_dato'
                                            ? 'Sin Registro'
                                            : `Posición #${selectedSlice.rank || 1}`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {isPinned ? 'Fijado · Clic para liberar' : 'Hover / Selección'}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap title={selectedSlice.label}>
                                    {selectedSlice.label}
                                </Typography>
                                <Typography variant="caption" color="#64748b">
                                    Representa el <strong>{formatPermilleToPercent(selectedSlice.permille)}</strong> del total ({selectedSlice.count} de {total} consultas).
                                    {selectedSlice.grouped && ` Agrupa ${selectedSlice.grouped.count} elementos menores.`}
                                </Typography>
                            </Box>
                        ) : dominantSlice ? (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Mayor Demanda Registrada
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {distinct} categorías detectadas
                                    </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap title={dominantSlice.label}>
                                    {dominantSlice.label}
                                </Typography>
                                <Typography variant="caption" color="#64748b">
                                    Lidera con <strong>{dominantSlice.count} consultas</strong> ({formatPermilleToPercent(dominantSlice.permille)} de la demanda analizada).
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                Selecciona una porción para inspeccionar detalles.
                            </Typography>
                        )}
                    </Box>
                </>
            )}
        </Paper>
    )
}
