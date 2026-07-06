/**
 * QuickMatch Component
 *
 * Single-input matching field for the homepage hero.
 * Types a need → fuzzy-matches against ListadoCategorias → navigates to
 * the matching discovery page (/{service-slug}/{zone}) or nuevo-proyecto.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zoneNames } from '@assets/data/ListadoZonas'
import { Box, Typography, Paper, InputBase, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
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

const ZONES = Object.entries(zoneNames).map(([slug, label]) => ({
    slug,
    label
}))

// Pre-build search index
const SEARCH_INDEX: MatchResult[] = ListadoCategorias.map((cat) => ({
    key: cat.key,
    label: cat.label,
    rol: cat.rol || cat.label,
    slug: slugify(cat.label),
}))

export function QuickMatch() {
    const [query, setQuery] = useState('')
    const [matches, setMatches] = useState<MatchResult[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedZone, setSelectedZone] = useState('bogota')
    const containerRef = useRef<HTMLDivElement>(null)

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

    const handleSelect = useCallback((match: MatchResult) => {
        setQuery(match.label)
        setShowDropdown(false)
        navigate(`/${match.slug}/${selectedZone}`)
    }, [selectedZone])

    const handleSubmit = useCallback(() => {
        if (matches.length > 0 && matches[0]) {
            handleSelect(matches[0])
        } else if (query.trim()) {
            // Fallback: go to nuevo-proyecto with the query as description
            navigate(`/nuevo-proyecto?q=${encodeURIComponent(query.trim())}`)
        }
    }, [matches, query, handleSelect])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
    }, [handleSubmit])

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
                ¿Qué necesitas para tu hogar?
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

                <select
                    className={styles.ZoneSelect}
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    aria-label="seleccionar zona"
                >
                    {ZONES.map((z) => (
                        <option key={z.slug} value={z.slug}>
                            {z.label}
                        </option>
                    ))}
                </select>

                <IconButton
                    className={styles.SearchButton || ''}
                    onClick={handleSubmit}
                    aria-label="buscar"
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
                            onClick={() => handleSelect(match)}
                            type="button"
                        >
                            <span className={styles.DropdownLabel}>{match.label}</span>
                            <span className={styles.DropdownRol}>{match.rol}</span>
                        </button>
                    ))}
                </Paper>
            )}

            {/* Quick category chips */}
            <Box className={styles.QuickChips}>
                {SEARCH_INDEX.slice(0, 8).map((cat) => (
                    <button
                        key={cat.key}
                        className={styles.Chip}
                        onClick={() => handleSelect(cat)}
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
