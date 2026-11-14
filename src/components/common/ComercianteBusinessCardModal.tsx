/**
 * Comerciante Digital Business Card & QR Modal
 *
 * Provides a sharable, printable digital business card ("LinkedIn + Game Stats") for contractors.
 * Features:
 * - Dynamic QR Code pointing to public verified profile
 * - Operational trust badges
 * - Instant WhatsApp / Share CTA
 * - Annual Membership distinction badge
 */

import React, { useState, useCallback } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    Chip,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VerifiedIcon from '@mui/icons-material/Verified'
import StarIcon from '@mui/icons-material/Star'

export interface ComercianteBusinessCardProps {
    readonly open: boolean
    readonly onClose: () => void
    readonly comerciante: {
        readonly userId: string
        readonly userName?: string
        readonly userRazonSocial?: string
        readonly userProfession?: string
        readonly userSlug?: string
        readonly userPhotoUrl?: string
        readonly userPhone?: string
        readonly profileTier?: string
        readonly membershipStatus?: string
        readonly earnedBadges?: Array<{
            readonly title?: string
            readonly category?: string
            readonly color?: string
            readonly bgLight?: string
        }>
    }
}

export function ComercianteBusinessCardModal({
    open,
    onClose,
    comerciante,
}: ComercianteBusinessCardProps) {
    const [copied, setCopied] = useState(false)

    const displayName = comerciante.userRazonSocial || comerciante.userName || 'Profesional Calificado'
    const profession = comerciante.userProfession || 'Especialista en Reformas y Acabados'
    const isMember =
        comerciante.membershipStatus === 'active' || comerciante.profileTier === 'destacado'

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dezzpo.com'
    const profileSlug = comerciante.userSlug || comerciante.userId
    const profileUrl = `${baseUrl}/comerciante/${profileSlug}`

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        profileUrl
    )}`

    const handleCopyLink = useCallback(async () => {
        try {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(profileUrl)
                setCopied(true)
            }
        } catch (err) {
            console.error('Error copying link:', err)
        }
    }, [profileUrl])

    const handleWhatsAppShare = useCallback(() => {
        const text = `¡Hola! Te comparto mi tarjeta de presentación y portafolio verificado en Comunidad Dezzpo: ${profileUrl}`
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(waUrl, '_blank', 'noopener,noreferrer')
    }, [profileUrl])

    const handleNativeShare = useCallback(async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `${displayName} — Profesional en Comunidad Dezzpo`,
                    text: `Revisa mi portafolio verificado, obras anteriores y calificaciones en Dezzpo:`,
                    url: profileUrl,
                })
            } catch {
                // User dismissed share dialog
            }
        } else {
            handleCopyLink()
        }
    }, [displayName, profileUrl, handleCopyLink])

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#0f766e',
                        color: '#ffffff',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QrCode2Icon />
                        <Typography variant="subtitle1" fontWeight={700}>
                            Tarjeta de Presentación Digital
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#ffffff' }} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, textAlign: 'center', bgcolor: '#fafafa' }}>
                    {/* Card Container */}
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: '#ffffff',
                            borderRadius: 2.5,
                            border: '1.5px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Header Brand */}
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0f766e',
                                fontWeight: 800,
                                letterSpacing: 1.2,
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            COMUNIDAD DEZZPO · RED PROFESIONAL
                        </Typography>

                        {/* Avatar */}
                        {comerciante.userPhotoUrl && (
                            <Box
                                component="img"
                                src={comerciante.userPhotoUrl}
                                alt={displayName}
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    mx: 'auto',
                                    mb: 1.5,
                                    border: '2px solid #0d9488',
                                }}
                            />
                        )}

                        <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.2 }}>
                            {displayName}
                        </Typography>
                        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5, mb: 1.5 }}>
                            {profession}
                        </Typography>

                        {/* Badges */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.8, mb: 2 }}>
                            {isMember && (
                                <Chip
                                    icon={<StarIcon sx={{ color: '#d97706 !important', fontSize: '0.9rem' }} />}
                                    label="Miembro Destacado"
                                    size="small"
                                    sx={{
                                        bgcolor: '#fffbeb',
                                        color: '#b45309',
                                        fontWeight: 700,
                                        border: '1px solid #fde68a',
                                        fontSize: '0.75rem',
                                    }}
                                />
                            )}
                            <Chip
                                icon={<VerifiedIcon sx={{ color: '#0d9488 !important', fontSize: '0.9rem' }} />}
                                label="Identidad Verificada"
                                size="small"
                                sx={{
                                    bgcolor: '#f0fdfa',
                                    color: '#0f766e',
                                    fontWeight: 600,
                                    border: '1px solid #ccfbf1',
                                    fontSize: '0.75rem',
                                }}
                            />
                        </Box>

                        {/* QR Code */}
                        <Box
                            sx={{
                                p: 1.5,
                                bgcolor: '#ffffff',
                                display: 'inline-block',
                                borderRadius: 2,
                                border: '1px solid #cbd5e1',
                                my: 1,
                            }}
                        >
                            <Box
                                component="img"
                                src={qrUrl}
                                alt={`Código QR de ${displayName}`}
                                sx={{ width: 180, height: 180, display: 'block' }}
                            />
                        </Box>

                        <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 1 }}>
                            Escanea para ver portafolio de obras, calificaciones y contactar directamente.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopyLink}
                        sx={{ borderColor: '#cbd5e1', color: '#475569' }}
                    >
                        Copiar Enlace
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<WhatsAppIcon />}
                            onClick={handleWhatsAppShare}
                            sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' }, color: '#fff' }}
                        >
                            WhatsApp
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<ShareIcon />}
                            onClick={handleNativeShare}
                            sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, color: '#fff' }}
                        >
                            Compartir
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={copied}
                autoHideDuration={3000}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setCopied(false)}>
                    ¡Enlace copiado al portapapeles!
                </Alert>
            </Snackbar>
        </>
    )
}

