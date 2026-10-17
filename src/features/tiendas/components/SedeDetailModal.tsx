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
    Avatar,
    Tooltip,
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
import LanguageIcon from '@mui/icons-material/Language'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LinkIcon from '@mui/icons-material/Link'
import { zoneNames } from '@assets/data/ListadoZonas'
import type { TiendaDocument } from '@services/tiendas'
import type { SocialPlatform } from '@services/types'
import { formatPhone, toTelHref, toWhatsAppHref } from '@services/phone'

interface SedeDetailModalProps {
    open: boolean
    onClose: () => void
    tienda: TiendaDocument | null
}

const platformIconMap: Record<SocialPlatform, React.ReactElement> = {
    WhatsApp: <WhatsAppIcon fontSize="small" />,
    Instagram: <InstagramIcon fontSize="small" />,
    Facebook: <FacebookIcon fontSize="small" />,
    TikTok: <LinkIcon fontSize="small" />,
    LinkedIn: <LinkedInIcon fontSize="small" />,
    X: <XIcon fontSize="small" />,
    Web: <LanguageIcon fontSize="small" />,
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

    // Visible social links (excluding WhatsApp since it has its own button per sede/contact)
    const visibleSocialLinks = (tienda.redesSociales ?? []).filter(
        (l) => l.isVisible && l.url.trim() !== '' && l.platform !== 'WhatsApp'
    )

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
                    <Avatar
                        {...(tienda.logoUrl ? { src: tienda.logoUrl } : {})}
                        alt={tienda.nombre}
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor: tienda.logoUrl ? 'transparent' : 'primary.50',
                            border: '1.5px solid',
                            borderColor: 'divider',
                            flexShrink: 0,
                        }}
                    >
                        <StorefrontIcon color="primary" />
                    </Avatar>
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

                {/* Digital Channels (Website & Social) + Emails */}
                {(tienda.sitioWeb || visibleSocialLinks.length > 0 || resolvedEmails.length > 0) && (
                    <Box
                        sx={{
                            mb: 2.5,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.25,
                        }}
                    >
                        {/* Website & Social Channels */}
                        {(tienda.sitioWeb || visibleSocialLinks.length > 0) && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                                {tienda.sitioWeb && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        startIcon={<LanguageIcon fontSize="small" />}
                                        endIcon={<OpenInNewIcon sx={{ fontSize: '0.85rem !important' }} />}
                                        href={tienda.sitioWeb.startsWith('http') ? tienda.sitioWeb : `https://${tienda.sitioWeb}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            py: 0.4,
                                            px: 1.25,
                                            fontSize: '0.82rem',
                                            bgcolor: '#ffffff',
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                bgcolor: 'primary.50',
                                            },
                                        }}
                                    >
                                        Sitio Web: {tienda.sitioWeb.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                                    </Button>
                                )}

                                {visibleSocialLinks.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: { sm: 'auto' } }}>
                                        {visibleSocialLinks.map((link) => (
                                            <Tooltip key={link.id} title={link.label || link.platform}>
                                                <IconButton
                                                    size="small"
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.label || link.platform}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        bgcolor: '#ffffff',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: 0.5,
                                                        '&:hover': {
                                                            bgcolor: 'primary.50',
                                                            color: 'primary.main',
                                                        },
                                                    }}
                                                >
                                                    {platformIconMap[link.platform]}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Emails */}
                        {resolvedEmails.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
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
                                        sx={{ fontWeight: 500, bgcolor: '#ffffff' }}
                                    />
                                ))}
                            </Box>
                        )}
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
                                        {sede.direccion}, {sede.ciudad}{sede.departamento && !sede.ciudad.toLowerCase().includes(sede.departamento.toLowerCase()) ? ` (${sede.departamento})` : ''}{sede.codigoPostal ? ` • C.P. ${sede.codigoPostal}` : ''}
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
                                            {resolvedTelefonos.map((tel, tIdx) => {
                                                const telHref = toTelHref(tel)
                                                if (!telHref) return null
                                                return (
                                                    <Button
                                                        key={tIdx}
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        startIcon={<PhoneIcon fontSize="small" />}
                                                        href={telHref}
                                                        sx={{ borderRadius: 4, textTransform: 'none' }}
                                                    >
                                                        Llamar: {formatPhone(tel)}
                                                    </Button>
                                                )
                                            })}

                                            {toWhatsAppHref(resolvedWhatsApp) && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="success"
                                                    startIcon={<WhatsAppIcon fontSize="small" />}
                                                    href={toWhatsAppHref(resolvedWhatsApp)!}
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
