import { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    MenuItem,
    FormControl,
    Select,
    type SelectChangeEvent
} from '@mui/material'

interface CategoriaSelection {
    subCategoria: string
    subCategoriaCantidad: string
    subCategoriaDescription: string
    subCategoriaPrecio: number | string
    subCategoriaCantidades?: number
    subCategoriaPrecioFinal?: number
}

interface CategoriaInfo {
    selected: CategoriaSelection[]
    quatities: any[]
    data: any[]
}

interface DraftInfo {
    draftTotal: number
    draftSubCategory: any
    [key: string]: any
}

interface Props {
    categoriaInfo: CategoriaInfo
    setDraftInfo: (info: any) => void
    draftInfo: DraftInfo
}

const TablaSubCategoriaCantidades = (props: Props) => {
    const { categoriaInfo, setDraftInfo, draftInfo } = props

    const cantidades = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]
    const [precioTotalizadoDraft, setPrecioTotalizadoDraft] = useState(0)
    const [cantidadesCategorias, setCantidadesCategorias] = useState<{
        cantidadInicial: number
        [key: string]: number
    }>({
        cantidadInicial: 1,
    })

    const handleChangeCantidades = (
        e: SelectChangeEvent<number>,
        subCategoria: string
    ) => {
        setCantidadesCategorias({
            ...cantidadesCategorias,
            [subCategoria]: Number(e.target.value),
        })
    }

    const handleCalculateDraft = () => {
        let suma = 0
        categoriaInfo.selected.forEach((selection) => {
            const { subCategoriaPrecioFinal } = selection
            if (subCategoriaPrecioFinal) {
                suma = suma + subCategoriaPrecioFinal
            }
        })
        setPrecioTotalizadoDraft(suma)
    }

    useEffect(() => {
        if (categoriaInfo.selected.length > 0) {
            // Check if first item has quantity
            const firstItem = categoriaInfo.selected[0]
            if (firstItem && (firstItem.subCategoriaCantidades || 0) > 0) {
                handleCalculateDraft()
                setDraftInfo({
                    ...draftInfo,
                    draftTotal: precioTotalizadoDraft,
                    draftSubCategory: categoriaInfo.selected,
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cantidadesCategorias, categoriaInfo.selected])

    return (
        <Col className="w-100">
            <p className="p-description">
                Compara precios de los mejores profesionales calificados
            </p>
            <Table
                className=""
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
                    {categoriaInfo.selected.length > 0 &&
                        categoriaInfo.selected.map(
                            (selection, index, array) => {
                                const {
                                    subCategoria,
                                    subCategoriaCantidad,
                                    subCategoriaDescription,
                                    subCategoriaPrecio,
                                } = selection

                                const subCategoriaCantidades =
                                    cantidadesCategorias[subCategoria] ||
                                    cantidadesCategorias.cantidadInicial

                                const subCategoriaPrecioFinal =
                                    parseFloat(String(subCategoriaPrecio)) *
                                    subCategoriaCantidades

                                // Mutating array directly is generally bad practice in React, 
                                // but migrating logic "as is" with types first.
                                // In a perfect refactor, we would compute this and store in state, 
                                // avoiding mutation of props/array in render.
                                if (array[index]) {
                                    array[index]!.subCategoriaCantidades = subCategoriaCantidades
                                    array[index]!.subCategoriaPrecioFinal = subCategoriaPrecioFinal
                                }

                                return (
                                    <TableRow key={index}>
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
                                                        id={`select-${index}`}
                                                        value={
                                                            cantidadesCategorias[
                                                            subCategoria
                                                            ] ||
                                                            cantidadesCategorias.cantidadInicial
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeCantidades(
                                                                e as SelectChangeEvent<number>,
                                                                subCategoria
                                                            )
                                                        }
                                                        inputProps={{
                                                            'aria-label':
                                                                'Without label',
                                                        }}
                                                    >
                                                        {cantidades.map(
                                                            (item, idx) => (
                                                                <MenuItem
                                                                    value={item}
                                                                    key={idx}
                                                                >
                                                                    {item}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Box>
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
                            }
                        )}
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell> Precio Total</TableCell>
                        <TableCell>
                            {parseInt(
                                String(precioTotalizadoDraft)
                            ).toLocaleString('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                            })}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Col>
    )
}

export default TablaSubCategoriaCantidades
