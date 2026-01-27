/**
 * CategorySelector Component
 *
 * Reusable category dropdown selector for projects.
 * Migrated from src/index/components/SeleccionarCategoria.jsx
 */

import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'

import { ListadoCategorias } from '@index/components/ListadoCategorias'
import type { ProjectDraftInfo } from '../types'

const StyledSelect = styled(Select)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingRight: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
        },
    },
}))

export interface CategorySelectorProps {
    /** Current draft info */
    draftInfo: ProjectDraftInfo
    /** State setter for draft info */
    setDraftInfo: (info: ProjectDraftInfo) => void
    /** Callback when loading state changes */
    setIsLoaded?: (loaded: boolean) => void
    /** Field name in draftInfo */
    fieldName?: string
    /** Custom className */
    className?: string
}

export function CategorySelector({
    draftInfo,
    setDraftInfo,
    setIsLoaded,
    fieldName = 'draftCategory',
    className = 'mt-1',
}: CategorySelectorProps): React.ReactElement {
    const handleChange = useCallback(
        (event: SelectChangeEvent<unknown>) => {
            const value = event.target.value as string
            setDraftInfo({
                ...draftInfo,
                [fieldName]: value,
            })
            setIsLoaded?.(false)
        },
        [draftInfo, setDraftInfo, fieldName, setIsLoaded]
    )

    const currentValue = draftInfo?.[fieldName] ?? 0

    return (
        <Box className={className}>
            <StyledSelect
                className="casillaSeleccion form-select w-100 m-auto p-0 textGris"
                style={{ textAlign: 'left' }}
                name={fieldName}
                value={currentValue}
                onChange={handleChange}
                inputProps={{
                    'aria-label': 'Seleccionar categoría',
                }}
            >
                <MenuItem className="py-1 px-3" value={0}>
                    seleccionar categoria
                </MenuItem>
                {ListadoCategorias?.map((item) => {
                    const { key, label, icon } = item
                    return (
                        <MenuItem value={label} key={key}>
                            {icon}
                            {label}
                        </MenuItem>
                    )
                })}
            </StyledSelect>
        </Box>
    )
}

export default CategorySelector
