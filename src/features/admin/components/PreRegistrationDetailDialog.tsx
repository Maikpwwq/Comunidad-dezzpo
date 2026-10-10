/**
 * PreRegistrationDetailDialog (`PreRegistrationDetailDialog.tsx`)
 *
 * Admin moderation and verification workbench dialog for evaluating
 * professional pre-registrations and candidate talent radar.
 *
 * Features:
 * 1. Comprehensive candidate profile inspection & inline editing prior to approval.
 * 2. Source contrasting checklist (`contrastedWithSources` mandatory before approving).
 * 3. Safe contact shortcuts (`tel:`, `mailto:`, WhatsApp with `rel="noopener noreferrer"`).
 * 4. First-contact legal-compliant outreach template with 1-click clipboard copy (R3).
 * 5. Closed rejection reason picker and duplicate marking.
 * 6. Right to data suppression (Habeas Data).
 * 7. Optimistic concurrency detection (`expectedVersion`).
 */

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    TextField,
    Chip,
    FormControlLabel,
    Checkbox,
    Alert,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    Autocomplete,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import LanguageIcon from '@mui/icons-material/Language'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import type {
    PreRegistration,
    PreRegistrationCandidate,
    ModerationAction,
} from '@/features/preRegistration/types'
import {
    REJECTION_REASONS,
    REJECTION_REASON_LABELS,
    OUTREACH_MESSAGE_TEMPLATE,
    type RejectionReasonCode,
} from '@/config/preRegistration.config'
import { moderatePreRegistration } from '@services/preRegistration/preRegistrationService'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { formatPhoneDisplay } from '@services/utils/phoneUtils'

export interface PreRegistrationDetailDialogProps {
    open: boolean
    item: PreRegistration | null
    onClose: () => void
    onModerationComplete: (outcomeMessage: string) => void
}

