import React from 'react'

// Bootstrap
import { Col } from 'react-bootstrap'

// MUI
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material'

// Types
export interface SubCategoryItem {
    subCategoria: string
    subCategoriaCantidad: string
    subCategoriaDescription: string
    subCategoriaCantidades: number
    subCategoriaPrecioFinal: number
    subCategoriaPrecio: number
}

interface TablaSubCategoriaPresupuestoProps {
    draftSubCategory: SubCategoryItem[]
    draftTotal: number
    requerimientoCategorias?: SubCategoryItem[] // Handle legacy prop name from editar page
    requerimientoTotal?: number // Handle legacy prop name from editar page
}

const TablaSubCategoriaPresupuesto: React.FC<TablaSubCategoriaPresupuestoProps> = ({
    draftSubCategory,
    draftTotal,
    requerimientoCategorias,
    requerimientoTotal
}) => {
    // Normalize props to support both naming conventions (legacy editar uses requerimiento*)
    const items = draftSubCategory || requerimientoCategorias || []
    const baseTotal = draftTotal || requerimientoTotal || 0
    const computedTotal = items.reduce((sum, item) => sum + (Number(item.subCategoriaPrecioFinal) || 0), 0)
    const displayTotal = computedTotal > 0 ? computedTotal : baseTotal

    return (
        <Col className="ms-4 p-4">
            <p className="p-description">
                Compara precios de los mejores profesionales calificados
            </p>
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
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
                    {items.length > 0 &&
                        items.map((selection, index) => {
                            const {
                                subCategoria,
                                subCategoriaCantidad,
                                subCategoriaDescription,
                                subCategoriaCantidades,
                                subCategoriaPrecioFinal,
                                subCategoriaPrecio,
                            } = selection

                            return (
                                <TableRow key={subCategoria || index}>
                                    <TableCell>{subCategoria}</TableCell>
                                    <TableCell>
                                        {subCategoriaCantidad}
                                    </TableCell>
                                    <TableCell>
                                        {subCategoriaDescription}
                                    </TableCell>
                                    <TableCell>
                                        {parseInt(
                                            String(subCategoriaPrecio)
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
                                            String(subCategoriaPrecioFinal)
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
                            {parseInt(String(displayTotal)).toLocaleString(
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
            </Box>
        </Col>
    )
}

export default TablaSubCategoriaPresupuesto
