/**
 * HomeCategoryChips Component
 *
 * Full service category chips shelf for the homepage:
 * 1. Displays all 92 service categories arranged in at least 3 rows
 * 2. Default mode: 3-row horizontal swipeable track with smooth navigation arrows on desktop
 * 3. Mobile optimized: compact 3-row touch scrolling that prevents page stretching
 * 4. Direct SEO anchor links to category landing pages (/{slug}/bogota)
 */

import React, { useRef, useState, useCallback, useMemo } from 'react'
import { navigate } from 'vike/client/router'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { persistPendingSearchContext } from '@services/matching/searchContextCodec'
import styles from './HomeCategoryChips.module.scss'

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

interface CategoryChipItem {
    key: number
    label: string
    slug: string
}

export function HomeCategoryChips(): React.ReactElement {
    const trackRef = useRef<HTMLDivElement>(null)
    const [isGridExpanded, setIsGridExpanded] = useState(false)

    const categories = useMemo<CategoryChipItem[]>(() => {
        return ListadoCategorias.map((cat) => ({
            key: cat.key,
            label: cat.label,
            slug: slugify(cat.label),
        }))
    }, [])

    const handleScroll = useCallback((direction: 'left' | 'right') => {
        if (!trackRef.current) return
        const scrollAmount = direction === 'left' ? -420 : 420
        trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }, [])

    const handleChipClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, item: CategoryChipItem) => {
        e.preventDefault()
        // Save matching context so downstream booking / search preserves the chosen category
        persistPendingSearchContext({
            category: item.label,
            zone: 'bogota',
        })
        const targetUrl = `/${item.slug}/bogota`
        navigate(targetUrl)
    }, [])

    return (
        <section className={styles.Section} aria-label="Categorías de servicios disponibles">
            <div className={styles.Container}>
                <div className={styles.Header}>
                    <p className={styles.Subtitle}>
                        Así te mostramos primero a quienes mejor encajan con tu proyecto.
                    </p>
                    <button
                        type="button"
                        className={styles.ToggleViewBtn}
                        onClick={() => setIsGridExpanded((prev) => !prev)}
                        aria-expanded={isGridExpanded}
                    >
                        {isGridExpanded ? (
                            <>
                                <ViewStreamIcon fontSize="inherit" />
                                <span>Ver en 3 filas deslizables</span>
                            </>
                        ) : (
                            <>
                                <GridViewIcon fontSize="inherit" />
                                <span>Ver todas en cuadrícula ({categories.length})</span>
                            </>
                        )}
                    </button>
                </div>

                <div className={styles.TrackWrapper}>
                    {!isGridExpanded && (
                        <>
                            <button
                                type="button"
                                className={`${styles.NavButton} ${styles.NavPrev}`}
                                onClick={() => handleScroll('left')}
                                aria-label="Desplazar categorías hacia la izquierda"
                            >
                                <ChevronLeftIcon fontSize="medium" />
                            </button>
                            <button
                                type="button"
                                className={`${styles.NavButton} ${styles.NavNext}`}
                                onClick={() => handleScroll('right')}
                                aria-label="Desplazar categorías hacia la derecha"
                            >
                                <ChevronRightIcon fontSize="medium" />
                            </button>
                        </>
                    )}

                    <div
                        ref={trackRef}
                        className={isGridExpanded ? styles.GridTrack : styles.ScrollTrack}
                        role="region"
                        aria-label="Listado de categorías de servicios"
                    >
                        {categories.map((cat) => (
                            <a
                                key={cat.key}
                                href={`/${cat.slug}/bogota`}
                                className={styles.Chip}
                                onClick={(e) => handleChipClick(e, cat)}
                                title={`Buscar profesionales de ${cat.label} en Bogotá`}
                            >
                                {cat.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeCategoryChips
