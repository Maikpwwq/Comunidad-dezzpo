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
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import iconSet from '@assets/icomoon/selection.json'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// Lazy load IcoMoon to prevent SSR crashes
const IcoMoon = React.lazy(() => import('react-icomoon'))

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
    const [isMounted, setIsMounted] = useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

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
                    src="/assets/img/logo/Logo-Comunidad-Dezzpo.png"
                    alt="Logo Comunidad Dezzpo"
                    className="logo-comunidad-dezzpo me-2"
                    height="55px"
                    width="55px"
                />
            </Link>
            <Search sx={{ maxWidth: '300px', width: '100% !important' }}>
                <SearchIconWrapper>
                    {isMounted && (
                        <React.Suspense fallback={null}>
                            <IcoMoon
                                iconSet={iconSet}
                                icon="LupaFomularioIcono"
                                style={{
                                    height: '28px',
                                    marginRight: '8px',
                                    width: 'auto',
                                }}
                            />
                        </React.Suspense>
                    )}
                </SearchIconWrapper>
                <StyledSelect
                    sx={{
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        minWidth: '250px',
                        borderColor: 'white',
                    }}
                    className="w-100 text-gris"
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
                    {/* Render list only on client to avoid SSR overhead and potential Icon instantiation crashes */}
                    {isMounted && ListadoCategorias?.map((item: any) => {
                        const { key, label, icon: IconComponent } = item
                        return (
                            <MenuItem value={label} key={key}>
                                {IconComponent && (
                                    <Box component={IconComponent} sx={{ mr: 1, fontSize: '1.5rem' }} className="mx-2 my-1" />
                                )}
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
