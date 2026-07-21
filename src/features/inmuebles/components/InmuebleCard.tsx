import React from 'react'
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Stack
} from '@mui/material'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PlaceIcon from '@mui/icons-material/Place'
import type { Inmueble } from '@services/inmuebles'
import { zoneNames } from '@assets/data/ListadoZonas'

interface InmuebleCardProps {
    inmueble: Inmueble
    onSetPreferida: (id: string) => void
    onEdit: (inmueble: Inmueble) => void
    onDelete: (id: string) => void
    isActionLoading?: boolean
}

export const InmuebleCard: React.FC<InmuebleCardProps> = ({
    inmueble,
    onSetPreferida,
    onEdit,
    onDelete,
    isActionLoading = false,
}) => {
    const zoneLabel = inmueble.zona && zoneNames[inmueble.zona] ? zoneNames[inmueble.zona] : inmueble.zona

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: inmueble.isPreferida ? '2px solid #0f766e' : '1px solid #e2e8f0',
                backgroundColor: inmueble.isPreferida ? '#f0fdfa' : '#ffffff',
                transition: 'all 0.25s ease-in-out',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    boxShadow: '0 10px 25px -5px rgba(15, 118, 110, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    borderColor: inmueble.isPreferida ? '#0f766e' : '#cbd5e1',
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: inmueble.isPreferida ? '#0f766e' : '#e0f2fe',
                                color: inmueble.isPreferida ? '#ffffff' : '#0284c7'
                            }}
                        >
                            <HomeWorkIcon />
                        </Box>
                        <Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="h6" component="h3" fontWeight={700} color="#0f172a" fontSize="1.1rem">
                                    {inmueble.alias}
                                </Typography>
                                {inmueble.isPreferida && (
                                    <Chip
                                        icon={<StarIcon style={{ color: '#ffffff', fontSize: 16 }} />}
                                        label="Preferida"
                                        size="small"
                                        sx={{
                                            bgcolor: '#0f766e',
                                            color: '#ffffff',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            height: 24
                                        }}
                                    />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                <LocationOnIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                {inmueble.direccion}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Editar inmueble">
                            <IconButton
                                size="small"
                                onClick={() => onEdit(inmueble)}
                                disabled={isActionLoading}
                                sx={{ color: '#64748b', '&:hover': { color: '#0f766e', bgcolor: '#f1f5f9' } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar inmueble">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(inmueble.id)}
                                disabled={isActionLoading}
                                sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mt={2} pt={2} borderTop="1px dashed #e2e8f0">
                    <Chip
                        label={inmueble.ciudad}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#cbd5e1', color: '#475569', fontSize: '0.75rem' }}
                    />
                    {zoneLabel && (
                        <Chip
                            icon={<PlaceIcon sx={{ fontSize: '14px !important' }} />}
                            label={zoneLabel}
                            size="small"
                            sx={{ bgcolor: '#f1f5f9', color: '#334155', fontSize: '0.75rem' }}
                        />
                    )}
                    {inmueble.codigoPostal && (
                        <Chip
                            label={`C.P. ${inmueble.codigoPostal}`}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#e2e8f0', color: '#64748b', fontSize: '0.75rem' }}
                        />
                    )}

                    <Box flexGrow={1} />

                    {!inmueble.isPreferida && (
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<StarBorderIcon />}
                            onClick={() => onSetPreferida(inmueble.id)}
                            disabled={isActionLoading}
                            sx={{
                                color: '#0f766e',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.825rem',
                                '&:hover': { bgcolor: '#f0fdfa' }
                            }}
                        >
                            Marcar como preferida
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}
