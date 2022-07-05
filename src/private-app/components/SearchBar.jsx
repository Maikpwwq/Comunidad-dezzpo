import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%', // 20ch
        },
    },
}))

const SearchBar = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useState({
        searchInput: '',
    })

    const handleChange = (event) => {
        setSearchParams({
            ...searchParams,
            [event.target.name]: event.target.value,
        })
    }

    const handleSearch = (event) => {
        // Detectar tecla 'Enter' if (event.key === 'Enter')
        if (event.keyCode === 13) {
            // console.log(event, searchParams)
            navigate('/app/portal-servicios', { state: searchParams })
        }
    }

    return (
        <>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Busqueda Local: Buscar por categoria"
                    inputProps={{ 'aria-label': 'search' }}
                    className="w-100"
                    name="searchInput"
                    value={searchParams.searchInput}
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                    // onKeyPress={handleSearch} Deprecated 2021
                />
            </Search>
        </>
    )
}

export default SearchBar
