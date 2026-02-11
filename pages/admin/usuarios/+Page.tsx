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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getAllUsers, type AdminUserRow } from '@services/admin'

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
        }
    }, [selectedUser])

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
                                disabled
                                sx={{
                                    borderColor: BRAND.teal,
                                    color: BRAND.teal,
                                    '&:hover': { borderColor: BRAND.tealDark, bgcolor: 'rgba(0,137,123,0.04)' },
                                }}
                            >
                                Reset Password
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                    bgcolor: '#C62828',
                                    '&:hover': { bgcolor: '#B71C1C' },
                                }}
                            >
                                Banear Usuario
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
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
