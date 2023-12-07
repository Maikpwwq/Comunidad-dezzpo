import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}))

// TODO - Refactor this component to use a props.serCategories from user profile
const ChipsCategories = (props) => {
    const {
        setUserEditInfo,
        userEditInfo,
        listadoCategorias,
        editableContent,
        saved,
    } = props
    const editable = editableContent === false ? false : true
    const [chipData, setChipData] = useState({
        categorias: listadoCategorias,
        selected: {
            numbers: [], // TODO: compare categories in list and save numbers
            labels: userEditInfo?.userCategories,
        },
    })
    // const handleDelete = (chipToDelete) => () => {
    //     setChipData((chips) =>
    //         chips.filter((chip) => chip.key !== chipToDelete.key)
    //     )
    // }

    useEffect(() => {
        // Almacena las categorias cuando se editan los seleccionados
        if (userEditInfo && chipData.selected.labels.length > 0) {
            setUserEditInfo({
                ...userEditInfo,
                userCategories: chipData.selected.labels,
            })
        }
    }, [chipData.selected.labels, saved, setUserEditInfo, userEditInfo])

    const handleClick = (e, numero) => {
        e.preventDefault()
        // console.log(chipData.categorias[numero].variant)
        console.log('numero', numero)
        const selectedLabels = chipData.selected.labels
        const selectedNumbers = chipData.selected.numbers
        if (chipData.categorias[numero].variant === 'outlined') {
            if (chipData.selected.numbers.length < 4) {
                const selectLabel = listadoCategorias[numero].label
                const labels = [...selectedLabels, selectLabel]
                const numbers = [...selectedNumbers, numero]
                console.log('selection', labels, numbers)
                setChipData({
                    ...chipData,
                    categorias: [
                        ...listadoCategorias,
                        (listadoCategorias[numero].variant = 'filled'),
                    ],
                    selected: {
                        numbers: numbers,
                        labels: labels,
                    },
                })
                console.log(chipData, typeof chipData)
            }
        } else {
            const isEqualNumber = (element) => element === numero
            const isEqualLabel = (element) =>
                element === listadoCategorias[numero].label
            const deselectNumbers = selectedNumbers.findIndex(isEqualNumber)
            const deselectLabels = selectedLabels.findIndex(isEqualLabel)
            if (deselectNumbers !== -1 && deselectLabels !== -1) {
                const selectNumbers = selectedNumbers.splice(deselectNumbers, 1)
                console.log('deselect', deselectNumbers)
                const labels = selectedLabels.splice(deselectLabels, 1)
                console.log('selectedLabels', deselectLabels)
                console.log('select', selectedNumbers, labels)
                setChipData({
                    ...chipData,
                    categorias: [
                        ...listadoCategorias,
                        (listadoCategorias[numero].variant = 'outlined'),
                    ],
                    selected: {
                        numbers: selectNumbers,
                        labels: labels,
                    },
                })
                console.log(chipData, typeof chipData)
            }
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
                    width: '100% !important',
                    overflow: 'auto',
                }}
                component="ul"
            >
                {typeof chipData !== 'undefined' &&
                    typeof chipData.categorias === 'object' &&
                    chipData.categorias.length > 0 &&
                    chipData.categorias.map((data) => {
                        // console.log(data)
                        let icon

                        if (data.label === 'React') {
                            icon = <TagFacesIcon />
                        }

                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    className="caption"
                                    icon={data.icon}
                                    color="primary"
                                    label={data.label}
                                    variant={data.variant} // "outlined" or "filled"
                                    onClick={(e) => {
                                        editable ? handleClick(e, data.key) : {}
                                    }}
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

ChipsCategories.propTypes = {
    setUserEditInfo: PropTypes.func,
    userEditInfo: PropTypes.object,
    listadoCategorias: PropTypes.array.isRequired,
    editableContent: PropTypes.bool,
    saved: PropTypes.bool,
}

export default ChipsCategories