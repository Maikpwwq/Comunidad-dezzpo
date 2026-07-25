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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveIcon from '@mui/icons-material/Save'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
    getAllUsers,
    sendPasswordResetForUser,
    banUser,
    unbanUser,
    backfillOpenChannels,
    updateUserClassification,
    type AdminUserRow,
} from '@services/admin'
import { COMERCIANTE_OPTIONS, PROPIETARIO_OPTIONS, getBadgeDetails } from '@config/userClassification.config'

/* ── Brand palette ─────────────────────────────────────────────── */
const BRAND = {
    teal: 'var(--brand-teal)',
    tealDark: 'var(--brand-teal-dark)',
    tealLight: 'var(--primary-blue-light-color)',
    gradientHeader: 'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-teal-dark) 100%)',
    surface: 'var(--admin-surface)',
}

/* ── Role / Status chip colour map ─────────────────────────────── */
const roleChipSx = (role: string) =>
    role === 'Propietario'
        ? { bgcolor: 'var(--status-active-bg)', color: 'var(--status-active-color)', fontWeight: 600 }
        : { bgcolor: 'var(--status-completed-bg)', color: 'var(--status-completed-color)', fontWeight: 600 }

const statusChipSx = (status: string) =>
    status === 'active'
        ? { bgcolor: 'var(--status-active-bg)', color: 'var(--status-active-color)', fontWeight: 600 }
        : { bgcolor: 'var(--status-disputed-bg)', color: 'var(--status-disputed-color)', fontWeight: 600 }

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
    {
        field: 'userCategorie',
        headerName: 'Categoría',
        width: 130,
        renderCell: (params) => {
            if (!params.value) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
            const badge = getBadgeDetails(params.value)
            return (
                <Chip
                    label={badge.name}
                    size="small"
                    sx={{ bgcolor: badge.bgLight, color: badge.color, fontWeight: 600, fontSize: '0.7rem' }}
                />
            )
        },
    },
    {
        field: 'userClasification',
        headerName: 'Clasificación',
        width: 160,
        renderCell: (params) => {
            if (!params.value) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
            const badge = getBadgeDetails(params.value)
            return (
                <Chip
                    label={badge.name}
                    size="small"
                    sx={{ bgcolor: badge.bgLight, color: badge.color, fontWeight: 600, fontSize: '0.7rem' }}
                />
            )
        },
    },
    {
        field: 'userGrade',
        headerName: 'Grado',
        width: 140,
        renderCell: (params) => {
            if (!params.value) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
            const badge = getBadgeDetails(params.value)
            return (
                <Chip
                    label={badge.name}
                    size="small"
                    sx={{ bgcolor: badge.bgLight, color: badge.color, fontWeight: 600, fontSize: '0.7rem' }}
                />
            )
        },
    },
    { field: 'joined', headerName: 'Registro', width: 130 },
    {
        field: 'channelUrl',
        headerName: 'Canal',
        width: 100,
        renderCell: (params) => {
            if (params.row.role === 'Propietario') {
                return <span style={{ color: '#999', fontSize: '0.75rem' }}>N/A</span>
            }
            const ok = !!params.value && params.value !== ''
            return (
                <Chip
                    label={ok ? 'Asignado' : 'Faltante'}
                    size="small"
                    sx={{
                        bgcolor: ok ? '#E8F5E9' : '#FFF3E0',
                        color: ok ? '#2E7D32' : '#E65100',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                    }}
                />
            )
        }
    },
]

