/**
 * Admin User Management Page
 *
 * MUI DataGrid with all platform users.
 * Quick actions: view details in side drawer.
 */
import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Drawer,
    Divider,
    TextField,
    Button,
    Chip,
    IconButton,
    Paper,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getAllUsers, type AdminUserRow } from '@services/admin'

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
            <Chip
                label={params.value}
                size="small"
                color={params.value === 'Comerciante' ? 'primary' : 'secondary'}
                variant="outlined"
            />
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
                color={params.value === 'active' ? 'success' : 'error'}
            />
        ),
    },
    { field: 'joined', headerName: 'Registro', width: 130 },
]

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
                            bgcolor: '#f5f5f5',
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>

            {/* User Detail Drawer */}
            <Drawer
                anchor="right"
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 3 } }}
            >
                {selectedUser && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Detalle de Usuario
                            </Typography>
                            <IconButton onClick={() => setSelectedUser(null)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <DetailField label="UID" value={selectedUser.uid} mono />
                            <DetailField label="Nombre" value={selectedUser.name} />
                            <DetailField label="Email" value={selectedUser.email} />
                            <DetailField label="Rol" value={selectedUser.role} />
                            <DetailField label="Estado" value={selectedUser.status} />
                            <DetailField label="Registro" value={selectedUser.joined} />
                            <DetailField label="Último acceso" value={selectedUser.lastLogin} />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                fullWidth
                                disabled
                            >
                                Reset Password
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                fullWidth
                                disabled
                            >
                                Banear Usuario
                            </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Las acciones de seguridad requieren Cloud Functions configuradas.
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </Box>
    )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={mono ? { fontFamily: 'monospace', fontSize: '0.85rem' } : {}}
            >
                {value}
            </Typography>
        </Box>
    )
}
