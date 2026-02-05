// import React from 'react'
import {
    DataGrid,
    type DataGridProps,
    type GridColDef,
    type GridValidRowModel,
} from '@mui/x-data-grid'
import {
    Box,
    Typography,
    Paper,
    LinearProgress
} from '@mui/material'

interface DataTableProps<R extends GridValidRowModel> extends Omit<DataGridProps<R>, 'rows' | 'columns'> {
    rows: R[]
    columns: GridColDef<R>[]
    title?: string
    loading?: boolean
    error?: string
    emptyMessage?: string
}

export function DataTable<R extends GridValidRowModel>({
    rows,
    columns,
    title,
    loading,
    error,
    emptyMessage = 'No data available',
    sx,
    ...props
}: DataTableProps<R>) {
    return (
        <Paper elevation={0} variant="outlined" sx={{ width: '100%', overflow: 'hidden', ...sx }}>
            {title && (
                <Box p={2} borderBottom={1} borderColor="divider">
                    <Typography variant="h6" component="h2">
                        {title}
                    </Typography>
                </Box>
            )}

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading ?? false}
                    slots={{
                        loadingOverlay: LinearProgress as any,
                        noRowsOverlay: () => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                <Typography color="text.secondary">{emptyMessage}</Typography>
                            </Box>
                        ),
                    }}
                    disableRowSelectionOnClick
                    {...props}
                />
            </Box>
            {error && (
                <Box p={2} bgcolor="error.light" color="error.contrastText">
                    <Typography variant="body2">{error}</Typography>
                </Box>
            )}
        </Paper>
    )
}
