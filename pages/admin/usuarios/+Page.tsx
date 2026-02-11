/**
 * Admin User Management Page
 *
 * MUI DataGrid with all platform users.
 * Quick actions: view details in branded modal.
 */
import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    TextField,
    Button,
    Chip,
    IconButton,
    Paper,
    Avatar,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
    getAllUsers,
    sendPasswordResetForUser,
    banUser,
    unbanUser,
    type AdminUserRow,
} from '@services/admin'

/* ── Brand palette ─────────────────────────────────────────────── */
const BRAND = {
    teal: '#00897B',
    tealDark: '#00695C',
    tealLight: '#1ec7e6',
    gradientHeader: 'linear-gradient(135deg, #00897B 0%, #00695C 100%)',
    surface: '#FAFBFC',
}

/* ── Role / Status chip colour map ─────────────────────────────── */
const roleChipSx = (role: string) =>
    role === 'Propietario'
        ? { bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }
        : { bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }

const statusChipSx = (status: string) =>
    status === 'active'
        ? { bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }
        : { bgcolor: '#FFEBEE', color: '#C62828', fontWeight: 600 }

/* ── DataGrid columns ──────────────────────────────────────────── */
const columns: GridColDef<AdminUserRow>[] = [
    {
        field: 'uid',
        headerName: 'UID',
        width: 120,
        renderCell: (params) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {params.value?.slice(0, 12)}…
            </Typography>
        ),
    },
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    {
        field: 'role',
        headerName: 'Rol',
        width: 130,
        renderCell: (params) => (
            <Chip label={params.value} size="small" sx={roleChipSx(params.value)} />
        ),
    },
    {
        field: 'status',
        headerName: 'Estado',
        width: 100,
        renderCell: (params) => (
            <Chip
                label={params.value === 'active' ? 'Activo' : params.value === 'banned' ? 'Baneado' : params.value}
                size="small"
                sx={statusChipSx(params.value)}
            />
        ),
    },
    { field: 'joined', headerName: 'Registro', width: 130 },
]

