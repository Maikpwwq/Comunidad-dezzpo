/**
 * Contract Milestones Section (I2.1 - Modelo D: Logical Escrow)
 *
 * Visualizes contract milestone breakdown, progress tracking,
 * photo proof submission, and bilateral client sign-off (Acta de recibo a satisfacción).
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
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/HourglassEmpty'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CloseIcon from '@mui/icons-material/Close'
import {
    getMilestonesByContract,
    createContractMilestones,
    approveMilestone,
    submitMilestoneProof,
    calculateMilestoneProgress,
    type ContractMilestone,
} from '@services/contracts/milestoneService'

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
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [approvalModalMilestone, setApprovalModalMilestone] = useState<ContractMilestone | null>(null)
    const [proofModalMilestone, setProofModalMilestone] = useState<ContractMilestone | null>(null)
    const [proofNotes, setProofNotes] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const isClient = currentUserId === clientId
    const isProvider = currentUserId === providerId

    const fetchMilestones = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await getMilestonesByContract(contractId)
            if (res.success && res.data) {
                setMilestones(res.data)
            }
        } catch (err) {
            console.warn('[Milestones] Error fetching:', err)
        } finally {
            setIsLoading(false)
        }
    }, [contractId])

    useEffect(() => {
        fetchMilestones()
    }, [fetchMilestones])

    const progress = calculateMilestoneProgress(milestones)

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
                await fetchMilestones()
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
            const res = await submitMilestoneProof({
                contractId,
                milestoneId: proofModalMilestone.milestoneId,
                proofPhotos: [],
                proofNotes: proofNotes.trim(),
            })

            if (res.success) {
                setProofModalMilestone(null)
                setProofNotes('')
                setFeedbackMessage({ type: 'success', text: 'Evidencias enviadas para validación del cliente.' })
                await fetchMilestones()
            } else {
                setFeedbackMessage({ type: 'error', text: res.error?.message || 'Error al enviar evidencias.' })
            }
        } finally {
            setIsActionLoading(false)
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentTurnedInIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Hitos de Obra y Entregas
                    </Typography>
                </Box>
                {milestones.length > 0 && (
                    <Chip
                        icon={<VerifiedUserIcon />}
                        label="Modelo D: Escrow Lógico"
                        size="small"
                        sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 600, fontSize: '0.72rem' }}
                    />
                )}
            </Box>

            {feedbackMessage && (
                <Alert severity={feedbackMessage.type} sx={{ mb: 2 }} onClose={() => setFeedbackMessage(null)}>
                    {feedbackMessage.text}
                </Alert>
            )}

            {milestones.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, bgcolor: '#f8fafc', borderRadius: 2, p: 3 }}>
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
                <>
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

                    {/* Milestones list */}
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
                                        {/* Contractor action: submit proof */}
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

                                        {/* Client action: approve */}
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
                </>
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
                        sx={{ mt: 1 }}
                    />
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
        </Paper>
    )
}

