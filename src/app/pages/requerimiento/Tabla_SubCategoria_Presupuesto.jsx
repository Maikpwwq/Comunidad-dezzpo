export { TablaSubCategoriaPresupuesto }

import React from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const TablaSubCategoriaPresupuesto = (props) => {
    const { draftSubCategory, draftTotal } = props

    return (
        <>
            <Col className="ms-4 p-4">
                <p className="p-description">
                    Compara precios de los mejores profesionales calificados
                </p>
                <Table
                    sx={{
                        display: { sm: 'grid', xs: 'grid' },
                        overflowX: 'scroll',
                    }}
                >
                    <TableHead>
                        <TableRow className="w-100" sx={{ display: 'table' }}>
                            <TableCell>Sub Categoria</TableCell>
                            <TableCell>Unidad Medida</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Precio unitario</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {draftSubCategory.length > 0 &&
                            draftSubCategory.map((selection) => {
                                const {
                                    subCategoria,
                                    subCategoriaCantidad,
                                    subCategoriaDescription,
                                    // subCategoriaPhotoUrl,
                                    subCategoriaCantidades,
                                    subCategoriaPrecioFinal,
                                    subCategoriaPrecio,
                                } = selection
                                return (
                                    <TableRow key={subCategoria}>
                                        {console.log(
                                            'this load changes',
                                            draftSubCategory
                                        )}
                                        <TableCell>{subCategoria}</TableCell>
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
                                            {subCategoriaCantidades}
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
                            })}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell> Precio Total</TableCell>
                            <TableCell>
                                {parseInt(draftTotal).toLocaleString(
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

TablaSubCategoriaPresupuesto.propTypes = {
    draftSubCategory: PropTypes.array.isRequired,
    draftTotal: PropTypes.number.isRequired,
}
