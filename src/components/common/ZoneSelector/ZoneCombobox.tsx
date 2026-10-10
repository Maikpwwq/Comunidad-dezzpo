/**
 * ZoneCombobox Component
 *
 * Accessible (WAI-ARIA 1.2) combobox for Colombian municipality selection
 * using the official DIVIPOLA dataset (1,122 municipalities).
 *
 * Implements hover prefetching as requested:
 * Loads the dataset on mouseEnter / focus for instantaneous perceived performance.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
    searchMunicipalities,
    prefetchDivipolaDataset,
    getMunicipalityByCode,
    type DivipolaMunicipality,
} from '@services/matching/divipolaService'
import styles from './ZoneCombobox.module.scss'

export interface ZoneComboboxProps {
    /** 5-digit DIVIPOLA municipality code if already selected */
    selectedCode?: string | null | undefined
    /** Municipality name if already known */
    selectedName?: string | null | undefined
    /** Callback triggered when a municipality is selected or cleared */
    onSelect: (municipality: DivipolaMunicipality | null) => void
    /** Callback when user cancels or clears "otra zona" */
    onCancel?: () => void
    /** Custom placeholder */
    placeholder?: string
    /** Whether to autoFocus the input field */
    autoFocus?: boolean
}

export function ZoneCombobox({
    selectedCode,
    selectedName,
    onSelect,
    onCancel,
    placeholder = '¿En qué ciudad o municipio?',
    autoFocus = false,
}: ZoneComboboxProps): React.ReactElement {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<DivipolaMunicipality[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [statusMessage, setStatusMessage] = useState('')
    const [currentSelection, setCurrentSelection] = useState<DivipolaMunicipality | null>(null)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const listboxRef = useRef<HTMLUListElement>(null)

    // Hydrate currentSelection from selectedCode if provided
    useEffect(() => {
        if (selectedCode) {
            getMunicipalityByCode(selectedCode).then((m) => {
                if (m) {
                    setCurrentSelection(m)
                } else if (selectedName) {
                    setCurrentSelection({
                        code: selectedCode,
                        departamentoCode: '',
                        municipio: selectedName,
                        departamento: '',
                        label: selectedName,
                        normalized: selectedName.toLowerCase(),
                    })
                }
            })
        } else {
            setCurrentSelection(null)
        }
    }, [selectedCode, selectedName])

    // Live search debounced query
    const performSearch = useCallback(async (searchTerm: string) => {
        setIsLoading(true)
        try {
            const matches = await searchMunicipalities(searchTerm, 12)
            setResults(matches)
            setIsOpen(true)
            setHighlightedIndex(-1)

            if (matches.length === 0) {
                setStatusMessage('No encontramos esa zona. Prueba con otro nombre; igual verás profesionales de todo el país.')
            } else {
                setStatusMessage(`${matches.length} municipios encontrados.`)
            }
        } catch {
            setResults([])
            setStatusMessage('Error al cargar municipios.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        performSearch(val)
    }

    const handleSelectOption = (item: DivipolaMunicipality) => {
        setCurrentSelection(item)
        setQuery('')
        setIsOpen(false)
        onSelect(item)
    }

    const handleClear = () => {
        setCurrentSelection(null)
        setQuery('')
        setResults([])
        setIsOpen(false)
        onSelect(null)
        if (onCancel) {
            onCancel()
        } else {
            inputRef.current?.focus()
        }
    }

    // Keyboard navigation (WAI-ARIA 1.2 Combobox pattern)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault()
            performSearch(query)
            return
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (results.length > 0) {
                setHighlightedIndex((prev) => (prev + 1) % results.length)
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (results.length > 0) {
                setHighlightedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
            }
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (highlightedIndex >= 0 && results[highlightedIndex]) {
                handleSelectOption(results[highlightedIndex]!)
            }
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setIsOpen(false)
            if (onCancel) onCancel()
        }
    }

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Hover / Focus prefetcher for lightning-fast dataset ready state
    const handlePrefetch = useCallback(() => {
        prefetchDivipolaDataset()
    }, [])

    return (
        <div
            className={styles.ComboboxWrapper}
            ref={wrapperRef}
            onMouseEnter={handlePrefetch}
        >
            {/* If municipality is selected, display concise removable chip */}
            {currentSelection ? (
                <div className={styles.SelectedBadge}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LocationOnIcon fontSize="small" />
                        <span>{currentSelection.label}</span>
                    </div>
                    <button
                        type="button"
                        className={styles.ClearButton}
                        onClick={handleClear}
                        aria-label={`Cambiar zona: ${currentSelection.label}`}
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>
            ) : (
                <div
                    className={`${styles.InputContainer} ${isOpen ? styles.InputContainerActive : ''}`}
                >
                    <span className={styles.IconLeading}>
                        {isLoading ? <LocationOnIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
                    </span>

                    <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        aria-controls="divipola-listbox"
                        aria-activedescendant={
                            highlightedIndex >= 0 && results[highlightedIndex]
                                ? `divipola-option-${results[highlightedIndex]!.code}`
                                : undefined
                        }
                        className={styles.InputField}
                        placeholder={placeholder}
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            handlePrefetch()
                            if (query.trim() || results.length > 0) setIsOpen(true)
                        }}
                        autoFocus={autoFocus}
                        aria-label="Buscar municipio de Colombia"
                    />

                    {query && (
                        <button
                            type="button"
                            className={styles.ClearButton}
                            onClick={() => {
                                setQuery('')
                                setResults([])
                                setIsOpen(false)
                                inputRef.current?.focus()
                            }}
                            aria-label="Borrar texto de búsqueda"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    )}
                </div>
            )}

            {/* Polite screen reader announcement */}
            <div className={styles.VisuallyHidden} aria-live="polite">
                {statusMessage}
            </div>

            {/* Autocomplete Dropdown List */}
            {isOpen && (
                <ul
                    id="divipola-listbox"
                    role="listbox"
                    ref={listboxRef}
                    className={styles.DropdownList}
                    aria-label="Sugerencias de municipios de Colombia"
                >
                    {results.length > 0 ? (
                        results.map((item, index) => {
                            const isHighlighted = index === highlightedIndex
                            const isSelected = currentSelection?.code === item.code

                            return (
                                <li
                                    key={item.code}
                                    id={`divipola-option-${item.code}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.DropdownItem} ${
                                        isHighlighted ? styles.Highlighted : ''
                                    } ${isSelected ? styles.Selected : ''}`}
                                    onClick={() => handleSelectOption(item)}
                                >
                                    <span className={styles.MunicipioName}>{item.municipio}</span>
                                    <span className={styles.DepartamentoName}>{item.departamento}</span>
                                </li>
                            )
                        })
                    ) : (
                        <li className={styles.StatusMessage}>
                            {isLoading ? (
                                'Cargando municipios oficiales...'
                            ) : (
                                <>
                                    No encontramos esa zona. Prueba con otro nombre;
                                    <br />
                                    igual verás profesionales de todo el país.
                                </>
                            )}
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}
export default ZoneCombobox
