/**
 * Admin Notification Broadcast Workbench
 *
 * Allows platform administrators to:
 * - Broadcast platform-wide announcements to all users or by role
 * - Target specific system alerts
 * - Audit past broadcast notifications
 */

import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import CampaignIcon from '@mui/icons-material/Campaign'
import SendIcon from '@mui/icons-material/Send'

import {
    broadcastNotification,
    getUserNotifications,
} from '@services/notificationService'
import type { NotificationDocument, NotificationType } from '@services/types'

export default function Page() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [actionUrl, setActionUrl] = useState('')
    const [recipientRole, setRecipientRole] = useState<'all' | '1' | '2'>('all')
    const [type, setType] = useState<NotificationType>('system_announcement')

    const [sending, setSending] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [broadcasts, setBroadcasts] = useState<NotificationDocument[]>([])
    const [loadingHistory, setLoadingHistory] = useState(true)

    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({ open: false, message: '', severity: 'success' })

    const loadHistory = async () => {
        setLoadingHistory(true)
        try {
            // Broadcasts use recipientId = 'ALL'
            const list = await getUserNotifications('ALL')
            setBroadcasts(list)
        } catch (err) {
            console.error('Error loading broadcast history:', err)
        } finally {
            setLoadingHistory(false)
        }
    }

    useEffect(() => {
        loadHistory()
    }, [])

    const handleConfirmSend = async () => {
        if (!title.trim() || !body.trim()) return

        setSending(true)
        setConfirmOpen(false)

        try {
            const roleFilter = recipientRole === 'all' ? undefined : (Number(recipientRole) as 1 | 2)
            const id = await broadcastNotification({
                title: title.trim(),
                body: body.trim(),
                actionUrl: actionUrl.trim() || undefined,
                recipientRole: roleFilter,
                type,
            })

            if (id) {
                setSnackbar({
                    open: true,
                    message: '¡Notificación masiva enviada con éxito!',
                    severity: 'success',
                })
                setTitle('')
                setBody('')
                setActionUrl('')
                loadHistory()
            } else {
                throw new Error('No se pudo enviar el aviso.')
            }
        } catch (err) {
            console.error('Error broadcasting notification:', err)
            setSnackbar({
                open: true,
                message: 'Ocurrió un error al emitir la notificación.',
                severity: 'error',
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CampaignIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
                    >
                        Emisión de Notificaciones Masivas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Envía comunicados, avisos de mantenimiento y notificaciones globales a la Comunidad Dezzpo.
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={{ xs: 2.5, md: 3 }}>
                {/* Form Column */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Nuevo Comunicado
                        </Typography>

                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Título del Comunicado"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Actualización de la plataforma"
                                required
                            />

                            <TextField
                                label="Mensaje / Detalle"
                                fullWidth
                                multiline
                                rows={4}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Escribe el contenido de la notificación masiva..."
                                required
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Audiencia Destino</InputLabel>
                                        <Select
                                            value={recipientRole}
                                            label="Audiencia Destino"
                                            onChange={(e) => setRecipientRole(e.target.value as 'all' | '1' | '2')}
                                        >
                                            <MenuItem value="all">Todos los Usuarios</MenuItem>
                                            <MenuItem value="1">Solo Propietarios (Rol 1)</MenuItem>
                                            <MenuItem value="2">Solo Comerciantes (Rol 2)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tipo de Notificación</InputLabel>
                                        <Select
                                            value={type}
                                            label="Tipo de Notificación"
                                            onChange={(e) => setType(e.target.value as NotificationType)}
                                        >
                                            <MenuItem value="system_announcement">Anuncio de Sistema</MenuItem>
                                            <MenuItem value="pending_action">Acción Requerida</MenuItem>
                                            <MenuItem value="referral_earned">Novedad de Referidos</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <TextField
                                label="URL de Redirección (Opcional)"
                                fullWidth
                                size="small"
                                value={actionUrl}
                                onChange={(e) => setActionUrl(e.target.value)}
                                placeholder="Ej: /app/suscripciones"
                            />

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SendIcon />}
                                disabled={!title.trim() || !body.trim() || sending}
                                onClick={() => setConfirmOpen(true)}
                                sx={{ mt: 1, py: 1.2, fontWeight: 700, borderRadius: 2.5 }}
                            >
                                {sending ? 'Emitiendo...' : 'Emitir Notificación Masiva'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* History Column */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Historial de Notificaciones Emitidas
                        </Typography>

                        {/* MOBILE HISTORY CARD LIST (< md) */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                            {broadcasts.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {loadingHistory ? 'Cargando historial...' : 'No se han enviado notificaciones masivas aún.'}
                                    </Typography>
                                </Box>
                            ) : (
                                broadcasts.map((item, idx) => (
                                    <Card
                                        key={item.notificationId || idx}
                                        sx={{
                                            p: 1.75,
                                            borderRadius: 2.5,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {item.title}
                                            </Typography>
                                            <Chip
                                                label={
                                                    item.recipientRole === 1
                                                        ? 'Propietarios'
                                                        : item.recipientRole === 2
                                                        ? 'Comerciantes'
                                                        : 'Todos'
                                                }
                                                size="small"
                                                color={item.recipientRole ? 'secondary' : 'primary'}
                                                variant="outlined"
                                                sx={{ height: 22, fontSize: '0.72rem', flexShrink: 0 }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.82rem' }}>
                                            {item.body}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.disabled">
                                                {item.type || 'system_announcement'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString('es-CO', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : ''}
                                            </Typography>
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Box>

                        {/* DESKTOP HISTORY TABLE (>= md) */}
                        <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Título & Mensaje</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Audiencia</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {broadcasts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                {loadingHistory ? 'Cargando historial...' : 'No se han enviado notificaciones masivas aún.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        broadcasts.map((item, idx) => (
                                            <TableRow key={item.notificationId || idx}>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ maxWidth: 260 }}>
                                                        {item.body}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            item.recipientRole === 1
                                                                ? 'Propietarios'
                                                                : item.recipientRole === 2
                                                                ? 'Comerciantes'
                                                                : 'Todos'
                                                        }
                                                        size="small"
                                                        color={item.recipientRole ? 'secondary' : 'primary'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.createdAt
                                                            ? new Date(item.createdAt).toLocaleDateString('es-CO', {
                                                                  day: '2-digit',
                                                                  month: 'short',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : ''}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={700}>Confirmar Emisión Masiva</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        ¿Estás seguro de que deseas emitir este comunicado a{' '}
                        <strong>
                            {recipientRole === 'all'
                                ? 'todos los usuarios'
                                : recipientRole === '1'
                                ? 'todos los propietarios'
                                : 'todos los comerciantes'}
                        </strong>?
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {body}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button variant="contained" startIcon={<SendIcon />} onClick={handleConfirmSend}>
                        Confirmar y Enviar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
