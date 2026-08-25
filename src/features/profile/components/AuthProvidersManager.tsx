/**
 * AuthProvidersManager Component
 *
 * Visual workbench for viewing, linking, and unlinking multi-provider authentication methods
 * (Google, Phone SMS OTP, Email/Password) within the Settings panel.
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import EmailIcon from '@mui/icons-material/Email'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import CloseIcon from '@mui/icons-material/Close'

import {
    getLinkedProviders,
    linkGoogleProvider,
    linkPhoneProvider,
    unlinkProvider,
    sendSMSCode,
    setupRecaptchaVerifier,
    cleanupRecaptchaVerifier,
    type ConfirmationResult,
} from '@services/firebase/authService'
import type { LinkedAuthProvider } from '@/types/services.d'
import { formatPhoneDisplay, formatToE164 } from '@services/utils/phoneUtils'
import { OTPCodeInput } from '@features/auth/components/OTPCodeInput'
import styles from './UserCard.module.scss'

interface AuthProvidersManagerProps {
    userId: string
    userRole: 1 | 2
    onSyncUser?: () => void
}

export const AuthProvidersManager: React.FC<AuthProvidersManagerProps> = ({
    onSyncUser,
}) => {
    const [providers, setProviders] = useState<LinkedAuthProvider[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

    // Phone Linking Modal State
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
    const [phoneInput, setPhoneInput] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [otpCode, setOtpCode] = useState('')
    const [isSendingSMS, setIsSendingSMS] = useState(false)
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)

    // Unlink Confirmation Dialog State
    const [unlinkTarget, setUnlinkTarget] = useState<LinkedAuthProvider | null>(null)

    // Load linked providers from Firebase Auth
    const refreshProviders = useCallback(() => {
        const linked = getLinkedProviders()
        setProviders(linked)
    }, [])

    useEffect(() => {
        refreshProviders()
    }, [refreshProviders])

    const isGoogleLinked = providers.some((p) => p.providerId === 'google.com')
    const isPhoneLinked = providers.some((p) => p.providerId === 'phone')
    const isPasswordLinked = providers.some((p) => p.providerId === 'password')

    const googleProvider = providers.find((p) => p.providerId === 'google.com')
    const phoneProvider = providers.find((p) => p.providerId === 'phone')
    const passwordProvider = providers.find((p) => p.providerId === 'password')

    // Handle Link Google
    const handleLinkGoogle = async () => {
        setIsLoading(true)
        setAlertMessage(null)
        const response = await linkGoogleProvider()
        setIsLoading(false)

        if (response.success) {
            refreshProviders()
            setAlertMessage({ type: 'success', text: '¡Cuenta de Google vinculada con éxito!' })
            if (onSyncUser) onSyncUser()
        } else {
            setAlertMessage({ type: 'error', text: response.error.message })
        }
    }

    // Handle Start Link Phone (Send SMS)
    const handleSendPhoneCode = async () => {
        if (!phoneInput || phoneInput.trim().length < 7) {
            setAlertMessage({ type: 'error', text: 'Por favor ingresa un número de teléfono celular válido.' })
            return
        }

        const formatted = formatToE164(phoneInput)
        if (!formatted) {
            setAlertMessage({ type: 'error', text: 'Formato de teléfono celular no válido.' })
            return
        }

        setIsSendingSMS(true)
        setAlertMessage(null)

        try {
            const verifier = setupRecaptchaVerifier('link-phone-recaptcha')
            if (!verifier) {
                setIsSendingSMS(false)
                setAlertMessage({ type: 'error', text: 'Error al inicializar la verificación de seguridad.' })
                return
            }

            const result = await sendSMSCode(formatted, verifier)
            setIsSendingSMS(false)

            if (result.success) {
                setConfirmationResult(result.data)
                setAlertMessage({ type: 'info', text: `Código SMS enviado a ${formatPhoneDisplay(formatted)}.` })
            } else {
                cleanupRecaptchaVerifier('link-phone-recaptcha')
                setAlertMessage({ type: 'error', text: result.error.message })
            }
        } catch (err: unknown) {
            cleanupRecaptchaVerifier('link-phone-recaptcha')
            setIsSendingSMS(false)
            setAlertMessage({ type: 'error', text: (err as Error)?.message || 'Error al enviar código SMS' })
        }
    }

    // Handle Verify Phone OTP & Link
    const handleVerifyAndLinkPhone = async () => {
        if (!confirmationResult || otpCode.length !== 6) return

        setIsVerifyingOTP(true)
        setAlertMessage(null)

        const response = await linkPhoneProvider(confirmationResult, otpCode)
        setIsVerifyingOTP(false)

        if (response.success) {
            cleanupRecaptchaVerifier('link-phone-recaptcha')
            setIsPhoneModalOpen(false)
            setConfirmationResult(null)
            setOtpCode('')
            setPhoneInput('')
            refreshProviders()
            setAlertMessage({ type: 'success', text: '¡Teléfono celular vinculado con éxito!' })
            if (onSyncUser) onSyncUser()
        } else {
            setAlertMessage({ type: 'error', text: response.error.message })
        }
    }

    // Handle Unlink Provider
    const handleConfirmUnlink = async () => {
        if (!unlinkTarget) return

        setIsLoading(true)
        setAlertMessage(null)

        const response = await unlinkProvider(unlinkTarget.providerId)
        setIsLoading(false)
        setUnlinkTarget(null)

        if (response.success) {
            refreshProviders()
            setAlertMessage({ type: 'success', text: 'Método de acceso desvinculado con éxito.' })
            if (onSyncUser) onSyncUser()
        } else {
            setAlertMessage({ type: 'error', text: response.error.message })
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            {alertMessage && (
                <Alert
                    severity={alertMessage.type}
                    onClose={() => setAlertMessage(null)}
                    sx={{ mb: 2.5, borderRadius: 2 }}
                >
                    {alertMessage.text}
                </Alert>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Administra las formas con las que puedes acceder a tu cuenta. Mantener múltiples métodos activos facilita
                tu inicio de sesión y asegura que nunca pierdas el acceso.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 1. Google Account */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isGoogleLinked ? 'rgba(32, 157, 161, 0.3)' : '#e0e0e0',
                        backgroundColor: isGoogleLinked ? 'rgba(32, 157, 161, 0.04)' : '#fafafa',
                        flexWrap: 'wrap',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <GoogleIcon sx={{ color: '#EA4335', fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Cuenta de Google
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {isGoogleLinked
                                    ? googleProvider?.email || 'Vinculada activamente'
                                    : 'Inicia sesión rápido con un solo clic'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isGoogleLinked ? (
                            <>
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '1rem !important' }} />}
                                    label="Vinculado"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                                {providers.length > 1 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="text"
                                        startIcon={<LinkOffIcon />}
                                        onClick={() => setUnlinkTarget(googleProvider!)}
                                        disabled={isLoading}
                                    >
                                        Desvincular
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<LinkIcon />}
                                onClick={handleLinkGoogle}
                                disabled={isLoading}
                                sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 600 }}
                            >
                                Vincular Google
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* 2. Phone SMS OTP */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isPhoneLinked ? 'rgba(32, 157, 161, 0.3)' : '#e0e0e0',
                        backgroundColor: isPhoneLinked ? 'rgba(32, 157, 161, 0.04)' : '#fafafa',
                        flexWrap: 'wrap',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIphoneIcon sx={{ color: '#00b0ab', fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Teléfono Celular (SMS OTP)
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {isPhoneLinked
                                    ? formatPhoneDisplay(phoneProvider?.phoneNumber || '') || 'Vinculado activamente'
                                    : 'Acceso seguro mediante código SMS de 6 dígitos'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPhoneLinked ? (
                            <>
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '1rem !important' }} />}
                                    label="Vinculado"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                                {providers.length > 1 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="text"
                                        startIcon={<LinkOffIcon />}
                                        onClick={() => setUnlinkTarget(phoneProvider!)}
                                        disabled={isLoading}
                                    >
                                        Desvincular
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<LinkIcon />}
                                onClick={() => {
                                    setAlertMessage(null)
                                    setIsPhoneModalOpen(true)
                                }}
                                disabled={isLoading}
                                sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 600 }}
                            >
                                Vincular Teléfono
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* 3. Email & Password */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isPasswordLinked ? 'rgba(32, 157, 161, 0.3)' : '#e0e0e0',
                        backgroundColor: isPasswordLinked ? 'rgba(32, 157, 161, 0.04)' : '#fafafa',
                        flexWrap: 'wrap',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EmailIcon sx={{ color: '#662382', fontSize: 28 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Correo y Contraseña
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {isPasswordLinked
                                    ? passwordProvider?.email || 'Vinculado activamente'
                                    : 'Acceso tradicional con credenciales'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPasswordLinked && (
                            <Chip
                                icon={<CheckCircleIcon sx={{ fontSize: '1rem !important' }} />}
                                label="Vinculado"
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Invisible reCAPTCHA container for Phone Linking */}
            <div id="link-phone-recaptcha" style={{ display: 'none' }} />

            {/* Phone Linking Modal */}
            <Dialog
                open={isPhoneModalOpen}
                onClose={() => !isSendingSMS && !isVerifyingOTP && setIsPhoneModalOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Vincular Teléfono Celular
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setIsPhoneModalOpen(false)}
                        disabled={isSendingSMS || isVerifyingOTP}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {!confirmationResult ? (
                        <Box sx={{ pt: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                Te enviaremos un código SMS de 6 dígitos para verificar la titularidad de tu número.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Número Celular (Colombia)"
                                placeholder="320 484 2897"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                disabled={isSendingSMS}
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    ) : (
                        <Box sx={{ pt: 1, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                Ingresa el código de 6 dígitos enviado a{' '}
                                <strong>{formatPhoneDisplay(phoneInput)}</strong>:
                            </Typography>
                            <OTPCodeInput
                                value={otpCode}
                                onChange={setOtpCode}
                                onComplete={() => handleVerifyAndLinkPhone()}
                                isLoading={isVerifyingOTP}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    {!confirmationResult ? (
                        <Button
                            className="btn-primary-gradient"
                            onClick={handleSendPhoneCode}
                            disabled={isSendingSMS || !phoneInput.trim()}
                            sx={{ minWidth: 140 }}
                        >
                            {isSendingSMS ? <CircularProgress size={20} color="inherit" /> : 'Enviar Código SMS'}
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setConfirmationResult(null)
                                    setOtpCode('')
                                }}
                                disabled={isVerifyingOTP}
                            >
                                Cambiar Número
                            </Button>
                            <Button
                                className="btn-primary-gradient"
                                onClick={handleVerifyAndLinkPhone}
                                disabled={isVerifyingOTP || otpCode.length !== 6}
                            >
                                {isVerifyingOTP ? <CircularProgress size={20} color="inherit" /> : 'Verificar y Vincular'}
                            </Button>
                        </Box>
                    )}
                </DialogActions>
            </Dialog>

            {/* Unlink Confirmation Dialog */}
            <Dialog
                open={Boolean(unlinkTarget)}
                onClose={() => setUnlinkTarget(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>¿Desvincular método de acceso?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ya no podrás usar{' '}
                        <strong>
                            {unlinkTarget?.providerId === 'google.com'
                                ? 'tu cuenta de Google'
                                : unlinkTarget?.providerId === 'phone'
                                ? 'tu número de teléfono celular'
                                : 'este método'}
                        </strong>{' '}
                        para iniciar sesión. Podrás seguir ingresando con tus otros métodos vinculados.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setUnlinkTarget(null)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmUnlink}
                        color="error"
                        variant="contained"
                        disabled={isLoading}
                        sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 600 }}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Desvinculación'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default AuthProvidersManager
