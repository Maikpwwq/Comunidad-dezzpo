/**
 * Admin Certification Requests Review Queue
 *
 * Provides a split-screen workbench for evaluator tasks:
 * - Queue of pending or paid requests (left)
 * - Detail pane with status transition actions (right)
 * - Schedule, Evaluate, Approve/Reject transitions
 */

import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Chip,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
} from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import {
    getAllCertificationRequests,
    updateCertificationRequestStatus,
} from '@services/membershipAndCertService'

const STATUS_LABELS: Record<string, { label: string; color: 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error' }> = {
    pending_payment: { label: 'Pago Pendiente', color: 'warning' },
    pending: { label: 'Pagado - Por Programar', color: 'info' },
    scheduled: { label: 'Visita Programada', color: 'primary' },
    evaluated: { label: 'Evaluado', color: 'secondary' },
    approved: { label: 'Aprobado (Certificado)', color: 'success' },
    rejected: { label: 'Rechazado', color: 'error' },
}

export default function Page() {
    const [queue, setQueue] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<any | null>(null)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [processing, setProcessing] = useState(false)

    // Schedule state
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('09:00')

    async function load() {
        setLoading(true)
        const items = await getAllCertificationRequests()
        setQueue(items)
        if (items.length > 0) setSelected(items[0]!)
        setLoading(false)
    }

    useEffect(() => {
        load()
    }, [])

    const handleApprove = async () => {
        if (!selected) return
        setProcessing(true)
        try {
            await updateCertificationRequestStatus(selected.requestId, 'approved', 'Aprobado por el Evaluador.')
            // Update local state
            const updated = queue.map((q) => 
                q.requestId === selected.requestId ? { ...q, status: 'approved', notes: 'Aprobado por el Evaluador.' } : q
            )
            setQueue(updated)
            setSelected(updated.find(q => q.requestId === selected.requestId) || null)
        } catch (error) {
            console.error('Error approving request:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async () => {
        if (!selected) return
        setProcessing(true)
        try {
            await updateCertificationRequestStatus(selected.requestId, 'rejected', rejectReason)
            const updated = queue.map((q) => 
                q.requestId === selected.requestId ? { ...q, status: 'rejected', notes: rejectReason } : q
            )
            setQueue(updated)
            setSelected(updated.find(q => q.requestId === selected.requestId) || null)
            setRejectDialogOpen(false)
            setRejectReason('')
        } catch (error) {
            console.error('Error rejecting request:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected || !scheduleDate) return
        setProcessing(true)
        try {
            const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
            await updateCertificationRequestStatus(
                selected.requestId, 
                'scheduled', 
                `Visita confirmada para el día: ${new Date(scheduledDateTime).toLocaleString()}`
            )
            const updated = queue.map((q) => 
                q.requestId === selected.requestId 
                    ? { ...q, status: 'scheduled', dateTime: scheduledDateTime, notes: `Visita programada: ${new Date(scheduledDateTime).toLocaleString()}` } 
                    : q
            )
            setQueue(updated)
            setSelected(updated.find(q => q.requestId === selected.requestId) || null)
            setScheduleDialogOpen(false)
        } catch (error) {
            console.error('Error scheduling request:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleMarkEvaluated = async () => {
        if (!selected) return
        setProcessing(true)
        try {
            await updateCertificationRequestStatus(selected.requestId, 'evaluated', 'Evaluación técnica completada. Listo para decisión final.')
            const updated = queue.map((q) => 
                q.requestId === selected.requestId ? { ...q, status: 'evaluated', notes: 'Evaluación técnica completada. Listo para decisión final.' } : q
            )
            setQueue(updated)
            setSelected(updated.find(q => q.requestId === selected.requestId) || null)
        } catch (error) {
            console.error('Error evaluating request:', error)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>Verificación de Certificaciones</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 2, height: '70vh' }}>
                    <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Validación de Competencias Laborales
                </Typography>
                <Chip
                    label={`${queue.filter(q => q.status === 'pending' || q.status === 'scheduled').length} pendientes`}
                    color={queue.some(q => q.status === 'pending') ? 'warning' : 'default'}
                />
            </Box>

            {queue.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }} elevation={0} variant="outlined">
                    <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay solicitudes de certificación registradas
                    </Typography>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
                        gap: 2,
                        minHeight: '70vh',
                    }}
                >
                    {/* Queue List */}
                    <Paper sx={{ borderRadius: 2, overflow: 'auto' }} elevation={0} variant="outlined">
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Listado de Evaluaciones
                            </Typography>
                        </Box>
                        <List disablePadding>
                            {queue.map((item) => (
                                <ListItemButton
                                    key={item.requestId}
                                    selected={selected?.requestId === item.requestId}
                                    onClick={() => setSelected(item)}
                                    sx={{
                                        '&.Mui-selected': { bgcolor: 'rgba(13, 148, 136, 0.08)' },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#0d9488' }}>
                                            <BadgeIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.category}
                                        secondary={
                                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip 
                                                    label={STATUS_LABELS[item.status]?.label || item.status} 
                                                    size="small" 
                                                    color={STATUS_LABELS[item.status]?.color || 'default'}
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                                <Chip 
                                                    label={item.paymentStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'} 
                                                    size="small" 
                                                    variant="outlined" 
                                                    color={item.paymentStatus === 'paid' ? 'success' : 'warning'}
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>

                    {/* Workbench */}
                    {selected && (
                        <Paper sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column' }} elevation={0} variant="outlined">
                            <Box sx={{ p: 3, flex: 1 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Detalle de la Solicitud
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <FieldRow label="ID Solicitud" value={selected.requestId} mono />
                                    <FieldRow label="ID Comerciante" value={selected.comercianteId} mono />
                                    <FieldRow label="Especialidad / Categoría" value={selected.category} />
                                    <FieldRow label="Fecha Propuesta / Programada" value={new Date(selected.dateTime).toLocaleString('es-CO')} />
                                    <FieldRow label="Estado del Pago" value={selected.paymentStatus === 'paid' ? 'Pagado' : 'No pagado'} />
                                    <FieldRow label="Referencia del Pago" value={selected.paymentReference || 'Ninguna'} mono />
                                    <FieldRow label="Fecha Creación" value={new Date(selected.createdAt).toLocaleString('es-CO')} />
                                    <FieldRow label="Estado de Solicitud" value={STATUS_LABELS[selected.status]?.label || selected.status} />
                                </Box>

                                <Box sx={{ mt: 3, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Notas / Observaciones del Evaluador
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selected.notes || 'Sin observaciones registradas.'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Action Bar */}
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fafafa' }}>
                                {/* Schedule Action (Only if status is pending - paid) */}
                                {selected.status === 'pending' && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<CalendarMonthIcon />}
                                        onClick={() => {
                                            const formattedDate = selected.dateTime ? selected.dateTime.split('T')[0] : ''
                                            setScheduleDate(formattedDate)
                                            setScheduleDialogOpen(true)
                                        }}
                                        disabled={processing}
                                    >
                                        Programar Visita
                                    </Button>
                                )}

                                {/* Mark Evaluated Action (Only if status is scheduled) */}
                                {selected.status === 'scheduled' && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<HourglassEmptyIcon />}
                                        onClick={handleMarkEvaluated}
                                        disabled={processing}
                                    >
                                        Completar Evaluación
                                    </Button>
                                )}

                                {/* Decisive Action Bar (Only if status is evaluated/pending/scheduled) */}
                                {(selected.status === 'evaluated' || selected.status === 'pending' || selected.status === 'scheduled') && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CancelIcon />}
                                            onClick={() => setRejectDialogOpen(true)}
                                            disabled={processing}
                                        >
                                            Rechazar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={handleApprove}
                                            disabled={processing}
                                        >
                                            Aprobar y Certificar
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Schedule Visita Dialog */}
            <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="xs" fullWidth>
                <form onSubmit={handleScheduleSubmit}>
                    <DialogTitle>Programar Visita Técnica</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField
                                label="Fecha Visita"
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Hora Visita"
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setScheduleDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" color="primary" variant="contained" disabled={processing}>
                            Confirmar Programación
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Rechazar Solicitud de Certificación</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={3}
                        fullWidth
                        label="Explica la razón del rechazo"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleReject}
                        color="error"
                        variant="contained"
                        disabled={!rejectReason.trim() || processing}
                    >
                        Confirmar Rechazo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

function FieldRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={mono ? { fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' } : {}}
            >
                {value}
            </Typography>
        </Box>
    )
}
