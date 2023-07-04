export { TableCards }

import React, { useState, useEffect, Suspense } from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

const TableCards = (props) => {
    const { dataTable } = props
    let array = []
    const [dataCards, setDataCards] = useState()

    useEffect(() => {
        if (dataTable.length > 0) {
            dataTable.map((categoria) => {
                if (categoria.subCategoria !== undefined) {
                    array.push(categoria)
                }
            })
            if (array.length > 0) {
                setDataCards(...dataCards, array)
                console.log('dataTable', dataTable, array)
            }
        }
    }, [])

    const pageSize = 5

    const colums = [
        {
            field: 'subCategoria',
            headerName: 'Credit Card Number',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.value}</>,
        },
        {
            field: 'subCategoriaCantidad',
            headerName: 'Unidad Medida',
            flex: 1,
            renderCell: (params) => <>{params.value}</>,
        },
        {
            field: 'subCategoriaDescription',
            headerName: 'Description',
            flex: 1,
            renderCell: (params) => <>{params.value}</>,
        },
        {
            field: 'subCategoriaPrecio',
            headerName: 'Precio unitario bajo',
            flex: 1,
            renderCell: (params) => <>{params.value}</>,
        },
        {
            field: 'subCategoriaPrecio',
            headerName: 'Precio unitario alto',
            flex: 1,
            renderCell: (params) => <>{params.value}</>,
        },
    ]

    return (
        <Box className="mt-2 mb-4">
            <Suspense
                fallback={
                    <Stack spacing={1}>
                        <Skeleton
                            variant="rectangular"
                            width={210}
                            height={118}
                        />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton
                            variant="rectangular"
                            width={210}
                            height={60}
                        />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                }
            >
                {' '}
                {dataCards !== undefined && (
                    <DataGrid
                        disableColumnSelector
                        disableRowSelectionOnClick
                        autoHeight
                        pageSize={pageSize}
                        rowsPerPageOptions={[pageSize]}
                        rows={dataCards}
                        columns={colums}
                        getRowId={(row) => row.subCategoria}
                    />
                )}
            </Suspense>
        </Box>
    )
}

TableCards.propTypes = {
    dataTable: PropTypes.array,
}
