/**
 * SearchBar Component
 *
 * Searchable category selector for portal-servicios.
 * Uses MUI Autocomplete with brand-styled dropdown.
 */

import React, { useState, useCallback } from 'react'
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
    className?: string
    targetRoutePrefix?: string
    onCategorySelect?: (categoryLabel: string) => void
    placeholder?: string
}

export function SearchBar({
    className,
    targetRoutePrefix = '/app/portal-servicios',
    onCategorySelect,
    placeholder = 'Buscar categoría...',
}: SearchBarProps): React.ReactElement {
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null)

    const handleCategorySelect = useCallback(
        (_event: React.SyntheticEvent, value: CategoryOption | null) => {
            setSelectedCategory(value)
            if (value) {
                if (onCategorySelect) {
                    onCategorySelect(value.label)
                } else {
                    const encoded = value.label.replace(/ /g, '+')
                    navigate(`${targetRoutePrefix}/${encoded}`)
                }
            }
        },
        [onCategorySelect, targetRoutePrefix]
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

            <Autocomplete
                id="search-select-category"
                options={ListadoCategorias as CategoryOption[]}
                getOptionLabel={(option) => option.label}
                value={selectedCategory}
                onChange={handleCategorySelect}
                popupIcon={<ArrowDropDownIcon />}
                noOptionsText={
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'var(--secondary-text-gray-color)',
                                fontStyle: 'italic',
                            }}
                        >
                            No se encontraron categorías
                        </Typography>
                    </Box>
                }
                PaperComponent={(props) => (
                    <Paper
                        {...(props as any)}
                        sx={{
                            borderRadius: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            border: '1px solid var(--selected-border-light-gray-color)',
                            mt: 0.5,
                            overflow: 'hidden',
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    const IconComponent = CategoryIcons[option.iconName as string]
                    const isSelected = selectedCategory?.key === option.key
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
                        {...params}
                        InputLabelProps={params.InputLabelProps as any}
                        placeholder={placeholder}
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color: 'var(--primary-green-text-color)',
                                            fontSize: '1.4rem',
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: '#fff',
                                minWidth: '250px',
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
                sx={{ minWidth: 280, maxWidth: 350 }}
            />
        </Box>
    )
}

export default SearchBar