/* ── Page ───────────────────────────────────────────────────────── */
export default function Page() {
    const [users, setUsers] = useState<AdminUserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<{ type: 'password' | 'ban' | 'unban' | 'backfill'; user?: AdminUserRow } | null>(null)
    const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

    const [editUserCategorie, setEditUserCategorie] = useState('')
    const [editUserClasification, setEditUserClasification] = useState('')
    const [editUserGrade, setEditUserGrade] = useState('')

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
        setEditUserCategorie(params.row.userCategorie || '')
        setEditUserClasification(params.row.userClasification || '')
        setEditUserGrade(params.row.userGrade || '')
    }, [])

    const handleClose = useCallback(() => setSelectedUser(null), [])

    const handleSaveClassification = useCallback(async () => {
        if (!selectedUser) return
        try {
            const ok = await updateUserClassification(selectedUser.uid, selectedUser.role, {
                userCategorie: editUserCategorie,
                userClasification: editUserClasification,
                userGrade: editUserGrade,
            })

            if (ok) {
                setSnackbar({ message: '¡Clasificación actualizada en Firestore!', severity: 'success' })
                setUsers((prev) =>
                    prev.map((u) =>
                        u.uid === selectedUser.uid
                            ? {
                                  ...u,
                                  userCategorie: editUserCategorie,
                                  userClasification: editUserClasification,
                                  userGrade: editUserGrade,
                              }
                            : u
                    )
                )
            }
        } catch (err) {
            console.error('Error saving classification:', err)
            setSnackbar({ message: 'Error al actualizar clasificación', severity: 'error' })
        }
    }, [selectedUser, editUserCategorie, editUserClasification, editUserGrade])

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

            if (type === 'backfill') {
                const { processed, errors } = await backfillOpenChannels()
                setSnackbar({ message: `Generación completada: ${processed} asignados, ${errors} errores. Recargando...`, severity: 'success' })
                const data = await getAllUsers()
                setUsers(data)
                return
            }

            if (!user) return

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

            {/* Search Bar & Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Paper
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        flex: 1,
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
                <Button
                    variant="contained"
                    onClick={() => setConfirmDialog({ type: 'backfill' })}
                    sx={{
                        bgcolor: BRAND.teal,
                        color: '#fff',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        '&:hover': { bgcolor: BRAND.tealDark }
                    }}
                >
                    Asignar Canales Faltantes
                </Button>
            </Box>

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

                            {/* Classification, Gradation & Category Editor */}
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
                                Clasificación y Rangos del Usuario ({selectedUser.role})
                            </Typography>
                            {(() => {
                                const classificationOpts = selectedUser.role === 'Comerciante' ? COMERCIANTE_OPTIONS : PROPIETARIO_OPTIONS
                                return (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="select-user-categorie-label">Categoría Membresía (userCategorie)</InputLabel>
                                            <Select
                                                labelId="select-user-categorie-label"
                                                label="Categoría Membresía (userCategorie)"
                                                value={editUserCategorie}
                                                onChange={(e) => setEditUserCategorie(e.target.value)}
                                            >
                                                <MenuItem value=""><em>Sin Asignar</em></MenuItem>
                                                {classificationOpts.userCategorie.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                ))}
                                                {editUserCategorie && !classificationOpts.userCategorie.includes(editUserCategorie) && (
                                                    <MenuItem value={editUserCategorie}>{editUserCategorie} (Valor Actual)</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>

                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="select-user-clasification-label">
                                                {selectedUser.role === 'Comerciante'
                                                    ? 'Clasificación Operación (userClasification)'
                                                    : 'Clasificación Inmueble (userClasification)'}
                                            </InputLabel>
                                            <Select
                                                labelId="select-user-clasification-label"
                                                label={selectedUser.role === 'Comerciante'
                                                    ? 'Clasificación Operación (userClasification)'
                                                    : 'Clasificación Inmueble (userClasification)'}
                                                value={editUserClasification}
                                                onChange={(e) => setEditUserClasification(e.target.value)}
                                            >
                                                <MenuItem value=""><em>Sin Asignar</em></MenuItem>
                                                {classificationOpts.userClasification.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                ))}
                                                {editUserClasification && !classificationOpts.userClasification.includes(editUserClasification) && (
                                                    <MenuItem value={editUserClasification}>{editUserClasification} (Valor Actual)</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>

                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="select-user-grade-label">
                                                {selectedUser.role === 'Comerciante'
                                                    ? 'Grado de Experiencia (userGrade)'
                                                    : 'Grado de Fidelidad (userGrade)'}
                                            </InputLabel>
                                            <Select
                                                labelId="select-user-grade-label"
                                                label={selectedUser.role === 'Comerciante'
                                                    ? 'Grado de Experiencia (userGrade)'
                                                    : 'Grado de Fidelidad (userGrade)'}
                                                value={editUserGrade}
                                                onChange={(e) => setEditUserGrade(e.target.value)}
                                            >
                                                <MenuItem value=""><em>Sin Asignar</em></MenuItem>
                                                {classificationOpts.userGrade.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                ))}
                                                {editUserGrade && !classificationOpts.userGrade.includes(editUserGrade) && (
                                                    <MenuItem value={editUserGrade}>{editUserGrade} (Valor Actual)</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSaveClassification}
                                            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                                        >
                                            Guardar Clasificación
                                        </Button>
                                    </Box>
                                )
                            })()}
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
                    {confirmDialog?.type === 'backfill' && '¿Mapear canales faltantes?'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        {confirmDialog?.type === 'password' && confirmDialog.user && (
                            <>Se enviará un email de restablecimiento de contraseña a <strong>{confirmDialog.user.email}</strong>.  El usuario recibirá un enlace para crear una nueva contraseña.</>
                        )}
                        {confirmDialog?.type === 'ban' && confirmDialog.user && (
                            <>El usuario <strong>{confirmDialog.user.name}</strong> será baneado y no podrá acceder a la plataforma.</>
                        )}
                        {confirmDialog?.type === 'unban' && confirmDialog.user && (
                            <>El usuario <strong>{confirmDialog.user.name}</strong> será reactivado y podrá acceder nuevamente.</>
                        )}
                        {confirmDialog?.type === 'backfill' && (
                            <>Se iterará sobre todos los perfiles de Comerciantes. Si se detectan campos vacíos, se generará dinámicamente un canal público en Sendbird y se guardará la referencia. Esta acción puede tomar varios segundos o minutos si hay muchos usuarios.</>
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
