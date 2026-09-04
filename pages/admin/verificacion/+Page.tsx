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
            <Box sx={{ pb: 4, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' }, mb: 2 }}>
                    Verificación de Identidad
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 2, height: { xs: 320, md: '70vh' } }}>
                    <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{ pb: 4, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 3 }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}>
                    Verificación de Identidad
                </Typography>
                <Chip
                    label={`${queue.length} pendiente${queue.length !== 1 ? 's' : ''}`}
                    color={queue.length > 0 ? 'warning' : 'success'}
                    size="small"
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
                        minHeight: { md: '70vh' },
                    }}
                >
                    {/* Queue List */}
                    <Paper sx={{ borderRadius: 2, maxHeight: { xs: 260, md: '75vh' }, overflow: 'auto' }} elevation={0} variant="outlined">
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                                Cola de verificación ({queue.length})
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
                                        <Avatar sx={{ bgcolor: item.role === 'Comerciante' ? '#3f51b5' : '#f50057', width: 36, height: 36 }}>
                                            <PersonIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600 }}
                                        secondary={
                                            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                                <Chip label={item.role} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {DOC_TYPE_LABELS[item.docType] || item.docType}
                                                </Typography>
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
                                <Box sx={{ p: { xs: 2, sm: 3 }, borderRight: { lg: '1px solid #e0e0e0' } }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
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
                                <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' }, alignSelf: 'flex-start' }}>
                                        Documento
                                    </Typography>
                                    {selected.docUrl ? (
                                        selected.docUrl.toLowerCase().endsWith('.pdf') ? (
                                            <iframe
                                                src={selected.docUrl}
                                                title="Document Preview"
                                                style={{
                                                    width: '100%',
                                                    height: '350px',
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
                                                    maxHeight: '350px',
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
                            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fafafa' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setRejectDialogOpen(true)}
                                    disabled={processing}
                                    sx={{ flex: { xs: 1, sm: 'none' } }}
                                >
                                    Rechazar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleApprove}
                                    disabled={processing}
                                    sx={{ flex: { xs: 1, sm: 'none' } }}
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
