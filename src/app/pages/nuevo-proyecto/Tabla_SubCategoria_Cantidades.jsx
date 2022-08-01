import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const TablaSubCategoriaCantidades = (props) => {
    const { categoriaInfo, setDraftInfo, draftInfo } = props

    const cantidades = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]
    const [precioTotalizadoDraft, setPrecioTotalizadoDraft] = useState(0)
    const [cantidadesCategorias, setCantidadesCategorias] = useState(1)
    const handleChangeCantidades = (e) => {
        console.log(e.target.value)
        setCantidadesCategorias(e.target.value)
    }

    const handleCalculateDraft = () => {
        var suma = 0
        categoriaInfo.selected.map((selection, index, array) => {
            const { subCategoriaCantidades, subCategoriaPrecioFinal } =
                selection
            // console.log(subCategoriaCantidades, subCategoriaPrecioFinal)
            suma = suma + subCategoriaPrecioFinal
        })
        setPrecioTotalizadoDraft(suma)
    }

    useEffect(() => {
        if (categoriaInfo.selected.length > 0) {
            if (categoriaInfo.selected[0].subCategoriaCantidades > 0) {
                handleCalculateDraft()
                setDraftInfo({
                    ...draftInfo,
                    draftTotal: precioTotalizadoDraft,
                    draftSubCategory: categoriaInfo.selected,
                })
            }
        }
    }, [cantidadesCategorias, categoriaInfo.selected])

    return (
        <>
            <Col className="ms-4 p-4">
                {' '}
                <p className="p-description">
                    Compara precios de los mejores profesionales calificados{' '}
                </p>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sub Categoria</TableCell>
                            <TableCell>Unidad Medida</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Precio unitario</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoriaInfo.selected.length > 0 &&
                            categoriaInfo.selected.map(
                                (selection, index, array) => {
                                    const {
                                        subCategoria,
                                        subCategoriaCantidad,
                                        subCategoriaDescription,
                                        subCategoriaPhotoUrl,
                                        subCategoriaPrecio,
                                    } = selection
                                    const subCategoriaCantidades = 1 //TODO: Cambiar esto por las cantidades de subcategorias
                                    const subCategoriaPrecioFinal =
                                        parseFloat(subCategoriaPrecio) *
                                        subCategoriaCantidades
                                    array[index].subCategoriaCantidades =
                                        subCategoriaCantidades
                                    array[index].subCategoriaPrecioFinal =
                                        subCategoriaPrecioFinal
                                    return (
                                        <TableRow key={index}>
                                            {console.log(
                                                'this load changes',
                                                categoriaInfo.selected
                                            )}
                                            <TableCell>
                                                {subCategoria}
                                            </TableCell>
                                            <TableCell>
                                                {subCategoriaCantidad}
                                            </TableCell>
                                            <TableCell>
                                                {subCategoriaDescription}
                                            </TableCell>
                                            <TableCell>
                                                {parseInt(
                                                    subCategoriaPrecio
                                                ).toLocaleString('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        minWidth: 120,
                                                        zIndex: 100,
                                                        maxHeight: 200,
                                                        overflowX: 'scroll',
                                                    }}
                                                >
                                                    <FormControl fullWidth>
                                                        <Select
                                                            id="demo-simple-select"
                                                            value={
                                                                cantidadesCategorias
                                                            }
                                                            onChange={
                                                                handleChangeCantidades
                                                            }
                                                            inputProps={{
                                                                'aria-label':
                                                                    'Without label',
                                                            }}
                                                        >
                                                            {
                                                                cantidades.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <MenuItem
                                                                            value={
                                                                                item
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )
                                                                // subCategoriaCantidades
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {parseInt(
                                                    subCategoriaPrecioFinal
                                                ).toLocaleString('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            )}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell> Precio Total</TableCell>
                            <TableCell
                            // onLoad={handleCalculateDraft()}
                            >
                                {parseInt(precioTotalizadoDraft).toLocaleString(
                                    'es-CO',
                                    {
                                        style: 'currency',
                                        currency: 'COP',
                                    }
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Col>
        </>
    )
}

TablaSubCategoriaCantidades.propTypes = {
    categoriaInfo: PropTypes.object.isRequired,
    setDraftInfo: PropTypes.func.isRequired,
    draftInfo: PropTypes.object.isRequired,
}

export default TablaSubCategoriaCantidades