/* ── Page ───────────────────────────────────────────────────────── */
export default function Page() {
    const [users, setUsers] = useState<AdminUserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<{ type: 'password' | 'ban' | 'unban'; user: AdminUserRow } | null>(null)
    const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

    useEffect(() => {
        async function load() {
            const data = await getAllUsers()
            setUsers(data)
            setLoading(false)
        }
        load()
    }, [])

    const filteredUsers = searchQuery
        ? users.filter(
            (u) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.uid.includes(searchQuery),
        )
        : users

    const handleRowClick = useCallback((params: { row: AdminUserRow }) => {
        setSelectedUser(params.row)
    }, [])

    const handleClose = useCallback(() => setSelectedUser(null), [])

    const handleCopyUid = useCallback(() => {
        if (selectedUser) {
            navigator.clipboard.writeText(selectedUser.uid)
            setSnackbar({ message: 'UID copiado al portapapeles', severity: 'success' })
        }
    }, [selectedUser])

    const handleConfirmAction = useCallback(async () => {
        if (!confirmDialog) return
        setActionLoading(true)

        try {
            const { type, user } = confirmDialog

            if (type === 'password') {
                await sendPasswordResetForUser(user.email)
                setSnackbar({ message: `Email de restablecimiento enviado a ${user.email}`, severity: 'success' })
            } else if (type === 'ban') {
                await banUser(user.uid, user.role)
                // Update local state
                setUsers((prev) => prev.map((u) => u.uid === user.uid ? { ...u, status: 'banned' } : u))
                setSelectedUser((prev) => prev && prev.uid === user.uid ? { ...prev, status: 'banned' } : prev)
                setSnackbar({ message: `${user.name} ha sido baneado`, severity: 'success' })
            } else if (type === 'unban') {
                await unbanUser(user.uid, user.role)
                setUsers((prev) => prev.map((u) => u.uid === user.uid ? { ...u, status: 'active' } : u))
                setSelectedUser((prev) => prev && prev.uid === user.uid ? { ...prev, status: 'active' } : prev)
                setSnackbar({ message: `${user.name} ha sido reactivado`, severity: 'success' })
            }
        } catch (err) {
            console.error('Action failed:', err)
            setSnackbar({ message: `Error: ${err instanceof Error ? err.message : 'Operación fallida'}`, severity: 'error' })
        } finally {
            setActionLoading(false)
            setConfirmDialog(null)
        }
    }, [confirmDialog])

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Gestión de Usuarios
            </Typography>

            {/* Search Bar */}
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    mb: 2,
                    borderRadius: 2,
                }}
                elevation={0}
                variant="outlined"
            >
                <SearchIcon color="action" />
                <TextField
                    placeholder="Buscar por nombre, email o UID…"
                    variant="standard"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
            </Paper>

            {/* DataGrid */}
            <Paper sx={{ height: 560, borderRadius: 2 }} elevation={0} variant="outlined">
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    getRowId={(row) => row.uid}
                    loading={loading}
                    onRowClick={handleRowClick}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer',
                            bgcolor: 'rgba(0,137,123,0.04)',
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>

            {/* ── User Detail Modal ────────────────────────────── */}
            <Dialog
                open={!!selectedUser}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                    },
                }}
            >
                {selectedUser && (
                    <>
                        {/* Branded header */}
                        <DialogTitle
                            sx={{
                                background: BRAND.gradientHeader,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                py: 2.5,
                                px: 3,
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 28 }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={700} color="inherit">
                                    {selectedUser.name}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    {selectedUser.email}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={handleClose}
                                sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff' } }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        {/* Body */}
                        <DialogContent sx={{ bgcolor: BRAND.surface, px: 3, pt: 3, pb: 2 }}>
                            {/* Status row */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Chip
                                    label={selectedUser.role}
                                    size="small"
                                    sx={{ ...roleChipSx(selectedUser.role), px: 1 }}
                                />
                                <Chip
                                    label={selectedUser.status === 'active' ? 'Activo' : selectedUser.status === 'banned' ? 'Baneado' : selectedUser.status}
                                    size="small"
                                    sx={{ ...statusChipSx(selectedUser.status), px: 1 }}
                                />
                            </Box>

                            {/* Detail grid — 2 columns */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 2.5,
                                }}
                            >
                                <DetailField label="UID" value={selectedUser.uid} mono action={
                                    <IconButton size="small" onClick={handleCopyUid} sx={{ color: BRAND.teal }}>
                                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                } />
                                <DetailField label="Registro" value={selectedUser.joined} />
                                <DetailField label="Último acceso" value={selectedUser.lastLogin || '—'} />
                            </Box>

                            <Divider sx={{ my: 2.5 }} />

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Las acciones de seguridad requieren Cloud Functions configuradas.
                            </Typography>
                        </DialogContent>

                        {/* Action buttons */}
                        <DialogActions
                            sx={{
                                px: 3,
                                py: 2,
                                bgcolor: '#fff',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                gap: 1,
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setConfirmDialog({ type: 'password', user: selectedUser })}
                                sx={{
                                    borderColor: BRAND.teal,
                                    color: BRAND.teal,
                                    '&:hover': { borderColor: BRAND.tealDark, bgcolor: 'rgba(0,137,123,0.04)' },
                                }}
                            >
                                Cambiar Contraseña
                            </Button>
                            {selectedUser.status === 'banned' ? (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setConfirmDialog({ type: 'unban', user: selectedUser })}
                                    sx={{
                                        bgcolor: BRAND.teal,
                                        '&:hover': { bgcolor: BRAND.tealDark },
                                    }}
                                >
                                    Reactivar Usuario
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setConfirmDialog({ type: 'ban', user: selectedUser })}
                                    sx={{
                                        bgcolor: '#C62828',
                                        '&:hover': { bgcolor: '#B71C1C' },
                                    }}
                                >
                                    Banear Usuario
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* ── Confirmation Dialog ──────────────────────────── */}
            <Dialog
                open={!!confirmDialog}
                onClose={() => !actionLoading && setConfirmDialog(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {confirmDialog?.type === 'password' && '¿Enviar email de restablecimiento?'}
                    {confirmDialog?.type === 'ban' && '¿Banear este usuario?'}
                    {confirmDialog?.type === 'unban' && '¿Reactivar este usuario?'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        {confirmDialog?.type === 'password' && (
                            <>Se enviará un email de restablecimiento de contraseña a <strong>{confirmDialog.user.email}</strong>.  El usuario recibirá un enlace para crear una nueva contraseña.</>
                        )}
                        {confirmDialog?.type === 'ban' && (
                            <>El usuario <strong>{confirmDialog.user.name}</strong> será baneado y no podrá acceder a la plataforma.</>
                        )}
                        {confirmDialog?.type === 'unban' && (
                            <>El usuario <strong>{confirmDialog.user.name}</strong> será reactivado y podrá acceder nuevamente.</>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmDialog(null)}
                        disabled={actionLoading}
                        size="small"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleConfirmAction}
                        disabled={actionLoading}
                        sx={{
                            bgcolor: confirmDialog?.type === 'ban' ? '#C62828' : BRAND.teal,
                            '&:hover': { bgcolor: confirmDialog?.type === 'ban' ? '#B71C1C' : BRAND.tealDark },
                        }}
                        startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {actionLoading ? 'Procesando…' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar feedback ────────────────────────────── */}
            <Snackbar
                open={!!snackbar}
                autoHideDuration={5000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar(null)}
                    severity={snackbar?.severity ?? 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

/* ── Detail field component ────────────────────────────────────── */
function DetailField({
    label,
    value,
    mono,
    action,
}: {
    label: string
    value: string
    mono?: boolean
    action?: React.ReactNode
}) {
    return (
        <Box>
            <Typography
                variant="caption"
                sx={{ color: BRAND.teal, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        color: '#263238',
                        ...(mono ? { fontFamily: 'monospace', fontSize: '0.82rem' } : {}),
                    }}
                >
                    {value}
                </Typography>
                {action}
            </Box>
        </Box>
    )
}
