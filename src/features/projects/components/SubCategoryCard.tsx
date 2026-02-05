/**
 * SubCategoryCard Component
 *
 * Selectable sub-category card for project items.
 * Migrated from src/index/components/sub-categorias/SubCategorias.jsx
 */

import React, { useState, useCallback } from 'react'
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'

import type { SubCategoryItem, CategorySelectionState } from '../types'

export interface SubCategoryCardProps {
    /** Item data */
    item: SubCategoryItem
    /** Current selection state */
    categoriaInfo: CategorySelectionState
    /** State setter */
    setCategoriaInfo: (info: CategorySelectionState) => void
}

export function SubCategoryCard({
    item,
    categoriaInfo,
    setCategoriaInfo,
}: SubCategoryCardProps): React.ReactElement {
    const [isSelected, setIsSelected] = useState(false)

    const {
        subCategoria,
        subCategoriaDescription,
        subCategoriaPrecio,
        subCategoriaCantidad,
    } = item

    const formattedPrice = typeof subCategoriaPrecio === 'number'
        ? subCategoriaPrecio
        : parseInt(subCategoriaPrecio || '0')

    const handleToggleSelection = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()

            const currentSelected = [...categoriaInfo.selected]

            if (!isSelected) {
                // Add to selection
                currentSelected.push(item)
                setCategoriaInfo({ ...categoriaInfo, selected: currentSelected })
            } else {
                // Remove from selection
                const indexToRemove = currentSelected.findIndex(
                    (i) => i.subCategoria === item.subCategoria
                )
                if (indexToRemove > -1) {
                    currentSelected.splice(indexToRemove, 1)
                    setCategoriaInfo({ ...categoriaInfo, selected: currentSelected })
                }
            }

            setIsSelected(!isSelected)
        },
        [isSelected, item, categoriaInfo, setCategoriaInfo]
    )

    return (
        <Card className="card-categorie mb-4 me-4">
            <CardHeader title={subCategoria} />
            <CardContent className="pt-0 pb-0">
                {subCategoriaDescription && (
                    <Typography variant="body2" color="text.secondary" className="pb-2">
                        {subCategoriaDescription}
                    </Typography>
                )}
                <Typography variant="body1">
                    Precio:{' '}
                    {formattedPrice.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                    })}
                </Typography>
                {subCategoriaCantidad && (
                    <Typography variant="body1">
                        Cantidad: {subCategoriaCantidad}
                    </Typography>
                )}
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    className="pt-4"
                    onClick={handleToggleSelection}
                    color={isSelected ? 'error' : 'primary'}
                    startIcon={isSelected ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
                >
                    {isSelected ? 'Quitar' : 'Agregar al carrito'}
                </Button>
            </CardActions>
        </Card>
    )
}

export default SubCategoryCard
