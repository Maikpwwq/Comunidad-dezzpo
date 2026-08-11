import React, { useState } from 'react'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Stack,
    Divider,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LanguageIcon from '@mui/icons-material/Language'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LayersIcon from '@mui/icons-material/Layers'
import { zoneNames } from '@assets/data/ListadoZonas'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import type { TiendaDocument, SedeLocation } from '@services/tiendas'
import { SedeDetailModal } from './SedeDetailModal'

interface TiendaCardProps {
    tienda: TiendaDocument
}

export const TiendaCard: React.FC<TiendaCardProps> = ({ tienda }) => {
    const [detailOpen, setDetailOpen] = useState(false)

    const primarySede: SedeLocation = tienda.sedes[0] || {
        id: 'default_sede',
        nombreSede: 'Sucursal Principal',
        direccion: 'Dirección no especificada',
        ciudad: 'Bogotá, Colombia',
        zona: 'bogota',
        telefonos: [],
        whatsapp: '',
    }

    const primaryZoneLabel = zoneNames[primarySede.zona] || primarySede.zona
    const primaryPhone = tienda.telefonoPrincipal || primarySede.telefonos[0]
    const primaryWhatsapp = tienda.whatsappPrincipal || primarySede.whatsapp

    return (
        <>
            <Card
                elevation={1}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                }}
            >
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header: Title & Badges */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <StorefrontIcon color="primary" fontSize="medium" sx={{ mt: 0.3 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, color: '#0A2540' }}>
                                    {tienda.nombre}
                                </Typography>
                                {(tienda.razonSocial || tienda.nit) && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                                        {tienda.razonSocial}{tienda.razonSocial && tienda.nit ? ' • ' : ''}{tienda.nit ? `NIT: ${tienda.nit}` : ''}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        {tienda.tierVisibilidad && tienda.tierVisibilidad !== 'estandar' && (
                            <Chip
                                label={tienda.tierVisibilidad === 'patrocinado' ? 'Patrocinado' : 'Destacado'}
                                color={tienda.tierVisibilidad === 'patrocinado' ? 'secondary' : 'primary'}
                                size="small"
                                sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}
                            />
                        )}
                    </Box>

                    {/* Slogan / Description */}
                    {tienda.descripcion && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {tienda.descripcion}
                        </Typography>
                    )}

                    {/* Category Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {tienda.categorias.map((catKey) => {
                            const catObj = ListadoCategoriasTiendas.find((c) => c.key === catKey)
                            const label = catObj ? catObj.label : catKey

                            return (
                                <Chip
                                    key={catKey}
                                    label={label}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: '0.75rem',
                                        backgroundColor: 'rgba(10, 37, 64, 0.04)',
                                        borderColor: 'rgba(10, 37, 64, 0.12)',
                                        fontWeight: 500,
                                    }}
                                />
                            )
                        })}
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ my: 1.5 }} />

                        {/* Location & Contact Summary */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, overflow: 'hidden' }}>
                                    <LocationOnIcon color="action" fontSize="small" />
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {primarySede.direccion} ({primaryZoneLabel})
                                    </Typography>
                                </Box>

                                {tienda.sedes.length > 1 && (
                                    <Chip
                                        icon={<LayersIcon fontSize="small" />}
                                        label={`+${tienda.sedes.length - 1} sedes`}
                                        size="small"
                                        color="info"
                                        variant="soft"
                                        onClick={() => setDetailOpen(true)}
                                        sx={{ fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                                    />
                                )}
                            </Box>

                            {primarySede.detallesUbicacion && (
                                <Typography variant="caption" color="text.secondary" sx={{ pl: 3.2, fontStyle: 'italic' }} noWrap>
                                    📍 {primarySede.detallesUbicacion}
                                </Typography>
                            )}

                            {primarySede.nombreContacto && (
                                <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ pl: 3.2 }}>
                                    👤 Contacto: {primarySede.nombreContacto} {primarySede.cargoContacto ? `(${primarySede.cargoContacto})` : ''}
                                </Typography>
                            )}
                        </Box>

                        {/* Actions Toolbar */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {primaryPhone && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    startIcon={<PhoneIcon />}
                                    href={`tel:${primaryPhone}`}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Llamar
                                </Button>
                            )}

                            {primaryWhatsapp && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="success"
                                    startIcon={<WhatsAppIcon />}
                                    href={`https://wa.me/${primaryWhatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    WhatsApp
                                </Button>
                            )}

                            {tienda.sitioWeb && (
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<LanguageIcon />}
                                    href={tienda.sitioWeb.startsWith('http') ? tienda.sitioWeb : `https://${tienda.sitioWeb}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Web
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                size="small"
                                color="inherit"
                                onClick={() => setDetailOpen(true)}
                                sx={{ textTransform: 'none', ml: 'auto !important' }}
                            >
                                Detalle Sedes
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* Sede Detail Modal */}
            <SedeDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                tienda={tienda}
            />
        </>
    )
}
