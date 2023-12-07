import React from 'react'
import { navigate } from 'vike/client/router'
import PropTypes from 'prop-types'
import  { ListadoCategorias } from '#@/index/components/ListadoCategorias'

import Button from 'react-bootstrap/Button'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'

const StyledSelect = styled(Select)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingRigth: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%', // 20ch
        },
    },
}))

const SeleccionarCategoria = ({ setDraftInfo, draftInfo, setIsLoaded }) => {
    const handleClick = () => {
        navigate('/nuevo-proyecto')
        // setDraftInfo(projectData)
    }

    const handleChange = (event) => {
        event.preventDefault()
        // console.log('Detecto:', event, draftInfo)
        setDraftInfo({
            ...draftInfo,
            [event.target.name]: event.target.value,
        })
        setIsLoaded(false)
    }

    return (
        <Box
            className="mt-1" // sx={{ width: { } }}
        >
            <Select
                className="casillaSeleccion form-select w-100 m-auto p-0 textGris"
                style={{ textAlign: 'left'}}
                name="draftCategory"
                value={draftInfo?.draftCategory}
                onChange={handleChange}
                inputProps={{
                    'aria-label': 'search', //Without label
                }}
                // multiple
                // autoFocus={true}
                // onKeyDown={handleSearch}
            >
                <MenuItem className="py-1 px-3" value={0}>seleccionar categoria</MenuItem>
                {!!ListadoCategorias &&
                    ListadoCategorias.map((item) => {
                        const { key, label, icon } = item
                        return (
                            <MenuItem
                                value={label}
                                key={key}
                            >
                                {icon}
                                {label}
                            </MenuItem>
                        )
                    })}
            </Select>
        </Box>
    )
}

SeleccionarCategoria.propTypes = {
    setDraftInfo: PropTypes.func.isRequired,
    draftInfo: PropTypes.object.isRequired,
    setIsLoaded: PropTypes.func.isRequired,
}

export default SeleccionarCategoria