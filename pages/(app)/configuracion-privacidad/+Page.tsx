/**
 * Configuración de Privacidad (Privacy Settings) Page
 *
 * Toggle switches for privacy settings stored in user's
 * `privacySettings` map field in Firestore.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Switch,
    Paper,
    Divider,
    Snackbar,
} from '@mui/material'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import { getUser, updateUser } from '@services/users'
import type { PrivacySettings, UserRole } from '@services/types'

// Default privacy settings
const DEFAULT_PRIVACY: PrivacySettings = {
    showPhone: false,
    showEmail: true,
    allowMarketing: false,
}

interface PrivacyOption {
    key: keyof PrivacySettings
    label: string
    description: string
}

const privacyOptions: PrivacyOption[] = [
    {
        key: 'showPhone',
        label: 'Mostrar teléfono',
        description: 'Permite que usuarios con contratos activos vean tu número de teléfono.',
    },
    {
        key: 'showEmail',
        label: 'Mostrar correo electrónico',
        description: 'Tu correo electrónico será visible públicamente en tu perfil.',
    },
    {
        key: 'allowMarketing',
        label: 'Comunicaciones de marketing',
        description: 'Recibe noticias, promociones y novedades de Comunidad Dezzpo.',
    },
]

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol) as UserRole | null

    const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_PRIVACY)
    const [isLoading, setIsLoading] = useState(true)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Fetch current privacy settings
    useEffect(() => {
        const fetchSettings = async () => {
            if (!currentUserId || !userRole) {
                setIsLoading(false)
                return
            }

            try {
                const userData = await getUser({ userId: currentUserId, role: userRole })
                if (userData && (userData as any).privacySettings) {
                    setSettings({ ...DEFAULT_PRIVACY, ...(userData as any).privacySettings })
                }
            } catch (error) {
                console.error('Error fetching privacy settings:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [currentUserId, userRole])

    // Handle toggle change — saves immediately
    const handleToggle = useCallback(async (key: keyof PrivacySettings) => {
        if (!currentUserId || !userRole) return

        const newSettings = { ...settings, [key]: !settings[key] }
        setSettings(newSettings)

        try {
            await updateUser({
                userId: currentUserId,
                role: userRole,
                data: { privacySettings: newSettings } as any,
            })
            setSnackMessage('Configuración actualizada')
            setSnackOpen(true)
        } catch (error) {
            // Revert on error
            setSettings(settings)
            console.error('Error updating privacy settings:', error)
            setSnackMessage('Error al actualizar')
            setSnackOpen(true)
        }
    }, [currentUserId, userRole, settings])

    if (!currentUserId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">Debes iniciar sesión para gestionar tu privacidad.</Alert>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando configuración...</p>
            </Container>
        )
    }

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 720, margin: '0 auto' }}>
                <h1 className="type-hero-title">Configuración de Privacidad</h1>

                <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    {privacyOptions.map((option, index) => (
                        <React.Fragment key={option.key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                                <div>
                                    <Typography variant="body1" fontWeight={500}>
                                        {option.label}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {option.description}
                                    </Typography>
                                </div>
                                <Switch
                                    checked={settings[option.key]}
                                    onChange={() => handleToggle(option.key)}
                                    color="primary"
                                />
                            </div>
                            {index < privacyOptions.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </Paper>

                <Snackbar
                    open={snackOpen}
                    autoHideDuration={2000}
                    onClose={() => setSnackOpen(false)}
                    message={snackMessage}
                />
            </div>
        </Container>
    )
}
