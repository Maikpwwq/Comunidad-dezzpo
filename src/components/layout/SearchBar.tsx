/**
 * SearchBar Component
 *
 * Category search bar for portal-servicios.
 * Migrated from src/app/components/SearchBar.tsx
 */

import React, { useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import Link from '@hooks/Link'
import { styled, alpha } from '@mui/material/styles'
import IcoMoon from 'react-icomoon'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import iconSet from '@assets/icomoon/selection.json'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// Logo
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.5),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledSelect = styled(Select)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
        },
    },
}))

export interface SearchBarProps {
    /** Additional className */
    className?: string
}

export function SearchBar({ className }: SearchBarProps): React.ReactElement {
    const [searchInput, setSearchInput] = useState<string[]>([])

    const handleSearch = useCallback((query: string) => {
        const handleSpacedText = query.replace(/ /g, '+')
        navigate(`/app/portal-servicios/${handleSpacedText}`)
    }, [])

    const handleChange = useCallback(
        (event: SelectChangeEvent<unknown>) => {
            const values = event.target.value as string[]
            if (values.length > 0) {
                const lastValue = values[values.length - 1]
                if (lastValue) {
                    setSearchInput([lastValue])
                    handleSearch(lastValue)
                }
            }
        },
        [handleSearch]
    )

    return (
        <Box
            className={className}
            sx={{
                display: 'flex',
                minWidth: '230px',
                alignItems: 'center',
            }}
        >
            <Link href="/app/portal-servicios" className="activo body-2 p-2 d-flex flex-row">
                <img
                    src={LogoMenuComunidadDezzpo}
                    alt="Logo Comunidad Dezzpo"
                    className="logo-comunidad-dezzpo me-2"
                    height="55px"
                    width="55px"
                />
            </Link>
            <Search sx={{ maxWidth: '300px', width: '100% !important' }}>
                <SearchIconWrapper>
                    <IcoMoon
                        iconSet={iconSet}
                        icon="LupaFomularioIcono"
                        style={{
                            height: '28px',
                            marginRight: '8px',
                            width: 'auto',
                        }}
                    />
                </SearchIconWrapper>
                <StyledSelect
                    sx={{
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        minWidth: '250px',
                        borderColor: 'white',
                    }}
                    className="w-100 textGris"
                    id="search-select-category"
                    name="searchInput"
                    multiple
                    value={searchInput}
                    onChange={handleChange}
                    inputProps={{
                        'aria-label': 'search',
                    }}
                >
                    <MenuItem value="">Seleccionar categoría</MenuItem>
                    {ListadoCategorias?.map((item: { key: number; label: string; icon?: React.ReactNode }) => {
                        const { key, label, icon } = item
                        return (
                            <MenuItem value={label} key={key}>
                                {icon}
                                {label}
                            </MenuItem>
                        )
                    })}
                </StyledSelect>
            </Search>
        </Box>
    )
}

export default SearchBar
