/**
 * Admin Identity Verification Page
 *
 * Queue-style processing of identity document submissions.
 * Split-screen workbench: user data (left) + document preview (right).
 */
import { useState, useEffect } from 'react'
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
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
    getPendingVerifications,
    updateVerificationStatus,
    type VerificationItem,
} from '@services/admin'

const DOC_TYPE_LABELS: Record<string, string> = {
    cedula: 'Cédula de Ciudadanía',
    pasaporte: 'Pasaporte',
    cedula_extranjeria: 'Cédula de Extranjería',
    nit: 'NIT',
}

export default function Page() {
    const [queue, setQueue] = useState<VerificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<VerificationItem | null>(null)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        async function load() {
            const items = await getPendingVerifications()
            setQueue(items)
            if (items.length > 0) setSelected(items[0]!)
            setLoading(false)
        }
        load()
    }, [])

    const handleApprove = async () => {
        if (!selected) return
        setProcessing(true)
        await updateVerificationStatus(selected.uid, selected.role, 'verified')
        // Remove from queue
        const updated = queue.filter((q) => q.uid !== selected.uid)
        setQueue(updated)
        setSelected(updated[0] || null)
        setProcessing(false)
    }

    const handleReject = async () => {
        if (!selected) return
        setProcessing(true)
        await updateVerificationStatus(selected.uid, selected.role, 'rejected', rejectReason)
        const updated = queue.filter((q) => q.uid !== selected.uid)
        setQueue(updated)
        setSelected(updated[0] || null)
        setRejectDialogOpen(false)
        setRejectReason('')
        setProcessing(false)
    }

    if (loading) {
        return (
            <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>Verificación de Identidad</Typography>
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
                    Verificación de Identidad
                </Typography>
                <Chip
                    label={`${queue.length} pendiente${queue.length !== 1 ? 's' : ''}`}
                    color={queue.length > 0 ? 'warning' : 'success'}
                />
            </Box>

            {queue.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }} elevation={0} variant="outlined">
                    <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay verificaciones pendientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Todas las solicitudes han sido procesadas.
                    </Typography>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
                        gap: 2,
                        minHeight: '70vh',
                    }}
                >
                    {/* Queue List */}
                    <Paper sx={{ borderRadius: 2, overflow: 'auto' }} elevation={0} variant="outlined">
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Cola de verificación
                            </Typography>
                        </Box>
                        <List disablePadding>
                            {queue.map((item) => (
                                <ListItemButton
                                    key={item.uid}
                                    selected={selected?.uid === item.uid}
                                    onClick={() => setSelected(item)}
                                    sx={{
                                        '&.Mui-selected': { bgcolor: '#e3f2fd' },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: item.role === 'Comerciante' ? '#3f51b5' : '#f50057' }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <>
                                                <Chip label={item.role} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                                                {DOC_TYPE_LABELS[item.docType] || item.docType}
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>

                    {/* Workbench */}
                    {selected && (
                        <Paper sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column' }} elevation={0} variant="outlined">
                            {/* Split screen: data left, document right */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                                    overflow: 'auto',
                                }}
                            >
                                {/* Left: User Data */}
                                <Box sx={{ p: 3, borderRight: { lg: '1px solid #e0e0e0' } }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Datos del Solicitante
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <FieldRow label="Nombre" value={selected.name} />
                                        <FieldRow label="Email" value={selected.email} />
                                        <FieldRow label="UID" value={selected.uid} mono />
                                        <FieldRow label="Rol" value={selected.role} />
                                        <FieldRow label="Nº Identificación" value={selected.identification} />
                                        <FieldRow label="Tipo Documento" value={DOC_TYPE_LABELS[selected.docType] || selected.docType} />
                                        <FieldRow label="Fecha Solicitud" value={selected.submittedAt} />
                                    </Box>
                                </Box>

                                {/* Right: Document Preview */}
                                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Documento
                                    </Typography>
                                    {selected.docUrl ? (
                                        selected.docUrl.toLowerCase().endsWith('.pdf') ? (
                                            <iframe
                                                src={selected.docUrl}
                                                title="Document Preview"
                                                style={{
                                                    width: '100%',
                                                    height: '400px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={selected.docUrl}
                                                alt="Identity Document"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '400px',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e0e0e0',
                                                }}
                                            />
                                        )
                                    ) : (
                                        <Typography color="text.secondary">
                                            Sin documento adjunto
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* Action Bar */}
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fafafa' }}>
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
                                    Aprobar
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Reject Dialog */}
            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Razón del Rechazo</DialogTitle>
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
