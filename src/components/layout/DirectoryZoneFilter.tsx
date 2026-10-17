import React from 'react'
import { TextField, MenuItem, Divider } from '@mui/material'
import { DIRECTORY_ZONE_OPTIONS } from '@assets/data/ListadoZonas'
import { ZoneCombobox } from '@components/common/ZoneSelector/ZoneCombobox'

export interface DirectoryZoneFilterProps {
    activeZone: string | null
    activeMpioCode?: string | null | undefined
    activeMpioName?: string | null | undefined
    onChange: (zone: string | null, mpioCode?: string | null, mpioName?: string | null) => void
    label?: string
}

/**
 * DirectoryZoneFilter
 *
 * Zone filter for directory filter bars:
 * - Shows 'Otra zona' as the 2nd option immediately after 'Todas las zonas' (matching QuickMatch Home convention).
 * - When 'Otra zona' is selected, seamlessly activates the assisted DIVIPOLA municipality search engine (ZoneCombobox).
 * - Canceling or clearing gracefully returns to standard zone selection.
 */
export const DirectoryZoneFilter: React.FC<DirectoryZoneFilterProps> = ({
    activeZone,
    activeMpioCode,
    activeMpioName,
    onChange,
    label = 'Filtrar por Zona',
}) => {
    // When "otra-zona" is active, render the assisted place search (ZoneCombobox)
    if (activeZone === 'otra-zona') {
        return (
            <ZoneCombobox
                variant="mui"
                selectedCode={activeMpioCode}
                selectedName={activeMpioName}
                onSelect={(mpio) => {
                    if (mpio) {
                        onChange('otra-zona', mpio.code, mpio.label)
                    } else {
                        onChange('otra-zona', null, null)
                    }
                }}
                onCancel={() => {
                    onChange(null, null, null)
                }}
                placeholder="¿En qué ciudad o municipio?"
                autoFocus
            />
        )
    }

    // Otherwise render standard MUI TextField Select with "Otra zona" as the 2nd option
    return (
        <TextField
            select
            fullWidth
            size="small"
            label={label}
            value={activeZone || ''}
            onChange={(e) => {
                const val = e.target.value
                if (val === 'otra-zona') {
                    onChange('otra-zona', null, null)
                } else {
                    onChange(val || null, null, null)
                }
            }}
        >
            <MenuItem value="">
                <em>Todas las zonas</em>
            </MenuItem>
            {DIRECTORY_ZONE_OPTIONS.map((opt) => (
                <React.Fragment key={opt.slug}>
                    <MenuItem
                        value={opt.slug}
                        sx={
                            opt.slug === 'otra-zona'
                                ? { fontWeight: 700, color: 'var(--background-main-green-color, #00b0ab)' }
                                : {}
                        }
                    >
                        {opt.label}
                    </MenuItem>
                    {/* Add visual separator after 'otra-zona' (the 2nd option) for maximum clarity */}
                    {opt.slug === 'otra-zona' && <Divider sx={{ my: 0.5 }} />}
                </React.Fragment>
            ))}
        </TextField>
    )
}

export default DirectoryZoneFilter
