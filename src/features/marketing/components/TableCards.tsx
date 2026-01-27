import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import type { CategoriaItem } from '../types'

interface TableCardsProps {
    dataTable: CategoriaItem[]
}

const TableCards: React.FC<TableCardsProps> = ({ dataTable }) => {
    const formatCurrency = (value: number) => {
        return parseInt(String(value)).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
        })
    }

    return (
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2, width: '100%' }}>
            {dataTable.map((item, index) => {
                if (item.subSistema) {
                    return (
                        <Typography key={index} variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                            {item.subSistema}
                        </Typography>
                    )
                }

                if (!item.subCategoria) return null

                const precioBajo = (item.subCategoriaPrecio || 0) * 1.05
                const precioAlto = (item.subCategoriaPrecio || 0) * 1.65

                return (
                    <Card key={index} variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" component="div" fontWeight="bold">
                                {item.subCategoria}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {item.subCategoriaDescription}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Unidad:</Typography>
                                <Chip label={item.subCategoriaCantidad} size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Rango Precio:</Typography>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" color="success.main">
                                        {formatCurrency(precioBajo)}
                                    </Typography>
                                    <Typography variant="body2" color="error.main">
                                        {formatCurrency(precioAlto)}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )
            })}
        </Box>
    )
}

export default TableCards
