/**
 * ZoneSelector Component
 *
 * Unified zone picker for home and app views:
 * 1. Primary dropdown with Bogotá first, followed immediately by «Otra zona» (R6),
 *    and metropolitan localities/municipalities.
 * 2. When «Otra zona» is selected, smoothly activates ZoneCombobox with hover prefetching.
 */

import React, { useState, useEffect } from 'react'
import { HOME_ZONE_OPTIONS } from '@assets/data/ListadoZonas'
import { prefetchDivipolaDataset, type DivipolaMunicipality } from '@services/matching/divipolaService'
import { ZoneCombobox } from './ZoneCombobox'
import styles from './ZoneSelector.module.scss'

export interface ZoneSelectionValue {
    zone: string
    municipioCode?: string | null | undefined
    municipioName?: string | null | undefined
}

export interface ZoneSelectorProps {
    /** Current selected zone slug (e.g. 'bogota', 'chapinero', 'otra-zona') */
    value: string
    /** Current selected DIVIPOLA municipality code if zone === 'otra-zona' */
    municipioCode?: string | null | undefined
    /** Current selected municipality label if zone === 'otra-zona' */
    municipioName?: string | null | undefined
    /** Callback on zone change */
    onChange: (val: ZoneSelectionValue) => void
    /** Custom class name */
    className?: string
    /** Compact / embedded mode */
    compact?: boolean
}

export function ZoneSelector({
    value,
    municipioCode,
    municipioName,
    onChange,
    className = '',
    compact = false,
}: ZoneSelectorProps): React.ReactElement {
    const [isOtraZona, setIsOtraZona] = useState(value === 'otra-zona')

    useEffect(() => {
        setIsOtraZona(value === 'otra-zona')
    }, [value])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value
        if (selected === 'otra-zona') {
            setIsOtraZona(true)
            prefetchDivipolaDataset()
            onChange({ zone: 'otra-zona', municipioCode: null, municipioName: null })
        } else {
            setIsOtraZona(false)
            onChange({ zone: selected, municipioCode: null, municipioName: null })
        }
    }

    const handleMunicipalitySelect = (municipality: DivipolaMunicipality | null) => {
        if (municipality) {
            onChange({
                zone: 'otra-zona',
                municipioCode: municipality.code,
                municipioName: municipality.label,
            })
        } else {
            onChange({
                zone: 'otra-zona',
                municipioCode: null,
                municipioName: null,
            })
        }
    }

    const handleCancelOtraZona = () => {
        setIsOtraZona(false)
        onChange({ zone: 'bogota', municipioCode: null, municipioName: null })
    }

    return (
        <div
            className={`${styles.Container} ${compact ? styles.Compact : ''} ${className}`}
            onMouseEnter={prefetchDivipolaDataset}
        >
            {!isOtraZona ? (
                <select
                    className={styles.Select}
                    value={value}
                    onChange={handleSelectChange}
                    onFocus={prefetchDivipolaDataset}
                    aria-label="Seleccionar ciudad o zona"
                >
                    {HOME_ZONE_OPTIONS.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <div className={styles.OtraZonaWrapper}>
                    <ZoneCombobox
                        selectedCode={municipioCode}
                        selectedName={municipioName}
                        onSelect={handleMunicipalitySelect}
                        onCancel={handleCancelOtraZona}
                        autoFocus
                    />
                </div>
            )}
        </div>
    )
}
export default ZoneSelector
