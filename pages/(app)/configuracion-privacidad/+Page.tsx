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
    Box,
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

                <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: '#0f172a' }}>
                        Documentos Legales y Protección de Datos Personales
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Conforme a la Ley 1581 de 2012 de Habeas Data, puedes consultar nuestros términos oficiales y políticas de tratamiento de datos en cualquier momento:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <a
                            href="/legal?doc=aviso-privacidad"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                        >
                            • Aviso de Privacidad y Autorización de Tratamiento de Datos Personales →
                        </a>
                        <a
                            href="/legal?doc=politica-tratamiento-datos"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                        >
                            • Política de Tratamiento de Datos Personales (Ley 1581 de 2012) →
                        </a>
                        <a
                            href="/legal"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#64748b', fontWeight: 600, textDecoration: 'none' }}
                        >
                            • Centro Legal Completo (Términos y Condiciones) →
                        </a>
                    </Box>
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
