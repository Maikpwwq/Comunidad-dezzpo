import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles'
import ListadoCategorias from '../../app/components/ListadoCategorias'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

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

const StyledSelect = styled(Select)(({ theme }) => ({
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
        searchInput: [],
    })

    const handleChange = (event) => {
        const changeSerachParams = event.target.value
        const multipleSearch = []
        changeSerachParams.map((item) => {
            multipleSearch.push(item)
        })
        if (multipleSearch.length > 0) {
            console.log(multipleSearch)
            setSearchParams({
                ...searchParams,
                searchInput: multipleSearch,
            })
            handleSearch(multipleSearch)
        }
    }

    const handleSearch = (multipleSearch) => {
        // Detectar tecla 'Enter' if (event.key === 'Enter')
        // if (event.keyCode === 13) {
        // console.log(event, searchParams)
        navigate('/app/portal-servicios', {
            state: { searchInput: multipleSearch },
        })
        // }
    }

    return (
        <>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledSelect
                    style={{ borderStyle: 'solid', borderWidth: '1px' }}
                    className="w-100"
                    id="search-select-category"
                    name="searchInput"
                    multiple
                    // autoFocus={true}
                    // onKeyDown={handleSearch}
                    value={searchParams.searchInput}
                    onChange={(e) => handleChange(e)}
                    inputProps={{
                        'aria-label': 'search', //Without label
                    }}
                    // 'Busqueda Local: Buscar por categoria'
                >
                    {ListadoCategorias.map((item) => {
                        const { key, label } = item
                        return (
                            <MenuItem value={label} key={key}>
                                {label}
                            </MenuItem>
                        )
                    })}
                </StyledSelect>
            </Search>
        </>
    )
}

export default SearchBar
