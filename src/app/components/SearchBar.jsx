import React, { useState } from 'react'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { styled, alpha } from '@mui/material/styles'
import IcoMoon from 'react-icomoon'
import iconSet from '#@/assets/css/icomoon/selection.json'
import { ListadoCategorias } from '#@/index/components/ListadoCategorias'
// import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// images
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
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%', // 20ch
        },
    },
}))

export { SearchBar }

const SearchBar = () => {
    // const navigate = useNavigate()
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
        navigate(`/app/portal-servicios/${multipleSearch}`) // searchInput
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    minWidth: '230px',
                    alignItems: 'center',
                }}
            >
                <Link
                    href="/app/portal-servicios"
                    className="activo body-2 p-2 d-flex flex-row"
                >
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
                        {/* <SearchIcon /> */}
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
            </Box>
        </>
    )
}
