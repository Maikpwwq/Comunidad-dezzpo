/**
 * TiendaSocialLinksManager
 *
 * Dynamic social media channel manager for store registration.
 * Reuses the same PLATFORM_CONFIG / PLATFORM_LIST / SocialLink ecosystem
 * already established in app/ajustes/+Page.tsx.
 *
 * Props:
 *   links    — current list of SocialLink entries
 *   onChange — called on any modification
 *   disabled — disables all controls
 */
import React from 'react'
import {
    Box,
    Button,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
    PLATFORM_CONFIG,
    PLATFORM_LIST,
    createEmptySocialLink,
    validateSocialUrl,
} from '@utilities/socialUtils'
import type { SocialLink, SocialPlatform } from '@services/types'

const MAX_LINKS = 8

interface TiendaSocialLinksManagerProps {
    links: SocialLink[]
    onChange: (links: SocialLink[]) => void
    disabled?: boolean | undefined
}

export const TiendaSocialLinksManager: React.FC<TiendaSocialLinksManagerProps> = ({
    links,
    onChange,
    disabled = false,
}) => {
    // Track URL validation errors per link ID
    const urlErrors: Record<string, boolean> = {}
    links.forEach((l) => {
        urlErrors[l.id] = l.url.length > 0 && !validateSocialUrl(l.platform, l.url)
    })

    const handleAdd = () => {
        if (links.length >= MAX_LINKS) return
        const maxPriority = links.reduce((m, l) => Math.max(m, l.priority), -1)
        onChange([...links, createEmptySocialLink(maxPriority + 1)])
    }

    const handleRemove = (id: string) => {
        onChange(links.filter((l) => l.id !== id))
    }

    const handleChange = (id: string, field: keyof SocialLink, value: unknown) => {
        onChange(
            links.map((l) =>
                l.id === id ? { ...l, [field]: value } : l
            )
        )
    }

    const handlePlatformChange = (id: string, platform: SocialPlatform) => {
        // Reset URL when platform changes to avoid stale validation state
        onChange(
            links.map((l) =>
                l.id === id ? { ...l, platform, url: '' } : l
            )
        )
    }

    return (
        <Box>
            <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ display: 'block', mb: 1.5 }}
            >
                Redes Sociales y Canales Digitales (Opcional)
            </Typography>

            {links.length === 0 && (
                <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', mb: 1.5, fontStyle: 'italic' }}
                >
                    Sin canales digitales registrados. Agrega WhatsApp, Instagram, Facebook u otros.
                </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {links.map((link, idx) => (
                    <Box key={link.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'flex-start',
                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            }}
                        >
                            {/* Platform Selector */}
                            <FormControl size="small" sx={{ minWidth: 130, flexShrink: 0 }}>
                                <Select
                                    value={link.platform}
                                    disabled={disabled}
                                    onChange={(e) =>
                                        handlePlatformChange(link.id, e.target.value as SocialPlatform)
                                    }
                                    inputProps={{ 'aria-label': `Plataforma de canal ${idx + 1}` }}
                                >
                                    {PLATFORM_LIST.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {PLATFORM_CONFIG[p].name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* URL Input */}
                            <TextField
                                size="small"
                                placeholder={PLATFORM_CONFIG[link.platform].placeholder}
                                value={link.url}
                                disabled={disabled}
                                error={urlErrors[link.id] ?? false}
                                onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                                sx={{ flex: 2, minWidth: { xs: '100%', sm: 180 } }}
                                inputProps={{ 'aria-label': `URL del canal ${idx + 1}` }}
                            />

                            {/* Label (optional custom name) */}
                            <TextField
                                size="small"
                                placeholder="Etiqueta (ej: Canal de cotizaciones)"
                                value={link.label ?? ''}
                                disabled={disabled}
                                onChange={(e) => handleChange(link.id, 'label', e.target.value)}
                                sx={{ flex: 1.5, minWidth: { xs: '100%', sm: 140 } }}
                                inputProps={{ 'aria-label': `Etiqueta del canal ${idx + 1}` }}
                            />

                            {/* Visibility toggle */}
                            <Tooltip title={link.isVisible ? 'Visible para visitantes' : 'Oculto para visitantes'}>
                                <span>
                                    <IconButton
                                        size="small"
                                        disabled={disabled}
                                        onClick={() => handleChange(link.id, 'isVisible', !link.isVisible)}
                                        aria-label={`Alternar visibilidad del canal ${idx + 1}`}
                                        sx={{
                                            color: link.isVisible ? 'primary.main' : 'action.disabled',
                                            mt: 0.25,
                                        }}
                                    >
                                        {link.isVisible ? (
                                            <VisibilityIcon fontSize="small" />
                                        ) : (
                                            <VisibilityOffIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                </span>
                            </Tooltip>

                            {/* Remove */}
                            <Tooltip title="Eliminar canal">
                                <span>
                                    <IconButton
                                        size="small"
                                        disabled={disabled}
                                        onClick={() => handleRemove(link.id)}
                                        aria-label={`Eliminar canal ${idx + 1}`}
                                        sx={{ mt: 0.25 }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>

                        {/* Inline URL error */}
                        {urlErrors[link.id] && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ pl: 0.5, mt: 0.25, display: 'block' }}
                            >
                                URL no válida para {PLATFORM_CONFIG[link.platform].name}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>

            <Button
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAdd}
                disabled={disabled || links.length >= MAX_LINKS}
                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, mt: 1.5 }}
            >
                {links.length >= MAX_LINKS
                    ? `Máximo ${MAX_LINKS} canales`
                    : 'Agregar red social'}
            </Button>
        </Box>
    )
}

export default TiendaSocialLinksManager
