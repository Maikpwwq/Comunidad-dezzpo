/**
 * SearchBar Component
 *
 * Searchable category selector for portal-servicios.
 * Uses MUI Autocomplete with brand-styled dropdown.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import Link from '@hooks/Link'
import {
    Autocomplete,
    TextField,
    Box,
    Paper,
    InputAdornment,
    Typography
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'

import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { CategoryIcons } from '@assets/data/CategoryIcons'

/** Shape of each category option */
interface CategoryOption {
    key: number
    label: string
    iconName?: string
    [k: string]: any
}

export interface SearchBarProps {
    className?: string | undefined
    targetRoutePrefix?: string | undefined
    onCategorySelect?: ((categoryLabel: string) => void) | undefined
    onSearchChange?: ((queryText: string) => void) | undefined
    placeholder?: string | undefined
    initialValue?: string | undefined
}

export function SearchBar({
    className,
    targetRoutePrefix = '/app/portal-servicios',
    onCategorySelect,
    onSearchChange,
    placeholder = 'Buscar categoría, comerciante o palabra clave...',
    initialValue = '',
}: SearchBarProps): React.ReactElement {
    const [inputValue, setInputValue] = useState(initialValue)
    const [selectedValue, setSelectedValue] = useState<string | CategoryOption | null>(initialValue || null)

    useEffect(() => {
        if (initialValue !== undefined) {
            setInputValue(initialValue)
            setSelectedValue(initialValue || null)
        }
    }, [initialValue])

    const executeSearch = useCallback(
        (queryText: string) => {
            const cleanQuery = queryText.trim()
            if (!cleanQuery) return

            if (onCategorySelect) {
                onCategorySelect(cleanQuery)
            } else {
                const encoded = encodeURIComponent(cleanQuery).replace(/%20/g, '+')
                navigate(`${targetRoutePrefix}/${encoded}`)
            }
        },
        [onCategorySelect, targetRoutePrefix]
    )

    const handleCategorySelect = useCallback(
        (_event: React.SyntheticEvent, value: string | CategoryOption | null) => {
            setSelectedValue(value)
            if (value) {
                const queryText = typeof value === 'string' ? value : value.label
                executeSearch(queryText)
            }
        },
        [executeSearch]
    )

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string, reason: string) => {
        setInputValue(newInputValue)
        if (onSearchChange && reason === 'input') {
            onSearchChange(newInputValue)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            executeSearch(inputValue)
        }
    }

    return (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                executeSearch(inputValue)
            }}
            className={className}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '650px',
            }}
        >
            <Link
                href="/app/portal-servicios"
                className="activo body-2 d-flex align-items-center justify-content-center text-decoration-none"
                style={{ flexShrink: 0, paddingRight: '10px' }}
            >
                <Box
                    sx={{
                        width: { xs: 44, sm: 48 },
                        height: { xs: 44, sm: 48 },
                        minWidth: { xs: 44, sm: 48 },
                        borderRadius: '14px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid var(--background-light-gray-color, #e2e8f0)',
                        flexShrink: 0,
                        p: 0.5,
                    }}
                >
                    <img
                        src="/assets/img/logo/IsoLogo-Dezzpo-Verde.png"
                        alt="Logo Comunidad Dezzpo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                </Box>
            </Link>

            <Autocomplete
                id="search-select-category"
                freeSolo
                options={ListadoCategorias as CategoryOption[]}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') return option
                    return option.label
                }}
                value={selectedValue}
                onChange={handleCategorySelect}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                popupIcon={<ArrowDropDownIcon />}
                noOptionsText={
                    <Box sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Presiona Enter para buscar "{inputValue}"
                        </Typography>
                    </Box>
                }
                PaperComponent={(props) => (
                    <Paper
                        {...(props as any)}
                        sx={{
                            borderRadius: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: '1px solid var(--selected-border-light-gray-color)',
                            mt: 0.5,
                            overflow: 'hidden',
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    if (typeof option === 'string') {
                        return (
                            <Box component="li" {...props} key={option}>
                                <Typography variant="body2">{option}</Typography>
                            </Box>
                        )
                    }
                    const IconComponent = CategoryIcons[option.iconName as string]
                    const isSelected =
                        typeof selectedValue !== 'string' && selectedValue?.key === option.key
                    return (
                        <Box
                            component="li"
                            {...props}
                            key={option.key}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1,
                                cursor: 'pointer',
                                backgroundColor: isSelected
                                    ? 'var(--background-main-green-color) !important'
                                    : 'transparent',
                                color: isSelected ? '#fff' : 'inherit',
                                '&:hover': {
                                    backgroundColor: isSelected
                                        ? 'var(--background-main-green-color) !important'
                                        : 'rgba(0, 0, 0, 0.04)',
                                },
                                transition: 'background-color 0.15s ease',
                            }}
                        >
                            {IconComponent && (
                                <Box
                                    component={IconComponent}
                                    sx={{
                                        fontSize: '1.4rem',
                                        color: isSelected
                                            ? '#fff'
                                            : 'var(--primary-green-text-color)',
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: isSelected ? 600 : 400,
                                    color: 'inherit',
                                }}
                            >
                                {option.label}
                            </Typography>
                        </Box>
                    )
                }}
                renderInput={(params) => (
                    <TextField
                        {...(params as unknown as Record<string, unknown>)}
                        placeholder={placeholder}
                        size="small"
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        onClick={() => executeSearch(inputValue)}
                                        sx={{
                                            color: 'var(--primary-green-text-color)',
                                            fontSize: '1.4rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: '#fff',
                                width: '100%',
                                minWidth: 0,
                                '& fieldset': {
                                    borderColor: 'var(--selected-border-light-gray-color)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--primary-green-text-color)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-green-text-color)',
                                    borderWidth: '2px',
                                },
                            },
                        }}
                    />
                )}
                sx={{ width: '100%', minWidth: 0, maxWidth: 580, flex: 1 }}
            />
        </Box>
    )
}

export default SearchBar
