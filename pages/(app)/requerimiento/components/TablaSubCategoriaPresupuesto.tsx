import React from 'react'

// Bootstrap
import { Col } from 'react-bootstrap'

// MUI
import {
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
    const total = draftTotal || requerimientoTotal || 0

    return (
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
                            {parseInt(String(total)).toLocaleString(
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
    )
}

export default TablaSubCategoriaPresupuesto
