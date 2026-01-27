import { useState } from 'react'
// import { navigate } from 'vike/client/router'
import { styled, alpha } from '@mui/material/styles'
import { ListadoCategorias } from '@index/components/ListadoCategorias'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import {
    // InputAdornment, // unused
    // TextField, // unused
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// images
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'

// Stub for IcoMoon if strictly needed or remove usage. 
// Looking at the code: <IcoMoon ... />
// I will comment out IcoMoon usage for now as I don't have the iconSet.
// And replace Link usage.

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

const SearchBar = () => {
    // const navigate = useNavigate()
    const [searchParams, setSearchParams] = useState({
        searchInput: [],
    })
    // const [isLoaded, setIsLoaded] = useState(false)

    // const handleKeyDown = (event: any) => {
    //     const changeSerachParams = event.target.value
    //     const multipleSearch = []
    //     changeSerachParams.map((item) => {
    //         multipleSearch.push(item)
    //     })
    //     if (multipleSearch.length > 0) {
    //         console.log(multipleSearch)
    //         const searchInput = multipleSearch[multipleSearch.length - 1]
    //         setSearchParams({
    //             ...searchParams,
    // const handleSearch = (multipleSearch: string) => {
    /*
    const handleSearch = (multipleSearch: string) => {
        // Detectar tecla 'Enter' if (event.key === 'Enter')
        const handleSpacedText = multipleSearch.replace(/ /g, '+')
        // console.log('handleSearch', multipleSearch, handleSpacedText)
        navigate(`/app/portal-servicios/${handleSpacedText}`) // searchInput
    }
    */

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    minWidth: '230px',
                    alignItems: 'center',
                }}
            >
                <a
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
                </a>
                <Search sx={{ maxWidth: '300px', width: '100% !important' }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                        {/* <IcoMoon
                            iconSet={iconSet}
                            icon="LupaFomularioIcono"
                            style={{
                                height: '28px',
                                marginRight: '8px',
                                width: 'auto',
                            }}
                        /> */}
                    </SearchIconWrapper>
                    {/* <SeleccionarCategoria
                        setDraftInfo={setSearchParams}
                        draftInfo={searchParams}
                        setIsLoaded={setIsLoaded}
                    /> */}
                    <StyledSelect
                        style={{ borderStyle: 'solid', borderWidth: '1px', minWidth: '250px', borderColor: 'white' }}
                        className="w-100 textGris"
                        id="search-select-category"
                        name="searchInput"
                        multiple
                        // autoFocus={true}
                        // onKeyDown={handleSearch}
                        value={searchParams?.searchInput}
                        onChange={(e) => {
                            // Stub handle change
                            // handleChange(e)
                            setSearchParams({ ...searchParams, searchInput: e.target.value as any })
                        }}
                        inputProps={{
                            'aria-label': 'search', //Without label
                        }}
                    // 'Busqueda Local: Buscar por categoria'
                    >
                        <MenuItem value={0}>
                            seleccionar categoria
                        </MenuItem>
                        {!!ListadoCategorias && ListadoCategorias.map((item) => {
                            const { key, label, icon } = item
                            return (
                                <MenuItem value={label} key={key}>
                                    {icon}{label}
                                </MenuItem>
                            )
                        })}
                    </StyledSelect>
                </Search>
            </Box>
        </>
    )
}

export default SearchBar