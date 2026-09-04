import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Paper,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PersonIcon from '@mui/icons-material/Person'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import EmailIcon from '@mui/icons-material/Email'
import { zoneNames } from '@assets/data/ListadoZonas'
import type { TiendaDocument } from '@services/tiendas'

interface SedeDetailModalProps {
    open: boolean
    onClose: () => void
    tienda: TiendaDocument | null
}

export const SedeDetailModal: React.FC<SedeDetailModalProps> = ({
    open,
    onClose,
    tienda,
}) => {
    if (!tienda) return null

    // Resolve emails: prefer emails array, fallback to legacy email string
    const resolvedEmails: string[] = tienda.emails && tienda.emails.length > 0
        ? tienda.emails
        : tienda.email
            ? tienda.email.split(',').map((e) => e.trim()).filter(Boolean)
            : []

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: { xs: 2, sm: 3 },
                    m: { xs: 1.5, sm: 2 },
                    maxHeight: { xs: 'calc(100dvh - 32px)', sm: 'calc(100vh - 64px)' },
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StorefrontIcon color="primary" />
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                            {tienda.nombre}
                        </Typography>
                        {(tienda.razonSocial || tienda.nit) && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {tienda.razonSocial}{tienda.razonSocial && tienda.nit ? ' • ' : ''}{tienda.nit ? `NIT: ${tienda.nit}` : ''}
                            </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {tienda.sedes.length} {tienda.sedes.length === 1 ? 'sede disponible' : 'sedes disponibles'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small" aria-label="Cerrar">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider sx={{ flexShrink: 0 }} />
            <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, overflowY: 'auto', flexGrow: 1 }}>
                {tienda.descripcion && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                        "{tienda.descripcion}"
                    </Typography>
                )}

                {/* Emails Section */}
                {resolvedEmails.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                        <EmailIcon fontSize="small" color="action" />
                        {resolvedEmails.map((em, idx) => (
                            <Chip
                                key={idx}
                                label={em}
                                size="small"
                                component="a"
                                href={`mailto:${em}`}
                                clickable
                                variant="outlined"
                                color="primary"
                                sx={{ fontWeight: 500 }}
                            />
                        ))}
                    </Box>
                )}

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#0A2540' }}>
                    Sedes y Puntos de Atención
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tienda.sedes.map((sede, index) => {
                        const zoneLabel = zoneNames[sede.zona] || sede.zona

                        return (
                            <Paper
                                key={sede.id || index}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    borderColor: 'divider',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                                        {sede.nombreSede || `Sede ${index + 1}`}
                                    </Typography>
                                    <Chip
                                        icon={<LocationOnIcon fontSize="small" />}
                                        label={zoneLabel}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOnIcon fontSize="small" color="action" />
                                    <Typography variant="body2" fontWeight={500}>
                                        {sede.direccion}, {sede.ciudad}{sede.departamento && !sede.ciudad.toLowerCase().includes(sede.departamento.toLowerCase()) ? ` (${sede.departamento})` : ''}
                                    </Typography>
                                </Box>

                                {sede.detallesUbicacion && (
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1, pl: 0.5 }}>
                                        <InfoOutlinedIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {sede.detallesUbicacion}
                                        </Typography>
                                    </Box>
                                )}

                                {sede.nombreContacto && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 0.5 }}>
                                        <PersonIcon fontSize="small" color="primary" />
                                        <Typography variant="caption" fontWeight={600} color="text.primary">
                                            Contacto: {sede.nombreContacto} {sede.cargoContacto ? `(${sede.cargoContacto})` : ''}
                                        </Typography>
                                    </Box>
                                )}

                                {sede.horario && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <AccessTimeIcon fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">
                                            {sede.horario}
                                        </Typography>
                                    </Box>
                                )}

                                {(() => {
                                    const resolvedTelefonos = (sede.hasCustomPhones && sede.telefonos && sede.telefonos.filter(Boolean).length > 0)
                                        ? sede.telefonos.filter(Boolean)
                                        : (tienda.telefonoPrincipal ? [tienda.telefonoPrincipal] : (sede.telefonos?.filter(Boolean) || []))

                                    const resolvedWhatsApp = (sede.hasCustomPhones && sede.whatsapp)
                                        ? sede.whatsapp
                                        : (tienda.whatsappPrincipal || sede.whatsapp || '')

                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {resolvedTelefonos.map((tel, tIdx) => (
                                                <Button
                                                    key={tIdx}
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<PhoneIcon fontSize="small" />}
                                                    href={`tel:${tel}`}
                                                    sx={{ borderRadius: 4, textTransform: 'none' }}
                                                >
                                                    Llamar: {tel}
                                                </Button>
                                            ))}

                                            {resolvedWhatsApp && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="success"
                                                    startIcon={<WhatsAppIcon fontSize="small" />}
                                                    href={`https://wa.me/${resolvedWhatsApp.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ borderRadius: 4, textTransform: 'none' }}
                                                >
                                                    WhatsApp
                                                </Button>
                                            )}
                                        </Box>
                                    )
                                })()}
                            </Paper>
                        )
                    })}
                </Box>
            </DialogContent>
            <Divider sx={{ flexShrink: 0 }} />
            <DialogActions sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, flexShrink: 0 }}>
                <Button onClick={onClose} variant="contained" className="btn-primary" size="medium">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
