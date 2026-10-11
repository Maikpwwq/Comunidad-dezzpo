/**
 * TiendaLogoUpload
 *
 * A self-contained logo upload component for the store registration form.
 * Handles file selection, client-side size validation, Firebase Storage upload,
 * and preview — completely decoupled from user roles.
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
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
            {/* Hidden native file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={disabled || uploading}
                onChange={handleFileChange}
            />

            {/* Avatar / logo preview */}
            <Box
                sx={{
                    position: 'relative',
                    width: 96,
                    height: 96,
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
                        width: 96,
                        height: 96,
                        bgcolor: value ? 'transparent' : 'primary.50',
                        border: '3px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: disabled ? 'divider' : 'primary.main' },
                    }}
                >
                    <StorefrontIcon sx={{ fontSize: 40, color: 'primary.light' }} />
                </Avatar>

                {/* Hover overlay */}
                <Box
                    className="logo-overlay"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,0,0,0.40)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    }}
                >
                    {uploading ? (
                        <CircularProgress size={28} sx={{ color: 'white' }} />
                    ) : (
                        <AddPhotoAlternateIcon sx={{ color: 'white', fontSize: 28 }} />
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
                            bgcolor: 'rgba(255,255,255,0.70)',
                        }}
                    >
                        <CircularProgress size={28} color="primary" />
                    </Box>
                )}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Tooltip title={value ? 'Cambiar logo (JPG, PNG, WebP – máx. 5 MB)' : 'Subir logo (JPG, PNG, WebP – máx. 5 MB)'}>
                    <span>
                        <IconButton
                            size="small"
                            color="primary"
                            disabled={disabled || uploading}
                            onClick={() => inputRef.current?.click()}
                            aria-label="Seleccionar imagen de logo"
                        >
                            <AddPhotoAlternateIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                {value && (
                    <Tooltip title="Eliminar logo">
                        <span>
                            <IconButton
                                size="small"
                                color="default"
                                disabled={disabled || uploading}
                                onClick={handleRemove}
                                aria-label="Eliminar logo"
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            </Box>

            {/* Label below */}
            <Typography
                variant="caption"
                color={error ? 'error' : 'text.secondary'}
                sx={{ textAlign: 'center', maxWidth: 120, lineHeight: 1.3 }}
            >
                {error ?? (value ? 'Logo cargado' : 'Logo de la tienda')}
            </Typography>
        </Box>
    )
}

export default TiendaLogoUpload
