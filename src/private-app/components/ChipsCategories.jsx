import React, { useState } from 'react'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import { styled } from '@mui/material/styles'
import ListadoCategorias from '../../app/components/ListadoCategorias'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}))

// TODO - Refactor this component to use a props.serCategories from user profile
const ChipsCategories = (props) => {
    const [chipData, setChipData] = useState({ categorias: ListadoCategorias })

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) =>
            chips.filter((chip) => chip.key !== chipToDelete.key)
        )
    }

    const handleClick = (e, numero) => {
        e.preventDefault()
        console.log(chipData.categorias[numero].variant)
        if (chipData.categorias[numero].variant === 'outlined') {
            setChipData({
                ...chipData,
                categorias: [
                    ...ListadoCategorias,
                    (ListadoCategorias[numero].variant = 'filled'),
                ],
            })
            console.log(chipData, typeof chipData)
        } else {
            setChipData({
                ...chipData,
                categorias: [
                    ...ListadoCategorias,
                    (ListadoCategorias[numero].variant = 'outlined'),
                ],
            })
            console.log(chipData, typeof chipData)
        }
    }

    return (
        <>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'row !important',
                    justifyContent: 'center !important',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
                component="ul"
            >
                {typeof chipData !== 'undefined' &&
                    typeof chipData === 'object' &&
                    chipData.categorias.map((data) => {
                        let icon

                        if (data.label === 'React') {
                            icon = <TagFacesIcon />
                        }

                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    icon={icon}
                                    color="primary"
                                    label={data.label}
                                    variant={data.variant} // "outlined" or "filled"
                                    onClick={(e) => handleClick(e, data.key)}
                                    // onDelete={
                                    //     data.label === 'React'
                                    //         ? undefined
                                    //         : handleDelete(data)
                                    // }
                                />
                            </ListItem>
                        )
                    })}
            </Paper>
        </>
    )
}

export default ChipsCategories
