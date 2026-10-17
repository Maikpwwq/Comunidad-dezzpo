/**
 * TiendaLogoUpload
 *
 * A self-contained logo upload component for the store registration form.
 * Handles file selection, client-side size validation, Firebase Storage upload,
 * and preview — completely decoupled from user roles.
 *
 * Layout:
 *   Two-column arrangement:
 *   - Column 1: Circular Avatar preview with hover overlay and progress spinner
 *   - Column 2: Logo section title, action buttons ('cargar', 'editar', 'borrar') in their own row,
 *     and status / format helper text.
 *
 * Props:
 *   value    — current logo URL (empty string or undefined = no logo)
 *   onChange — called with the new download URL after upload, or undefined on removal
 *   disabled — disables the control (e.g. while the form is submitting)
 */
import React, { useRef, useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Typography,
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { uploadTiendaLogo } from '@services/tiendas'

interface TiendaLogoUploadProps {
    value?: string | undefined
    onChange: (url: string | undefined) => void
    disabled?: boolean | undefined
}

export const TiendaLogoUpload: React.FC<TiendaLogoUploadProps> = ({
    value,
    onChange,
    disabled = false,
}) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        // Reset input so the same file can be re-selected after removal
        e.target.value = ''
        if (!file) return

        setError(undefined)
        setUploading(true)
        const result = await uploadTiendaLogo(file)
        setUploading(false)

        if (result.success && result.data) {
            onChange(result.data)
        } else {
            setError(result.error?.message ?? 'No se pudo subir el logo')
        }
    }

    const handleRemove = () => {
        setError(undefined)
        onChange(undefined)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                gap: { xs: 2, sm: 2.5 },
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2.5,
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                },
            }}
        >
            {/* Hidden native file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                style={{ display: 'none' }}
                disabled={disabled || uploading}
                onChange={handleFileChange}
            />

            {/* Column 1: Avatar preview */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: 76, sm: 84 },
                        height: { xs: 76, sm: 84 },
                        borderRadius: '50%',
                        cursor: disabled ? 'default' : 'pointer',
                        '&:hover .logo-overlay': {
                            opacity: disabled ? 0 : 1,
                        },
                    }}
                    onClick={() => {
                        if (!disabled && !uploading) inputRef.current?.click()
                    }}
                    aria-label={value ? 'Cambiar logo de la tienda' : 'Subir logo de la tienda'}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !uploading) {
                            inputRef.current?.click()
                        }
                    }}
                >
                    <Avatar
                        {...(value ? { src: value } : {})}
                        alt="Logo de la tienda"
                        sx={{
                            width: { xs: 76, sm: 84 },
                            height: { xs: 76, sm: 84 },
                            bgcolor: value ? 'transparent' : 'rgba(0, 176, 171, 0.08)',
                            border: '2.5px solid',
                            borderColor: value ? 'primary.main' : 'divider',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: disabled ? 'divider' : 'primary.main' },
                        }}
                    >
                        <StorefrontIcon sx={{ fontSize: 38, color: 'primary.main' }} />
                    </Avatar>

                    {/* Hover overlay */}
                    <Box
                        className="logo-overlay"
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            bgcolor: 'rgba(0, 0, 0, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {uploading ? (
                            <CircularProgress size={26} sx={{ color: 'white' }} />
                        ) : (
                            <AddPhotoAlternateIcon sx={{ color: 'white', fontSize: 26 }} />
                        )}
                    </Box>

                    {/* Upload progress when not hovering */}
                    {uploading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.75)',
                            }}
                        >
                            <CircularProgress size={26} color="primary" />
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Column 2: Logo title, action buttons, and status/format rows */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.85,
                    flexGrow: 1,
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    textAlign: { xs: 'center', sm: 'left' },
                }}
            >
                {/* Row 1: Section Title */}
                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.95rem' }}>
                    Logo del Comercio / Tienda
                </Typography>

                {/* Row 2: Action Buttons ('cargar', 'editar', 'borrar') */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                    {!value ? (
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <AddPhotoAlternateIcon />}
                            disabled={disabled || uploading}
                            onClick={() => inputRef.current?.click()}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 1.75,
                                py: 0.5,
                                borderColor: 'primary.main',
                                '&:hover': { bgcolor: 'rgba(0, 176, 171, 0.08)' },
                            }}
                        >
                            {uploading ? 'Subiendo...' : 'Cargar logo'}
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <EditOutlinedIcon />}
                                disabled={disabled || uploading}
                                onClick={() => inputRef.current?.click()}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                }}
                            >
                                {uploading ? 'Subiendo...' : 'Editar / Cambiar'}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                disabled={disabled || uploading}
                                onClick={handleRemove}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                }}
                            >
                                Borrar
                            </Button>
                        </>
                    )}
                </Box>

                {/* Row 3: Helper & Status specification */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                    {value && !error && (
                        <Chip
                            size="small"
                            color="success"
                            variant="outlined"
                            label="Logo cargado"
                            sx={{ height: 20, fontSize: '0.72rem', fontWeight: 600 }}
                        />
                    )}
                    <Typography
                        variant="caption"
                        color={error ? 'error' : 'text.secondary'}
                        sx={{ fontSize: '0.76rem', lineHeight: 1.3 }}
                    >
                        {error ?? 'Formatos recomendados: JPG, PNG o WebP (máx. 5 MB). Opcional.'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default TiendaLogoUpload
