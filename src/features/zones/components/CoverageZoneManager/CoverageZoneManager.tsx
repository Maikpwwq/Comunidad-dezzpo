/**
 * CoverageZoneManager Component
 *
 * Full management UI for coverage zones in /app/ajustes:
 * - Accessible Combobox with hover-prefetching & in-memory instant search across 1,122 municipalities
 * - Multi-selection tray with individual deletion and "Quitar todas"
 * - Resolution of legacy "otra-zona" chip with "Indicar cuál" CTA
 * - Cap enforcement (max 15 zones) with grandfathering
 * - Comma-separated list paste (R11)
 * - Grouped curated quick-access chips (excluding opaque 'otra-zona')
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Chip, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckIcon from '@mui/icons-material/Check'
import ReplayIcon from '@mui/icons-material/Replay'
import { MAX_COVERAGE_ZONES } from '@config/zones.config'
import {
    buildUnifiedCatalog,
    getCuratedZoneOptions,
    searchZones,
    parseStoredZones,
    canAddZone,
    formatZoneCount,
    resolveZoneDisplay,
    type ZoneId,
    type ZoneMatch,
} from '../../domain'
import {
    loadDivipolaDataset,
    prefetchDivipolaDataset,
    type DivipolaMunicipality,
} from '@services/matching/divipolaService'
import styles from './CoverageZoneManager.module.scss'

export interface CoverageZoneManagerProps {
    readonly coverageZones: readonly string[]
    readonly onCoverageZonesChange: (zones: string[]) => void
}

export const CoverageZoneManager: React.FC<CoverageZoneManagerProps> = ({
    coverageZones,
    onCoverageZonesChange,
}) => {
    // Dataset state
    const [divipolaItems, setDivipolaItems] = useState<DivipolaMunicipality[]>([])
    const [isLoadingDataset, setIsLoadingDataset] = useState(false)
    const [datasetLoadError, setDatasetLoadError] = useState(false)

    // Search combobox state
    const [searchQuery, setSearchQuery] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [liveAnnouncement, setLiveAnnouncement] = useState('')

    const searchInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLUListElement>(null)
    const comboboxContainerRef = useRef<HTMLDivElement>(null)

    // Parse stored zones using total pure parser
    const selectionState = useMemo(() => {
        return parseStoredZones(coverageZones, divipolaItems)
    }, [coverageZones, divipolaItems])

    const selectedSet = useMemo(() => {
        return new Set<ZoneId>(selectionState.zoneIds)
    }, [selectionState.zoneIds])

    // Load DIVIPOLA on demand
    const loadDataset = useCallback(async () => {
        if (divipolaItems.length > 0) return
        setIsLoadingDataset(true)
        setDatasetLoadError(false)
        try {
            const data = await loadDivipolaDataset()
            setDivipolaItems(data)
        } catch {
            setDatasetLoadError(true)
        } finally {
            setIsLoadingDataset(false)
        }
    }, [divipolaItems.length])

    // Unified catalog
    const unifiedCatalog = useMemo(() => {
        return buildUnifiedCatalog(divipolaItems)
    }, [divipolaItems])

    // Search results
    const searchResults = useMemo<ZoneMatch[]>(() => {
        return searchZones(unifiedCatalog, searchQuery, {
            selectedIds: selectedSet,
            limit: 25,
        })
    }, [unifiedCatalog, searchQuery, selectedSet])

    // Cap reached status
    const isCapReached = !canAddZone(selectionState, MAX_COVERAGE_ZONES)
    const isGrandfatheredOverCap = selectionState.zoneIds.length > MAX_COVERAGE_ZONES

    // Add or replace zone helper
    const handleAddZone = useCallback((zoneId: ZoneId, zoneLabel: string) => {
        if (selectedSet.has(zoneId)) return

        if (!canAddZone(selectionState, MAX_COVERAGE_ZONES)) {
            setLiveAnnouncement(`Llegaste al límite de ${MAX_COVERAGE_ZONES} zonas.`)
            return
        }

        // If legacy other zone was present, replace it seamlessly (R2)
        let nextZones = [...selectionState.zoneIds, zoneId]
        if (selectionState.unrecognized.length > 0) {
            nextZones = [...nextZones, ...selectionState.unrecognized]
        }

        onCoverageZonesChange(nextZones)
        setLiveAnnouncement(`Zona ${zoneLabel} agregada.`)
        setSearchQuery('')
        setHighlightedIndex(-1)
        searchInputRef.current?.focus()
    }, [selectedSet, selectionState, onCoverageZonesChange])

    // Remove zone helper
    const handleRemoveZone = useCallback((zoneIdToRemove: string, zoneLabel?: string) => {
        const nextZones = coverageZones.filter(
            (z) => z !== zoneIdToRemove && z.toLowerCase() !== zoneIdToRemove.toLowerCase()
        )
        onCoverageZonesChange(nextZones)
        setLiveAnnouncement(`Zona ${zoneLabel || zoneIdToRemove} quitada.`)
    }, [coverageZones, onCoverageZonesChange])

    // Remove all zones helper
    const handleClearAllZones = useCallback(() => {
        onCoverageZonesChange([])
        setLiveAnnouncement('Todas las zonas de cobertura fueron eliminadas.')
    }, [onCoverageZonesChange])

    // Handle legacy 'otra-zona' removal
    const handleRemoveLegacyOtherZone = useCallback(() => {
        const nextZones = coverageZones.filter(
            (z) => z !== 'otra-zona' && z.toLowerCase() !== 'otra zona'
        )
        onCoverageZonesChange(nextZones)
        setLiveAnnouncement('Otra zona sin especificar fue eliminada.')
    }, [coverageZones, onCoverageZonesChange])

    // Handle 'Indicar cuál' CTA
    const handleSpecifyOtherZone = useCallback(() => {
        loadDataset()
        setIsDropdownOpen(true)
        searchInputRef.current?.focus()
        setLiveAnnouncement('Escribe en el buscador el municipio o ciudad de tu otra zona.')
    }, [loadDataset])

    // Paste handling (R11 [DE]: "Suba, Chía, Cajicá")
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text')
        if (!text || (!text.includes(',') && !text.includes(';') && !text.includes('\n'))) {
            return
        }

        e.preventDefault()
        const chunks = text
            .split(/[,;\n]+/)
            .map((c) => c.trim())
            .filter(Boolean)

        if (chunks.length === 0) return

        let currentIds = [...selectionState.zoneIds]
        let addedCount = 0

        for (const chunk of chunks) {
            if (currentIds.length >= MAX_COVERAGE_ZONES) break
            const matches = searchZones(unifiedCatalog, chunk, {
                selectedIds: new Set(currentIds),
                limit: 1,
            })
            if (matches.length > 0 && matches[0]) {
                const best = matches[0].option
                if (!currentIds.includes(best.id)) {
                    currentIds.push(best.id)
                    addedCount++
                }
            }
        }

        if (addedCount > 0) {
            if (selectionState.unrecognized.length > 0) {
                currentIds = [...currentIds, ...selectionState.unrecognized]
            }
            onCoverageZonesChange(currentIds)
            setLiveAnnouncement(`Se agregaron ${addedCount} zonas desde el texto pegado.`)
            setSearchQuery('')
            setIsDropdownOpen(false)
        }
    }

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!isDropdownOpen) {
                setIsDropdownOpen(true)
                return
            }
            setHighlightedIndex((prev) =>
                searchResults.length > 0 ? (prev + 1) % searchResults.length : -1
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!isDropdownOpen) return
            setHighlightedIndex((prev) =>
                searchResults.length > 0
                    ? prev <= 0
                        ? searchResults.length - 1
                        : prev - 1
                    : -1
            )
        } else if (e.key === 'Enter') {
            if (isDropdownOpen && highlightedIndex >= 0 && searchResults[highlightedIndex]) {
                e.preventDefault()
                const target = searchResults[highlightedIndex]!
                handleAddZone(target.option.id, target.option.label)
            }
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setIsDropdownOpen(false)
            setHighlightedIndex(-1)
        } else if (e.key === 'Backspace' && !searchQuery) {
            // Delete last zone on backspace when input is empty
            if (selectionState.zoneIds.length > 0) {
                const lastId = selectionState.zoneIds[selectionState.zoneIds.length - 1]
                if (lastId) {
                    handleRemoveZone(lastId)
                }
            }
        }
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                comboboxContainerRef.current &&
                !comboboxContainerRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Highlight search match in label
    const renderHighlightedText = (text: string, query: string) => {
        if (!query.trim()) return text
        const lowerText = text.toLowerCase()
        const lowerQuery = query.toLowerCase().trim()
        const index = lowerText.indexOf(lowerQuery)
        if (index === -1) return text

        const before = text.slice(0, index)
        const match = text.slice(index, index + lowerQuery.length)
        const after = text.slice(index + lowerQuery.length)

        return (
            <>
                {before}
                <span className={styles.HighlightMatch}>{match}</span>
                {after}
            </>
        )
    }

    // Curated quick-access chips grouped
    const curatedOptions = useMemo(() => {
        return getCuratedZoneOptions()
    }, [])

    const bogotaLocalities = useMemo(() => {
        return curatedOptions.filter((opt) => opt.kind === 'localidad')
    }, [curatedOptions])

    const nearbyMunicipalities = useMemo(() => {
        return curatedOptions.filter((opt) => opt.kind === 'municipio')
    }, [curatedOptions])

    const macroAndSectors = useMemo(() => {
        return curatedOptions.filter(
            (opt) => opt.kind === 'macrozona' || opt.kind === 'sector' || opt.kind === 'area_metropolitana'
        )
    }, [curatedOptions])

    return (
        <div className={styles.ManagerContainer} onMouseEnter={prefetchDivipolaDataset}>
            {/* Screen reader live region */}
            <div aria-live="polite" className={styles.SrOnly}>
                {liveAnnouncement}
            </div>

            {/* ── Search Bar Combobox ── */}
            <div className={styles.SearchContainer} ref={comboboxContainerRef}>
                <div className={styles.ComboboxWrapper}>
                    <span className={styles.SearchIconLeading} aria-hidden="true">
                        {isLoadingDataset ? <CircularProgress size={18} color="inherit" /> : <SearchIcon fontSize="small" />}
                    </span>

                    <input
                        ref={searchInputRef}
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="listbox"
                        aria-controls="coverage-zone-results"
                        aria-activedescendant={
                            highlightedIndex >= 0 && searchResults[highlightedIndex]
                                ? `zone-opt-${searchResults[highlightedIndex]!.option.id}`
                                : undefined
                        }
                        className={styles.SearchInput}
                        placeholder="Buscar zona o municipio (ej: Medellín, Chía, Suba...)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setIsDropdownOpen(true)
                            setHighlightedIndex(-1)
                        }}
                        onFocus={() => {
                            loadDataset()
                            setIsDropdownOpen(true)
                        }}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        aria-label="Buscar zona o municipio de Colombia"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            className={styles.ClearSearchButton}
                            onClick={() => {
                                setSearchQuery('')
                                setIsDropdownOpen(false)
                                searchInputRef.current?.focus()
                            }}
                            aria-label="Borrar texto de búsqueda"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    )}
                </div>

                {/* Dropdown Results List */}
                {isDropdownOpen && (
                    <ul
                        id="coverage-zone-results"
                        role="listbox"
                        className={styles.ResultsDropdown}
                        ref={dropdownRef}
                    >
                        {isLoadingDataset && divipolaItems.length === 0 && (
                            <li className={styles.DropdownStatus}>
                                <CircularProgress size={20} sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Cargando catálogo de municipios...
                            </li>
                        )}

                        {datasetLoadError && (
                            <li className={styles.DropdownStatus}>
                                <div>No pudimos cargar todos los municipios de Colombia.</div>
                                <button
                                    type="button"
                                    className={styles.DropdownRetryButton}
                                    onClick={loadDataset}
                                >
                                    <ReplayIcon fontSize="small" /> Reintentar
                                </button>
                            </li>
                        )}

                        {!isLoadingDataset && searchResults.length === 0 && (
                            <li className={styles.DropdownStatus}>
                                No encontramos esa zona. Prueba con el nombre del municipio o departamento.
                            </li>
                        )}

                        {searchResults.map((match, idx) => {
                            const isHighlighted = idx === highlightedIndex
                            const isSelected = match.selected
                            const opt = match.option

                            return (
                                <li
                                    key={opt.id}
                                    id={`zone-opt-${opt.id}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.ResultItem} ${
                                        isHighlighted ? styles.ResultItemHighlighted : ''
                                    } ${isSelected ? styles.ResultItemSelected : ''}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            handleRemoveZone(opt.id, opt.label)
                                        } else {
                                            handleAddZone(opt.id, opt.label)
                                        }
                                    }}
                                >
                                    <div className={styles.ResultItemDetails}>
                                        <div className={styles.ResultItemLabel}>
                                            {renderHighlightedText(opt.label, searchQuery)}
                                        </div>
                                        {opt.parentLabel && (
                                            <div className={styles.ResultItemParent}>
                                                {renderHighlightedText(opt.parentLabel, searchQuery)}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {opt.curated && (
                                            <span className={styles.ResultBadge}>Destacada</span>
                                        )}
                                        {isSelected && (
                                            <CheckIcon
                                                fontSize="small"
                                                sx={{ color: 'var(--background-main-green-color, #00b0ab)', ml: 1 }}
                                            />
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* ── Selected Zones Tray ── */}
            <div className={styles.SelectedTray}>
                <div className={styles.TrayHeader}>
                    <span className={styles.TrayTitle}>
                        TUS ZONAS SELECCIONADAS ({selectionState.zoneIds.length}/{MAX_COVERAGE_ZONES})
                    </span>

                    {(selectionState.zoneIds.length > 0 || selectionState.hasLegacyOtherZone) && (
                        <button
                            type="button"
                            className={styles.ClearAllButton}
                            onClick={handleClearAllZones}
                        >
                            Quitar todas
                        </button>
                    )}
                </div>

                {/* Cap Warning */}
                {isGrandfatheredOverCap && (
                    <div className={styles.CapWarningBanner}>
                        <WarningAmberIcon fontSize="small" />
                        <span>
                            Tienes {selectionState.zoneIds.length} zonas guardadas. Para agregar nuevas zonas, primero debes tener menos de {MAX_COVERAGE_ZONES}.
                        </span>
                    </div>
                )}
                {isCapReached && !isGrandfatheredOverCap && (
                    <div className={styles.CapWarningBanner}>
                        <WarningAmberIcon fontSize="small" />
                        <span>
                            Llegaste al máximo de {MAX_COVERAGE_ZONES} zonas. Quita una para agregar otra.
                        </span>
                    </div>
                )}

                <div className={styles.TrayChipList}>
                    {/* Legacy 'otra-zona' resolution chip (R2) */}
                    {selectionState.hasLegacyOtherZone && (
                        <div className={styles.LegacyOtherZoneChip}>
                            <WarningAmberIcon fontSize="small" sx={{ color: '#ffab00' }} />
                            <span>Otra zona (sin especificar)</span>
                            <button
                                type="button"
                                className={styles.SpecifyActionBtn}
                                onClick={handleSpecifyOtherZone}
                            >
                                Indicar cuál
                            </button>
                            <button
                                type="button"
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#888888',
                                }}
                                onClick={handleRemoveLegacyOtherZone}
                                aria-label="Quitar otra zona sin especificar"
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </div>
                    )}

                    {/* Recognized Zone Chips */}
                    {selectionState.zoneIds.map((zoneId) => {
                        const display = resolveZoneDisplay(zoneId, divipolaItems)
                        return (
                            <Chip
                                key={zoneId}
                                label={display.parentLabel ? `${display.label} (${display.parentLabel})` : display.label}
                                onDelete={() => handleRemoveZone(zoneId, display.label)}
                                color="success"
                                variant="filled"
                                size="small"
                                sx={{
                                    fontWeight: 500,
                                    borderRadius: '16px',
                                    backgroundColor: 'var(--background-main-green-color, #00b0ab)',
                                    color: '#ffffff',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            color: '#ffffff',
                                        },
                                    },
                                }}
                            />
                        )
                    })}

                    {/* Unrecognized raw tags */}
                    {selectionState.unrecognized.map((tag) => (
                        <Chip
                            key={tag}
                            label={`${tag} (personalizada)`}
                            onDelete={() => handleRemoveZone(tag, tag)}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: '16px' }}
                        />
                    ))}

                    {selectionState.zoneIds.length === 0 && !selectionState.hasLegacyOtherZone && (
                        <span style={{ fontSize: '0.85rem', color: '#777777', fontStyle: 'italic' }}>
                            Aún no has seleccionado zonas de cobertura. Busca arriba o toca una de las sugerencias rápidas.
                        </span>
                    )}
                </div>
            </div>

            {/* ── Curated Quick Access ── */}
            <div className={styles.CuratedSection}>
                <div className={styles.CuratedSectionHeader}>
                    <span className={styles.CuratedSectionTitle}>
                        Zonas sugeridas de acceso rápido
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>
                        {formatZoneCount(selectionState.zoneIds.length)}
                    </span>
                </div>

                <div className={styles.CuratedGroups}>
                    {/* Localidades de Bogotá */}
                    <div>
                        <div className={styles.CuratedGroupSubhead}>Localidades de Bogotá</div>
                        <div className={styles.CuratedGrid}>
                            {bogotaLocalities.map((opt) => {
                                const isSelected = selectedSet.has(opt.id)
                                return (
                                    <Chip
                                        key={opt.id}
                                        label={opt.label}
                                        onClick={() => {
                                            if (isSelected) {
                                                handleRemoveZone(opt.id, opt.label)
                                            } else {
                                                handleAddZone(opt.id, opt.label)
                                            }
                                        }}
                                        color={isSelected ? 'success' : 'default'}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        size="small"
                                        disabled={!isSelected && isCapReached}
                                        sx={{ borderRadius: '16px' }}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Municipios Cercanos */}
                    <div>
                        <div className={styles.CuratedGroupSubhead}>Municipios Cercanos</div>
                        <div className={styles.CuratedGrid}>
                            {nearbyMunicipalities.map((opt) => {
                                const isSelected = selectedSet.has(opt.id)
                                return (
                                    <Chip
                                        key={opt.id}
                                        label={opt.label}
                                        onClick={() => {
                                            if (isSelected) {
                                                handleRemoveZone(opt.id, opt.label)
                                            } else {
                                                handleAddZone(opt.id, opt.label)
                                            }
                                        }}
                                        color={isSelected ? 'success' : 'default'}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        size="small"
                                        disabled={!isSelected && isCapReached}
                                        sx={{ borderRadius: '16px' }}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Macrozonas y Sectores */}
                    <div>
                        <div className={styles.CuratedGroupSubhead}>Macrozonas y Sectores</div>
                        <div className={styles.CuratedGrid}>
                            {macroAndSectors.map((opt) => {
                                const isSelected = selectedSet.has(opt.id)
                                return (
                                    <Chip
                                        key={opt.id}
                                        label={opt.label}
                                        onClick={() => {
                                            if (isSelected) {
                                                handleRemoveZone(opt.id, opt.label)
                                            } else {
                                                handleAddZone(opt.id, opt.label)
                                            }
                                        }}
                                        color={isSelected ? 'success' : 'default'}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        size="small"
                                        disabled={!isSelected && isCapReached}
                                        sx={{ borderRadius: '16px' }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