export function PreRegistrationDetailDialog({
    open,
    item,
    onClose,
    onModerationComplete,
}: PreRegistrationDetailDialogProps) {
    if (!item) return null

    const initialCand = item.candidate || {}

    // Editable candidate fields
    const [displayName, setDisplayName] = useState(initialCand.displayName || '')
    const [phone, setPhone] = useState(initialCand.phoneE164 || '')
    const [email, setEmail] = useState(initialCand.email || '')
    const [description, setDescription] = useState(initialCand.description || '')
    const [selectedSkills, setSelectedSkills] = useState<number[]>(
        (initialCand.skillIds || []).map((s) => Number(s)),
    )
    const [address, setAddress] = useState(initialCand.address || '')
    const [website, setWebsite] = useState(initialCand.website || '')

    // Verification checklist
    const [contrastedSources, setContrastedSources] = useState(false)
    const [contactedByAdmin, setContactedByAdmin] = useState(false)
    const [matchedProfession, setMatchedProfession] = useState(false)

    // Moderation state
    const [internalNotes, setInternalNotes] = useState('')
    const [activeAction, setActiveAction] = useState<'idle' | 'reject' | 'duplicate' | 'suppress'>('idle')
    const [rejectionReason, setRejectionReason] = useState<RejectionReasonCode>('informacion_insuficiente')
    const [duplicateRefId, setDuplicateRefId] = useState('')

    // Feedback & loading
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)

    // Reset when item changes
    useEffect(() => {
        if (item) {
            const cand = item.candidate || {}
            setDisplayName(cand.displayName || '')
            setPhone(cand.phoneE164 || '')
            setEmail(cand.email || '')
            setDescription(cand.description || '')
            setSelectedSkills((cand.skillIds || []).map((s) => Number(s)))
            setAddress(cand.address || '')
            setWebsite(cand.website || '')
            setContrastedSources(false)
            setContactedByAdmin(false)
            setMatchedProfession(false)
            setInternalNotes('')
            setActiveAction('idle')
            setErrorMsg(null)
            setCopySuccess(false)
        }
    }, [item])

    const cleanPhoneDigits = (phone || '').replace(/\D/g, '')
    const outreachMessage = OUTREACH_MESSAGE_TEMPLATE(displayName || 'Profesional')

    const handleCopyTemplate = async () => {
        try {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(outreachMessage)
                setCopySuccess(true)
                setTimeout(() => setCopySuccess(false), 3000)
            }
        } catch {
            setCopySuccess(false)
        }
    }

    const handleExecuteModeration = async (action: ModerationAction) => {
        setSubmitting(true)
        setErrorMsg(null)

        const result = await moderatePreRegistration({
            id: item.id,
            expectedVersion: item.version,
            action,
        })

        setSubmitting(false)

        if (!result.success) {
            if (result.code === 'CONFLICT') {
                setErrorMsg('Conflicto de concurrencia: este pre-registro fue modificado por otro administrador. Por favor cierra y recarga.')
            } else {
                setErrorMsg(result.error || 'Error al ejecutar la moderación.')
            }
            return
        }

        const msg =
            action.type === 'aprobar'
                ? `Candidato ${displayName} aprobado e incorporado al Radar.`
                : action.type === 'rechazar'
                ? `Pre-registro rechazado con motivo: ${REJECTION_REASON_LABELS[action.reasonCode]}`
                : action.type === 'duplicada'
                ? 'Pre-registro marcado como duplicado.'
                : 'Pre-registro suprimido conforme a solicitud de Habeas Data.'

        onModerationComplete(msg)
        onClose()
    }

    const handleApprove = () => {
        const edits: Partial<PreRegistrationCandidate> = {
            displayName: displayName.trim(),
            phoneE164: phone.trim(),
            description: description.trim(),
            skillIds: selectedSkills.map(String),
            ...(email.trim() ? { email: email.trim() } : {}),
            ...(address.trim() ? { address: address.trim() } : {}),
            ...(website.trim() ? { website: website.trim() } : {}),
        }

        handleExecuteModeration({
            type: 'aprobar',
            verification: {
                contrastedWithSources: true,
                ...(internalNotes.trim() ? { sourcesNote: internalNotes.trim() } : {}),
            },
            edits,
            ...(internalNotes.trim() ? { internalNote: internalNotes.trim() } : {}),
        })
    }

    const handleReject = () => {
        handleExecuteModeration({
            type: 'rechazar',
            reasonCode: rejectionReason,
            ...(internalNotes.trim() ? { internalNote: internalNotes.trim() } : {}),
        })
    }

    const handleMarkDuplicate = () => {
        handleExecuteModeration({
            type: 'duplicada',
            duplicateOf: {
                type: 'pre_registration',
                targetId: duplicateRefId.trim() || 'unknown',
                displayName: 'Duplicado',
            },
            ...(internalNotes.trim() ? { internalNote: internalNotes.trim() } : {}),
        })
    }

    const handleSuppress = () => {
        handleExecuteModeration({
            type: 'suprimir',
            requestedBy: 'admin',
            reason: internalNotes.trim() || 'Solicitud de supresión de datos.',
        })
    }

    return (
        <Dialog
            open={open}
            onClose={submitting ? undefined : onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="pre-reg-detail-title"
        >
            <DialogTitle
                id="pre-reg-detail-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    borderBottom: '1px solid var(--border-color, #e0e0e0)',
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography component="span" variant="h6" fontWeight={700}>
                        Ficha de Moderación — Pre-Registro
                    </Typography>
                    <Chip
                        label={`v${item.version}`}
                        size="small"
                        sx={{ fontSize: '0.72rem', height: 20 }}
                    />
                    <Chip
                        label={item.status.toUpperCase()}
                        size="small"
                        color={
                            item.status === 'pendiente'
                                ? 'warning'
                                : item.status === 'aprobada'
                                ? 'success'
                                : 'default'
                        }
                        sx={{ fontWeight: 700, fontSize: '0.72rem', height: 20 }}
                    />
                </Box>
                <IconButton onClick={onClose} disabled={submitting} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2.5 }}>
                {/* Possible Match Alert Banner (R9 Coexistence) */}
                {item.hasPossibleMatch && (
                    <Alert
                        severity="warning"
                        icon={<WarningAmberIcon />}
                        sx={{ mb: 2.5, borderRadius: 2 }}
                    >
                        <Typography variant="subtitle2" fontWeight={700}>
                            Alerta de Coincidencia (R9)
                        </Typography>
                        <Typography variant="body2">
                            Se detectó posible coincidencia con un usuario comerciante registrado en la plataforma
                            {item.matchedUserId ? ` (UID: ${item.matchedUserId})` : ''}. Verifica si ya cuenta con perfil oficial activo antes de aprobar.
                        </Typography>
                    </Alert>
                )}

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

                {/* Grid with 2 columns: Candidate Details & Moderation Checklist */}
                <Grid container spacing={3}>
                    {/* Left Column: Candidate Information */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                            DATOS DEL PROFESIONAL (EDITABLES)
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField
                                label="Nombre profesional / comercial"
                                size="small"
                                fullWidth
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                disabled={submitting || item.status !== 'pendiente'}
                            />

                            <Box display="flex" gap={2}>
                                <TextField
                                    label="Teléfono Móvil (E.164)"
                                    size="small"
                                    fullWidth
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    helperText={formatPhoneDisplay(phone)}
                                    disabled={submitting || item.status !== 'pendiente'}
                                />
                                <TextField
                                    label="Correo electrónico (opcional)"
                                    size="small"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={submitting || item.status !== 'pendiente'}
                                />
                            </Box>

                            <TextField
                                label="Descripción del oficio o experiencia"
                                size="small"
                                multiline
                                rows={3}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                helperText={`${description.length} caracteres (mín. 15)`}
                                disabled={submitting || item.status !== 'pendiente'}
                            />

                            {/* Skills / Categories Autocomplete */}
                            <Autocomplete
                                multiple
                                size="small"
                                options={ListadoCategorias}
                                getOptionLabel={(option) => option.label}
                                value={ListadoCategorias.filter((cat) => selectedSkills.includes(cat.key))}
                                onChange={(_, newValue) => {
                                    if (newValue.length <= 5) {
                                        setSelectedSkills(newValue.map((v) => v.key))
                                    }
                                }}
                                disabled={submitting || item.status !== 'pendiente'}
                                renderInput={(params) => (
                                    <TextField
                                        {...(params as unknown as Record<string, unknown>)}
                                        label="Oficios / Categorías (máx. 5)"
                                        placeholder="Seleccionar..."
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.label}
                                            size="small"
                                            {...getTagProps({ index })}
                                            key={option.key}
                                        />
                                    ))
                                }
                            />

                            <Box display="flex" gap={2}>
                                <TextField
                                    label="Dirección / Localidad (opcional)"
                                    size="small"
                                    fullWidth
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={submitting || item.status !== 'pendiente'}
                                />
                                <TextField
                                    label="Sitio Web / Red Social (opcional)"
                                    size="small"
                                    fullWidth
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    disabled={submitting || item.status !== 'pendiente'}
                                />
                            </Box>
                        </Box>

                        {/* Submitter & Legal Audit Details */}
                        <Box
                            sx={{
                                mt: 3,
                                p: 1.5,
                                bgcolor: 'var(--table-header-bg, #f8f9fa)',
                                borderRadius: 1.5,
                                border: '1px solid var(--border-color, #e0e0e0)',
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" display="block">
                                <strong>Recomendado por:</strong> {item.submittedBy}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                <strong>Fecha de envío:</strong> {new Date(item.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                <strong>Consentimiento legal:</strong> Versión {item.consent?.privacyNoticeVersion || 'V1.1'} (Aceptado por el recomendador)
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Column: Contact Shortcuts, Template & Verification */}
                    <Grid item xs={12} md={5}>
                        {/* Quick Contact Shortcuts */}
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                            CANALES DIRECTOS DE CONTACTO
                        </Typography>

                        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                                href={`https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(outreachMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textTransform: 'none' }}
                            >
                                WhatsApp
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PhoneIcon />}
                                href={`tel:${phone}`}
                                sx={{ textTransform: 'none' }}
                            >
                                Llamar
                            </Button>
                            {email && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EmailIcon />}
                                    href={`mailto:${email}?subject=${encodeURIComponent('Invitación a la Comunidad Dezzpo')}&body=${encodeURIComponent(outreachMessage)}`}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Correo
                                </Button>
                            )}
                            {website && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<LanguageIcon />}
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Web
                                </Button>
                            )}
                        </Box>

                        {/* First-Contact Legal Copy Box */}
                        <Box
                            sx={{
                                p: 1.5,
                                bgcolor: 'var(--surface-color, #ffffff)',
                                border: '1px dashed var(--border-color, #bdbdbd)',
                                borderRadius: 1.5,
                                mb: 2.5,
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                    MENSAJE DE PRIMER CONTACTO (HABEAS DATA)
                                </Typography>
                                <Tooltip title={copySuccess ? '¡Copiado!' : 'Copiar al portapapeles'}>
                                    <IconButton size="small" onClick={handleCopyTemplate}>
                                        <ContentCopyIcon fontSize="small" color={copySuccess ? 'success' : 'inherit'} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    fontFamily: 'monospace',
                                    fontSize: '0.72rem',
                                    color: 'text.secondary',
                                }}
                            >
                                {outreachMessage}
                            </Typography>
                        </Box>

                        {/* Checklist (Mandatory for Approval) */}
                        {item.status === 'pendiente' && (
                            <Box
                                sx={{
                                    p: 1.5,
                                    bgcolor: contrastedSources ? 'rgba(46, 125, 50, 0.05)' : 'rgba(237, 108, 2, 0.05)',
                                    border: `1px solid ${contrastedSources ? '#2e7d32' : '#ed6c02'}`,
                                    borderRadius: 1.5,
                                    mb: 2,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                    CHECKLIST DE VERIFICACIÓN
                                </Typography>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={contrastedSources}
                                            onChange={(e) => setContrastedSources(e.target.checked)}
                                            color="success"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" fontWeight={600}>
                                            Contrasté fuentes en internet / redes *
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={contactedByAdmin}
                                            onChange={(e) => setContactedByAdmin(e.target.checked)}
                                        />
                                    }
                                    label={<Typography variant="body2">Contacto profesional verificado</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={matchedProfession}
                                            onChange={(e) => setMatchedProfession(e.target.checked)}
                                        />
                                    }
                                    label={<Typography variant="body2">Oficio y categorías coherentes</Typography>}
                                />

                                {!contrastedSources && (
                                    <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                                        * Obligatorio contrastar con fuentes públicas para aprobar.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Internal Admin Notes */}
                        <TextField
                            label="Notas internas de moderación (privadas)"
                            size="small"
                            multiline
                            rows={2}
                            fullWidth
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Anotaciones de verificación, enlaces consultados..."
                            disabled={submitting}
                        />

                        {/* Conditional Panels for Rejection or Duplicate */}
                        {activeAction === 'reject' && (
                            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(211, 47, 47, 0.05)', borderRadius: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight={700} color="error" gutterBottom>
                                    MOTIVO DE RECHAZO
                                </Typography>
                                <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                                    <InputLabel id="rej-reason-label">Causa cerrada</InputLabel>
                                    <Select
                                        labelId="rej-reason-label"
                                        value={rejectionReason}
                                        label="Causa cerrada"
                                        onChange={(e) => setRejectionReason(e.target.value as RejectionReasonCode)}
                                    >
                                        {(Object.keys(REJECTION_REASONS) as RejectionReasonCode[]).map((code) => (
                                            <MenuItem key={code} value={code}>
                                                {REJECTION_REASON_LABELS[code]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    fullWidth
                                    onClick={handleReject}
                                    disabled={submitting}
                                >
                                    Confirmar Rechazo
                                </Button>
                            </Box>
                        )}

                        {activeAction === 'duplicate' && (
                            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(2, 136, 209, 0.05)', borderRadius: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight={700} color="info.main" gutterBottom>
                                    MARCAR DUPLICADO
                                </Typography>
                                <TextField
                                    label="ID de pre-registro o UID original (opcional)"
                                    size="small"
                                    fullWidth
                                    value={duplicateRefId}
                                    onChange={(e) => setDuplicateRefId(e.target.value)}
                                    sx={{ mb: 1.5 }}
                                />
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    fullWidth
                                    onClick={handleMarkDuplicate}
                                    disabled={submitting}
                                >
                                    Confirmar Duplicada
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                {/* Left Action: Habeas Data Suppression */}
                <Button
                    variant="text"
                    color="inherit"
                    size="small"
                    startIcon={<DeleteSweepIcon />}
                    onClick={handleSuppress}
                    disabled={submitting}
                    sx={{ color: 'text.secondary', fontSize: '0.8rem', textTransform: 'none' }}
                >
                    Suprimir (Habeas Data)
                </Button>

                {/* Right Actions */}
                <Box display="flex" gap={1.5} alignItems="center">
                    {item.status === 'pendiente' && (
                        <>
                            {activeAction === 'idle' ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        onClick={() => setActiveAction('duplicate')}
                                        disabled={submitting}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Duplicada
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setActiveAction('reject')}
                                        disabled={submitting}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Rechazar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={handleApprove}
                                        disabled={submitting || !contrastedSources}
                                        sx={{ textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Aprobar (Radar)
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setActiveAction('idle')}
                                    disabled={submitting}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Cancelar acción
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    )
}
