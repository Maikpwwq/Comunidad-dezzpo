/**
 * Contract Milestones & Daily Log Section (I2.1 & I3.1 - Modelo D: Logical Escrow & Bitácora)
 *
 * Visualizes contract milestone breakdown, progress tracking,
 * photo proof submission, bilateral client sign-off, daily work logs,
 * and client-authorized public sharing tokens.
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Paper,
    Typography,
    LinearProgress,
    Button,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Divider,
    FormControlLabel,
    Switch,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CloseIcon from '@mui/icons-material/Close'
import ShareIcon from '@mui/icons-material/Share'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@services/firebase'
import { processImageFile } from '@utils/mediaPipeline'
import {
    getMilestonesByContract,
    createContractMilestones,
    approveMilestone,
    submitMilestoneProof,
    calculateMilestoneProgress,
    addDailyLog,
    getDailyLogsByContract,
    toggleDailyLogPublicShare,
    generateContractShareToken,
    type ContractMilestone,
    type ContractDailyLog,
} from '@services/contracts'

export interface ContractMilestonesSectionProps {
    contractId: string
    clientId: string
    providerId: string
    agreedAmount: number
    currentUserId: string | null
}

const statusConfig = {
    pending: { label: 'En espera', color: 'default' as const },
    in_progress: { label: 'En ejecución', color: 'primary' as const },
    submitted: { label: 'Revisión por cliente', color: 'warning' as const },
    approved: { label: 'Aprobado a satisfacción', color: 'success' as const },
    paid: { label: 'Completado', color: 'success' as const },
}

export const ContractMilestonesSection: React.FC<ContractMilestonesSectionProps> = ({
    contractId,
    clientId,
    providerId,
    agreedAmount,
    currentUserId,
}) => {
    const [milestones, setMilestones] = useState<ContractMilestone[]>([])
    const [dailyLogs, setDailyLogs] = useState<ContractDailyLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [approvalModalMilestone, setApprovalModalMilestone] = useState<ContractMilestone | null>(null)
    const [proofModalMilestone, setProofModalMilestone] = useState<ContractMilestone | null>(null)
    const [proofNotes, setProofNotes] = useState('')
    const [proofFile, setProofFile] = useState<File | null>(null)

    // New daily log state
    const [isLogModalOpen, setIsLogModalOpen] = useState(false)
    const [newLogNotes, setNewLogNotes] = useState('')
    const [newLogFile, setNewLogFile] = useState<File | null>(null)
    const [newLogMilestoneId, setNewLogMilestoneId] = useState<string>('')
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const isClient = currentUserId === clientId
    const isProvider = currentUserId === providerId

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [mRes, lRes] = await Promise.all([
                getMilestonesByContract(contractId),
                getDailyLogsByContract(contractId),
            ])
            if (mRes.success && mRes.data) setMilestones(mRes.data)
            if (lRes.success && lRes.data) setDailyLogs(lRes.data)
        } catch (err) {
            console.warn('[Milestones] Error fetching:', err)
        } finally {
            setIsLoading(false)
        }
    }, [contractId])

    useEffect(() => {
        loadData()
    }, [loadData])

    const progress = calculateMilestoneProgress(milestones)
    const shareToken = generateContractShareToken(contractId)
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/obra/${shareToken}`
        : `/obra/${shareToken}`

    // Quick initialize default 30-40-30 template
    const handleInitializeDefaultMilestones = async () => {
        setIsActionLoading(true)
        setFeedbackMessage(null)
        try {
            const res = await createContractMilestones(contractId, agreedAmount, [
                { title: 'Hito 1: Inicio y Aprovisionamiento', percentage: 30, description: 'Compra de materiales y adecuación inicial del espacio.' },
                { title: 'Hito 2: Avance Estructural y Enchapes', percentage: 40, description: 'Instalaciones técnicas, enchapes o estructura principal.' },
                { title: 'Hito 3: Acabados Finales y Entrega', percentage: 30, description: 'Pintura, limpieza de obra y verificación general.' },
            ])

            if (res.success && res.data) {
                setMilestones(res.data)
                setFeedbackMessage({ type: 'success', text: 'Hitos de obra estructurados con éxito.' })
            } else {
                setFeedbackMessage({ type: 'error', text: res.error?.message || 'Error al crear hitos.' })
            }
        } catch (err) {
            setFeedbackMessage({ type: 'error', text: 'Error inesperado al inicializar hitos.' })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleConfirmApproval = async () => {
        if (!approvalModalMilestone || !currentUserId) return
        setIsActionLoading(true)
        try {
            const res = await approveMilestone({
                contractId,
                milestoneId: approvalModalMilestone.milestoneId,
                clientUid: currentUserId,
            })

            if (res.success) {
                setApprovalModalMilestone(null)
                setFeedbackMessage({ type: 'success', text: `Hito "${approvalModalMilestone.title}" aprobado a satisfacción.` })
                await loadData()
            } else {
                setFeedbackMessage({ type: 'error', text: res.error?.message || 'Error al aprobar hito.' })
            }
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleSubmitProof = async () => {
        if (!proofModalMilestone) return
        setIsActionLoading(true)
        try {
            let photoUrl = ''
            if (proofFile && storage) {
                const processed = await processImageFile(proofFile)
                const storageRef = ref(storage, `contracts/${contractId}/proofs/${Date.now()}.webp`)
                await uploadBytes(storageRef, processed.blob, { contentType: 'image/webp' })
                photoUrl = await getDownloadURL(storageRef)
            }

            const res = await submitMilestoneProof({
                contractId,
                milestoneId: proofModalMilestone.milestoneId,
                proofPhotos: photoUrl ? [photoUrl] : [],
                proofNotes: proofNotes.trim(),
            })

            if (res.success) {
                setProofModalMilestone(null)
                setProofNotes('')
                setProofFile(null)
                setFeedbackMessage({ type: 'success', text: 'Evidencias enviadas para validación del cliente.' })
                await loadData()
            } else {
                setFeedbackMessage({ type: 'error', text: res.error?.message || 'Error al enviar evidencias.' })
            }
        } catch (err) {
            setFeedbackMessage({ type: 'error', text: 'Error al procesar la foto de evidencia.' })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleCreateDailyLog = async () => {
        if (!currentUserId) return
        setIsActionLoading(true)
        try {
            let photoUrl = ''
            if (newLogFile && storage) {
                const processed = await processImageFile(newLogFile)
                const storageRef = ref(storage, `contracts/${contractId}/logs/${Date.now()}.webp`)
                await uploadBytes(storageRef, processed.blob, { contentType: 'image/webp' })
                photoUrl = await getDownloadURL(storageRef)
            }

            const res = await addDailyLog({
                contractId,
                authorId: currentUserId,
                milestoneId: newLogMilestoneId || undefined,
                notes: newLogNotes.trim(),
                photos: photoUrl ? [photoUrl] : [],
                isPublicForShare: true,
            })

            if (res.success && res.data) {
                setIsLogModalOpen(false)
                setNewLogNotes('')
                setNewLogFile(null)
                setFeedbackMessage({ type: 'success', text: 'Avance registrado en la bitácora con éxito.' })
                await loadData()
            } else {
                setFeedbackMessage({ type: 'error', text: res.error?.message || 'Error al registrar avance.' })
            }
        } catch (err) {
            setFeedbackMessage({ type: 'error', text: 'Error al procesar el avance diario.' })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleToggleShareLog = async (logId: string, currentVal: boolean) => {
        try {
            await toggleDailyLogPublicShare(contractId, logId, !currentVal)
            setDailyLogs((prev) =>
                prev.map((l) => (l.logId === logId ? { ...l, isPublicForShare: !currentVal } : l))
            )
        } catch (err) {
            console.warn('Error toggling share:', err)
        }
    }

    const handleShareLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Avance de Obra · Comunidad Dezzpo',
                text: 'Sigue el avance fotográfico y la bitácora de nuestra remodelación en tiempo real.',
                url: shareUrl,
            }).catch(() => {})
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl)
            setFeedbackMessage({ type: 'success', text: 'Enlace copiado al portapapeles. ¡Compártelo en WhatsApp!' })
        }
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
            </Box>
        )
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentTurnedInIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Hitos de Obra y Bitácora Visual
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        icon={<VerifiedUserIcon />}
                        label="Modelo D: Escrow Lógico"
                        size="small"
                        sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 600, fontSize: '0.72rem' }}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={handleShareLink}
                        sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                    >
                        Compartir Avance
                    </Button>
                </Box>
            </Box>

            {feedbackMessage && (
                <Alert severity={feedbackMessage.type} sx={{ mb: 2 }} onClose={() => setFeedbackMessage(null)}>
                    {feedbackMessage.text}
                </Alert>
            )}

            {/* Milestones list */}
            {milestones.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, bgcolor: '#f8fafc', borderRadius: 2, p: 3, mb: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Este contrato aún no tiene hitos de avance definidos.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Dividir la obra en hitos permite controlar los pagos por entregas reales verificables (Ley 527/1999).
                    </Typography>

                    {(isClient || isProvider) && (
                        <Button
                            variant="outlined"
                            onClick={handleInitializeDefaultMilestones}
                            disabled={isActionLoading}
                            startIcon={<AssignmentTurnedInIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            {isActionLoading ? 'Estructurando...' : 'Estructurar Hitos (30% / 40% / 30%)'}
                        </Button>
                    )}
                </Box>
            ) : (
                <Box sx={{ mb: 4 }}>
                    {/* Progression bar */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Progreso de la obra: <strong>{progress.completedCount} de {progress.totalCount} hitos aprobados</strong>
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                                {progress.progressPercentage}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress.progressPercentage}
                            sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0' }}
                        />
                    </Box>

                    <Stack spacing={2}>
                        {milestones.map((m) => {
                            const cfg = statusConfig[m.status] || { label: m.status, color: 'default' }
                            const isApproved = m.status === 'approved' || m.status === 'paid'
                            const isSubmitted = m.status === 'submitted'
                            const isInProgress = m.status === 'in_progress'

                            return (
                                <Box
                                    key={m.milestoneId}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: isApproved ? '#bbf7d0' : isSubmitted ? '#fed7aa' : '#e2e8f0',
                                        borderRadius: 2,
                                        bgcolor: isApproved ? '#f0fdf4' : isSubmitted ? '#fffbeb' : '#ffffff',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {m.order}. {m.title}
                                            </Typography>
                                            {m.description && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {m.description}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                ${m.amountCop.toLocaleString('es-CO')} COP
                                            </Typography>
                                            <Chip
                                                label={`${m.percentage}% · ${cfg.label}`}
                                                size="small"
                                                color={cfg.color}
                                                sx={{ mt: 0.5, fontSize: '0.7rem', fontWeight: 600 }}
                                            />
                                        </Box>
                                    </Box>

                                    {m.proofNotes && (
                                        <Box sx={{ mt: 1.5, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                <strong>Nota de entrega:</strong> {m.proofNotes}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
                                        {isInProgress && isProvider && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<CameraAltIcon />}
                                                onClick={() => setProofModalMilestone(m)}
                                                sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                                            >
                                                Entregar Hito y Reportar Avance
                                            </Button>
                                        )}

                                        {isSubmitted && isClient && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => setApprovalModalMilestone(m)}
                                                sx={{ textTransform: 'none', fontSize: '0.78rem', fontWeight: 'bold' }}
                                            >
                                                Aprobar a Satisfacción
                                            </Button>
                                        )}

                                        {isApproved && (
                                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CheckCircleIcon sx={{ fontSize: 14 }} /> Acta bilateral firmada digitalmente
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Stack>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Bitácora Visual Feed (I3.1) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhotoLibraryIcon color="action" />
                    <Typography variant="subtitle1" fontWeight="bold">
                        Bitácora Visual de Obra ({dailyLogs.length})
                    </Typography>
                </Box>
                {isProvider && (
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => setIsLogModalOpen(true)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Nuevo Registro Diario
                    </Button>
                )}
            </Box>

            {dailyLogs.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                    Aún no se han registrado fotos de avance diario en la bitácora.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {dailyLogs.map((log) => (
                        <Box
                            key={log.logId}
                            sx={{
                                p: 2,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                bgcolor: '#ffffff',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(log.createdAt).toLocaleDateString('es-CO', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                                {isClient && (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                size="small"
                                                checked={log.isPublicForShare}
                                                onChange={() => handleToggleShareLog(log.logId, log.isPublicForShare)}
                                            />
                                        }
                                        label={<Typography variant="caption">Visible en enlace público</Typography>}
                                    />
                                )}
                            </Box>

                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                {log.notes}
                            </Typography>

                            {log.photos && log.photos.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    {log.photos.map((photoUrl, idx) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={photoUrl}
                                            alt={`Avance ${idx + 1}`}
                                            sx={{
                                                width: 120,
                                                height: 90,
                                                objectFit: 'cover',
                                                borderRadius: 1.5,
                                                border: '1px solid #e2e8f0',
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}

            {/* Approval Modal (Bilateral Sign-off) */}
            <Dialog open={Boolean(approvalModalMilestone)} onClose={() => setApprovalModalMilestone(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Acta de Recibo de Hito
                    </Typography>
                    <IconButton size="small" onClick={() => setApprovalModalMilestone(null)} aria-label="Cerrar modal">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" gutterBottom>
                        ¿Confirmas que el hito <strong>"{approvalModalMilestone?.title}"</strong> ha sido completado y recibido a entera satisfacción?
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
                        Conforme a la Ley 527 de 1999 y Decreto 2364 de 2012, tu confirmación constituye firma electrónica con valor probatorio de recibido de obra.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setApprovalModalMilestone(null)} disabled={isActionLoading} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleConfirmApproval}
                        disabled={isActionLoading}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {isActionLoading ? 'Firmando...' : 'Aprobar a Satisfacción'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Submit Proof Modal */}
            <Dialog open={Boolean(proofModalMilestone)} onClose={() => setProofModalMilestone(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Entregar Hito de Obra
                    </Typography>
                    <IconButton size="small" onClick={() => setProofModalMilestone(null)} aria-label="Cerrar modal">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" gutterBottom>
                        Indica los detalles de los trabajos culminados para <strong>"{proofModalMilestone?.title}"</strong>:
                    </Typography>
                    <TextField
                        label="Descripción de la entrega"
                        placeholder="Ej. Se completó la instalación de tuberías y sellado..."
                        value={proofNotes}
                        onChange={(e) => setProofNotes(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        startIcon={<AddPhotoAlternateIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        {proofFile ? proofFile.name : 'Adjuntar Foto de Evidencia'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        />
                    </Button>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setProofModalMilestone(null)} disabled={isActionLoading} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitProof}
                        disabled={isActionLoading}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {isActionLoading ? 'Enviando...' : 'Notificar al Cliente'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* New Daily Log Modal */}
            <Dialog open={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Nuevo Avance de Bitácora
                    </Typography>
                    <IconButton size="small" onClick={() => setIsLogModalOpen(false)} aria-label="Cerrar modal">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                        Sube una foto y una breve nota de los avances de hoy. La imagen se optimizará a WebP y se limpiarán los datos EXIF/GPS.
                    </Typography>
                    <TextField
                        label="Nota de avance"
                        placeholder="Ej. Enchape de piso completado al 50%, listo para fraguado."
                        value={newLogNotes}
                        onChange={(e) => setNewLogNotes(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        startIcon={<AddPhotoAlternateIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        {newLogFile ? newLogFile.name : 'Subir Foto de Avance'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setNewLogFile(e.target.files?.[0] || null)}
                        />
                    </Button>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsLogModalOpen(false)} disabled={isActionLoading} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateDailyLog}
                        disabled={isActionLoading || (!newLogNotes.trim() && !newLogFile)}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {isActionLoading ? 'Guardando...' : 'Publicar Avance'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}
