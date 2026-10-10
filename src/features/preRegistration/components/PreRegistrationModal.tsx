/**
 * Pre-Registration Modal Component (`PreRegistrationModal.tsx`)
 *
 * Provides the interactive user experience for recommending professionals from `/app/portal-servicios`.
 * Features:
 * - Tab 1: "Recomendar profesional" form with early non-enumerating duplicate check,
 *   field validations, 15-300 character counter, skills picker, and mandatory V1.1 consent.
 * - Tab 2: "Mis recomendaciones" list with status tracking and "Retirar" action (R12).
 * - Mobile-first responsive sheet (fullScreen on small viewports, centered modal on desktop).
 * - Safe-area padding and high z-index avoiding floating chat overlap.
 * - Innovation 2: "Avísale tú" WhatsApp handoff button upon success.
 */

import React, { useState, useEffect, useRef, useTransition } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Tabs,
    Tab,
    Chip,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ListAltIcon from '@mui/icons-material/ListAlt'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import {
    submitPreRegistration,
    checkEarlyCandidateName,
    getMyPreRegistrations,
    withdrawPreRegistration,
} from '@services/preRegistration'
import {
    CANONICAL_PRIVACY_NOTICE_VERSION,
    DESCRIPTION_MAX_LENGTH,
    DESCRIPTION_MIN_LENGTH,
    MAX_SKILLS_COUNT,
    REJECTION_REASON_LABELS,
    type RejectionReasonCode,
} from '@config/preRegistration.config'
import type { PreRegistrationStatus } from '@/features/preRegistration/types'

export interface PreRegistrationModalProps {
    readonly open: boolean
    readonly onClose: () => void
    readonly initialCategoryKey?: string | number | null | undefined
}

interface EarlyCheckState {
    readonly isChecking: boolean
    readonly existsInDirectory?: boolean | undefined
    readonly publicProfile?: { userId: string; displayName: string } | undefined
    readonly existsInPreRegistrations?: boolean | undefined
    readonly isSelfRecommendation?: boolean | undefined
    readonly message?: string | undefined
}

