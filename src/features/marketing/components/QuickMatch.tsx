/**
 * QuickMatch Component
 *
 * Single-input matching field for the homepage hero with:
 * 1. Service fuzzy-match search against 92 categories
 * 2. Property Type (Inmueble) selection context (Hogar, PH, Negocio, etc.)
 * 3. Zone selection with «Otra zona» and DIVIPOLA hover prefetching
 * 4. Context preservation across URL parameters and auth flows
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { Box, Typography, Paper, InputBase, IconButton, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    PROPERTY_TYPE_IDS,
    PROPERTY_TYPE_METADATA,
    type PropertyTypeId,
    normalizePropertyType,
} from '@config/matching.config'
import { ZoneSelector, type ZoneSelectionValue } from '@components/common/ZoneSelector'
import {
    encodeSearchContext,
    persistPendingSearchContext,
} from '@services/matching/searchContextCodec'
import { useUserStore } from '@stores/userStore'
import styles from './QuickMatch.module.scss'

interface MatchResult {
    key: number
    label: string
    rol: string
    slug: string
}

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

// Pre-build search index
const SEARCH_INDEX: MatchResult[] = ListadoCategorias.map((cat) => ({
    key: cat.key,
    label: cat.label,
    rol: cat.rol || cat.label,
    slug: slugify(cat.label),
}))

export function QuickMatch(): React.ReactElement {
    const [query, setQuery] = useState('')
    const [matches, setMatches] = useState<MatchResult[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedZone, setSelectedZone] = useState('bogota')
    const [selectedMpioCode, setSelectedMpioCode] = useState<string | null>(null)
    const [selectedMpioName, setSelectedMpioName] = useState<string | null>(null)
    const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeId | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    const userRole = useUserStore((state) => state.rol)
    const userClasification = useUserStore((state) => (state as unknown as { userClasification?: string }).userClasification)

    useEffect(() => {
        if (userRole === 1 && userClasification) {
            const canonical = normalizePropertyType(userClasification)
            if (canonical) {
                setSelectedPropertyType(canonical)
            }
        }
    }, [userRole, userClasification])

    const handleSearch = useCallback((value: string) => {
        setQuery(value)
        if (value.length < 2) {
            setMatches([])
            setShowDropdown(false)
            return
        }

        const normalized = value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

        const results = SEARCH_INDEX.filter((item) => {
            const labelNorm = item.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const rolNorm = item.rol.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            return labelNorm.includes(normalized) || rolNorm.includes(normalized)
        }).slice(0, 6)

        setMatches(results)
        setShowDropdown(results.length > 0)
    }, [])

    const handleZoneChange = useCallback((val: ZoneSelectionValue) => {
        setSelectedZone(val.zone)
        setSelectedMpioCode(val.municipioCode || null)
        setSelectedMpioName(val.municipioName || null)
    }, [])

    const handleTogglePropertyType = useCallback((typeId: PropertyTypeId) => {
        setSelectedPropertyType((prev) => (prev === typeId ? null : typeId))
    }, [])

    const navigateWithContext = useCallback(
        (serviceSlug: string, serviceLabel: string) => {
            const contextState = {
                category: serviceLabel,
                propertyType: selectedPropertyType,
                zone: selectedZone,
                municipioCode: selectedMpioCode,
                municipioName: selectedMpioName,
            }

            // Persist in session storage for auth survival
            persistPendingSearchContext(contextState)

            // Construct query parameters for URL porting
            const queryParams = encodeSearchContext({
                propertyType: selectedPropertyType,
                municipioCode: selectedMpioCode,
                municipioName: selectedMpioName,
            })

            const targetUrl = `/${serviceSlug}/${selectedZone}${queryParams}`
            navigate(targetUrl)
        },
        [selectedPropertyType, selectedZone, selectedMpioCode, selectedMpioName]
    )

    const handleSelectMatch = useCallback(
        (match: MatchResult) => {
            setQuery(match.label)
            setShowDropdown(false)
            navigateWithContext(match.slug, match.label)
        },
        [navigateWithContext]
    )

    const handleSubmit = useCallback(() => {
        if (matches.length > 0 && matches[0]) {
            handleSelectMatch(matches[0])
        } else if (query.trim()) {
            const contextState = {
                category: query.trim(),
                propertyType: selectedPropertyType,
                zone: selectedZone,
                municipioCode: selectedMpioCode,
                municipioName: selectedMpioName,
            }
            persistPendingSearchContext(contextState)

            const queryParams = encodeSearchContext({
                category: query.trim(),
                propertyType: selectedPropertyType,
                zone: selectedZone,
                municipioCode: selectedMpioCode,
                municipioName: selectedMpioName,
            })
            navigate(`/nuevo-proyecto${queryParams}`)
        }
    }, [matches, query, handleSelectMatch, selectedPropertyType, selectedZone, selectedMpioCode, selectedMpioName])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
            }
        },
        [handleSubmit]
    )

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={styles.Container} ref={containerRef}>
            <Typography variant="h2" className={styles.Title || ''}>
                ¿Qué necesitas para tu proyecto?
            </Typography>

            <Paper className={styles.SearchBar || ''} elevation={0}>
                <InputBase
                    className={styles.Input || ''}
                    placeholder="Ej: plomero, electricista, pintura..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    inputProps={{
                        'aria-label': 'buscar servicio',
                        id: 'quick-match-input',
                    }}
                />

                <div className={styles.ZoneContainer}>
                    <ZoneSelector
                        value={selectedZone}
                        municipioCode={selectedMpioCode}
                        municipioName={selectedMpioName}
                        onChange={handleZoneChange}
                    />
                </div>

                <IconButton
                    className={styles.SearchButton || ''}
                    onClick={handleSubmit}
                    aria-label="buscar profesionales"
                >
                    <SearchIcon />
                </IconButton>
            </Paper>

            {/* Autocomplete dropdown */}
            {showDropdown && (
                <Paper className={styles.Dropdown || ''} elevation={4}>
                    {matches.map((match) => (
                        <button
                            key={match.key}
                            className={styles.DropdownItem}
                            onClick={() => handleSelectMatch(match)}
                            type="button"
                        >
                            <span className={styles.DropdownLabel}>{match.label}</span>
                            <span className={styles.DropdownRol}>{match.rol}</span>
                        </button>
                    ))}
                </Paper>
            )}

            {/* Property Type Selection Section (R1) */}
            <div className={styles.PropertySection}>
                <div className={styles.PropertyHeader}>
                    <span>Tipo de inmueble:</span>
                    <Tooltip
                        title="Selecciona el tipo de inmueble para priorizar profesionales con la estructura legal y operativa adecuada para tu proyecto."
                        arrow
                    >
                        <HelpOutlineIcon fontSize="inherit" sx={{ cursor: 'pointer', color: '#94a3b8' }} />
                    </Tooltip>
                </div>

                <div className={styles.PropertyChipsList} role="group" aria-label="Seleccionar tipo de inmueble">
                    {PROPERTY_TYPE_IDS.map((typeId) => {
                        const meta = PROPERTY_TYPE_METADATA[typeId]
                        const isActive = selectedPropertyType === typeId

                        return (
                            <button
                                key={typeId}
                                type="button"
                                className={`${styles.PropertyChip} ${isActive ? styles.PropertyChipActive : ''}`}
                                onClick={() => handleTogglePropertyType(typeId)}
                                aria-pressed={isActive}
                            >
                                <span>{meta.label}</span>
                            </button>
                        )
                    })}
                </div>

                <span className={styles.PropertyHelper}>
                    Así te mostramos primero a quienes mejor encajan con tu proyecto.
                </span>
            </div>

            {/* Quick category chips */}
            <Box className={styles.QuickChips}>
                {SEARCH_INDEX.slice(0, 8).map((cat) => (
                    <button
                        key={cat.key}
                        className={styles.Chip}
                        onClick={() => handleSelectMatch(cat)}
                        type="button"
                    >
                        {cat.label}
                    </button>
                ))}
            </Box>
        </div>
    )
}

export default QuickMatch