export const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({
    open,
    onClose,
    initialCategoryKey,
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [, startTransition] = useTransition()

    // View state: 0 = Form, 1 = My Submissions
    const [currentTab, setCurrentTab] = useState<number>(0)

    // Form inputs
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [description, setDescription] = useState('')
    const [selectedSkills, setSelectedSkills] = useState<typeof ListadoCategorias>([])
    const [address, setAddress] = useState('')
    const [website, setWebsite] = useState('')
    const [acceptedConsent, setAcceptedConsent] = useState(false)

    // UI Feedback & early warning
    const [earlyCheck, setEarlyCheck] = useState<EarlyCheckState>({ isChecking: false })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [successData, setSuccessData] = useState<{
        displayName: string
        phone: string
    } | null>(null)

    // My submissions list (R12)
    const [mySubmissions, setMySubmissions] = useState<
        {
            id: string
            status: PreRegistrationStatus
            createdAt: string
            candidate: { displayName: string; skillIds: string[] }
            reasonCode?: string | null
        }[]
    >([])
    const [loadingSubmissions, setLoadingSubmissions] = useState(false)
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null)

    // Pre-fill initial skill if passed
    useEffect(() => {
        if (initialCategoryKey !== undefined && initialCategoryKey !== null) {
            const found = ListadoCategorias.find(
                (c) =>
                    c.key === initialCategoryKey ||
                    c.label.toLowerCase() === String(initialCategoryKey).toLowerCase(),
            )
            if (found) {
                setSelectedSkills([found])
            }
        }
    }, [initialCategoryKey])

    // Load user's submissions when tab 1 is opened
    useEffect(() => {
        if (currentTab === 1 && open) {
            setLoadingSubmissions(true)
            getMyPreRegistrations()
                .then((data) => setMySubmissions(data))
                .finally(() => setLoadingSubmissions(false))
        }
    }, [currentTab, open])

    // 300ms debounce early duplicate check on candidate name
    const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setDisplayName(val)

        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current)
        }

        if (val.trim().length >= 3) {
            setEarlyCheck({ isChecking: true })
            checkTimeoutRef.current = setTimeout(() => {
                checkEarlyCandidateName(val)
                    .then((result) => {
                        startTransition(() => {
                            setEarlyCheck({
                                isChecking: false,
                                existsInDirectory: result.existsInDirectory,
                                publicProfile: result.publicProfile,
                                existsInPreRegistrations: result.existsInPreRegistrations,
                                isSelfRecommendation: result.isSelfRecommendation,
                                message: result.message,
                            })
                        })
                    })
                    .catch(() => setEarlyCheck({ isChecking: false }))
            }, 300)
        } else {
            setEarlyCheck({ isChecking: false })
        }
    }

    // Reset form
    const resetForm = () => {
        setDisplayName('')
        setEmail('')
        setPhone('')
        setDescription('')
        setSelectedSkills([])
        setAddress('')
        setWebsite('')
        setAcceptedConsent(false)
        setEarlyCheck({ isChecking: false })
        setSubmitError(null)
        setSuccessData(null)
    }

    const handleClose = () => {
        // Confirmation if dirty and not succeeded
        if (
            (displayName || email || phone || description) &&
            !successData &&
            !window.confirm('¿Deseas descartar los datos ingresados?')
        ) {
            return
        }
        resetForm()
        onClose()
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null)

        if (!acceptedConsent) {
            setSubmitError(
                'Debes aceptar el Aviso de Privacidad y Tratamiento de Datos Personales para continuar.',
            )
            return
        }

        if (description.trim().length < DESCRIPTION_MIN_LENGTH) {
            setSubmitError(
                `La descripción debe tener al menos ${DESCRIPTION_MIN_LENGTH} caracteres.`,
            )
            return
        }

        setIsSubmitting(true)
        const idempotencyKey =
            typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

        const payload = {
            candidate: {
                displayName: displayName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                description: description.trim(),
                skillIds: selectedSkills.map((s) => s.label),
                ...(address.trim() ? { address: address.trim() } : {}),
                ...(website.trim() ? { website: website.trim() } : {}),
            },
            consent: {
                privacyNoticeVersion: CANONICAL_PRIVACY_NOTICE_VERSION,
                accepted: true as const,
            },
            idempotencyKey,
        }

        const result = await submitPreRegistration(payload)
        setIsSubmitting(false)

        if (result.success) {
            setSuccessData({
                displayName: displayName.trim(),
                phone: phone.trim(),
            })
        } else {
            setSubmitError(result.error || 'Ocurrió un error al procesar la recomendación.')
        }
    }

    // Handle withdrawal of author's pending item
    const handleWithdraw = async (id: string) => {
        if (!window.confirm('¿Seguro que deseas retirar esta recomendación?')) {
            return
        }
        setWithdrawingId(id)
        const res = await withdrawPreRegistration(id)
        setWithdrawingId(null)
        if (res.success) {
            setMySubmissions((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: 'retirada' } : item,
                ),
            )
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
            aria-labelledby="recommend-dialog-title"
            aria-describedby="recommend-dialog-desc"
            sx={{
                zIndex: 1400, // Guarantees modal renders cleanly above floating chat widget
                '& .MuiDialog-paper': {
                    borderRadius: isMobile ? 0 : 3,
                    maxHeight: isMobile ? '100%' : '90vh',
                },
            }}
        >
            <DialogTitle
                id="recommend-dialog-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    borderBottom: '1px solid #f1f5f9',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonAddAlt1Icon sx={{ color: 'var(--brand-teal, #00897b)' }} />
                    <Typography variant="h6" component="span" fontWeight={800} color="#0A2540">
                        Recomendar un profesional
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} aria-label="Cerrar ventana" size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Tabs
                value={currentTab}
                onChange={(_, newVal) => setCurrentTab(newVal)}
                sx={{
                    px: 3,
                    borderBottom: '1px solid #e2e8f0',
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 },
                }}
            >
                <Tab label="Recomendar profesional" icon={<PersonAddAlt1Icon />} iconPosition="start" />
                <Tab
                    label={`Mis recomendaciones ${mySubmissions.length > 0 ? `(${mySubmissions.length})` : ''}`}
                    icon={<ListAltIcon />}
                    iconPosition="start"
                />
            </Tabs>

            <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
                <Typography id="recommend-dialog-desc" sx={{ position: 'absolute', width: 1, height: 1, clip: 'rect(0 0 0 0)', overflow: 'hidden' }}>
                    Formulario para recomendar a un maestro o profesional técnico que aún no está en Dezzpo.
                </Typography>

                {currentTab === 0 ? (
                    successData ? (
                        /* Success View */
                        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#16a34a', mb: 2 }} />
                            <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
                                ¡Gracias por recomendar!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 3 }}>
                                Revisaremos los datos de <strong>{successData.displayName}</strong> y, si todo está en orden, nuestro equipo lo contactará para que active su perfil en Dezzpo.
                            </Typography>

                            {/* Innovation 2: "Avísale tú" WhatsApp shortcut */}
                            {successData.phone && (
                                <Box
                                    sx={{
                                        p: 2.5,
                                        mb: 3,
                                        borderRadius: 2.5,
                                        bgcolor: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                        maxWidth: 520,
                                        mx: 'auto',
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight={700} color="#15803d" gutterBottom>
                                        ¿Quieres que sepa que lo recomendaste?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Puedes enviarle un mensaje por WhatsApp desde tu celular para avisarle que lo recomendaste en Dezzpo.
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        startIcon={<WhatsAppIcon />}
                                        component="a"
                                        href={`https://wa.me/57${successData.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                            `Hola ${successData.displayName}, te recomendé en Comunidad Dezzpo para que más personas puedan contratar tus servicios. Pronto el equipo de Dezzpo te contactará para invitarte a la red.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Avísale por WhatsApp
                                    </Button>
                                </Box>
                            )}

                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    onClick={resetForm}
                                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
                                >
                                    Recomendar a otro profesional
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Listo, cerrar
                                </Button>
                            </Stack>
                        </Box>
                    ) : (
                        /* Submission Form */
                        <form onSubmit={handleSubmit} id="pre-reg-form">
                            <Stack spacing={2.5}>
                                <Typography variant="body2" color="text.secondary">
                                    ¿Conoces a un buen maestro o empresa de construcción y mantenimiento que aún no está en Dezzpo? Déjanos sus datos para invitarlo a la comunidad.
                                </Typography>

                                {submitError && (
                                    <Alert severity="error" role="alert" sx={{ borderRadius: 2 }}>
                                        {submitError}
                                    </Alert>
                                )}

                                {/* Early Duplicate Warning Banner */}
                                {earlyCheck.existsInDirectory && earlyCheck.publicProfile && (
                                    <Alert
                                        severity="info"
                                        sx={{ borderRadius: 2 }}
                                        action={
                                            <Button
                                                size="small"
                                                color="inherit"
                                                href={`/app/perfil/${earlyCheck.publicProfile.userId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<OpenInNewIcon fontSize="small" />}
                                            >
                                                Ver perfil
                                            </Button>
                                        }
                                    >
                                        Este profesional ya está registrado en Dezzpo ({earlyCheck.publicProfile.displayName}).
                                    </Alert>
                                )}

                                {earlyCheck.isSelfRecommendation && (
                                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                        Estás ingresando tus propios datos de perfil.
                                    </Alert>
                                )}

                                {earlyCheck.existsInPreRegistrations && (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        Ya recibimos una recomendación de este profesional. ¡Gracias por tu interés!
                                    </Alert>
                                )}

                                {/* Display Name */}
                                <TextField
                                    label="Nombre del profesional o empresa"
                                    required
                                    fullWidth
                                    value={displayName}
                                    onChange={handleNameChange}
                                    autoComplete="off"
                                    placeholder="Ej: Carlos Rodríguez o Instalaciones Eléctricas SAS"
                                    helperText="Nombre comercial o personal con el que presta sus servicios."
                                    InputProps={{
                                        endAdornment: earlyCheck.isChecking ? (
                                            <CircularProgress size={18} />
                                        ) : null,
                                    }}
                                />

                                {/* Contact Row: Email + Phone */}
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        label="Correo electrónico"
                                        type="email"
                                        required
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                        placeholder="correo@ejemplo.com"
                                    />
                                    <TextField
                                        label="WhatsApp o teléfono celular"
                                        type="tel"
                                        inputMode="numeric"
                                        required
                                        fullWidth
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoComplete="off"
                                        placeholder="Ej: 320 484 2897"
                                        helperText="Celular de Colombia (10 dígitos)."
                                    />
                                </Stack>

                                {/* Description with length counter */}
                                <Box>
                                    <TextField
                                        label="¿A qué se dedica? Cuéntanos en pocas palabras"
                                        required
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        autoComplete="off"
                                        placeholder="Ej: Técnico electricista especializado en redes residenciales y tableros de control con 10 años de experiencia."
                                        helperText={`${description.length} / ${DESCRIPTION_MAX_LENGTH} caracteres (mínimo ${DESCRIPTION_MIN_LENGTH}).`}
                                        error={
                                            description.length > 0 &&
                                            description.length < DESCRIPTION_MIN_LENGTH
                                        }
                                    />
                                </Box>

                                {/* Skills Selector (ListadoCategorias) */}
                                <Autocomplete
                                    multiple
                                    options={ListadoCategorias}
                                    getOptionLabel={(option) => option.label}
                                    value={selectedSkills}
                                    onChange={(_, newVal) => {
                                        if (newVal.length <= MAX_SKILLS_COUNT) {
                                            setSelectedSkills(newVal)
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...(params as unknown as Record<string, unknown>)}
                                            label="Habilidades u oficios (Opcional, máx. 5)"
                                            placeholder="Seleccionar especialidades..."
                                            helperText={`${selectedSkills.length} / ${MAX_SKILLS_COUNT} seleccionadas.`}
                                        />
                                    )}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => (
                                            <Chip
                                                label={option.label}
                                                {...getTagProps({ index })}
                                                key={option.key}
                                                size="small"
                                            />
                                        ))
                                    }
                                />

                                {/* Address (Optional) */}
                                <TextField
                                    label="Dirección o zona de trabajo (Opcional)"
                                    fullWidth
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    autoComplete="off"
                                    placeholder="Ej: Carrera 24 # 65-12, Bogotá"
                                    helperText="Mejor la de su local, taller u oficina; evita direcciones de vivienda."
                                />

                                {/* Website or Social Media (Optional) */}
                                <TextField
                                    label="Sitio web o red social (Opcional)"
                                    type="text"
                                    fullWidth
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    autoComplete="off"
                                    placeholder="Ej: instagram.com/maestro o www.suweb.com"
                                />

                                {/* Canonical Consent Checkbox (R3) */}
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={acceptedConsent}
                                                onChange={(e) => setAcceptedConsent(e.target.checked)}
                                                color="primary"
                                                id="pre-reg-consent-checkbox"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                                                He leído y acepto el{' '}
                                                <a
                                                    href="/legal?doc=aviso-privacidad"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        textDecoration: 'underline',
                                                        fontWeight: 700,
                                                        color: 'var(--brand-teal, #00897b)',
                                                    }}
                                                >
                                                    Aviso de Privacidad y Autorización para el Tratamiento de Datos Personales
                                                </a>
                                                . <span style={{ color: '#ef4444' }}>*</span>
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </Stack>
                        </form>
                    )
                ) : (
                    /* Tab 2: My Recommendations (R12) */
                    <Box>
                        {loadingSubmissions ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : mySubmissions.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Aún no has recomendado a ningún profesional.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {mySubmissions.map((sub) => {
                                    const statusColors: Record<PreRegistrationStatus, 'warning' | 'success' | 'error' | 'default'> = {
                                        pendiente: 'warning',
                                        aprobada: 'success',
                                        rechazada: 'error',
                                        duplicada: 'default',
                                        retirada: 'default',
                                    }

                                    const statusLabels: Record<PreRegistrationStatus, string> = {
                                        pendiente: 'En revisión',
                                        aprobada: 'En radar Dezzpo',
                                        rechazada: 'No admitida',
                                        duplicada: 'Ya registrada',
                                        retirada: 'Retirada',
                                    }

                                    return (
                                        <Box
                                            key={sub.id}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2.5,
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {sub.candidate.displayName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Enviada el: {new Date(sub.createdAt).toLocaleDateString('es-CO')}
                                                </Typography>
                                                {sub.status === 'rechazada' && sub.reasonCode && (
                                                    <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
                                                        Motivo: {REJECTION_REASON_LABELS[sub.reasonCode as RejectionReasonCode] || 'No admitida'}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Chip
                                                    label={statusLabels[sub.status]}
                                                    color={statusColors[sub.status]}
                                                    size="small"
                                                    sx={{ fontWeight: 700 }}
                                                />
                                                {sub.status === 'pendiente' && (
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        startIcon={<DeleteOutlineIcon />}
                                                        disabled={withdrawingId === sub.id}
                                                        onClick={() => handleWithdraw(sub.id)}
                                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                                    >
                                                        Retirar
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Box>
                                    )
                                })}
                            </Stack>
                        )}
                    </Box>
                )}
            </DialogContent>

            {currentTab === 0 && !successData && (
                <DialogActions
                    sx={{
                        p: 2.5,
                        borderTop: '1px solid #f1f5f9',
                        pb: 'max(16px, env(safe-area-inset-bottom))',
                    }}
                >
                    <Button onClick={handleClose} disabled={isSubmitting} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="pre-reg-form"
                        variant="contained"
                        disabled={
                            isSubmitting ||
                            !acceptedConsent ||
                            !displayName ||
                            !email ||
                            !phone ||
                            description.length < DESCRIPTION_MIN_LENGTH
                        }
                        sx={{
                            borderRadius: '50px',
                            px: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: 'var(--brand-teal, #00897b)',
                            '&:hover': { bgcolor: '#00796b' },
                        }}
                    >
                        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Enviar recomendación'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
